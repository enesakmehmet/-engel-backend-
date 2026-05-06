const router = require('express').Router();
const ctrl = require('../controllers/notification.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/register', ctrl.registerToken);
router.post('/remove', ctrl.removeToken);

module.exports = router;
