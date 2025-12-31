const express = require('express');
const prisma = require('../utils/prisma');
const path = require('path');
const authMiddleware = require(path.join(__dirname, '..', 'middleware', 'auth'));

const router = express.Router();

router.post('/submit', authMiddleware, async (req, res) => {
  try {
    // Accept flexible payloads from frontend. Compute required numeric fields if missing.
    // Log incoming body for diagnostics
    const body = req.body || {};
    try { console.log('QUIZ SUBMIT REQUEST BODY:', JSON.stringify(body)); } catch(e){ console.log('QUIZ SUBMIT REQUEST BODY: (could not stringify)'); }
    const { quizType, score, totalQuestions: tq, correctAnswers: ca, questions = [], timeSpent: ts } = body;
    const userId = req.userId || (req.user && req.user.userId) || body.userId;

    // user must be present (we require auth middleware normally)
    if (!userId) return res.status(401).json({ error: 'Unauthorized: missing user' });

    // derive totals when possible and normalize numeric inputs
    const parsedTq = Number(tq);
    let totalQuestions = Number.isFinite(parsedTq) && parsedTq >= 0 ? Math.max(0, Math.floor(parsedTq)) : (Array.isArray(questions) ? questions.length : 0);

    const parsedCa = Number(ca);
    let correctAnswers = Number.isFinite(parsedCa) && parsedCa >= 0 ? Math.max(0, Math.floor(parsedCa)) : 0;

    // Normalize score (float) and timeSpent (seconds)
    const parsedScore = Number(score);
    let normalizedScore = Number.isFinite(parsedScore) ? parsedScore : NaN;

    const parsedTs = Number(ts);
    const timeSpent = Number.isFinite(parsedTs) && parsedTs > 0 ? Math.max(0, Math.floor(parsedTs)) : 0;

    // If totalQuestions is still zero try to derive from questions array
    if (totalQuestions === 0 && Array.isArray(questions) && questions.length > 0) {
      totalQuestions = questions.length;
    }

    // If still nothing, reject the payload as invalid
    if (totalQuestions === 0) {
      return res.status(400).json({ error: 'Invalid quiz payload: totalQuestions or questions required', received: body });
    }

    // Ensure sane bounds: score non-negative, correctAnswers not greater than totalQuestions
    correctAnswers = Math.min(correctAnswers, totalQuestions);
    if (!Number.isFinite(normalizedScore) || normalizedScore < 0) {
      // fallback: compute score from correctAnswers if available
      normalizedScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    }

    // clamp score to 0-100
    if (normalizedScore < 0) normalizedScore = 0;
    if (normalizedScore > 100) normalizedScore = 100;

    const quizCategory = typeof quizType === 'string' && quizType.length > 0 ? quizType : 'unknown';

    const payload = {
      userId: Number(userId),
      quizCategory,
      score: normalizedScore,
      totalQuestions: Number.isFinite(Number(totalQuestions)) ? Math.max(0, Math.floor(Number(totalQuestions))) : 0,
      correctAnswers: Number.isFinite(Number(correctAnswers)) ? Math.max(0, Math.floor(Number(correctAnswers))) : 0,
      timeSpent: Number.isFinite(Number(timeSpent)) ? Math.max(0, Math.floor(Number(timeSpent))) : 0,
    };

  // Ensure payload logged (use console.log so it appears in server logs)
  try { console.log('QUIZ SUBMIT PAYLOAD COMPUTED:', JSON.stringify(payload)); } catch(e){ console.log('QUIZ SUBMIT PAYLOAD COMPUTED: (could not stringify)'); }

    // Defensive: ensure we send valid integer fields to Prisma. Prisma will reject NaN/undefined.
    if (!Number.isFinite(payload.totalQuestions) || payload.totalQuestions <= 0) {
      // If we somehow still don't have totalQuestions, set to at least 1 to avoid Prisma errors.
      payload.totalQuestions = 1;
    }
    payload.correctAnswers = Math.min(payload.correctAnswers || 0, payload.totalQuestions);

    const result = await prisma.quizResult.create({ data: payload });
    res.json({ success: true, result });
  } catch (error) {
    console.error('QUIZ SUBMIT ERROR:', error, '\nrequest body:', req && req.body);
    const resp = { error: 'Failed to save quiz result' };
    if (process.env.NODE_ENV !== 'production') {
      resp.detail = error && error.message ? error.message : String(error);
      resp.stack = error && error.stack ? error.stack.split('\n').slice(0,5).join('\n') : undefined;
    }
    res.status(500).json(resp);
  }
});

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const results = await prisma.quizResult.findMany({ where: { userId }, orderBy: { completedAt: 'desc' } });
    res.json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch quiz history' });
  }
});

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const results = await prisma.quizResult.findMany({ where: { userId } });
    const stats = { totalQuizzes: results.length, averageScore: results.length > 0 ? results.reduce((s, r) => s + r.score, 0) / results.length : 0, bestScore: results.length > 0 ? Math.max(...results.map(r => r.score)) : 0, totalTimeSpent: results.reduce((s, r) => s + (r.timeSpent || 0), 0) };
    res.json({ stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Quiz progress endpoints: store/load per-user progress for a quiz category
router.get('/progress', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const category = typeof req.query.category === 'string' && req.query.category.length > 0 ? req.query.category : undefined;
    const where = category ? { userId, quizCategory: category } : { userId };
    const items = await prisma.quizProgress.findMany({ where, orderBy: { lastAccessed: 'desc' } });
    res.json({ progress: items });
  } catch (error) {
    console.error('Failed to fetch quiz progress', error);
    res.status(500).json({ error: 'Failed to fetch quiz progress' });
  }
});

router.post('/progress', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const body = req.body || {};
    const quizCategory = typeof body.quizCategory === 'string' && body.quizCategory.length > 0 ? body.quizCategory : 'unknown';
    const progress = Number.isFinite(Number(body.progress)) ? Math.max(0, Math.min(100, Math.floor(Number(body.progress)))) : 0;
    const currentQuestion = Number.isFinite(Number(body.currentQuestion)) ? Math.max(0, Math.floor(Number(body.currentQuestion))) : 0;
    const state = (body.state && typeof body.state === 'object') ? body.state : undefined;

    // Try to find existing record
    const existing = await prisma.quizProgress.findFirst({ where: { userId, quizCategory } });
    let result;
    if (existing) {
      const data = { progress, currentQuestion, lastAccessed: new Date() };
      if (state !== undefined) data.state = state;
      result = await prisma.quizProgress.update({ where: { id: existing.id }, data });
    } else {
      const data = { userId, quizCategory, progress, currentQuestion };
      if (state !== undefined) data.state = state;
      result = await prisma.quizProgress.create({ data });
    }

    res.json({ success: true, progress: result });
  } catch (error) {
    console.error('Failed to save quiz progress', error);
    res.status(500).json({ error: 'Failed to save quiz progress' });
  }
});

module.exports = router;

