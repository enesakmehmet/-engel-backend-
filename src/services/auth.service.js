const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const prisma = require('../utils/prisma');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const mailService = require('./mail.service');
const { verifyFirebaseIdToken } = require('../utils/firebase');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── Kullanıcı adı üret ─────────────────────
const generateUsername = async (base) => {
  const clean = base.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 15) || 'user';
  let username = clean;
  let counter = 1;
  while (await prisma.user.findUnique({ where: { username } })) {
    username = `${clean}${counter++}`;
  }
  return username;
};

const buildSafeUser = (user, extra = {}) => ({
  ...user,
  email: user.email ?? null,
  plan: user.plan,
  planExpiresAt: user.planExpiresAt,
  ...extra,
});

// ── Email / Şifre Kayıt ────────────────────
const register = async ({ email, username, password, displayName }) => {
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) throw Object.assign(new Error('Bu email zaten kullanımda'), { statusCode: 409 });

  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) throw Object.assign(new Error('Bu kullanıcı adı zaten alınmış'), { statusCode: 409 });

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, username, passwordHash, displayName: displayName || username, totalScore: 200 },
    select: { id: true, email: true, username: true, displayName: true, avatar: true, role: true, plan: true, planExpiresAt: true, totalScore: true },
  });

  // Hoş geldin maili gönder (arkaplan işlemi olarak)
  mailService.sendWelcomeEmail(email, user.username).catch(console.error);


  const tokens = await _issueTokens(user.id);
  return { user: buildSafeUser(user, { isGuest: false }), ...tokens };
};

// ── Email / Şifre Giriş ────────────────────
const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, username: true, displayName: true, avatar: true, role: true, plan: true, planExpiresAt: true, passwordHash: true, isActive: true },
  });
  if (!user || !user.passwordHash) {
    throw Object.assign(new Error('Email veya şifre hatalı'), { statusCode: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw Object.assign(new Error('Email veya şifre hatalı'), { statusCode: 401 });
  if (!user.isActive) throw Object.assign(new Error('Hesap devre dışı'), { statusCode: 403 });

  const tokens = await _issueTokens(user.id);
  const { passwordHash, isActive, ...safeUser } = user;
  return { user: buildSafeUser(safeUser, { isGuest: false }), ...tokens };
};

// ── Firebase Auth Exchange ──────────────────
const firebaseAuth = async ({ idToken, provider }) => {
  const decoded = await verifyFirebaseIdToken(idToken);
  const email = decoded.email || null;
  const displayName = decoded.name || decoded.email?.split('@')[0] || decoded.uid;
  const avatar = decoded.picture || null;
  const providerData = decoded.firebase?.sign_in_provider || null;
  const identityProvider = provider || providerData || 'firebase';

  let user = await prisma.user.findFirst({
    where: {
      OR: [
        email ? { email } : null,
        decoded.uid ? { firebaseUid: decoded.uid } : null,
      ].filter(Boolean),
    },
  });

  if (!user) {
    const usernameBase = displayName || (email ? email.split('@')[0] : decoded.uid);
    const username = await generateUsername(usernameBase);
    user = await prisma.user.create({
      data: {
        email,
        username,
        displayName,
        avatar,
        firebaseUid: decoded.uid,
        totalScore: 200,
        // Firebase users are treated as normal registered users in the app.
      },
    });

    if (email) {
      mailService.sendWelcomeEmail(email, user.username).catch(console.error);
    }
  } else if (!user.firebaseUid) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { firebaseUid: decoded.uid },
    });
  }

  if (!user.isActive) throw Object.assign(new Error('Hesap devre dışı'), { statusCode: 403 });

  const tokens = await _issueTokens(user.id);
  const { passwordHash, ...safeUser } = user;
  return {
    provider: identityProvider,
    user: buildSafeUser(safeUser, { isGuest: false }),
    ...tokens,
  };
};

// ── Google OAuth ───────────────────────────
const googleAuth = async ({ idToken }) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { sub: googleId, email, name, picture } = payload;

  let user = await prisma.user.findFirst({
    where: { OR: [{ googleId }, { email }] },
  });

  if (user) {
    if (!user.googleId) {
      user = await prisma.user.update({ where: { id: user.id }, data: { googleId } });
    }
  } else {
    const username = await generateUsername(name || email.split('@')[0]);
    user = await prisma.user.create({
      data: { googleId, email, username, displayName: name, avatar: picture, totalScore: 200 },
    });
    // Yeni kullanıcı, hoş geldin maili gönder
    if (email) mailService.sendWelcomeEmail(email, user.username).catch(console.error);
  }

  if (!user.isActive) throw Object.assign(new Error('Hesap devre dışı'), { statusCode: 403 });
  const tokens = await _issueTokens(user.id);
  const { passwordHash, ...safeUser } = user;
  return { user: buildSafeUser(safeUser, { isGuest: false }), ...tokens };
};

