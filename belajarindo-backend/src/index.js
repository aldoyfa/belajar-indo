// ...existing code...
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const flashcardRoutes = require('./routes/flashcard');
// avatar route removed (not used by frontend)

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
// CORS: allow configured frontend origin plus 127.0.0.1 for local dev.
// Override FRONTEND_ORIGIN in .env if needed (example: http://localhost:5500)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5500';
const allowedOrigins = [FRONTEND_ORIGIN, 'http://127.0.0.1:5500'];

// Configure CORS to return a specific Access-Control-Allow-Origin when credentials are used.
// Note: browsers will reject responses that set Access-Control-Allow-Origin: '*' when request uses credentials.
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (eg. mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
// Ensure preflight requests receive the same CORS headers
app.options('*', cors(corsOptions));

// Serve static uploads (before routes so frontend can fetch files)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
// avatar endpoint removed
app.use('/api/quiz', quizRoutes);
app.use('/api/flashcard', flashcardRoutes);

// Health / root
app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', message: 'BelajarIndo API is running', environment: process.env.NODE_ENV, port: PORT })
);
app.get('/', (req, res) => res.json({ message: 'BelajarIndo API', version: '1.0.0' }));

// 404 handler (must come after routes)
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler (must be last)
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 BelajarIndo API Server');
  console.log('='.repeat(50));
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`📍 API Base: http://localhost:${PORT}/api`);
  console.log('='.repeat(50));
});
// ...existing code...