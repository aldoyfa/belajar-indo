const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const auth = require('../middleware/auth');
const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Only images allowed'), false)
});

router.post('/', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const relativePath = `/uploads/${req.file.filename}`;
    // Note: Prisma schema in this project does not include an `avatar` field.
    // To avoid failing when updating DB, we only save the file and return the path.
    // If you later add `avatar` to the Prisma `User` model, uncomment the prisma update.
    return res.json({ success: true, avatar: relativePath });
  } catch (err) {
    console.error('avatar upload error', err);
    return res.status(500).json({ error: 'Failed to save avatar' });
  }
});

module.exports = router;