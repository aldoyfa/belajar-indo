const express = require('express');
const authMiddleware = require('../middleware/auth');
const prisma = require('../utils/prisma');

const router = express.Router();

// For this app we store vocab progress in VocabProgress model
router.post('/progress', authMiddleware, async (req, res) => {
  try {
    const { category, wordsLearned } = req.body; // wordsLearned: array of ids
    const userId = req.userId;

    const existing = await prisma.vocabProgress.findUnique({ where: { userId_category: { userId, category } } }).catch(() => null);

    if (existing) {
      const updated = await prisma.vocabProgress.update({
        where: { id: existing.id },
        data: { wordsLearned: wordsLearned, lastAccessed: new Date() }
      });
      return res.json({ success: true, progress: updated });
    }

    const created = await prisma.vocabProgress.create({ data: { userId, category, wordsLearned: wordsLearned || [], lastAccessed: new Date() } });
    res.json({ success: true, progress: created });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

router.get('/progress', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const progress = await prisma.vocabProgress.findMany({ where: { userId } });
    res.json({ progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

module.exports = router;
