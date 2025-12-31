import { prisma } from '../../utils/prisma.js';
import { verifyJwt } from '../../utils/jwt.js';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const token = getCookie(event, 'auth_token') || (getHeader(event, 'authorization') || '').replace(/^Bearer\s+/i, '');
  const payload = token ? verifyJwt(token) : null;
  if (!payload || !payload.sub) { setResponseStatus(event, 401); return { error: 'Not authenticated' }; }

  // body: { lessonId, progress }
  const { lessonId, progress } = body || {};
  if (!lessonId) { setResponseStatus(event, 400); return { error: 'Missing lessonId' }; }

  const upsert = await prisma.quizProgress.upsert({
    where: { userId_lessonId: { userId: payload.sub, lessonId } },
    update: { progress },
    create: { userId: payload.sub, lessonId, progress }
  });

  return { progress: upsert };
});
