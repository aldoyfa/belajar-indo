import { prisma } from '../../utils/prisma.js';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { quizType, score, totalQuestions: tq, correctAnswers: ca, answers, timeSpent: ts } = body || {};
    const user = event.context.user;
    const userId = user && (user.sub || user.userId || user.id);

    if (!userId) { setResponseStatus(event, 401); return { error: 'Not authenticated' }; }

    // Normalize numeric fields and derive totals from answers when possible
    const parsedTq = Number(tq);
    const totalQuestions = Number.isFinite(parsedTq) && parsedTq >= 0 ? Math.max(0, Math.floor(parsedTq)) : (Array.isArray(answers) ? answers.length : 0);

    const parsedCa = Number(ca);
    const correctAnswers = Number.isFinite(parsedCa) && parsedCa >= 0 ? Math.max(0, Math.floor(parsedCa)) : 0;

    const parsedScore = Number(score);
    const normalizedScore = Number.isFinite(parsedScore) ? (parsedScore < 0 ? 0 : parsedScore) : 0;

    const parsedTs = Number(ts);
    const timeSpent = Number.isFinite(parsedTs) && parsedTs > 0 ? Math.max(0, Math.floor(parsedTs)) : 0;

    // If there's clearly no quiz data, return 400 instead of letting Prisma throw
    if (totalQuestions === 0 && (!Array.isArray(answers) || answers.length === 0)) {
      setResponseStatus(event, 400);
      return { error: 'Invalid quiz payload: totalQuestions or answers required' };
    }

    const quizCategory = typeof quizType === 'string' && quizType.length > 0 ? quizType : 'unknown';

    const result = await prisma.quizResult.create({
      data: {
        userId,
        quizCategory,
        score: normalizedScore,
        totalQuestions: totalQuestions,
        correctAnswers: Math.min(correctAnswers, totalQuestions),
        // store answers if provided (optional)
        answers: answers || undefined,
        timeSpent
      }
    });

    return { success: true, result };
  } catch (error) {
    console.error(error);
    setResponseStatus(event, 500);
    return { error: 'Failed to save quiz result' };
  }
});
