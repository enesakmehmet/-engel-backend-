const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Örnek: Küçük bir 4x4 Çengel Bulmaca Kesiti
  const gridData = [
    // 0. Satır
    { row: 0, col: 0, type: 'CLUE', clueText: 'Sodyum Simge', arrowDir: 'RIGHT' },
    { row: 0, col: 1, type: 'LETTER', answer: 'N' },
    { row: 0, col: 2, type: 'LETTER', answer: 'A' },
    { row: 0, col: 3, type: 'BLOCK' },

    // 1. Satır
    { row: 1, col: 0, type: 'CLUE', clueText: 'Ters "Evet"', arrowDir: 'DOWN' },
    { row: 1, col: 1, type: 'BLOCK' },
    { row: 1, col: 2, type: 'CLUE', clueText: 'Kuş Yuvası', arrowDir: 'DOWN' },
    { row: 1, col: 3, type: 'BLOCK' },

    // 2. Satır
    { row: 2, col: 0, type: 'LETTER', answer: 'E' },
    { row: 2, col: 1, type: 'BLOCK' },
    { row: 2, col: 2, type: 'LETTER', answer: 'Y' },
    { row: 2, col: 3, type: 'BLOCK' },

    // 3. Satır
    { row: 3, col: 0, type: 'LETTER', answer: 'V' },
    { row: 3, col: 1, type: 'BLOCK' },
    { row: 3, col: 2, type: 'LETTER', answer: 'A' },
    { row: 3, col: 3, type: 'BLOCK' },
  ];

  const title = 'Genel Kültür Bulmacası - Mini 1';

  await prisma.puzzle.deleteMany({ where: { title: { in: ['Test Bulmaca 1', title] } } });

  await prisma.puzzle.create({
    data: {
      title,
      width: 4,
      height: 4,
      gridData: gridData,
      points: 100,
    }
  });

  console.log('✅ Çengel Bulmaca veritabanına başarıyla eklendi!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
