const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { spawnSync } = require('child_process');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed başlıyor...');

  // Admin kullanıcı
  const adminHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cenegel.com' },
    update: {},
    create: {
      email: 'admin@cenegel.com',
      username: 'admin',
      displayName: 'Admin',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin kullanıcı:', admin.email);

  // Kategoriler
  const categories = [
    { name: 'Genel Kültür', icon: '🌍', color: '#6C63FF', description: 'Her konudan sorular' },
    { name: 'Bilim', icon: '🔬', color: '#00B894', description: 'Fizik, kimya, biyoloji' },
    { name: 'Tarih', icon: '📜', color: '#E17055', description: 'Dünya ve Türk tarihi' },
    { name: 'Spor', icon: '⚽', color: '#FDCB6E', description: 'Futbol, basketbol ve daha fazlası' },
    { name: 'Coğrafya', icon: '🗺️', color: '#74B9FF', description: 'Ülkeler, başkentler, nehirler' },
    { name: 'Teknoloji', icon: '💻', color: '#A29BFE', description: 'Yazılım, donanım, internet' },
    { name: 'Günlük Bulmaca', icon: '🧩', color: '#FFB703', description: 'Günlük çengel bulmacalar' },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    createdCategories.push(c);
    console.log(`✅ Kategori: ${c.name}`);
  }

  await prisma.report.deleteMany({
    where: {
      puzzleId: { not: null },
    },
  });

  await prisma.gameSession.deleteMany({});
  await prisma.puzzle.deleteMany({});

  const cleanupScriptPath = path.join(__dirname, '..', 'scripts', 'delete-legacy-puzzles.js');
  const cleanupResult = spawnSync(process.execPath, [cleanupScriptPath], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: process.env,
  });

  if (cleanupResult.status !== 0) {
    throw new Error('Legacy puzzle cleanup script failed: delete-legacy-puzzles.js');
  }

  const puzzleSeedPath = path.join(__dirname, '..', 'seed-hurriyet-oyuncu.js');
  const result = spawnSync(process.execPath, [puzzleSeedPath], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0) {
    throw new Error('Puzzle seed script failed: seed-hurriyet-oyuncu.js');
  }

  const mediumPuzzleSeedPath = path.join(__dirname, '..', 'seed-hurriyet-oyuncu-medium.js');
  const mediumResult = spawnSync(process.execPath, [mediumPuzzleSeedPath], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: process.env,
  });

  if (mediumResult.status !== 0) {
    throw new Error('Puzzle seed script failed: seed-hurriyet-oyuncu-medium.js');
  }

  const korkuPuzzleSeedPath = path.join(__dirname, '..', 'seed-hurriyet-korku.js');
  const korkuResult = spawnSync(process.execPath, [korkuPuzzleSeedPath], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: process.env,
  });

  if (korkuResult.status !== 0) {
    throw new Error('Puzzle seed script failed: seed-hurriyet-korku.js');
  }

  console.log('🧹 Eski bulmacalar veritabanından silindi, yeni bulmacalar eklendi.');

  console.log('\n🎉 Seed tamamlandı!');
  console.log('📧 Admin: admin@cenegel.com');
  console.log('🔑 Şifre: admin123');
}

main()
  .catch((e) => { console.error('❌ Seed hatası:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
