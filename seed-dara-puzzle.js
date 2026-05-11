const { PrismaClient } = require('@prisma/client');
const { upsertPuzzle } = require('./seed-helpers/crossword-layout');

const W = 22, H = 15;

const PUZZLE_ENTRIES = [
  { clueText: 'Nesnenin kap ağırlığı', answer: 'DARA' },
  { clueText: 'Üflemeli çalgılar grubu', answer: 'NEFESLİ' },
  { clueText: 'Düz baskı', answer: 'OFSET' },
  { clueText: 'Tiyatro edebiyatı', answer: 'DRAM' },
  { clueText: 'Binek hayvan', answer: 'AT' },
  { clueText: 'Toprağın nemi (Halk ağzı)', answer: 'TAV' },
  { clueText: 'Aşırı samimi', answer: 'SENLİBENLİ' },
  { clueText: 'Tepkili uçak', answer: 'JET' },
  { clueText: 'Mizaç', answer: 'HUY' },
  { clueText: 'Mercek (Fizik)', answer: 'ADESE' },
  { clueText: 'Büyümemiş karpuz', answer: 'KELEK' },
  { clueText: 'Yiyeceği ağızda parçalama', answer: 'ÇİĞNEME' },
  { clueText: 'Tuzsuz beyaz peynir', answer: 'LOR' },
  { clueText: 'Parlak deri', answer: 'RUGAN' },
  { clueText: 'Uygulamalı öğrenme', answer: 'STAJ' },
  { clueText: 'Bilinen, belli', answer: 'MALUM' },
  { clueText: "Disprosyum'un simgesi", answer: 'DY' },
  { clueText: 'Açık elle vurulan tokat', answer: 'ŞAPLAK' },
  { clueText: 'Taş silindir (Halk ağzı)', answer: 'LOĞ' },
  { clueText: 'Sıva aracı', answer: 'MALA' },
  { clueText: 'Bir orman ağacı', answer: 'KAYIN' },
  { clueText: 'Ağabey (Halk ağzı)', answer: 'AĞA' },
  { clueText: 'Pekmez toprağı', answer: 'MARN' },
  { clueText: 'Bir zamk türü', answer: 'ARAP' },
  { clueText: 'İncirden sızan sıvı', answer: 'SÜT' },
  { clueText: 'Baba, cet', answer: 'ATA' },
  { clueText: 'Kalın kaba kumaş', answer: 'ÇUHA' },
  { clueText: 'Eskiz', answer: 'KROKİ' },
  { clueText: 'Bir şeyin öncesi', answer: 'ÖN' },
  { clueText: 'O yer', answer: 'ORASI' },
  { clueText: 'Bir bağlaç', answer: 'İLE' },
  { clueText: "Sodyum'un simgesi", answer: 'NA' },
  { clueText: 'Anlam', answer: 'MANA' },
  { clueText: "Molibden'in simgesi", answer: 'MO' },
  { clueText: 'Kemiklerin toparlak başı', answer: 'BOĞUM' },
  { clueText: "Talyum'un simgesi", answer: 'TL' },
  { clueText: 'Çok sıkılmak', answer: 'PATLAMAK' },
  { clueText: 'Derideki geniş leke', answer: 'ŞAMA' },
  { clueText: 'Damla', answer: 'KATRE' },
  { clueText: 'Klakson', answer: 'KORNA' },
];

async function seedHurriyetDara(prisma) {
  await upsertPuzzle(prisma, {
    title: 'Nesnenin Kap Ağırlığı',
    entries: PUZZLE_ENTRIES,
    W, H,
  });
}

module.exports = seedHurriyetDara;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetDara(prisma)
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
