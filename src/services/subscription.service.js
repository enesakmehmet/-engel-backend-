const prisma = require('../utils/prisma');
const logger = require('../utils/logger');

// ── Ürün kataloğu ────────────────────────────
const PRODUCTS = {
  // SUBSCRIPTION
  'cenegel.sub.weekly':  { type: 'SUBSCRIPTION_WEEKLY',  days: 7,   label: 'Haftalık Premium' },
  'cenegel.sub.monthly': { type: 'SUBSCRIPTION_MONTHLY', days: 30,  label: 'Aylık Premium' },
  'cenegel.sub.yearly':  { type: 'SUBSCRIPTION_YEARLY',  days: 365, label: 'Yıllık Premium' },
};

// ── Günlük limit kontrolü (Varsayılan değerler) ────────────
const DEFAULT_FREE_DAILY_LIMIT = 3;

const getDailyLimit = async () => {
  try {
    const settings = await prisma.systemSettings.findUnique({ where: { id: 'current' } });
    if (settings && settings.data && typeof settings.data.freeDailyLimit !== 'undefined') {
      return parseInt(settings.data.freeDailyLimit);
    }
  } catch (error) {
    logger.error('Sistem ayarları okunurken hata:', error);
  }
  return DEFAULT_FREE_DAILY_LIMIT;
};

const checkCanPlay = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, planExpiresAt: true, dailyGamesUsed: true, dailyResetAt: true },
  });
  if (!user) throw Object.assign(new Error('Kullanıcı bulunamadı'), { statusCode: 404 });

  // PREMIUM ise → sınırsız (süre dolmamışsa)
  if (user.plan === 'PREMIUM') {
    if (!user.planExpiresAt || user.planExpiresAt > new Date()) {
      return { canPlay: true, reason: 'premium' };
    }
    // Süresi dolmuş → FREE'ye düşür
    await prisma.user.update({ where: { id: userId }, data: { plan: 'FREE', planExpiresAt: null } });
  }

  // Günlük sayacı sıfırla (gün geçmişse)
  const now = new Date();
  const resetAt = new Date(user.dailyResetAt);
  const isSameDay =
    now.getFullYear() === resetAt.getFullYear() &&
    now.getMonth() === resetAt.getMonth() &&
    now.getDate() === resetAt.getDate();

  let dailyUsed = user.dailyGamesUsed;
  if (!isSameDay) {
    await prisma.user.update({ where: { id: userId }, data: { dailyGamesUsed: 0, dailyResetAt: now } });
    dailyUsed = 0;
  }

  const dailyLimit = await getDailyLimit();

  // Günlük limit dolmamışsa → oynayabilir
  if (dailyUsed < dailyLimit) {
    return {
      canPlay: true,
      reason: 'free_daily',
      remaining: dailyLimit - dailyUsed,
      dailyLimit: dailyLimit,
    };
  }

  // Hiçbiri yoksa → engelle
  return {
    canPlay: false,
    reason: 'limit_reached',
    message: `Günlük ${dailyLimit} ücretsiz oyun hakkın doldu.`,
    dailyLimit: dailyLimit,
  };
};

// ── Oyun kullanımını kaydet ──────────────────
const consumePlay = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, planExpiresAt: true, dailyGamesUsed: true, dailyResetAt: true },
  });

  // PREMIUM → sadece gamesPlayed artır, limit yok
  if (user.plan === 'PREMIUM' && (!user.planExpiresAt || user.planExpiresAt > new Date())) return;

  const now = new Date();
  const resetAt = new Date(user.dailyResetAt || now);
  const isSameDay =
    now.getFullYear() === resetAt.getFullYear() &&
    now.getMonth() === resetAt.getMonth() &&
    now.getDate() === resetAt.getDate();

  const dailyUsed = isSameDay ? user.dailyGamesUsed : 0;

  const dailyLimit = await getDailyLimit();

  if (dailyUsed < dailyLimit) {
    await prisma.user.update({
      where: { id: userId },
      data: { dailyGamesUsed: { increment: 1 }, ...(!isSameDay && { dailyResetAt: now }) },
    });
  }
};

// ── Plan durumu getir ────────────────────────
const getStatus = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, planExpiresAt: true, dailyGamesUsed: true, dailyResetAt: true },
  });

  const now = new Date();
  const isPremiumActive = user.plan === 'PREMIUM' && (!user.planExpiresAt || user.planExpiresAt > now);

  const resetAt = new Date(user.dailyResetAt || now);
  const isSameDay =
    now.getFullYear() === resetAt.getFullYear() &&
    now.getMonth() === resetAt.getMonth() &&
    now.getDate() === resetAt.getDate();
  const dailyUsed = isSameDay ? user.dailyGamesUsed : 0;

  const dailyLimit = await getDailyLimit();
  const dailyRemaining = isPremiumActive ? 0 : Math.max(0, dailyLimit - dailyUsed);

  return {
    plan: user.plan,
    isPremiumActive,
    planExpiresAt: user.planExpiresAt,
    dailyGamesUsed: dailyUsed,
    dailyGamesLimit: dailyLimit,
    dailyGamesRemaining: isPremiumActive ? null : dailyRemaining,
  };
};

