import { prisma } from '../../utils/prisma.js';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { cardId, mastered } = body || {};
    const user = event.context.user;
    const userId = user && (user.sub || user.userId || user.id);

    if (!userId) { setResponseStatus(event, 401); return { error: 'Not authenticated' }; }

    const progress = await prisma.flashcardProgress.upsert({
      where: { userId_cardId: { userId, cardId } },
      update: {
        mastered,
        reviewCount: { increment: 1 },
        lastReviewed: new Date()
      },
      create: {
        userId,
        cardId,
        mastered,
        reviewCount: 1
      }
    });

    return { success: true, progress };
  } catch (error) {
    console.error(error);
    setResponseStatus(event, 500);
    return { error: 'Failed to update progress' };
  }
});
