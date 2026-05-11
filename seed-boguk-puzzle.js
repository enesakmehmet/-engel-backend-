const { PrismaClient } = require('@prisma/client');
const { upsertPuzzle } = require('./seed-helpers/crossword-layout');

const W = 22, H = 15;

const PUZZLE_ENTRIES = [
  { clueText: 'Boğuk boğuk ağlama', answer: 'HIÇKIRIK' },
  { clueText: "Talyum'un simgesi", answer: 'TL' },
  { clueText: 'Posta beygiri', answer: 'MENZİL' },
  { clueText: 'Akıllıca', answer: 'USLUCA' },
  { clueText: 'Irkçılık', answer: 'IRKÇILIK' },
  { clueText: 'Slayt', answer: 'ASETAT' },
  { clueText: "Ukrayna'nın plakası", answer: 'UA' },
  { clueText: "Honduras'ın parası", answer: 'LEMPİRA' },
  { clueText: 'Ağzına kadar dolu', answer: 'LEBALEB' },
  { clueText: 'Cilve', answer: 'NAZ' },
  { clueText: 'Bir tür geyik', answer: 'REN' },
  { clueText: 'Tanzanya plakası', answer: 'EAT' },
  { clueText: 'Valide', answer: 'ANNE' },
  { clueText: "Platin'in simgesi", answer: 'PT' },
  { clueText: 'Anne, baba ve çocuklardan oluşan', answer: 'AİLE' },
  { clueText: "Asya'da bir göl", answer: 'ARAL' },
  { clueText: 'Bağırsaklar', answer: 'BARSAK' },
  { clueText: 'İpek bir kumaş', answer: 'ATLAS' },
  { clueText: 'Gelincik', answer: 'KAKAVAN' },
  { clueText: "Liberya'nın plakası", answer: 'LB' },
  { clueText: 'Sporda dinlenme', answer: 'MOLA' },
  { clueText: 'Bal', answer: 'ŞEHD' },
  { clueText: 'Kayak', answer: 'SKİ' },
  { clueText: 'Oruç tutulan ay', answer: 'RAMAZAN' },
  { clueText: "Praseodim'in simgesi", answer: 'PR' },
  { clueText: 'Alfabenin 21. harfi', answer: 'S' },
  { clueText: 'Ortası çukur kap', answer: 'TAS' },
  { clueText: 'Ev makarnası', answer: 'ERİŞTE' },
  { clueText: 'Üçüncü tekil şahıs', answer: 'O' },
  { clueText: 'Şikar', answer: 'AV' },
  { clueText: 'Sayma, sayılma', answer: 'ADET' },
  { clueText: 'Tasa, kaygı', answer: 'KEDER' },
  { clueText: 'Sanı', answer: 'ZAN' },
  { clueText: 'Viteste geri harfi', answer: 'R' },
  { clueText: 'Kucaktaki tombul çocuk', answer: 'BEBEK' },
  { clueText: 'Mühlet, mehil', answer: 'SÜRE' },
  { clueText: 'Hipnoz durumu', answer: 'İPNOZ' },
  { clueText: 'Kullanılması önlenmiş', answer: 'MEMNU' },
];

async function seedHurriyetBoguk(prisma) {
  await upsertPuzzle(prisma, {
    title: 'Boğuk Boğuk Ağlama',
    entries: PUZZLE_ENTRIES,
    W, H,
  });
}

module.exports = seedHurriyetBoguk;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetBoguk(prisma)
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
