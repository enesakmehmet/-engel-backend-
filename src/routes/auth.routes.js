const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validate, registerSchema, loginSchema, googleAuthSchema, forgotPasswordSchema, resetPasswordSchema } = require('../middleware/validate');

router.post('/register', authLimiter, validate(registerSchema), ctrl.register);
router.post('/login',    authLimiter, validate(loginSchema),    ctrl.login);
router.post('/guest',    authLimiter, ctrl.guestLogin);
router.post('/google',   authLimiter, validate(googleAuthSchema), ctrl.googleAuth);
router.post('/apple',    authLimiter, ctrl.appleAuth);
router.post('/refresh',  ctrl.refresh);
router.post('/logout',   ctrl.logout);
router.get('/me',        authenticate, ctrl.me);

router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), ctrl.forgotPassword);
router.post('/reset-password',  authLimiter, validate(resetPasswordSchema),  ctrl.resetPassword);
router.get('/reset-password',   ctrl.renderResetPage);

module.exports = router;
