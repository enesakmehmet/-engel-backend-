require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const { defaultLimiter } = require('./middleware/rateLimiter');

// Routes
const authRoutes        = require('./routes/auth.routes');
const userRoutes        = require('./routes/user.routes');
const gameRoutes        = require('./routes/game.routes');
const leaderboardRoutes = require('./routes/leaderboard.routes');
const adminRoutes       = require('./routes/admin.routes');
const notificationRoutes= require('./routes/notification.routes');
const feedbackRoutes    = require('./routes/feedback.routes');
const settingsRoutes    = require('./routes/settings.routes');
const puzzleOcrRoutes   = require('./routes/puzzle-ocr.routes');

const app = express();
app.set('trust proxy', 1);

const localOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const envOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...localOrigins, ...envOrigins])];

const corsOptions = {
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  headers: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
};

// ── Güvenlik & temel middleware ─────────────
app.use(helmet());
app.use(compression());
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin) {
    return next();
  }

  if (!allowedOrigins.includes(origin)) {
    return res.status(403).json({ success: false, message: `CORS blocked for origin: ${origin}` });
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', corsOptions.methods);
  res.setHeader('Access-Control-Allow-Headers', corsOptions.headers);

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', {
  stream: { write: (msg) => logger.info(msg.trim()) },
}));

// Webhook route'ları rate limiter'dan hariç tut
app.use((req, res, next) => {
  if (req.method === 'OPTIONS' || req.path === '/health' || req.path.startsWith('/webhooks')) {
    return next();
  }

  if (!req.path.startsWith('/webhooks')) {
    return defaultLimiter(req, res, next);
  }
  next();
});

// ── Health check ────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ──────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/game',        gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin',       adminRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/settings',     settingsRoutes);
app.use('/api',              feedbackRoutes);
app.use('/api/admin/puzzles', puzzleOcrRoutes);

// ── 404 handler ─────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route bulunamadı: ${req.method} ${req.originalUrl}` });
});

// ── Global error handler ─────────────────────
app.use(errorHandler);

// ── Server başlat ────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 Çenegel API çalışıyor → http://0.0.0.0:${PORT} (LAN'dan erişilebilir)`);
  logger.info(`📌 Ortam: ${process.env.NODE_ENV}`);
});

module.exports = app;
