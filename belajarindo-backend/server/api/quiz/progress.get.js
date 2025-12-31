import { prisma } from '../../utils/prisma.js';
import { verifyJwt } from '../../utils/jwt.js';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token') || (getHeader(event, 'authorization') || '').replace(/^Bearer\s+/i, '');
  const payload = token ? verifyJwt(token) : null;
  if (!payload || !payload.sub) { setResponseStatus(event, 401); return { error: 'Not authenticated' }; }

  const progress = await prisma.quizProgress.findMany({ where: { userId: payload.sub } });
  return { progress };
});
