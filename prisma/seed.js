const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

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

  // Örnek sorular
  const genelKultur = createdCategories.find((c) => c.name === 'Genel Kültür');
  const bilim = createdCategories.find((c) => c.name === 'Bilim');
  const tarih = createdCategories.find((c) => c.name === 'Tarih');

  const questions = [
    {
      text: "Türkiye'nin başkenti neresidir?",
      categoryId: genelKultur.id,
      difficulty: 'EASY',
      points: 5,
      timeLimit: 20,
      options: [
        { text: 'İstanbul', isCorrect: false },
        { text: 'Ankara', isCorrect: true },
        { text: 'İzmir', isCorrect: false },
        { text: 'Bursa', isCorrect: false },
      ],
    },
    {
      text: "Işığın havadaki hızı yaklaşık kaç km/s'dir?",
      categoryId: bilim.id,
      difficulty: 'MEDIUM',
      points: 10,
      timeLimit: 30,
      options: [
        { text: '150.000 km/s', isCorrect: false },
        { text: '200.000 km/s', isCorrect: false },
        { text: '300.000 km/s', isCorrect: true },
        { text: '400.000 km/s', isCorrect: false },
      ],
    },
    {
      text: 'Osmanlı İmparatorluğu hangi yıl kurulmuştur?',
      categoryId: tarih.id,
      difficulty: 'MEDIUM',
      points: 10,
      timeLimit: 30,
      options: [
        { text: '1299', isCorrect: true },
        { text: '1453', isCorrect: false },
        { text: '1071', isCorrect: false },
        { text: '1326', isCorrect: false },
      ],
    },
    {
      text: 'Suyun kimyasal formülü nedir?',
      categoryId: bilim.id,
      difficulty: 'EASY',
      points: 5,
      timeLimit: 15,
      options: [
        { text: 'H2O', isCorrect: true },
        { text: 'CO2', isCorrect: false },
        { text: 'NaCl', isCorrect: false },
        { text: 'O2', isCorrect: false },
      ],
    },
    {
      text: "Dünya'nın en büyük okyanusu hangisidir?",
      categoryId: genelKultur.id,
      difficulty: 'EASY',
      points: 5,
      timeLimit: 20,
      options: [
        { text: 'Atlantik Okyanusu', isCorrect: false },
        { text: 'Hint Okyanusu', isCorrect: false },
        { text: 'Arktik Okyanusu', isCorrect: false },
        { text: 'Pasifik Okyanusu', isCorrect: true },
      ],
    },
  ];

  for (const q of questions) {
    await prisma.question.create({
      data: {
        text: q.text,
        categoryId: q.categoryId,
        difficulty: q.difficulty,
        points: q.points,
        timeLimit: q.timeLimit,
        options: { create: q.options },
      },
    });
    console.log(`✅ Soru: ${q.text.slice(0, 40)}...`);
  }

  console.log('\n🎉 Seed tamamlandı!');
  console.log('📧 Admin: admin@cenegel.com');
  console.log('🔑 Şifre: admin123');
}

main()
  .catch((e) => { console.error('❌ Seed hatası:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
