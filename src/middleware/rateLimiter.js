const rateLimit = require('express-rate-limit');

const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Çok fazla istek, lütfen bekleyin.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Çok fazla giriş denemesi, 15 dakika bekleyin.' },
});

const gameLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 dakika
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Çok fazla oyun isteği.' },
});

module.exports = { defaultLimiter, authLimiter, gameLimiter };
