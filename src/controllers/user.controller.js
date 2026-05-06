const userService = require('../services/user.service');
const { success } = require('../utils/response');

const getProfile = async (req, res, next) => {
  try {
    const data = await userService.getProfile(req.user.id);
    return success(res, data);
  } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    const data = await userService.updateProfile(req.user.id, req.body);
    return success(res, data, 'Profil güncellendi');
  } catch (err) { next(err); }
};

const getStats = async (req, res, next) => {
  try {
    const data = await userService.getStats(req.user.id);
    return success(res, data);
  } catch (err) { next(err); }
};

const getGameHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const data = await userService.getGameHistory(req.user.id, { page: +page, limit: +limit });
    return success(res, data);
  } catch (err) { next(err); }
};

const changePassword = async (req, res, next) => {
  try {
    const data = await userService.changePassword(req.user.id, req.body);
    return success(res, data, 'Şifre değiştirildi');
  } catch (err) { next(err); }
};

const deleteAccount = async (req, res, next) => {
  try {
    const data = await userService.deleteAccount(req.user.id);
    return success(res, data, 'Hesap silindi');
  } catch (err) { next(err); }
};

module.exports = { getProfile, updateProfile, getStats, getGameHistory, changePassword, deleteAccount };
