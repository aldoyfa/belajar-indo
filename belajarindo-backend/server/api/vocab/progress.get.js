import { prisma } from '../../utils/prisma.js';

export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user;
    const userId = user && (user.sub || user.userId || user.id);
    if (!userId) { setResponseStatus(event, 401); return { error: 'Not authenticated' }; }

    const progress = await prisma.flashcardProgress.findMany({ where: { userId } });
    return { progress };
  } catch (error) {
    console.error(error);
    setResponseStatus(event, 500);
    return { error: 'Failed to fetch progress' };
  }
});
import { prisma } from '../../utils/prisma.js';
import { verifyJwt } from '../../utils/jwt.js';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token') || (getHeader(event, 'authorization') || '').replace(/^Bearer\s+/i, '');
  const payload = token ? verifyJwt(token) : null;
  if (!payload || !payload.sub) { setResponseStatus(event, 401); return { error: 'Not authenticated' }; }

  const progress = await prisma.vocabProgress.findMany({ where: { userId: payload.sub } });
  return { progress };
});
