const router = require('express').Router();
const ctrl = require('../controllers/game.controller');
const { authenticate } = require('../middleware/auth');
const { gameLimiter } = require('../middleware/rateLimiter');
const { validate, startGameSchema, answerSchema, hintSchema } = require('../middleware/validate');

router.use(authenticate, gameLimiter);

router.get('/puzzles',                           ctrl.getPuzzles);
router.post('/start',                            validate(startGameSchema), ctrl.startGame);
router.get('/:sessionId/status',                 ctrl.getGameStatus);
router.post('/:sessionId/answer',                validate(answerSchema),    ctrl.submitAnswer);
router.post('/:sessionId/hint',                  validate(hintSchema),      ctrl.useHint);
router.post('/:sessionId/finish',                ctrl.finishGame);
router.get('/:sessionId/result',                 ctrl.getSessionResult);

module.exports = router;
