const leaderboardService = require('../services/leaderboard.service');
const { success } = require('../utils/response');

const getGlobal = async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const data = await leaderboardService.getGlobalLeaderboard({ limit: +limit, page: +page });
    return success(res, data);
  } catch (err) { next(err); }
};

const getByCategory = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    const data = await leaderboardService.getCategoryLeaderboard(req.params.categoryId, { limit: +limit });
    return success(res, data);
  } catch (err) { next(err); }
};

const getWeekly = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    const data = await leaderboardService.getWeeklyLeaderboard({ limit: +limit });
    return success(res, data);
  } catch (err) { next(err); }
};

const getMyRank = async (req, res, next) => {
  try {
    const data = await leaderboardService.getUserRank(req.user.id);
    return success(res, data);
  } catch (err) { next(err); }
};

module.exports = { getGlobal, getByCategory, getWeekly, getMyRank };