// ── Apple IAP Doğrulama ──────────────────────
const verifyApplePurchase = async (userId, { productId, receiptData }) => {
  const product = PRODUCTS[productId];
  if (!product) throw Object.assign(new Error('Geçersiz ürün ID'), { statusCode: 400 });

  // Apple sandbox/production doğrulama
  let verificationUrl = 'https://buy.itunes.apple.com/verifyReceipt';
  let appleResponse = await _callApple(verificationUrl, receiptData);

  // Sandbox'a yönlendir (status 21007)
  if (appleResponse.status === 21007) {
    verificationUrl = 'https://sandbox.itunes.apple.com/verifyReceipt';
    appleResponse = await _callApple(verificationUrl, receiptData);
  }

  if (appleResponse.status !== 0) {
    logger.warn(`Apple IAP doğrulama başarısız: status ${appleResponse.status}`);
    throw Object.assign(new Error('Apple satın alma doğrulanamadı'), { statusCode: 400 });
  }

  const latestReceipt = appleResponse.latest_receipt_info?.[0];
  const transactionId = latestReceipt?.transaction_id || `apple_${Date.now()}`;

  // Duplicate kontrol
  const existing = await prisma.purchase.findUnique({ where: { transactionId } });
  if (existing) throw Object.assign(new Error('Bu satın alma zaten işlendi'), { statusCode: 409 });

  return _applyPurchase(userId, { productId, product, platform: 'APPLE', receiptData, transactionId });
};

// ── Google IAP Doğrulama ─────────────────────
const verifyGooglePurchase = async (userId, { productId, purchaseToken }) => {
  const product = PRODUCTS[productId];
  if (!product) throw Object.assign(new Error('Geçersiz ürün ID'), { statusCode: 400 });

  // NOT: Production'da Google Play Developer API ile doğrulama yapılmalı
  // Şimdilik token'ı kaydet, sonra doğrula
  const transactionId = purchaseToken;

  const existing = await prisma.purchase.findUnique({ where: { transactionId } });
  if (existing) throw Object.assign(new Error('Bu satın alma zaten işlendi'), { statusCode: 409 });

  logger.info(`Google IAP: userId=${userId}, productId=${productId}, token=${purchaseToken.slice(0, 20)}...`);

  return _applyPurchase(userId, { productId, product, platform: 'GOOGLE', receiptData: purchaseToken, transactionId });
};

// ── Satın alma geçmişi ───────────────────────
const getPurchaseHistory = async (userId) => {
  const purchases = await prisma.purchase.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, platform: true, purchaseType: true, productId: true,
      expiresAt: true, verifiedAt: true, createdAt: true,
    },
  });

  return purchases;
};

// ── İç: satın almayı uygula ──────────────────
const _applyPurchase = async (userId, { productId, product, platform, receiptData, transactionId }) => {
  const now = new Date();
  let expiresAt = null;
  const updateData = {};

  const currentUser = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true, planExpiresAt: true } });
  const base = currentUser.plan === 'PREMIUM' && currentUser.planExpiresAt > now
    ? currentUser.planExpiresAt  // Üst üste uzat
    : now;
  expiresAt = new Date(base);
  expiresAt.setDate(expiresAt.getDate() + product.days);
  updateData.plan = 'PREMIUM';
  updateData.planExpiresAt = expiresAt;

  const [purchase] = await prisma.$transaction([
    prisma.purchase.create({
      data: {
        userId, platform, purchaseType: product.type,
        productId, receiptData, transactionId,
        status: 'VERIFIED', expiresAt, verifiedAt: now,
      },
    }),
    prisma.user.update({ where: { id: userId }, data: updateData }),
  ]);

  return {
    purchase: { id: purchase.id, type: product.type, label: product.label, expiresAt },
    message: `${product.label} aktif edildi! Bitiş: ${expiresAt.toLocaleDateString('tr-TR')}`,
  };
};

// ── Apple API çağrısı ────────────────────────
const _callApple = async (url, receiptData) => {
  const https = require('https');
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ 'receipt-data': receiptData, password: process.env.APPLE_SHARED_SECRET || '' });
    const req = https.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
};

module.exports = { checkCanPlay, consumePlay, getStatus, verifyApplePurchase, verifyGooglePurchase, getPurchaseHistory, PRODUCTS };
