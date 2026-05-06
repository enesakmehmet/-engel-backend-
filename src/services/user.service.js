const prisma = require('../utils/prisma');

// ── Profil getir ────────────────────────────
const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      avatar: true,
      role: true,
      plan: true,
      planExpiresAt: true,
      totalScore: true,
      gamesPlayed: true,
      bestScore: true,
      totalCorrect: true,
      totalWrong: true,
      createdAt: true,
    },
  });
  if (!user) throw Object.assign(new Error('Kullanıcı bulunamadı'), { statusCode: 404 });
  return { ...user, isGuest: !user.email };
};

// ── Profil güncelle ─────────────────────────
const updateProfile = async (userId, { displayName, avatar }) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(displayName !== undefined && { displayName }),
      ...(avatar !== undefined && { avatar }),
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
    },
  });
};

// ── Oyun geçmişi ────────────────────────────
const getGameHistory = async (userId, { page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;
  const [sessions, total] = await prisma.$transaction([
    prisma.gameSession.findMany({
      where: { userId, status: 'COMPLETED' },
      orderBy: { finishedAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        score: true,
        correctCount: true,
        wrongCount: true,
        totalQuestions: true,
        difficulty: true,
        startedAt: true,
        finishedAt: true,
        category: { select: { id: true, name: true, icon: true, color: true } },
      },
    }),
    prisma.gameSession.count({ where: { userId, status: 'COMPLETED' } }),
  ]);

  return {
    sessions,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

// ── Kullanıcı istatistikleri ────────────────
const getStats = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      totalScore: true,
      gamesPlayed: true,
      bestScore: true,
      totalCorrect: true,
      totalWrong: true,
    },
  });
  if (!user) throw Object.assign(new Error('Kullanıcı bulunamadı'), { statusCode: 404 });

  const accuracy =
    user.totalCorrect + user.totalWrong > 0
      ? Math.round((user.totalCorrect / (user.totalCorrect + user.totalWrong)) * 100)
      : 0;

  // Kategori bazlı performans
  const categoryStats = await prisma.answer.groupBy({
    by: ['questionId'],
    where: { userId },
    _count: { isCorrect: true },
  });

  return { ...user, accuracy };
};

// ── Şifre Değiştirme ─────────────────────────
const changePassword = async (userId, { currentPassword, newPassword }) => {
  const bcrypt = require('bcryptjs');
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.passwordHash) {
    throw Object.assign(new Error('Kullanıcı veya şifre bulunamadı'), { statusCode: 404 });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) {
    throw Object.assign(new Error('Mevcut şifreniz yanlış'), { statusCode: 400 });
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash },
  });

  return { message: 'Şifreniz başarıyla değiştirildi' };
};

// ── Hesabı Sil ──────────────────────────────
const deleteAccount = async (userId) => {
  // İlişkili tüm verileri silmek için işlem yapıyoruz (Prisma Cascade ayarlıysa gerekmeyebilir ama garantiye alalım)
  await prisma.gameSession.deleteMany({ where: { userId } });
  await prisma.deviceToken.deleteMany({ where: { userId } });
  await prisma.refreshToken.deleteMany({ where: { userId } });
  await prisma.purchase.deleteMany({ where: { userId } });
  
  await prisma.user.delete({ where: { id: userId } });
  return { message: 'Hesabınız başarıyla silindi' };
};

module.exports = { getProfile, updateProfile, getGameHistory, getStats, changePassword, deleteAccount };
