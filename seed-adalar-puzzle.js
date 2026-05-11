const { PrismaClient } = require('@prisma/client');
const { upsertPuzzle } = require('./seed-helpers/crossword-layout');

const W = 22, H = 15;

const PUZZLE_ENTRIES = [
  { clueText: 'Adalar takımı', answer: 'ARŞİPEL' },
  { clueText: 'Varlığını sürdürme', answer: 'VAROLUŞ' },
  { clueText: 'Melez bir hayvan', answer: 'KATIR' },
  { clueText: 'Kötülük', answer: 'ŞER' },
  { clueText: 'Adam', answer: 'ER' },
  { clueText: 'Temel besin maddesi', answer: 'EKMEK' },
  { clueText: 'İki direkli yelkenli', answer: 'USKUNA' },
  { clueText: 'Anadolu Ajansı', answer: 'AA' },
  { clueText: 'Tarım işçisi', answer: 'IRGAT' },
  { clueText: 'Edebi', answer: 'YAZINSAL' },
  { clueText: 'Bol, verimli', answer: 'BEREKETLİ' },
  { clueText: 'Çok güçlü fırtına', answer: 'KASIRGA' },
  { clueText: "Aktinyum'un simgesi", answer: 'AC' },
  { clueText: 'Engel', answer: 'MANİ' },
  { clueText: 'Katliam', answer: 'KIYIM' },
  { clueText: 'Bir işte yardımcı', answer: 'YAMAK' },
  { clueText: 'Fön çekme aleti', answer: 'FÖN' },
  { clueText: 'Sonbahar', answer: 'GÜZ' },
  { clueText: 'Bir harman türü', answer: 'SAMAN' },
  { clueText: "Seryum'un simgesi", answer: 'CE' },
  { clueText: 'Kaplumbağa kabuğu', answer: 'BAĞA' },
  { clueText: 'İkaz, ihtar', answer: 'UYARI' },
  { clueText: 'Hayvan damı', answer: 'AHIR' },
  { clueText: 'Dilsiz', answer: 'LAL' },
  { clueText: 'Tanrı', answer: 'İLAH' },
  { clueText: 'Bir zamk türü', answer: 'SAKIZ' },
  { clueText: 'Yaşlı, kart', answer: 'İHTİYAR' },
  { clueText: 'Satrançta bir taş', answer: 'AT' },
  { clueText: "Radyum'un simgesi", answer: 'RA' },
  { clueText: 'Uyku', answer: 'HAB' },
  { clueText: "Kalsiyum'un simgesi", answer: 'CA' },
  { clueText: 'Notada durakla', answer: 'ES' },
  { clueText: "Rubidyum'un simgesi", answer: 'RB' },
  { clueText: 'İdam sehpası', answer: 'DARAĞACI' },
  { clueText: 'Bir zamk türü (2)', answer: 'ARAP' },
  { clueText: 'Geri, peş', answer: 'ART' },
  { clueText: 'Basit bilgisayar oyunu', answer: 'ATARİ' },
  { clueText: 'Bir tarım aracı', answer: 'ORAK' },
  { clueText: 'Kuşun uçma...', answer: 'TÜY' },
  { clueText: 'Çizgi', answer: 'HAT' },
];

async function seedHurriyetAdalar(prisma) {
  await upsertPuzzle(prisma, {
    title: 'Adalar',
    entries: PUZZLE_ENTRIES,
    W, H,
  });
}

module.exports = seedHurriyetAdalar;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetAdalar(prisma)
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
