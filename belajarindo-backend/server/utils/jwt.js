import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'change-me-in-env';

export function signJwt(payload, opts = {}) {
  return jwt.sign(payload, SECRET, { expiresIn: opts.expiresIn || '7d' });
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}
