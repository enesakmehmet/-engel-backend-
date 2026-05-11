const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const seedHurriyetOyuncu = require('../seed-hurriyet-oyuncu');
const seedHurriyetOyuncuMedium = require('../seed-hurriyet-oyuncu-medium');
const seedHurriyetKorku = require('../seed-hurriyet-korku');
const seedHurriyetAyi = require('../seed-ayi-puzzle');
const seedHurriyetKusun = require('../seed-kusun-puzzle');
const seedHurriyetKaragoz = require('../seed-karagoz-puzzle');
const seedHurriyetPeynir = require('../seed-peynir-puzzle');
const seedHurriyetSinirbilim = require('../seed-sinirbilim-puzzle');
const seedHurriyetAcimasizca = require('../seed-acimasizca-puzzle');
const seedHurriyetIsletmen = require('../seed-isletmen-puzzle');
const seedHurriyetDuru = require('../seed-duru-puzzle');
const seedHurriyetAdalar = require('../seed-adalar-puzzle');
const seedHurriyetMuco = require('../seed-muco-puzzle');
const seedHurriyetZorla = require('../seed-zorla-puzzle');
const seedHurriyetVeri = require('../seed-veri-puzzle');
const seedHurriyetUzunOlta = require('../seed-uzun-olta-puzzle');
const seedHurriyetCiy = require('../seed-ciy-puzzle');
const seedHurriyetBrunei = require('../seed-brunei-puzzle');
const seedHurriyetBoguk = require('../seed-boguk-puzzle');
const seedHurriyetGeriCevirme = require('../seed-geri-cevirme-puzzle');
const seedHurriyetKimlik = require('../seed-kimlik-puzzle');
const seedHurriyetKadercilik = require('../scripts/seed-hurriyet-kadercilik');
const seedHurriyetIcCamasiri = require('../seed-ic-camasiri-puzzle');
const seedHurriyetMaas = require('../seed-maas-puzzle');
const seedHurriyetSara = require('../seed-sara-puzzle');
const seedHurriyetMaden = require('../seed-maden-puzzle');

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

  console.log('Deleted 0 legacy puzzle(s).');

  await seedHurriyetOyuncu(prisma);
  await seedHurriyetOyuncuMedium(prisma);
  await seedHurriyetKorku(prisma);
  await seedHurriyetAyi(prisma);
  await seedHurriyetKusun(prisma);
  await seedHurriyetKaragoz(prisma);
  await seedHurriyetPeynir(prisma);
  await seedHurriyetSinirbilim(prisma);
  await seedHurriyetAcimasizca(prisma);
  await seedHurriyetIsletmen(prisma);
  await seedHurriyetDuru(prisma);
  await seedHurriyetAdalar(prisma);
  await seedHurriyetMuco(prisma);
  await seedHurriyetZorla(prisma);
  await seedHurriyetVeri(prisma);
  await seedHurriyetUzunOlta(prisma);
  await seedHurriyetCiy(prisma);
  await seedHurriyetBrunei(prisma);
  await seedHurriyetBoguk(prisma);
  await seedHurriyetGeriCevirme(prisma);
  await seedHurriyetKimlik(prisma);
  await seedHurriyetKadercilik(prisma);
  await seedHurriyetIcCamasiri(prisma);
  await seedHurriyetMaas(prisma);
  await seedHurriyetSara(prisma);
  await seedHurriyetMaden(prisma);

  const legacyTitlePuzzles = await prisma.puzzle.findMany({
    where: { title: { startsWith: 'Hürriyet - ' } },
    select: { id: true, title: true },
  });

  for (const puzzle of legacyTitlePuzzles) {
    const cleanedTitle = String(puzzle.title || '').replace(/^Hürriyet\s*-\s*/u, '').trim();
    if (!cleanedTitle || cleanedTitle === puzzle.title) continue;

    await prisma.puzzle.update({
      where: { id: puzzle.id },
      data: { title: cleanedTitle },
    });
  }

  console.log('🧹 Eski bulmacalar veritabanından silindi, yeni bulmacalar eklendi.');

  console.log('\n🎉 Seed tamamlandı!');
  console.log('📧 Admin: admin@cenegel.com');
  console.log('🔑 Şifre: admin123');
}

main()
  .catch((e) => { console.error('❌ Seed hatası:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
