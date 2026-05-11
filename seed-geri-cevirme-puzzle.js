const { PrismaClient } = require('@prisma/client');
const { upsertPuzzle } = require('./seed-helpers/crossword-layout');

const W = 22, H = 15;

const PUZZLE_ENTRIES = [
  { clueText: 'Geri çevirme', answer: 'RET' },
  { clueText: 'Hindistan Prensi', answer: 'RACA' },
  { clueText: 'Kayıp', answer: 'ZIYAN' },
  { clueText: 'İran pilavı', answer: 'POLO' },
  { clueText: 'Türk müziği makamı', answer: 'SABA' },
  { clueText: "Osman Gazi'nin oğlu", answer: 'ORHAN' },
  { clueText: 'Parazit', answer: 'ASALAK' },
  { clueText: 'Tanıtma yazısı', answer: 'JENERİK' },
  { clueText: 'Bir nota', answer: 'DO' },
  { clueText: 'Dalkavuk', answer: 'YAĞCI' },
  { clueText: 'Baba, şeyh', answer: 'DEDE' },
  { clueText: 'Yarık, yırtık', answer: 'SÖKÜK' },
  { clueText: 'Tanrı', answer: 'İLAH' },
  { clueText: 'Açık deniz, engin', answer: 'ENGİN' },
  { clueText: 'Köşegen', answer: 'DİYAGONAL' },
  { clueText: 'Oğul otu', answer: 'MELİSA' },
  { clueText: 'Hıristiyanlıkta ermiş', answer: 'AZİZ' },
  { clueText: 'Din bakımından uygun', answer: 'CAİZ' },
  { clueText: 'Türk müziğinde bir makam', answer: 'UŞŞAK' },
  { clueText: "Sezar'ın selamlama şekli", answer: 'AVE' },
  { clueText: 'Kağıt cilası', answer: 'AHAR' },
  { clueText: 'Yapma, etme', answer: 'İCRA' },
  { clueText: 'Erkek deve', answer: 'BUĞRA' },
  { clueText: 'Gölgeler', answer: 'ZILAL' },
  { clueText: "Lütesyum'un simgesi", answer: 'LU' },
  { clueText: "Arjantin'in plaka işareti", answer: 'RA' },
  { clueText: 'Çelişki', answer: 'TEZAT' },
  { clueText: 'Bir cins pamuklu kumaş', answer: 'PATİSKA' },
  { clueText: 'Melodi', answer: 'EZGİ' },
  { clueText: 'Engel', answer: 'MANİ' },
  { clueText: 'Çok olmayan', answer: 'AZ' },
  { clueText: 'Bale yapan kadın', answer: 'BALERİN' },
];

async function seedHurriyetGeriCevirme(prisma) {
  await upsertPuzzle(prisma, {
    title: 'Geri Çevirme',
    entries: PUZZLE_ENTRIES,
    W, H,
  });
}

module.exports = seedHurriyetGeriCevirme;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetGeriCevirme(prisma)
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
