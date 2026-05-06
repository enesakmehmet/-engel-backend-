const router = require('express').Router();
const revenuecatCtrl = require('../controllers/revenuecat.controller');

// RevenueCat webhook - authentication gerektirmez (RevenueCat signature ile doğrulanır)
router.post('/revenuecat', revenuecatCtrl.handleWebhook);

module.exports = router;
