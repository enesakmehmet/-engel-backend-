const { PrismaClient } = require('@prisma/client');
const { upsertPuzzle } = require('./seed-helpers/crossword-layout');

const W = 24, H = 16;

const PUZZLE_ENTRIES = [
  { clueText: 'Çiy, kırağı', answer: 'ŞEBNEM' },
  { clueText: 'Asalak bilimi', answer: 'PARAZİTOLOJİ' },
  { clueText: 'Amaç, hedef', answer: 'GAYE' },
  { clueText: 'Dizem', answer: 'RİTİM' },
  { clueText: 'Salya', answer: 'TÜKÜRÜK' },
  { clueText: 'Mecburiyet', answer: 'ZORUNLULUK' },
  { clueText: 'Müzik alfabesi', answer: 'NOTA' },
  { clueText: 'Götürü iş yapan', answer: 'TAŞERON' },
  { clueText: 'Domuz', answer: 'HINZIR' },
  { clueText: 'Kimsesiz', answer: 'GARİBAN' },
  { clueText: "Jamaika'nın plakası", answer: 'JA' },
  { clueText: "Mersin'deki antik bir kent", answer: 'SOLİ' },
  { clueText: 'Topraktaki patlayıcı', answer: 'MAYIN' },
  { clueText: 'Yaraşırlık', answer: 'UYGUNLUK' },
  { clueText: 'Kafi', answer: 'YETER' },
  { clueText: 'Çıban', answer: 'ARPACIK' },
  { clueText: 'Eski Sümer su tanrısı', answer: 'ENKİ' },
  { clueText: "Fransa'da bir ırmak", answer: 'SEN' },
  { clueText: 'Güçsüzlük', answer: 'ACİZ' },
  { clueText: 'Körelme', answer: 'ATROFİ' },
  { clueText: 'Yüce', answer: 'ULU' },
  { clueText: 'İdrardaki madde', answer: 'ÜRE' },
  { clueText: 'Ut çalan, çalgıcı', answer: 'UDİ' },
  { clueText: 'Tanrı', answer: 'İLAH' },
  { clueText: 'Bir süs ve gölge ağacı', answer: 'ÇINAR' },
  { clueText: 'Bilinç, şuur', answer: 'İDRAK' },
  { clueText: 'Erkek', answer: 'ER' },
  { clueText: "Lüksemburg'un plakası", answer: 'L' },
  { clueText: 'Özür, kusur, bozukluk', answer: 'AYIP' },
  { clueText: 'Bir tür hafif ayakkabı', answer: 'BABET' },
  { clueText: 'Umma, umut', answer: 'RECA' },
  { clueText: 'Ölen insanın vücudu', answer: 'CESET' },
  { clueText: "İtriyum'un simgesi", answer: 'Y' },
  { clueText: 'Alfabenin son harfi', answer: 'Z' },
];

async function seedHurriyetCiy(prisma) {
  await upsertPuzzle(prisma, {
    title: 'Çiy, Kırağı',
    entries: PUZZLE_ENTRIES,
    W, H,
  });
}

module.exports = seedHurriyetCiy;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetCiy(prisma)
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
