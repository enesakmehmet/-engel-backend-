const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({ body: req.body, query: req.query, params: req.params });
    next();
  } catch (err) {
    return res.status(422).json({
      success: false,
      message: 'Doğrulama hatası',
      errors: err.errors.map((e) => ({
        field: e.path.slice(1).join('.'), // 'body.' prefix'ini kaldır
        message: e.message,
      })),
    });
  }
};

// ── Auth Schemas ─────────────────────────────

const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Geçerli email giriniz'),
    username: z.string().min(3, 'Kullanıcı adı en az 3 karakter').max(20),
    password: z.string().min(6, 'Şifre en az 6 karakter'),
    displayName: z.string().max(50).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Geçerli email giriniz'),
    password: z.string().min(1, 'Şifre gerekli'),
  }),
});

const googleAuthSchema = z.object({
  body: z.object({
    idToken: z.string().min(1, 'Google ID token gerekli'),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Geçerli email giriniz'),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token gerekli'),
    newPassword: z.string().min(6, 'Şifre en az 6 karakter'),
  }),
});

// ── Game Schemas ─────────────────────────────

const startGameSchema = z.object({
  body: z.object({
    puzzleId: z.string().cuid().optional(),
    categoryId: z.string().cuid().optional(),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
    questionCount: z.number().int().min(5).max(20).default(10).optional(),
  }),
});

const answerSchema = z.object({
  body: z.object({
    row:    z.number().int().min(0, 'Satır numarası geçersiz'),
    col:    z.number().int().min(0, 'Sütun numarası geçersiz'),
    letter: z.string().min(1).max(1, 'Sadece tek harf gönderin'),
  }),
  params: z.object({
    sessionId: z.string().cuid('Geçersiz session ID'),
  }),
});

const hintSchema = z.object({
  body: z.object({
    type: z.enum(['AD', 'POINTS']),
    row: z.number().int().min(0),
    col: z.number().int().min(0),
  }),
  params: z.object({
    sessionId: z.string().cuid('Geçersiz session ID'),
  }),
});

// ── Question Schemas (Admin) ──────────────────

const createQuestionSchema = z.object({
  body: z.object({
    title:      z.string().min(2, 'Başlık en az 2 karakter').max(200),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
    points:     z.number().int().min(1).max(10000).default(100),
    width:      z.number().int().min(5).max(20).default(10),
    height:     z.number().int().min(5).max(20).default(10),
    gridData:   z.array(z.any()).min(1, 'Grid verisi boş olamaz'),
    categoryId: z.string().cuid().optional().nullable(),
    isActive:   z.boolean().default(true),
  }),
});

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
    description: z.string().max(255).optional(),
    icon: z.string().optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  }),
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  googleAuthSchema,
  startGameSchema,
  answerSchema,
  hintSchema,
  createQuestionSchema,
  createCategorySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
