const adminService = require('../services/admin.service');
const { success } = require('../utils/response');

// Dashboard
const getDashboard = async (req, res, next) => {
  try { return success(res, await adminService.getDashboardStats()); }
  catch (err) { next(err); }
};

// Kategoriler
const getCategories = async (req, res, next) => {
  try { return success(res, await adminService.getCategories()); }
  catch (err) { next(err); }
};
const createCategory = async (req, res, next) => {
  try { return success(res, await adminService.createCategory(req.body), 'Kategori oluşturuldu', 201); }
  catch (err) { next(err); }
};
const updateCategory = async (req, res, next) => {
  try { return success(res, await adminService.updateCategory(req.params.id, req.body), 'Kategori güncellendi'); }
  catch (err) { next(err); }
};
const deleteCategory = async (req, res, next) => {
  try { return success(res, await adminService.deleteCategory(req.params.id), 'Kategori silindi'); }
  catch (err) { next(err); }
};

// Sorular
const getQuestions = async (req, res, next) => {
  try {
    const { categoryId, difficulty, page = 1, limit = 20 } = req.query;
    return success(res, await adminService.getQuestions({ categoryId, difficulty, page: +page, limit: +limit }));
  } catch (err) { next(err); }
};
const createQuestion = async (req, res, next) => {
  try { return success(res, await adminService.createQuestion(req.body), 'Soru oluşturuldu', 201); }
  catch (err) { next(err); }
};
const updateQuestion = async (req, res, next) => {
  try { return success(res, await adminService.updateQuestion(req.params.id, req.body), 'Soru güncellendi'); }
  catch (err) { next(err); }
};
const deleteQuestion = async (req, res, next) => {
  try { return success(res, await adminService.deleteQuestion(req.params.id), 'Soru silindi'); }
  catch (err) { next(err); }
};

// Kullanıcılar
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    return success(res, await adminService.getUsers({ page: +page, limit: +limit, search }));
  } catch (err) { next(err); }
};
const updateUserRole = async (req, res, next) => {
  try { return success(res, await adminService.updateUserRole(req.params.id, req.body.role), 'Rol güncellendi'); }
  catch (err) { next(err); }
};
const toggleUserStatus = async (req, res, next) => {
  try { return success(res, await adminService.toggleUserStatus(req.params.id), 'Durum güncellendi'); }
  catch (err) { next(err); }
};
const adjustUserCredits = async (req, res, next) => {
  try { return success(res, await adminService.adjustUserCredits(req.params.id, req.body), 'Puan/Erişim güncellendi'); }
  catch (err) { next(err); }
};

// Ayarlar
const getSettings = async (req, res, next) => {
  try { return success(res, await adminService.getSettings()); }
  catch (err) { next(err); }
};
const updateSettings = async (req, res, next) => {
  try { return success(res, await adminService.updateSettings(req.body), 'Ayarlar güncellendi'); }
  catch (err) { next(err); }
};

// Loglar
const getLogs = async (req, res, next) => {
  try {
    const { type, limit } = req.query;
    return success(res, await adminService.getLogs(type, limit ? +limit : 100));
  } catch (err) { next(err); }
};

// Bildirimler
const sendBulkNotification = async (req, res, next) => {
  try { return success(res, await adminService.sendBulkNotification(req.body), 'Bildirimler gönderiliyor'); }
  catch (err) { next(err); }
};

// Analitik
const getAnalytics = async (req, res, next) => {
  try { return success(res, await adminService.getAnalytics()); }
  catch (err) { next(err); }
};

// Satın Alımlar
const getPurchases = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    return success(res, await adminService.getPurchases({ page: +page, limit: +limit }));
  } catch (err) { next(err); }
};

module.exports = {
  getDashboard,
  getCategories, createCategory, updateCategory, deleteCategory,
  getQuestions, createQuestion, updateQuestion, deleteQuestion,
  getUsers, updateUserRole, toggleUserStatus, adjustUserCredits,
  getSettings, updateSettings, getLogs, sendBulkNotification, getAnalytics, getPurchases
};
