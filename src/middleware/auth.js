const { verifyAccessToken } = require('../utils/jwt');
const { error } = require('../utils/response');
const prisma = require('../utils/prisma');

/**
 * JWT access token doğrula
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Authorization token required', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatar: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) return error(res, 'User not found', 401);
    if (!user.isActive) return error(res, 'Account is deactivated', 403);

    req.user = { ...user, isGuest: !user.email };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return error(res, 'Token expired', 401);
    if (err.name === 'JsonWebTokenError') return error(res, 'Invalid token', 401);
    return error(res, 'Authentication failed', 401);
  }
};

/**
 * Rol kontrolü — kullanım: requireRole('ADMIN') veya requireRole(['ADMIN','MODERATOR'])
 */
const requireRole = (roles) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user) return error(res, 'Unauthorized', 401);
    if (!allowed.includes(req.user.role)) {
      return error(res, 'Forbidden: insufficient permissions', 403);
    }
    next();
  };
};

module.exports = { authenticate, requireRole };
