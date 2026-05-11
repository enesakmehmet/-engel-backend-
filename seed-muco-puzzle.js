const { PrismaClient } = require('@prisma/client');
const { upsertPuzzle } = require('./seed-helpers/crossword-layout');

const W = 24, H = 16;

const PUZZLE_ENTRIES = [
  { clueText: 'Muço', answer: 'MİÇO' },
  { clueText: "Letonya'nın başkenti", answer: 'RİGA' },
  { clueText: 'Bir cins reçine', answer: 'KOLOFAN' },
  { clueText: 'Kauçuklu yağmurluk', answer: 'MUŞAMBA' },
  { clueText: 'Göz çukuru', answer: 'OYUK' },
  { clueText: 'Karşılıksız yardım', answer: 'BAĞIŞ' },
  { clueText: "Litvanya'nın plakası", answer: 'LT' },
  { clueText: 'Akciğer zarı iltihabı', answer: 'PLÖREZİ' },
  { clueText: 'İrinli yara', answer: 'ÇIBAN' },
  { clueText: 'Telli balıkçıl', answer: 'BALIKÇIL' },
  { clueText: 'Bir süs taşı', answer: 'AKİK' },
  { clueText: 'Çok zengin kimse', answer: 'KARUN' },
  { clueText: 'Söz dinleme, boyun eğme', answer: 'İTAAT' },
  { clueText: 'Şimşek çakması', answer: 'ŞİMŞEK' },
  { clueText: 'Bademden yapılan bir tatlı', answer: 'ŞEKERPARE' },
  { clueText: 'Okumak işi, kıraat', answer: 'OKUMA' },
  { clueText: 'Mikroskop camı', answer: 'LAM' },
  { clueText: 'Dinle devleti', answer: 'İRAN' },
  { clueText: 'Eski dilde er, erkek', answer: 'MERT' },
  { clueText: 'Parça', answer: 'CÜZ' },
  { clueText: 'Tuzak, kapan', answer: 'KAPAN' },
  { clueText: 'Kulak yıkama aracı', answer: 'ŞIRINGA' },
  { clueText: 'Güzel', answer: 'ALA' },
  { clueText: 'Akılsal', answer: 'AKLİ' },
  { clueText: 'Şarap', answer: 'MEY' },
  { clueText: 'Hastalık salgını', answer: 'EPİDEMİ' },
  { clueText: 'En küçük izci', answer: 'YAVRUKURT' },
  { clueText: 'Şom ağızlı, kara', answer: 'UĞURSUZ' },
  { clueText: 'Eski bir hacim ölçüsü', answer: 'KİLE' },
  { clueText: 'Eski dilde korku', answer: 'HAVF' },
  { clueText: 'Nazi hücum kıtası', answer: 'SA' },
  { clueText: 'Minkale', answer: 'İLETKİ' },
  { clueText: 'Taşlarla oynanan oyun', answer: 'OKEY' },
  { clueText: 'Oldukça beyaz, beyazca', answer: 'AKÇIL' },
];

async function seedHurriyetMuco(prisma) {
  await upsertPuzzle(prisma, {
    title: 'Hürriyet - Muço',
    entries: PUZZLE_ENTRIES,
    W, H,
  });
}

module.exports = seedHurriyetMuco;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetMuco(prisma)
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
