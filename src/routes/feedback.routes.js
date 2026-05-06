const router = require('express').Router();
const ctrl = require('../controllers/feedback.controller');
const { authenticate } = require('../middleware/auth');

// Tüm kullanıcı işlemleri korumalıdır
router.use(authenticate);

router.post('/reports', ctrl.createReport);
router.post('/tickets', ctrl.createTicket);
router.get('/tickets', ctrl.getMyTickets);
router.delete('/tickets/:id', ctrl.deleteTicket);

module.exports = router;
