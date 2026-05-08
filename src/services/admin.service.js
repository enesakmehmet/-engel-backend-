const prisma = require('../utils/prisma');
const fs = require('fs/promises');
const path = require('path');
const notificationService = require('./notification.service');

// ── Kategoriler ─────────────────────────────
const getCategories = async () => {
  return prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { puzzles: { where: { isActive: true } } } } },
    orderBy: { name: 'asc' },
  });
};

const getCategory = async (id) => {
  const cat = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { puzzles: { where: { isActive: true } } } } },
  });
  if (!cat) throw Object.assign(new Error('Kategori bulunamadı'), { statusCode: 404 });
  return cat;
};

const createCategory = async (data) => prisma.category.create({ data });

const updateCategory = async (id, data) => {
  await getCategory(id);
  return prisma.category.update({ where: { id }, data });
};

const deleteCategory = async (id) => {
  await getCategory(id);
  return prisma.category.update({ where: { id }, data: { isActive: false } });
};

// ── Sorular (Admin) ─────────────────────────
const createQuestion = async ({ title, categoryId, difficulty, points, width, height, gridData, isActive }) => {
  return prisma.puzzle.create({
    data: {
      title,
      difficulty: difficulty || 'MEDIUM',
      points: points || 100,
      width: width || 10,
      height: height || 10,
      gridData,
      isActive: isActive !== false,
      ...(categoryId ? { categoryId } : {}),
    },
    include: { category: { select: { id: true, name: true } } },
  });
};

