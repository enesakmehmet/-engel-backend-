const { PrismaClient } = require('@prisma/client');
const { upsertPuzzle } = require('./seed-helpers/crossword-layout');

const W = 24, H = 16;

const PUZZLE_ENTRIES = [
  { clueText: 'Bir tür kimlik', answer: 'HÜVİYET' },
  { clueText: 'Nazi hücum kıtası', answer: 'SA' },
  { clueText: 'Beyin elektrosu', answer: 'EEG' },
  { clueText: 'Modern Yunanca', answer: 'RUMCA' },
  { clueText: 'Zamir', answer: 'ADIL' },
  { clueText: 'Cephe', answer: 'YÜZ' },
  { clueText: 'Lahor şalı', answer: 'LAHURİ' },
  { clueText: 'Uzlaşarak iş yapma', answer: 'İŞBİRLİĞİ' },
  { clueText: 'Az görülür, çok rastlanmaz', answer: 'NADİR' },
  { clueText: 'Bağnazlık', answer: 'TAASSUP' },
  { clueText: 'Kıl elek', answer: 'KALBUR' },
  { clueText: 'Alfabenin ilk harfi', answer: 'A' },
  { clueText: 'Ödünç verme', answer: 'İARE' },
  { clueText: 'Bayağılık', answer: 'ADİLİK' },
  { clueText: 'Şiddetli yağmur', answer: 'SAĞANAK' },
  { clueText: 'Eski dilde boy, soy', answer: 'NESİL' },
  { clueText: 'Düşkün', answer: 'TUTKUN' },
  { clueText: 'Meyve kurusu', answer: 'ÇİR' },
  { clueText: 'Göz bebeği', answer: 'GÖZBEBEĞİ' },
  { clueText: 'Bir tür dans', answer: 'SAMBA' },
  { clueText: 'Büyük erkek kardeş', answer: 'AĞABEY' },
  { clueText: 'Kemik bilye', answer: 'MİSKET' },
  { clueText: 'Bir çeşit hamur işi', answer: 'BÖREK' },
  { clueText: 'Kutup', answer: 'POL' },
  { clueText: 'Basit bilgisayar oyunu', answer: 'ATARİ' },
  { clueText: 'Gelincik', answer: 'KAKAVAN' },
  { clueText: 'Düzenli işleyen', answer: 'MUNTAZAM' },
  { clueText: "Lantanın simgesi", answer: 'LA' },
  { clueText: 'Baba, cet', answer: 'ATA' },
  { clueText: 'Tutturgaç', answer: 'RAPTİYE' },
  { clueText: 'Erzak odası', answer: 'KİLER' },
  { clueText: 'Kaba sofu', answer: 'YOBAZ' },
  { clueText: 'Yerleşim bölgesi', answer: 'İSKAN' },
  { clueText: 'Eski bir hacim ölçüsü', answer: 'KİLE' },
];

async function seedHurriyetKimlik(prisma) {
  await upsertPuzzle(prisma, {
    title: 'Hürriyet - Bir Tür Kimlik',
    entries: PUZZLE_ENTRIES,
    W, H,
  });
}

module.exports = seedHurriyetKimlik;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetKimlik(prisma)
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
