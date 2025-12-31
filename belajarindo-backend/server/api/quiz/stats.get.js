import { prisma } from '../../utils/prisma.js';

export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user;
    const userId = user && (user.sub || user.userId || user.id);
    if (!userId) { setResponseStatus(event, 401); return { error: 'Not authenticated' }; }

    const results = await prisma.quizResult.findMany({ where: { userId } });

    const stats = {
      totalQuizzes: results.length,
      averageScore: results.length > 0 ? results.reduce((sum, r) => sum + r.score, 0) / results.length : 0,
      bestScore: results.length > 0 ? Math.max(...results.map(r => r.score)) : 0,
      totalTimeSpent: results.reduce((sum, r) => sum + (r.timeSpent || 0), 0)
    };

    return { stats };
  } catch (error) {
    console.error(error);
    setResponseStatus(event, 500);
    return { error: 'Failed to fetch stats' };
  }
});
