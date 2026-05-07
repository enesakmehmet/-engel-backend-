const router = require('express').Router();
const multer = require('multer');
const { authenticate, requireRole } = require('../middleware/auth');
const { parsePuzzleImage } = require('../controllers/puzzle-ocr.controller');

// Resim bellekte tutulur (disk yerine buffer), max 10MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (/image\/(jpeg|png|webp|gif)/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Sadece jpeg, png, webp veya gif yükleyebilirsiniz.'));
    }
  },
});

router.post(
  '/parse-image',
  authenticate,
  requireRole('ADMIN'),
  upload.single('image'),
  parsePuzzleImage
);

module.exports = router;
