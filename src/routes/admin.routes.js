const router = require('express').Router();
const ctrl = require('../controllers/admin.controller');
const { validate, createQuestionSchema, createCategorySchema } = require('../middleware/validate');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate, requireRole('ADMIN'));

// Dashboard
router.get('/dashboard', ctrl.getDashboard);

// Kategoriler
router.get('/categories',          ctrl.getCategories);
router.post('/categories',         validate(createCategorySchema), ctrl.createCategory);
router.put('/categories/:id',      ctrl.updateCategory);
router.delete('/categories/:id',   ctrl.deleteCategory);

// Sorular
router.get('/questions',           ctrl.getQuestions);
router.post('/questions',          validate(createQuestionSchema), ctrl.createQuestion);
router.put('/questions/:id',       ctrl.updateQuestion);
router.delete('/questions/:id',    ctrl.deleteQuestion);

// Kullanıcılar
router.get('/users',               ctrl.getUsers);
router.patch('/users/:id/role',    ctrl.updateUserRole);
router.patch('/users/:id/status',  ctrl.toggleUserStatus);
router.patch('/users/:id/adjust',  ctrl.adjustUserCredits);

// Ayarlar
router.get('/settings',            ctrl.getSettings);
router.put('/settings',            ctrl.updateSettings);

// Loglar
router.get('/logs',                ctrl.getLogs);

const feedbackCtrl = require('../controllers/feedback.controller');

// Analitik ve Satın Alımlar
router.get('/analytics',           ctrl.getAnalytics);
router.get('/purchases',           ctrl.getPurchases);

// Bildirimler
router.post('/notifications/bulk', ctrl.sendBulkNotification);

// Geri Bildirim & Destek
router.get('/reports',             feedbackCtrl.getReports);
router.patch('/reports/:id',       feedbackCtrl.updateReportStatus);
router.get('/tickets',             feedbackCtrl.getTickets);
router.post('/tickets/:id/respond', feedbackCtrl.respondToTicket);
router.patch('/tickets/:id',        feedbackCtrl.updateTicketStatus);
router.delete('/tickets/:id',       feedbackCtrl.deleteTicket);

module.exports = router;
