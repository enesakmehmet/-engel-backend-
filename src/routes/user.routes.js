const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/profile',  ctrl.getProfile);
router.put('/profile',  ctrl.updateProfile);
router.get('/stats',    ctrl.getStats);
router.post('/reward-ad', ctrl.rewardAdStars);
router.get('/history',  ctrl.getGameHistory);
router.put('/change-password', ctrl.changePassword);
router.delete('/account', ctrl.deleteAccount);

module.exports = router;
