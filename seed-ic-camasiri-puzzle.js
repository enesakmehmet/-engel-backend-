const { PrismaClient } = require('@prisma/client');
const { upsertPuzzle } = require('./seed-helpers/crossword-layout');

const W = 22, H = 15;

const PUZZLE_ENTRIES = [
  { clueText: 'Bir iç çamaşırı', answer: 'KÜLOT' },
  { clueText: "Tantal'ın simgesi", answer: 'TA' },
  { clueText: 'Anlayış', answer: 'İZAN' },
  { clueText: "İterbiyum'un simgesi", answer: 'YB' },
  { clueText: 'Temel niteliği', answer: 'MAHİYET' },
  { clueText: 'Bakı', answer: 'NAZAR' },
  { clueText: 'Geveze', answer: 'BOŞBOĞAZ' },
  { clueText: 'Bir harman aracı', answer: 'DİRGEN' },
  { clueText: 'Domuz', answer: 'HINZIR' },
  { clueText: 'Güldeki batıcı', answer: 'DİKEN' },
  { clueText: 'Oyun', answer: 'EĞLENCE' },
  { clueText: 'Derisi çizgili bir hayvan', answer: 'ZEBRA' },
  { clueText: "Birmanya'da bir ırmak", answer: 'İRAVADİ' },
  { clueText: 'Derinin cilalanması', answer: 'PERDAH' },
  { clueText: "Asya'da bir ırmak", answer: 'AMUR' },
  { clueText: 'Okuma yitimi', answer: 'ALEKSİ' },
  { clueText: 'Ölen insanın vücudu', answer: 'CESET' },
  { clueText: 'Klarnet', answer: 'GIRNATA' },
  { clueText: 'Ayağı sekili at', answer: 'SEKEL' },
  { clueText: 'Taraça', answer: 'TERAS' },
  { clueText: 'Bir çeşit pelte', answer: 'MUHALLEBİ' },
  { clueText: 'Müezzin çağrısı', answer: 'EZAN' },
  { clueText: "Lantan'ın simgesi", answer: 'LA' },
  { clueText: 'Ders verme', answer: 'İRŞAT' },
  { clueText: 'Bir köpek cinsi', answer: 'TAZI' },
  { clueText: 'Sergen', answer: 'RAF' },
  { clueText: 'Kültür', answer: 'İRFAN' },
  { clueText: 'Kaldırma, giderme', answer: 'İZALE' },
  { clueText: 'İçitim', answer: 'NAİDE' },
  { clueText: "Kripton'un simgesi", answer: 'KR' },
  { clueText: 'İpekli bir kumaş türü', answer: 'ATLAS' },
  { clueText: 'Anadolu ajansı', answer: 'AA' },
  { clueText: 'Kalın kaba kumaş', answer: 'ABA' },
  { clueText: 'İtaat eden', answer: 'MUTİ' },
  { clueText: 'Bayındırlık işleri', answer: 'NAFİA' },
  { clueText: "İtriyum'un simgesi", answer: 'Y' },
];

async function seedHurriyetIcCamasiri(prisma) {
  await upsertPuzzle(prisma, {
    title: 'Bir İç Çamaşırı',
    entries: PUZZLE_ENTRIES,
    W, H,
  });
}

module.exports = seedHurriyetIcCamasiri;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetIcCamasiri(prisma)
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
