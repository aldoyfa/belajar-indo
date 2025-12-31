// Minimal replacement used for debugging deployment issues. This simple
// function ensures Vercel serves the file and returns JSON so we can
// confirm the route is mapped to this file. We'll restore full logic
// after verifying deployment.
module.exports = async (req, res) => {
  // Keep a lightweight GET check for quick verification
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, message: 'register function is deployed (GET check)' });
  }

  // If the production environment isn't configured with a DATABASE_URL,
  // avoid requiring/loading Prisma (this prevents immediate crashes in Vercel)
  if (!process.env.DATABASE_URL) {
    console.error('Register function: missing DATABASE_URL environment variable');
    return res.status(500).json({ error: 'Missing DATABASE_URL in environment — set DATABASE_URL in Vercel project settings' });
  }

  try {
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');

    // Require Prisma only after we've confirmed DATABASE_URL exists.
    let prisma;
    try {
      prisma = require('../../server/utils/prisma');
    } catch (e) {
      console.error('Prisma require failed in register function:', e && (e.stack || e.message) ? (e.stack || e.message) : String(e));
      return res.status(500).json({ error: 'Prisma client could not be loaded', detail: e && e.message ? e.message : String(e) });
    }

    const body = req.body || (req.method === 'POST' ? JSON.parse(req.rawBody || '{}') : {});
    const { name, email, password } = body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({ data: { name, email, password: hashed } });

      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'dev_secret_change_me', { expiresIn: '7d' });

      return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (dbErr) {
      console.error('Register DB error:', dbErr && (dbErr.stack || dbErr.message) ? (dbErr.stack || dbErr.message) : String(dbErr));
      return res.status(500).json({ error: 'Database error during registration', detail: dbErr && dbErr.message ? dbErr.message : String(dbErr) });
    }
  } catch (err) {
    console.error('Register function error (outer):', err && (err.stack || err.message) ? (err.stack || err.message) : String(err));
    return res.status(500).json({ error: 'Server error', detail: err && err.message ? err.message : String(err) });
  }
};
