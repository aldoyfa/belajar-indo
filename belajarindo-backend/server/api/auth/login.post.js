import { compare } from 'bcryptjs';
import { prisma } from '../../utils/prisma.js';
import { signJwt } from '../../utils/jwt.js';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body || {};

  if (!email || !password) {
    setResponseStatus(event, 400);
    return { error: 'Missing fields' };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    setResponseStatus(event, 401);
    return { error: 'Invalid credentials' };
  }

  const ok = await compare(password, user.password);
  if (!ok) {
    setResponseStatus(event, 401);
    return { error: 'Invalid credentials' };
  }

  const token = signJwt({ sub: user.id });
  setCookie(event, 'auth_token', token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });

  return { user: { id: user.id, name: user.name, email: user.email }, token };
});
