const express = require('express');
const router = express.Router();

// Yada doğrudan prisma'yı çağıralım, en kolayı:
const prisma = require('../utils/prisma');

router.get('/', async (req, res, next) => {
  try {
    const settings = await prisma.systemSettings.findUnique({ where: { id: 'current' } });
    
    // Default değerleri admin.service.js'den de alabiliriz ama bağımlılığı azaltmak için burada da dönüyoruz.
    const defaultData = {
      adFrequency: 3,
      admobEnabled: true,
      customBannerEnabled: false,
      customBannerImageUrl: '',
      customBannerLinkUrl: '',
      customBannerLocation: 'home_middle'
    };
    
    let responseData = defaultData;
    if (settings && settings.data) {
      responseData = { ...defaultData, ...settings.data };
    }
    
    res.json({ success: true, data: responseData });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
