require('dotenv').config();
const express = require('express');
const cors = require('cors');
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
const subscriptionRoutes= require('./routes/subscription.routes');
const notificationRoutes= require('./routes/notification.routes');
const feedbackRoutes    = require('./routes/feedback.routes');
const settingsRoutes    = require('./routes/settings.routes');
const webhookRoutes     = require('./routes/webhook.routes');

const app = express();

// ── Güvenlik & temel middleware ─────────────
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', {
  stream: { write: (msg) => logger.info(msg.trim()) },
}));

// Webhook route'ları rate limiter'dan hariç tut
app.use((req, res, next) => {
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
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/settings',     settingsRoutes);
app.use('/api',              feedbackRoutes);
app.use('/webhooks',         webhookRoutes);

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
