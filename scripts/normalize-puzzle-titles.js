const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const RENAMES = [
  { from: 'Yabansı', to: 'Klasik Seri Bulmacası - 1' },
  { from: 'Uzun Balık Oltası', to: 'Klasik Seri Bulmacası - 2' },
  { from: 'Boğuk Boğuk Ağlama', to: 'Klasik Seri Bulmacası - 3' },
  { from: 'Kadercilik', to: 'Klasik Seri Bulmacası - 4' },
  { from: 'Hürriyet Gazetesi: Veri Bulmacası', to: 'Klasik Seri Bulmacası - 11' },
  { from: 'Korkunç Hayal Bulmacası (Resimdeki)', to: 'Klasik Seri Bulmacası - 8' },
  { from: 'Zorla Alma (Hürriyet)', to: 'Klasik Seri Bulmacası - 9' },
  { from: 'Hitlerci (Hürriyet)', to: 'Gizem Serisi Bulmacası - 1' },
  { from: 'Nazizm Bulmacası (Hürriyet)', to: 'Gizem Serisi Bulmacası - 1' },
  { from: 'Resimdeki Bulmaca (Ferdi Tayfur Özel)', to: 'Klasik Seri Bulmacası - 10' },
  { from: 'Test Bulmaca 1', to: 'Klasik Seri Bulmacası - Mini 1' },
];

const HURRIYET_SERIES_REGEX = /^Hürriyet Klasik Bulmaca(?:\s*-\s*(\d+))?$/u;
const HURRIYET_MERGED_TITLE = 'Hürriyet Klasik Bulmaca (Birleşik)';
const HURRIYET_SERIES_UNIFIED = 'Klasik Seri Bulmacası';

async function main() {
  console.log('Bulmaca başlıkları normalize ediliyor...');

  const hurriyetSeries = await prisma.puzzle.findMany({
    where: {
      title: {
        startsWith: 'Hürriyet Klasik Bulmaca',
      },
    },
    select: { id: true, title: true },
  });

  for (const puzzle of hurriyetSeries) {
    const match = String(puzzle.title || '').match(HURRIYET_SERIES_REGEX);
    const part = match && match[1] ? match[1] : '1';
    const newTitle = `${HURRIYET_SERIES_UNIFIED} - ${part}`;

    const result = await prisma.puzzle.updateMany({
      where: { id: puzzle.id },
      data: { title: newTitle },
    });

    if (result.count > 0) {
      console.log(`✓ ${puzzle.title} -> ${newTitle}`);
    }
  }

  const mergedResult = await prisma.puzzle.updateMany({
    where: { title: HURRIYET_MERGED_TITLE },
    data: { title: 'Klasik Seri Bulmacası (Birleşik)' },
  });

  if (mergedResult.count > 0) {
    console.log(`✓ ${HURRIYET_MERGED_TITLE} -> Klasik Seri Bulmacası (Birleşik) (${mergedResult.count} kayıt)`);
  }

  for (const rename of RENAMES) {
    const result = await prisma.puzzle.updateMany({
      where: { title: rename.from },
      data: { title: rename.to },
    });

    if (result.count > 0) {
      console.log(`✓ ${rename.from} -> ${rename.to} (${result.count} kayıt)`);
    }
  }

  console.log('Başlık normalizasyonu tamamlandı.');
}

main()
  .catch((error) => {
    console.error('Başlık normalizasyonunda hata:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