const getQuestions = async ({ categoryId, difficulty, page = 1, limit = 20 } = {}) => {
  const where = {
    isActive: true,
    ...(categoryId && { categoryId }),
    ...(difficulty && { difficulty }),
  };
  const skip = (page - 1) * limit;
  const [questions, total] = await prisma.$transaction([
    prisma.puzzle.findMany({
      where, skip, take: limit,
      include: { category: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.puzzle.count({ where }),
  ]);
  return { questions, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const updateQuestion = async (id, data) => {
  const q = await prisma.puzzle.findUnique({ where: { id } });
  if (!q) throw Object.assign(new Error('Bulmaca bulunamadı'), { statusCode: 404 });
  const { gridData, ...rest } = data;
  return prisma.puzzle.update({
    where: { id },
    data: { ...rest, ...(gridData ? { gridData } : {}) },
    include: { category: { select: { id: true, name: true } } },
  });
};

const deleteQuestion = async (id) => {
  const q = await prisma.puzzle.findUnique({ where: { id } });
  if (!q) throw Object.assign(new Error('Bulmaca bulunamadı'), { statusCode: 404 });
  return prisma.puzzle.update({ where: { id }, data: { isActive: false } });
};

// ── Kullanıcılar (Admin) ────────────────────
const getUsers = async ({ page = 1, limit = 20, search } = {}) => {
  const skip = (page - 1) * limit;
  const where = search
    ? { OR: [{ username: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] }
    : {};
  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where, skip, take: limit,
      select: { id: true, email: true, username: true, displayName: true, role: true, isActive: true, plan: true, gamesPlayed: true, totalScore: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);
  return { users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const updateUserRole = async (id, role) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw Object.assign(new Error('Kullanıcı bulunamadı'), { statusCode: 404 });
  return prisma.user.update({ where: { id }, data: { role } });
};

const toggleUserStatus = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw Object.assign(new Error('Kullanıcı bulunamadı'), { statusCode: 404 });
  return prisma.user.update({ where: { id }, data: { isActive: !user.isActive } });
};

const adjustUserCredits = async (id, { scoreToAdd = 0, plan }) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw Object.assign(new Error('Kullanıcı bulunamadı'), { statusCode: 404 });

  const data = {};
  if (scoreToAdd) data.totalScore = { increment: Number(scoreToAdd) };
  if (plan && ['FREE', 'PREMIUM'].includes(plan)) {
    data.plan = plan;
    data.planExpiresAt = plan === 'PREMIUM' ? null : null;
  }

  if (Object.keys(data).length === 0) {
    return user;
  }

  return prisma.user.update({ where: { id }, data });
};

// ── Dashboard Stats ─────────────────────────
const getDashboardStats = async () => {
  const [totalUsers, totalQuestions, totalGames, totalCategories] = await prisma.$transaction([
    prisma.user.count({ where: { isActive: true } }),
    prisma.puzzle.count({ where: { isActive: true } }),
    prisma.gameSession.count({ where: { status: 'COMPLETED' } }),
    prisma.category.count({ where: { isActive: true } }),
  ]);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayGames = await prisma.gameSession.count({ where: { status: 'COMPLETED', finishedAt: { gte: today } } });
  const newUsersToday = await prisma.user.count({ where: { createdAt: { gte: today } } });

  return { totalUsers, totalQuestions, totalGames, totalCategories, todayGames, newUsersToday };
};

// ── Ayarlar ─────────────────────────────────
const getSettings = async () => {
  let settings = await prisma.systemSettings.findUnique({ where: { id: 'current' } });
  
  const defaultData = {
    hintCostLetter: 20,
    hintCostSolve: 100,
    adFrequency: 3,
    dailyBonusAmount: 50,
    welcomeBonus: 100,
    freeDailyLimit: 3,
    admobEnabled: true,
    customBannerEnabled: false,
    customBannerImageUrl: '',
    customBannerLinkUrl: '',
    customBannerLocation: 'home_middle'
  };

  if (!settings) {
    settings = await prisma.systemSettings.create({
      data: { id: 'current', data: defaultData }
    });
  } else {
    // Eksik alanları defaultData ile doldur
    const currentData = typeof settings.data === 'object' && settings.data !== null ? settings.data : {};
    settings.data = { ...defaultData, ...currentData };
  }
  return settings;
};

const updateSettings = async (data) => {
  return prisma.systemSettings.update({
    where: { id: 'current' },
    data: { data }
  });
};

// ── Loglar ──────────────────────────────────
const getLogs = async (type = 'combined', limit = 100) => {
  const fileName = type === 'error' ? 'error.log' : 'combined.log';
  const filePath = path.join(__dirname, '../../logs', fileName);
  
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    return lines.slice(-limit).reverse();
  } catch (error) {
    return [`Log dosyası okunamadı: ${error.message}`];
  }
};

// ── Bildirimler ─────────────────────────────
const sendBulkNotification = async ({ title, body, plan }) => {
  return notificationService.broadcast({ title, body, plan });
};

// ── Gelişmiş Analitik ───────────────────────
const getAnalytics = async () => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const lastWeek = new Date(today); lastWeek.setDate(lastWeek.getDate() - 7);

  const [
    popularity,
    completionRates,
    dailyActiveUsers
  ] = await prisma.$transaction([
    // En popüler bulmacalar
    prisma.puzzle.findMany({
      take: 5,
      where: { isActive: true },
      include: { _count: { select: { gameSessions: true } } },
      orderBy: { gameSessions: { _count: 'desc' } }
    }),
    // Tamamlama oranları (Zorluk seviyesine göre)
    prisma.gameSession.groupBy({
      by: ['status'],
      _count: { _all: true }
    }),
    // Son 7 günün günlük aktif kullanıcıları (Basit yaklaşım: session başlatanlar)
    prisma.gameSession.groupBy({
      by: ['startedAt'],
      where: { startedAt: { gte: lastWeek } },
      _count: { userId: true }
    })
  ]);

  return { popularity, completionRates, dailyActiveUsers };
};

// ── Satın Alımlar ───────────────────────────
const getPurchases = async ({ page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  const [purchases, total] = await prisma.$transaction([
    prisma.purchase.findMany({
      skip, take: limit,
      include: { user: { select: { id: true, username: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.purchase.count()
  ]);
  return { purchases, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

module.exports = {
  getCategories, getCategory, createCategory, updateCategory, deleteCategory,
  createQuestion, getQuestions, updateQuestion, deleteQuestion,
  getUsers, updateUserRole, toggleUserStatus, adjustUserCredits, getDashboardStats,
  getSettings, updateSettings, getLogs, sendBulkNotification, getAnalytics, getPurchases
};
