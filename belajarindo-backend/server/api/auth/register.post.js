import { hash } from 'bcryptjs';
import { prisma } from '../../utils/prisma.js';
import { signJwt } from '../../utils/jwt.js';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, email, password } = body || {};

    if (!name || !email || !password) {
      setResponseStatus(event, 400);
      return { error: 'Missing fields' };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      setResponseStatus(event, 409);
      return { error: 'Email already registered' };
    }

    const hashed = await hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed } });

    const token = signJwt({ sub: user.id });

    // set cookie
    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    setResponseStatus(event, 201);
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  } catch (err) {
    // better error handling and logging
    console.error('Register handler error:', err && err.stack ? err.stack : err);
    setResponseStatus(event, 500);
    return { error: 'Server error', detail: process.env.NODE_ENV !== 'production' ? (err && err.message ? err.message : String(err)) : undefined };
  }
});
