/**
 * App Store / Google Play inceleme ekipleri için kalıcı demo hesap oluşturur.
 *
 * Kullanım:
 *   node scripts/create-demo-user.js
 *
 * Ortam değişkenleri ile özelleştirebilirsin:
 *   DEMO_EMAIL=appleReview@cenegel.com node scripts/create-demo-user.js
 *   DEMO_USERNAME=appleReview        node scripts/create-demo-user.js
 *   DEMO_PASSWORD=AppleReview2026!   node scripts/create-demo-user.js
 *
 * Idempotent: hesap varsa şifresini ve aktiflik durumunu günceller.
 *
 * NOT: Backend login email ile yapıldığı için App Store Connect'e demo
 * bilgilerini yazarken USERNAME alanına e-posta'yı girmelisin.
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DEMO_EMAIL = process.env.DEMO_EMAIL || 'applereview@cenegel.com';
const DEMO_USERNAME = process.env.DEMO_USERNAME || 'apple_review';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'AppleReview2026!';
const DEMO_DISPLAY_NAME = process.env.DEMO_DISPLAY_NAME || 'Apple Review';

const main = async () => {
  console.log('🍎 Demo kullanıcı hazırlanıyor...');
  console.log(`   email   : ${DEMO_EMAIL}`);
  console.log(`   username: ${DEMO_USERNAME}`);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  // Önce email ile, sonra username ile arıyoruz ki çakışmaları yönetebilelim.
  const existing =
    (await prisma.user.findUnique({ where: { email: DEMO_EMAIL } })) ||
    (await prisma.user.findUnique({ where: { username: DEMO_USERNAME } }));

  if (existing) {
    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: {
        email: DEMO_EMAIL,
        username: DEMO_USERNAME,
        displayName: DEMO_DISPLAY_NAME,
        passwordHash,
        isActive: true,
        plan: 'PREMIUM',                       // Tüm bulmacalara erişebilsin
        planExpiresAt: new Date('2099-12-31'),  // Süresiz
        dailyGamesUsed: 0,
      },
      select: { id: true, email: true, username: true, plan: true, isActive: true },
    });
    console.log('♻️  Mevcut kullanıcı güncellendi:', updated);
  } else {
    const created = await prisma.user.create({
      data: {
        email: DEMO_EMAIL,
        username: DEMO_USERNAME,
        displayName: DEMO_DISPLAY_NAME,
        passwordHash,
        isActive: true,
        plan: 'PREMIUM',
        planExpiresAt: new Date('2099-12-31'),
        totalScore: 500,
      },
      select: { id: true, email: true, username: true, plan: true, isActive: true },
    });
    console.log('✅ Yeni demo kullanıcı oluşturuldu:', created);
  }

  console.log('');
  console.log('────────────────────────────────────────────────');
  console.log('App Store Connect → App Review Information altına şunları yaz:');
  console.log(`   Sign-in required : YES`);
  console.log(`   User name        : ${DEMO_EMAIL}`);
  console.log(`   Password         : ${DEMO_PASSWORD}`);
  console.log('────────────────────────────────────────────────');
};

main()
  .catch((err) => {
    console.error('❌ Demo kullanıcı oluşturulamadı:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
