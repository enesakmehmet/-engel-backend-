const { PrismaClient } = require('@prisma/client');
const { upsertPuzzle } = require('./seed-helpers/crossword-layout');

const W = 22, H = 15;

const PUZZLE_ENTRIES = [
  { clueText: 'Sara hastalığı', answer: 'EPİLEPSİ' },
  { clueText: 'İlgi eki', answer: 'NİN' },
  { clueText: "İrlanda'nın plakası", answer: 'IRL' },
  { clueText: 'Kötümser, karamsar', answer: 'PESİMİST' },
  { clueText: 'Koruma, esirgeme', answer: 'HİMAYE' },
  { clueText: 'Eski dilde hastalık', answer: 'MARAZ' },
  { clueText: 'Aleve tutularak pişirilmiş', answer: 'KEBAP' },
  { clueText: 'Temiz, iffetli', answer: 'NAMUSLU' },
  { clueText: 'Binek hayvanı', answer: 'AT' },
  { clueText: 'Yakacak', answer: 'ODUN' },
  { clueText: 'Acele', answer: 'İVEDİ' },
  { clueText: 'Zarfa yazılır', answer: 'ADRES' },
  { clueText: 'Ağaç cilası', answer: 'REÇİNE' },
  { clueText: 'Vietnam krallık dönemi', answer: 'ANNAM' },
  { clueText: 'Evrensel alıcı kan grubu', answer: 'AB' },
  { clueText: "Libya'nın plakası", answer: 'LAR' },
  { clueText: 'Amerika Birleşik Devletleri', answer: 'ABD' },
  { clueText: 'Şak diye ses çıkartmak', answer: 'ŞAKIRDAMAK' },
  { clueText: 'Çok eski bir tarihi anlatır', answer: 'DESTAN' },
  { clueText: "Fransa'da bir ırmak", answer: 'SEINE' },
  { clueText: 'Çok büyük', answer: 'DEVASA' },
  { clueText: "Konya'da bir baraj", answer: 'APA' },
  { clueText: 'Macar prensi', answer: 'ARPAD' },
  { clueText: 'Erkek deve', answer: 'BUĞRA' },
  { clueText: 'Açıkgöz, kurnaz', answer: 'ÇAKAL' },
  { clueText: "Praseodim'in simgesi", answer: 'PR' },
  { clueText: "Gümüş'ün simgesi", answer: 'AG' },
  { clueText: 'Bezginlik anlatan sözcük', answer: 'OF' },
  { clueText: 'Neşeli, hareketli', answer: 'ŞEN' },
  { clueText: 'Anadolu Ajansı', answer: 'AA' },
  { clueText: 'Japon lirik dramı', answer: 'NO' },
  { clueText: 'Nazi hücum kıtası', answer: 'SA' },
  { clueText: 'Üçüncü tekil şahıs', answer: 'O' },
  { clueText: 'Ara', answer: 'FASILA' },
  { clueText: "Azot'un simgesi", answer: 'N' },
  { clueText: 'Ödünç verme', answer: 'İARE' },
  { clueText: "Gabon'un plaka işareti", answer: 'G' },
  { clueText: "Hidrojen'in simgesi", answer: 'H' },
  { clueText: 'Ağabey', answer: 'ABİ' },
  { clueText: 'Seyelan', answer: 'SEL' },
  { clueText: 'Halk dilinde anne', answer: 'ANA' },
];

async function seedHurriyetSara(prisma) {
  await upsertPuzzle(prisma, {
    title: 'Sara Hastalığı',
    entries: PUZZLE_ENTRIES,
    W, H,
  });
}

module.exports = seedHurriyetSara;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetSara(prisma)
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
