const prisma = require('../utils/prisma');
const logger = require('../utils/logger');

// ── FCM Token Kaydet ─────────────────────────
const registerToken = async (userId, { token, platform }) => {
  await prisma.deviceToken.upsert({
    where: { token },
    update: { userId, platform, isActive: true, updatedAt: new Date() },
    create: { userId, token, platform, isActive: true },
  });
  return { message: 'Cihaz kaydedildi' };
};

// ── FCM Token Sil (çıkışta) ──────────────────
const removeToken = async (token) => {
  await prisma.deviceToken.updateMany({ where: { token }, data: { isActive: false } });
};

// ── Tek kullanıcıya bildirim ─────────────────
const sendToUser = async (userId, { title, body, data = {} }) => {
  const tokens = await prisma.deviceToken.findMany({
    where: { userId, isActive: true },
    select: { token: true, platform: true },
  });

  if (!tokens.length) return { sent: 0 };

  const results = await Promise.allSettled(
    tokens.map((t) => _sendFCM(t.token, { title, body, data }))
  );

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  logger.info(`Bildirim gönderildi: userId=${userId}, sent=${sent}/${tokens.length}`);
  return { sent, total: tokens.length };
};

// ── Tüm kullanıcılara (broadcast) ───────────
const broadcast = async ({ title, body, data = {}, plan = null }) => {
  const where = {
    isActive: true,
    ...(plan && { user: { plan } }),
  };

  const tokens = await prisma.deviceToken.findMany({
    where,
    select: { token: true },
    take: 500, // batch limit
  });

  if (!tokens.length) return { sent: 0 };

  const results = await Promise.allSettled(
    tokens.map((t) => _sendFCM(t.token, { title, body, data }))
  );

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  logger.info(`Broadcast gönderildi: sent=${sent}/${tokens.length}`);
  return { sent, total: tokens.length };
};

// ── Oyun sonu bildirim örneği ─────────────────
const sendGameResult = async (userId, { score, rank }) => {
  return sendToUser(userId, {
    title: '🎮 Oyun Bitti!',
    body: `${score} puan kazandın! Sıralaman: #${rank}`,
    data: { type: 'game_result', score, rank },
  });
};

// ── Günlük limit uyarısı ─────────────────────
const sendLimitWarning = async (userId) => {
  return sendToUser(userId, {
    title: '⚠️ Günlük Oyun Hakkın Doldu',
    body: 'Daha fazla oynamak için oyun paketi satın al veya Premium üye ol!',
    data: { type: 'limit_reached' },
  });
};

// ── FCM HTTP v1 API çağrısı ──────────────────
const _sendFCM = async (token, { title, body, data }) => {
  const fcmKey = process.env.FCM_SERVER_KEY;
  if (!fcmKey) {
    logger.warn('FCM_SERVER_KEY tanımlı değil, bildirim atlandı');
    return;
  }

  const https = require('https');
  const payload = JSON.stringify({
    to: token,
    notification: { title, body },
    data,
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      'https://fcm.googleapis.com/fcm/send',
      {
        method: 'POST',
        headers: {
          Authorization: `key=${fcmKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          const result = JSON.parse(raw);
          if (result.failure > 0) {
            logger.warn(`FCM hata: token=${token.slice(0, 20)}`, result);
          }
          resolve(result);
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
};

module.exports = { registerToken, removeToken, sendToUser, broadcast, sendGameResult, sendLimitWarning };