// ── Misafir Girişi ──────────────────────────
const guestLogin = async () => {
  const guestSuffix = crypto.randomBytes(4).toString('hex');
  const username = await generateUsername(`guest${guestSuffix}`);

  const user = await prisma.user.create({
    data: {
      email: null,
      username,
      displayName: 'Misafir Oyuncu',
      passwordHash: null,
      totalScore: 200,
    },
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
    },
  });

  const tokens = await _issueTokens(user.id);
  return { user: buildSafeUser(user, { isGuest: true }), ...tokens };
};

// ── Apple OAuth ────────────────────────────
const appleAuth = async ({ idToken, displayName }) => {
  // Apple JWT doğrulaması (basitleştirilmiş - production'da apple-signin-auth paketi kullanın)
  const parts = idToken.split('.');
  if (parts.length !== 3) throw Object.assign(new Error('Geçersiz Apple token'), { statusCode: 401 });

  const applePayload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
  const { sub: appleId, email } = applePayload;

  if (!appleId) throw Object.assign(new Error('Apple ID alınamadı'), { statusCode: 401 });

  let user = await prisma.user.findFirst({
    where: { OR: [{ appleId }, ...(email ? [{ email }] : [])] },
  });

  if (user) {
    if (!user.appleId) {
      user = await prisma.user.update({ where: { id: user.id }, data: { appleId } });
    }
  } else {
    const username = await generateUsername(displayName || (email ? email.split('@')[0] : 'appleuser'));
    user = await prisma.user.create({
      data: { appleId, email: email || null, username, displayName: displayName || username, totalScore: 200 },
    });
    // Yeni kullanıcı, hoş geldin maili gönder
    if (email) mailService.sendWelcomeEmail(email, user.username).catch(console.error);
  }

  if (!user.isActive) throw Object.assign(new Error('Hesap devre dışı'), { statusCode: 403 });
  const tokens = await _issueTokens(user.id);
  const { passwordHash, ...safeUser } = user;
  return { user: { ...safeUser, plan: user.plan, planExpiresAt: user.planExpiresAt }, ...tokens };
};

// ── Token Yenile ───────────────────────────
const refreshToken = async (token) => {
  const decoded = verifyRefreshToken(token);
  const stored = await prisma.refreshToken.findUnique({ where: { token } });

  if (!stored || stored.userId !== decoded.userId) {
    throw Object.assign(new Error('Geçersiz refresh token'), { statusCode: 401 });
  }
  if (new Date() > stored.expiresAt) {
    await prisma.refreshToken.delete({ where: { token } });
    throw Object.assign(new Error('Refresh token süresi dolmuş'), { statusCode: 401 });
  }

  // Rotate refresh token
  await prisma.refreshToken.delete({ where: { token } });
  return _issueTokens(decoded.userId);
};

// ── Çıkış ─────────────────────────────────
const logout = async (token) => {
  if (token) {
    await prisma.refreshToken.deleteMany({ where: { token } }).catch(() => {});
  }
};

// ── Token üret & kaydet ────────────────────
const _issueTokens = async (userId) => {
  const accessToken = generateAccessToken({ userId });
  const refreshTokenVal = generateRefreshToken({ userId });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: { token: refreshTokenVal, userId, expiresAt },
  });

  return { accessToken, refreshToken: refreshTokenVal };
};

// ── Şifremi Unuttum ────────────────────────
const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Güvenlik için kullanıcı bulunamadı dememek daha iyi olabilir ama şimdilik hata verelim
    throw Object.assign(new Error('Bu email adresi ile kayıtlı kullanıcı bulunamadı'), { statusCode: 404 });
  }

  // 6 haneli rastgele bir kod üret
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  const resetExpires = new Date(Date.now() + 3600000); // 1 saat

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    },
  });

  await mailService.sendPasswordResetEmail(email, resetToken);
  return { message: 'Sıfırlama kodu e-postanıza gönderildi' };
};

// ── Şifre Sıfırla ──────────────────────────
const resetPassword = async (token, newPassword) => {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { gt: new Date() },
    },
  });

  if (!user) {
    throw Object.assign(new Error('Geçersiz veya süresi dolmuş token'), { statusCode: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  return { message: 'Şifreniz başarıyla güncellendi' };
};

module.exports = { register, login, guestLogin, googleAuth, firebaseAuth, appleAuth, refreshToken, logout, forgotPassword, resetPassword };
