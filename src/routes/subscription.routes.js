const router = require('express').Router();
const ctrl = require('../controllers/subscription.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/products', ctrl.getProducts);
router.get('/status', ctrl.getStatus);
router.get('/history', ctrl.getHistory);

router.post('/verify/apple', ctrl.verifyApple);
router.post('/verify/google', ctrl.verifyGoogle);

module.exports = router;
