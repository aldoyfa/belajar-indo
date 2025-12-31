const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('../utils/jwt');
const prisma = require('../utils/prisma');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || password.length < 6) return res.status(400).json({ error: 'Email dan password (min 6 karakter) wajib diisi' });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email sudah terdaftar' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await prisma.user.create({ data: { name, email, password: hashedPassword, salt } });

  const token = generateToken(user.id);
    // set cookie for environments that support it
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });

    // Also return token in JSON so frontend can use Authorization header (helpful for cross-port dev)
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Email atau password salah' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Email atau password salah' });

    console.log(`User logged in with ID: ${user.id}`);

    const token = generateToken(user.id);

    console.log(`Generated token for user: ${token}`);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
  
    // Return token in response to support Authorization header for frontend
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

// Me
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    console.log(`User requested profile with token: ${token}`);

    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: 'Invalid token' });

    console.log(`User requested profile with ID: ${decoded.userId}`);

    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, name: true, email: true } });
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
