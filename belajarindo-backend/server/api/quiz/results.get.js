import { prisma } from '../../utils/prisma.js';

export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user;
    const userId = user && (user.sub || user.userId || user.id);
    if (!userId) { setResponseStatus(event, 401); return { error: 'Not authenticated' }; }

    const results = await prisma.quizResult.findMany({ where: { userId }, orderBy: { completedAt: 'desc' } });
    return { results };
  } catch (error) {
    console.error(error);
    setResponseStatus(event, 500);
    return { error: 'Failed to fetch quiz history' };
  }
});
