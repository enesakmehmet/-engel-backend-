const prisma = require('../utils/prisma');

const getGlobalLeaderboard = async ({ limit = 20, page = 1 } = {}) => {
  const skip = (page - 1) * limit;
  const users = await prisma.user.findMany({
    where: { isActive: true, gamesPlayed: { gt: 0 } },
    orderBy: { gamesPlayed: 'desc' },
    skip,
    take: limit,
    select: {
      id: true, username: true, displayName: true, avatar: true,
      totalScore: true, gamesPlayed: true, bestScore: true,
      totalCorrect: true, totalWrong: true,
    },
  });
  return users.map((u, i) => ({
    rank: skip + i + 1, ...u,
    accuracy: u.totalCorrect + u.totalWrong > 0
      ? Math.round((u.totalCorrect / (u.totalCorrect + u.totalWrong)) * 100) : 0,
  }));
};

const getCategoryLeaderboard = async (categoryId, { limit = 20 } = {}) => {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) throw Object.assign(new Error('Kategori bulunamadı'), { statusCode: 404 });

  const results = await prisma.gameSession.groupBy({
    by: ['userId'],
    where: { categoryId, status: 'COMPLETED' },
    _max: { score: true },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: limit,
  });

  const userIds = results.map((r) => r.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, username: true, displayName: true, avatar: true },
  });
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  return results.map((r, i) => ({
    rank: i + 1,
    user: userMap[r.userId],
    bestScore: r._max.score,
    gamesPlayed: r._count.id,
  }));
};

const getWeeklyLeaderboard = async ({ limit = 20 } = {}) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const results = await prisma.gameSession.groupBy({
    by: ['userId'],
    where: { status: 'COMPLETED', finishedAt: { gte: weekAgo } },
    _sum: { score: true },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: limit,
  });

  const userIds = results.map((r) => r.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, username: true, displayName: true, avatar: true },
  });
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  return results.map((r, i) => ({
    rank: i + 1,
    user: userMap[r.userId],
    weeklyScore: r._sum.score,
    gamesPlayed: r._count.id,
  }));
};

const getUserRank = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { gamesPlayed: true, totalScore: true } });
  if (!user) throw Object.assign(new Error('Kullanıcı bulunamadı'), { statusCode: 404 });
  const rank = await prisma.user.count({ where: { gamesPlayed: { gt: user.gamesPlayed }, isActive: true } });
  return { rank: rank + 1, totalScore: user.totalScore, gamesPlayed: user.gamesPlayed };
};

module.exports = { getGlobalLeaderboard, getCategoryLeaderboard, getWeeklyLeaderboard, getUserRank };
