const { PrismaClient } = require('@prisma/client');
const { upsertPuzzle } = require('./seed-helpers/crossword-layout');

const W = 22, H = 15;

const PUZZLE_ENTRIES = [
  { clueText: 'Brunei ülke kodu', answer: 'BRN' },
  { clueText: 'Bir anda olan', answer: 'ANİ' },
  { clueText: 'Japon halk türküsü', answer: 'ENKA' },
  { clueText: 'Vietnam plakası', answer: 'VN' },
  { clueText: 'Eski dilde cıva', answer: 'ZIBAK' },
  { clueText: 'Kimsesiz, zavallı', answer: 'BİÇARE' },
  { clueText: 'Türk Tarih Kurumu', answer: 'TTK' },
  { clueText: 'İşlenmemiş bakır', answer: 'MAT' },
  { clueText: 'Büyük anne', answer: 'NİNE' },
  { clueText: 'Hastalık salgını', answer: 'EPİDEMİ' },
  { clueText: 'Soluk borusu', answer: 'NEFES' },
  { clueText: 'Hayvan otlatmak', answer: 'OTLAK' },
  { clueText: 'Tuzsuz beyaz peynir', answer: 'LOR' },
  { clueText: 'O yer', answer: 'ORA' },
  { clueText: 'Eski dilde uzaklık', answer: 'BUUT' },
  { clueText: 'Gösterge çizelgesi', answer: 'TABLO' },
  { clueText: 'Yelkenli türü', answer: 'KOTRA' },
  { clueText: 'Yemek', answer: 'AŞ' },
  { clueText: 'Faal', answer: 'AKTİF' },
  { clueText: 'Çok renkli', answer: 'ALACA' },
  { clueText: 'Cüretkar', answer: 'ATAK' },
  { clueText: 'Yapma, etme', answer: 'İCRA' },
  { clueText: 'Bir nota', answer: 'RE' },
  { clueText: 'Bir cins orkide', answer: 'SALEP' },
  { clueText: 'Erkek', answer: 'ER' },
  { clueText: "Zirkonyum'un simgesi", answer: 'ZR' },
  { clueText: 'Argoda bit', answer: 'KEHLE' },
  { clueText: 'Çimenlik, bahçe', answer: 'ÇAYIR' },
  { clueText: "Potasyum'un simgesi", answer: 'K' },
  { clueText: 'Viteste geri harfi', answer: 'R' },
  { clueText: 'Bir masal kuşu', answer: 'ANKA' },
  { clueText: "Azot'un simgesi", answer: 'N' },
  { clueText: 'Engel, uymazlık', answer: 'MANİ' },
  { clueText: 'Düzen, hile', answer: 'DOLAP' },
  { clueText: 'Alfabenin ilk harfi', answer: 'A' },
];

async function seedHurriyetBrunei(prisma) {
  await upsertPuzzle(prisma, {
    title: 'Brunei',
    entries: PUZZLE_ENTRIES,
    W, H,
  });
}

module.exports = seedHurriyetBrunei;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetBrunei(prisma)
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
