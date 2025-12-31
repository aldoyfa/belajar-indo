const prisma = require('../src/utils/prisma');

(async () => {
  try {
    const quizResults = await prisma.quizResult.findMany({ where: { userId: 1 }, orderBy: { completedAt: 'desc' }, take: 10 });
    const vocabProgress = await prisma.vocabProgress.findMany({ where: { userId: 1 } });

    console.log('QUIZ_RESULTS:', JSON.stringify(quizResults, null, 2));
    console.log('VOCAB_PROGRESS:', JSON.stringify(vocabProgress, null, 2));
  } catch (e) {
    console.error('DB_CHECK_ERROR:', e);
    process.exitCode = 1;
  }
})();
