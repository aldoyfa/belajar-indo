import { verifyJwt } from '../utils/jwt.js';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token') || (getHeader(event, 'authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) { setResponseStatus(event, 401); return { error: 'Not authenticated' }; }

  try {
    const payload = verifyJwt(token);
    // attach to event.context for downstream handlers
    event.context.user = payload;
  } catch (err) {
    setResponseStatus(event, 401);
    return { error: 'Invalid token' };
  }
});
