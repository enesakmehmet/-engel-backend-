const { PrismaClient } = require('@prisma/client');
const { upsertPuzzle } = require('./seed-helpers/crossword-layout');

const W = 24, H = 16;

const PUZZLE_ENTRIES = [
  { clueText: 'Maaş, aylık', answer: 'ÖDENTİ' },
  { clueText: 'Bir cins koyun', answer: 'MERİNOS' },
  { clueText: "Ukrayna'nın plakası", answer: 'UA' },
  { clueText: 'Kaba dikiş', answer: 'TEYEL' },
  { clueText: 'Sanı', answer: 'ZAN' },
  { clueText: 'Sebze bahçesi', answer: 'BOSTAN' },
  { clueText: 'Slav halklarına özgü olan', answer: 'SLAVİK' },
  { clueText: 'Yüksek okul', answer: 'AKADEMİ' },
  { clueText: 'Sıvının sertlik derecesi', answer: 'KIVAM' },
  { clueText: 'Kıvırcık saç', answer: 'BUKLE' },
  { clueText: 'Tımar', answer: 'BAKIM' },
  { clueText: 'Durmadan, aralıksız', answer: 'MÜTEMADİYEN' },
  { clueText: 'Sümerlerde toprak tanrısı', answer: 'ENLİL' },
  { clueText: 'En kısa zaman', answer: 'AN' },
  { clueText: "Lesotho'nun plakası", answer: 'LS' },
  { clueText: 'Mühendis cetveli', answer: 'GÖNYE' },
  { clueText: 'Kimsesiz', answer: 'GARİP' },
  { clueText: 'Salah bulmak', answer: 'İYİLEŞMEK' },
  { clueText: 'İlave', answer: 'EK' },
  { clueText: 'Aylak', answer: 'AVARE' },
  { clueText: 'Eski dilde hesap', answer: 'HİSAP' },
  { clueText: 'Fiyat', answer: 'EDER' },
  { clueText: "Arjantin'in plakası", answer: 'RA' },
  { clueText: "Sodyum'un simgesi", answer: 'NA' },
  { clueText: 'İranlı', answer: 'ACEM' },
  { clueText: 'Akran, eş', answer: 'YAŞIT' },
  { clueText: 'Bilim, bilgi', answer: 'İLİM' },
  { clueText: 'Ağzın tavanı', answer: 'DAMAK' },
  { clueText: 'Yol', answer: 'CADDE' },
  { clueText: 'Alfabe', answer: 'ABECE' },
  { clueText: "İsrail'in plakası", answer: 'IL' },
  { clueText: 'Ücretle çalışan', answer: 'ÜCRETLİ' },
  { clueText: 'Beyaz', answer: 'AK' },
  { clueText: 'Gerçek', answer: 'HAKİKAT' },
  { clueText: 'Yemen parası', answer: 'RİYAL' },
  { clueText: 'Kahve kreması', answer: 'KREM' },
  { clueText: 'Alfabenin ilk harfi', answer: 'A' },
  { clueText: 'Gizemli eski yazı', answer: 'RUNİK' },
  { clueText: 'Gökteki ay', answer: 'KAMER' },
];

async function seedHurriyetMaas(prisma) {
  await upsertPuzzle(prisma, {
    title: 'Maaş, Aylık',
    entries: PUZZLE_ENTRIES,
    W, H,
  });
}

module.exports = seedHurriyetMaas;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetMaas(prisma)
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
