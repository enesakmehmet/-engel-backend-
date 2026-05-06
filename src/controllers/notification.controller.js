const notificationService = require('../services/notification.service');
const { success } = require('../utils/response');

const registerToken = async (req, res, next) => {
  try {
    const data = await notificationService.registerToken(req.user.id, req.body);
    return success(res, data, 'Cihaz başarıyla kaydedildi');
  } catch (err) { next(err); }
};

const removeToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (token) await notificationService.removeToken(token);
    return success(res, {}, 'Cihaz kaydı silindi');
  } catch (err) { next(err); }
};

module.exports = { registerToken, removeToken };
