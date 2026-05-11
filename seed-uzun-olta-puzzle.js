const { PrismaClient } = require('@prisma/client');
const { upsertPuzzle } = require('./seed-helpers/crossword-layout');

const W = 22, H = 15;

const PUZZLE_ENTRIES = [
  { clueText: 'Uzun balık oltası', answer: 'PARAKETE' },
  { clueText: 'Avusturya hükümeti', answer: 'KABİNE' },
  { clueText: 'Biçem', answer: 'ÜSLUP' },
  { clueText: 'Eksik', answer: 'NOKSAN' },
  { clueText: 'İdare kandili', answer: 'ŞAMDAN' },
  { clueText: 'Toprağın nemi', answer: 'TAV' },
  { clueText: 'Anlak, dirayet', answer: 'ZEKA' },
  { clueText: 'Agaragar', answer: 'JELOZ' },
  { clueText: 'Eski dilde üzüntü', answer: 'ELEM' },
  { clueText: 'Sentetik bir kumaş', answer: 'NAYLON' },
  { clueText: 'İnce yağmur', answer: 'ÇİSE' },
  { clueText: 'Başıboş at', answer: 'YILKI' },
  { clueText: 'Oldukça, hayli', answer: 'EPEY' },
  { clueText: 'Erezyon', answer: 'AŞINIM' },
  { clueText: 'Otomobil yarışması', answer: 'RALİ' },
  { clueText: 'Zırhlı hayvan', answer: 'ARMADİLLO' },
  { clueText: 'Afrika misk kedisi', answer: 'CİVET' },
  { clueText: 'Atmaca, doğan', answer: 'ŞAHİN' },
  { clueText: 'Sıralaç', answer: 'DOSYA' },
  { clueText: 'Kağıt cilası', answer: 'AHAR' },
  { clueText: 'Vietnam krallığı', answer: 'ANNAM' },
  { clueText: 'Bir kadın giysisi', answer: 'ETEK' },
  { clueText: 'Bir tür kuzu eti yemeği', answer: 'KAVURMA' },
  { clueText: 'Boyun eğen', answer: 'İTAATKAR' },
  { clueText: 'Keçi yolu, patika, yolak', answer: 'ÇIĞIR' },
  { clueText: 'Biricik', answer: 'YEGANE' },
  { clueText: 'Tek hörgüçlü deve', answer: 'HECİN' },
  { clueText: "Berilyum'un simgesi", answer: 'BE' },
  { clueText: 'Kulak iltihabı', answer: 'OTİT' },
  { clueText: 'Anadolu ajansı', answer: 'AA' },
  { clueText: 'Boy, endam', answer: 'POSTUR' },
  { clueText: 'İpek bir kumaş', answer: 'ATLAS' },
  { clueText: 'Yardım', answer: 'İMDAT' },
  { clueText: 'Alfabenin ilk harfi', answer: 'A' },
  { clueText: 'Faiz, ürem', answer: 'NEMA' },
  { clueText: 'Meyve kurusu', answer: 'ÇİR' },
];

async function seedHurriyetUzunOlta(prisma) {
  await upsertPuzzle(prisma, {
    title: 'Hürriyet - Uzun Balık Oltası',
    entries: PUZZLE_ENTRIES,
    W, H,
  });
}

module.exports = seedHurriyetUzunOlta;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetUzunOlta(prisma)
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
