const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} | ${req.method} ${req.originalUrl}`);

  // Prisma hataları
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'Bu değer zaten kullanımda (unique constraint)',
      field: err.meta?.target,
    });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Kayıt bulunamadı' });
  }

  // JWT hataları
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Geçersiz token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token süresi dolmuş' });
  }

  // Zod doğrulama hataları
  if (err.name === 'ZodError') {
    return res.status(422).json({
      success: false,
      message: 'Doğrulama hatası',
      errors: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
  }

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Sunucu hatası',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
