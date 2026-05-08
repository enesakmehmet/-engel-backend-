const gameService = require('../services/game.service');
const { success } = require('../utils/response');

const getPuzzles = async (req, res, next) => {
  try {
    return success(res, [], 'Bulmaca listeleme devre dışı bırakıldı');
  } catch (err) { next(err); }
};

const startGame = async (req, res, next) => {
  try {
    return success(res, null, 'Bulmaca başlatma devre dışı bırakıldı', 403);
  } catch (err) { next(err); }
};

const getGameStatus = async (req, res, next) => {
  try {
    const result = await gameService.getGameStatus(req.params.sessionId);
    return success(res, result);
  } catch (err) { next(err); }
};

const submitAnswer = async (req, res, next) => {
  try {
    const result = await gameService.submitAnswer(req.params.sessionId, req.body);
    return success(res, result);
  } catch (err) { next(err); }
};

const useHint = async (req, res, next) => {
  try {
    const result = await gameService.useHint(req.user.id, req.params.sessionId, req.body);
    return success(res, result, 'Yardım kullanıldı');
  } catch (err) { next(err); }
};

const finishGame = async (req, res, next) => {
  try {
    const result = await gameService.finishGame(req.params.sessionId);
    return success(res, result);
  } catch (err) { next(err); }
};

const getSessionResult = async (req, res, next) => {
  try {
    const data = await gameService.getSessionResult(req.user.id, req.params.sessionId);
    return success(res, data);
  } catch (err) { next(err); }
};

module.exports = { getPuzzles, startGame, getGameStatus, submitAnswer, useHint, finishGame, getSessionResult };
