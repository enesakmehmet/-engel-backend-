const feedbackService = require('../services/feedback.service');
const { success } = require('../utils/response');

// Kullanıcı
const createReport = async (req, res, next) => {
  try {
    const report = await feedbackService.createReport(req.user.id, req.body);
    return success(res, report, 'Hata raporu gönderildi', 201);
  } catch (err) { next(err); }
};

const createTicket = async (req, res, next) => {
  try {
    const ticket = await feedbackService.createTicket(req.user.id, req.body);
    return success(res, ticket, 'Destek talebi oluşturuldu', 201);
  } catch (err) { next(err); }
};

const getMyTickets = async (req, res, next) => {
  try {
    const data = await feedbackService.getMyTickets(req.user.id);
    return success(res, data);
  } catch (err) { next(err); }
};

const deleteTicket = async (req, res, next) => {
  try {
    // Add simple ownership check (assuming users can only delete their own unless admin)
    const ticket = await feedbackService.getMyTickets(req.user.id);
    if (!ticket.find(t => t.id === req.params.id) && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Bu işlem için yetkiniz yok.' });
    }
    await feedbackService.deleteTicket(req.params.id);
    return success(res, null, 'Destek talebi silindi');
  } catch (err) { next(err); }
};

// Admin
const getReports = async (req, res, next) => {
  try {
    const { status, page, limit } = req.query;
    const data = await feedbackService.getReports({ status, page: +page || 1, limit: +limit || 20 });
    return success(res, data);
  } catch (err) { next(err); }
};

const updateReportStatus = async (req, res, next) => {
  try {
    const data = await feedbackService.updateReportStatus(req.params.id, req.body.status);
    return success(res, data, 'Rapor durumu güncellendi');
  } catch (err) { next(err); }
};

const getTickets = async (req, res, next) => {
  try {
    const { status, page, limit } = req.query;
    const data = await feedbackService.getTickets({ status, page: +page || 1, limit: +limit || 20 });
    return success(res, data);
  } catch (err) { next(err); }
};

const respondToTicket = async (req, res, next) => {
  try {
    const data = await feedbackService.respondToTicket(req.params.id, req.body.response);
    return success(res, data, 'Destek talebi yanıtlandı');
  } catch (err) { next(err); }
};

const updateTicketStatus = async (req, res, next) => {
  try {
    const data = await feedbackService.updateTicketStatus(req.params.id, req.body.status);
    return success(res, data, 'Destek talebi durumu güncellendi');
  } catch (err) { next(err); }
};

module.exports = {
  createReport, createTicket, getMyTickets, deleteTicket,
  getReports, updateReportStatus,
  getTickets, respondToTicket, updateTicketStatus
};
