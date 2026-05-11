const { PrismaClient } = require('@prisma/client');
const { upsertPuzzle } = require('./seed-helpers/crossword-layout');

const W = 22, H = 15;

const PUZZLE_ENTRIES = [
  { clueText: 'Maden kazıma kalemi', answer: 'ISKARPELA' },
  { clueText: "Asya'da bir göl", answer: 'BAYKAL' },
  { clueText: 'Mantar', answer: 'FUNGUS' },
  { clueText: 'Ateşperest', answer: 'MECUSİ' },
  { clueText: 'Beyin elektrosu', answer: 'EEG' },
  { clueText: 'Katip', answer: 'YAZMAN' },
  { clueText: 'Karşılık', answer: 'BEDEL' },
  { clueText: 'Varağı olan', answer: 'CİLT' },
  { clueText: 'Tırpana (zooloji)', answer: 'VATOZ' },
  { clueText: 'Müstahkem mevki', answer: 'KALE' },
  { clueText: 'Derinlik, aptallık', answer: 'AHMAKLIK' },
  { clueText: 'Küre biçimli', answer: 'KÜRESEL' },
  { clueText: 'Kağıt cilası', answer: 'AHAR' },
  { clueText: 'Garaz', answer: 'KİN' },
  { clueText: 'Lanet okuma', answer: 'BEDDUA' },
  { clueText: 'Bir kilonun yüzde biri', answer: 'DEKAGRAM' },
  { clueText: 'Kefal türünden', answer: 'İLARYA' },
  { clueText: 'İhanet eden', answer: 'HAİN' },
  { clueText: 'Gurbette yaşayan', answer: 'GURBETÇİ' },
  { clueText: 'Gril', answer: 'IZGARA' },
  { clueText: 'Değerli bir taş', answer: 'ELMAS' },
  { clueText: 'Sezgili, bilgili kimse', answer: 'ARİF' },
  { clueText: 'Islak, ıslanmış', answer: 'NEMLİ' },
  { clueText: 'Kompetan', answer: 'EHİL' },
  { clueText: 'Valide', answer: 'ANNE' },
  { clueText: 'Gemi omurgası', answer: 'KARİNA' },
  { clueText: 'Ham ipek', answer: 'FLOŞ' },
  { clueText: 'Zehirli bir örümcek', answer: 'KARADUL' },
  { clueText: "Nikel'in simgesi", answer: 'NI' },
  { clueText: "Sodyum'un simgesi", answer: 'NA' },
  { clueText: "Lantanın simgesi", answer: 'LA' },
  { clueText: 'Küçük çocuk', answer: 'BEBEK' },
  { clueText: "Hahnyum'un simgesi", answer: 'HA' },
  { clueText: 'Özenli', answer: 'İTİNALI' },
  { clueText: "İyot'un simgesi", answer: 'I' },
  { clueText: 'Meyve kurusu', answer: 'PESTİL' },
  { clueText: "Protaktinyum'un simgesi", answer: 'PA' },
  { clueText: 'Bağışlama', answer: 'AF' },
];

async function seedHurriyetMaden(prisma) {
  await upsertPuzzle(prisma, {
    title: 'Maden Kazıma Kalemi',
    entries: PUZZLE_ENTRIES,
    W, H,
  });
}

module.exports = seedHurriyetMaden;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetMaden(prisma)
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
