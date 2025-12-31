import { prisma } from '../../utils/prisma.js';
import { verifyJwt } from '../../utils/jwt.js';

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth_token') || (getHeader(event, 'authorization') || '').replace(/^Bearer\s+/i, '');
    if (!token) {
      setResponseStatus(event, 401);
      return { error: 'Not authenticated' };
    }

    const payload = verifyJwt(token);
    if (!payload || !payload.sub) {
      setResponseStatus(event, 401);
      return { error: 'Invalid token' };
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      setResponseStatus(event, 404);
      return { error: 'User not found' };
    }

    return { user: { id: user.id, name: user.name, email: user.email } };
  } catch (err) {
    console.error('me error', err);
    setResponseStatus(event, 500);
    return { error: 'Server error' };
  }
});
