const { PrismaClient } = require('@prisma/client');
const { upsertPuzzle } = require('./seed-helpers/crossword-layout');

const W = 22, H = 15;

const PUZZLE_ENTRIES = [
  { clueText: 'Zorla alma', answer: 'GASP' },
  { clueText: 'Kısır döngü', answer: 'FASİTDAİRE' },
  { clueText: 'Çok yiyen, obur', answer: 'PİSBOĞAZ' },
  { clueText: 'Neşeli olmak', answer: 'GÜLMEK' },
  { clueText: 'Ut çalan, çalgıcı', answer: 'UDİ' },
  { clueText: 'Yonga', answer: 'TALAŞ' },
  { clueText: 'Boru sesi', answer: 'DÜT' },
  { clueText: 'İki çenetli yumuşakça', answer: 'MİDYE' },
  { clueText: 'Eski dilde bozma', answer: 'İFSAT' },
  { clueText: 'Yön bulucu', answer: 'PUSULA' },
  { clueText: 'Fizikte bir iş birimi', answer: 'ERG' },
  { clueText: 'Eski adı Seylan olan ülke', answer: 'SRİLANKA' },
  { clueText: 'Yedirip içirme', answer: 'İAŞE' },
  { clueText: 'Sıcak içecek', answer: 'ÇAY' },
  { clueText: 'Sırlar', answer: 'ESRAR' },
  { clueText: 'Geçersiz kılma', answer: 'İPTAL' },
  { clueText: 'Akıcılıkla ilgili', answer: 'SEYYAL' },
  { clueText: 'Her türlü kara taşıtı', answer: 'OTO' },
  { clueText: 'Kıvırcık saç', answer: 'BUKLE' },
  { clueText: 'Gövde heykeli', answer: 'BÜST' },
  { clueText: 'Bazısı', answer: 'KİMİ' },
  { clueText: "Alüminyum'un simgesi", answer: 'AL' },
  { clueText: 'Bilimsel', answer: 'İLMİ' },
  { clueText: 'Bir tür yün örgüsü', answer: 'TRİKO' },
  { clueText: 'Gözleri görmeyen', answer: 'AMA' },
  { clueText: 'Ruh dinginliği', answer: 'SÜKUN' },
  { clueText: 'Kasık', answer: 'KAVAL' },
  { clueText: "Uranüs'ün bir uydusu", answer: 'ARİEL' },
  { clueText: "İyot'un simgesi", answer: 'I' },
  { clueText: 'Yasaklama', answer: 'MEN' },
  { clueText: 'Bitki öz suyu', answer: 'USARE' },
  { clueText: 'Tanrı', answer: 'İLAH' },
  { clueText: 'Bir programlama dili', answer: 'JAVA' },
  { clueText: 'Eski dilde çekirge', answer: 'CERAD' },
  { clueText: 'Açma işini yapan', answer: 'AÇICI' },
  { clueText: 'Alfabenin ilk harfi', answer: 'A' },
];

async function seedHurriyetZorla(prisma) {
  await upsertPuzzle(prisma, {
    title: 'Hürriyet - Zorla Alma',
    entries: PUZZLE_ENTRIES,
    W, H,
  });
}

module.exports = seedHurriyetZorla;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetZorla(prisma)
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
