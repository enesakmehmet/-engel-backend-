const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const LEGACY_TITLES = [
  'Bilim Bulmacası - Mini 1',
  'Ek Bulmaca 05 - Toprak',
  'Ek Bulmaca 06 - Rüzgar',
  'Genel Kültür Bulmacası',
  'Genel Kültür Bulmacası - Mini 1',
  'Günlük Çengel - Ayı (Çizgi Film)',
  'Haftanın Kolay Bulmacası',
  'Hürriyet - Amaç Hedef Bulmacası',
  'Hürriyet - Gizli Saklı Bulmacası',
  'Hürriyet - Olay Bulmacası',
  'Hürriyet - Oyuncu Bulmacası',
  'Hürriyet - Veri Bulmacası',
  'Klasik Seri Bulmacası - 1',
  'Klasik Seri Bulmacası - 2',
  'Klasik Seri Bulmacası - 3',
  'Klasik Seri Bulmacası - 4',
  'Klasik Seri Bulmacası - 5',
  'Klasik Seri Bulmacası - 6',
  'Klasik Seri Bulmacası - 7',
  'Klasik Seri Bulmacası - 8',
  'Klasik Seri Bulmacası - 9',
  'Klasik Seri Bulmacası - 10',
  'Klasik Seri Bulmacası - 11',
  'Klasik Seri Bulmacası - 12',
  'Klasik Seri Bulmacası - 13',
  'Klasik Seri Bulmacası - 14',
  'Klasik Seri Bulmacası - Mini 1',
  'Seyrüsefer Bulmacası - 1',
  'Test Bulmaca 1',
  'Devasa Kullanıcı Bulmacası (Tüm Sorular)',
  'Gizem Serisi Bulmacası - 1',
  'Genel Kültür Bulmacası - 5',
  'Genel Kültür Bulmacası - 6',
  'Genel Kültür Bulmacası - 7',
  'Genel Kültür Bulmacası - 8',
  'Genel Kültür Bulmacası - 9',
  'Genel Kültür Bulmacası - 11',
];

async function main() {
  const puzzles = await prisma.puzzle.findMany({
    where: {
      OR: [
        { title: { in: LEGACY_TITLES } },
        { title: { startsWith: 'Genel Kültür Bulmacası - ' } },
        { title: { startsWith: 'Klasik Seri Bulmacası - ' } },
      ],
    },
    select: { id: true, title: true },
  });

  const puzzleIds = puzzles.map((p) => p.id);

  if (puzzleIds.length > 0) {
    await prisma.report.deleteMany({ where: { puzzleId: { in: puzzleIds } } });
    await prisma.gameSession.deleteMany({ where: { puzzleId: { in: puzzleIds } } });
    await prisma.puzzle.deleteMany({ where: { id: { in: puzzleIds } } });
  }

  console.log(`Deleted ${puzzleIds.length} legacy puzzle(s).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
