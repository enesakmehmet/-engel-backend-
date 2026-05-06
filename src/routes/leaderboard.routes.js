const router = require('express').Router();
const ctrl = require('../controllers/leaderboard.controller');
const { authenticate } = require('../middleware/auth');

router.get('/global',              ctrl.getGlobal);
router.get('/weekly',              ctrl.getWeekly);
router.get('/category/:categoryId', ctrl.getByCategory);
router.get('/me',                  authenticate, ctrl.getMyRank);

module.exports = router;
