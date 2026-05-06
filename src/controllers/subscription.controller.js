const subscriptionService = require('../services/subscription.service');
const { success } = require('../utils/response');

const getStatus = async (req, res, next) => {
  try {
    const data = await subscriptionService.getStatus(req.user.id);
    return success(res, data);
  } catch (err) { next(err); }
};

const verifyApple = async (req, res, next) => {
  try {
    const data = await subscriptionService.verifyApplePurchase(req.user.id, req.body);
    return success(res, data, data.message);
  } catch (err) { next(err); }
};

const verifyGoogle = async (req, res, next) => {
  try {
    const data = await subscriptionService.verifyGooglePurchase(req.user.id, req.body);
    return success(res, data, data.message);
  } catch (err) { next(err); }
};

const getHistory = async (req, res, next) => {
  try {
    const data = await subscriptionService.getPurchaseHistory(req.user.id);
    return success(res, data);
  } catch (err) { next(err); }
};

const getProducts = async (req, res) => {
  return success(res, subscriptionService.PRODUCTS);
};

module.exports = { getStatus, verifyApple, verifyGoogle, getHistory, getProducts };
