const { PrismaClient } = require('@prisma/client');
const { upsertPuzzle } = require('./seed-helpers/crossword-layout');

const W = 22, H = 15;

const PUZZLE_ENTRIES = [
  { clueText: 'Veri', answer: 'DATA' },
  { clueText: 'Elmasın yontulması', answer: 'TIRAŞ' },
  { clueText: 'Baş örtüsü', answer: 'YEMENİ' },
  { clueText: 'Huysuz, şirret', answer: 'CADI' },
  { clueText: 'Kıyı, kenar', answer: 'SAHİL' },
  { clueText: "San Marino'nun plakası", answer: 'RSM' },
  { clueText: 'Umma, umut', answer: 'RECA' },
  { clueText: 'Bir bitki türü', answer: 'OT' },
  { clueText: 'Hizmet eden, sadık', answer: 'KÖLE' },
  { clueText: 'Matkap', answer: 'BURGU' },
  { clueText: 'Brezilya dansı', answer: 'SAMBA' },
  { clueText: 'Yaprak sapı', answer: 'SAP' },
  { clueText: "Uranyum'un simgesi", answer: 'U' },
  { clueText: 'Gelin başı süsü', answer: 'TAÇ' },
  { clueText: 'Aristokrasi', answer: 'ASALET' },
  { clueText: 'İplikli organel', answer: 'KROMOZOM' },
  { clueText: 'Ölü yıkama', answer: 'GASİL' },
  { clueText: 'Eşi ölmüş kimse', answer: 'DUL' },
  { clueText: 'As (sıfat)', answer: 'AS' },
  { clueText: 'Boyun örtüsü', answer: 'ATKI' },
  { clueText: 'Geri çevirme', answer: 'RET' },
  { clueText: 'Ayı balığı', answer: 'CAN' },
  { clueText: 'Ağabey (halk ağzı)', answer: 'AĞA' },
  { clueText: 'Yapma, etme', answer: 'İCRA' },
  { clueText: 'Ailesine bakan', answer: 'AİL' },
  { clueText: 'Baba, cet', answer: 'ATA' },
  { clueText: 'Bir süs bitkisi', answer: 'BEGONYA' },
  { clueText: 'Amfiteatr', answer: 'ARENA' },
  { clueText: 'Kayınbirader (halk ağzı)', answer: 'KAYNO' },
  { clueText: 'Nazi hücum kıtası', answer: 'SA' },
  { clueText: "Dünya'nın uydusu", answer: 'AY' },
  { clueText: 'Kalın bağırsak', answer: 'KOLON' },
  { clueText: "Rusya'da kıyı ırmağı", answer: 'URAL' },
  { clueText: 'Katmerli', answer: 'KATLI' },
  { clueText: 'Bir süs çiçeği', answer: 'MENEKŞE' },
  { clueText: 'Dolaylı anlatım', answer: 'KİNAYE' },
  { clueText: 'Yaprak', answer: 'VARAK' },
];

async function seedHurriyetVeri(prisma) {
  await upsertPuzzle(prisma, {
    title: 'Hürriyet - Veri',
    entries: PUZZLE_ENTRIES,
    W, H,
  });
}

module.exports = seedHurriyetVeri;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetVeri(prisma)
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
