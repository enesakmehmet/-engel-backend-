const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Genel Kültür Bulmacası - 9 ekleniyor...');

  const category = await prisma.category.findFirst({ where: { name: 'Genel Kültür' } });
  if (!category) return;

  const gridData = [
    // CLUES - Row 0
    { row: 0, col: 0, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Zorla alma' },
    { row: 0, col: 2, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Çok yiyen, obur' },
    { row: 0, col: 4, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Ut çalan çalgıcı' },
    { row: 0, col: 6, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Boru sesi' },
    { row: 0, col: 8, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Eski dilde bozma' },
    { row: 0, col: 10, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Fizikte bir iş birimi' },
    { row: 0, col: 12, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Eski adı Seylan olan ülke' },

    // Row 1 Clues
    { row: 1, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Kısır döngü' },
    { row: 2, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Sırlar' },
    { row: 3, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Geçersiz kılma' },

    // Column 1 - Zorla alma (GASPET)
    { row: 0, col: 1, type: 'LETTER', answer: 'G' },
    { row: 1, col: 1, type: 'LETTER', answer: 'A' },
    { row: 2, col: 1, type: 'LETTER', answer: 'S' },
    { row: 3, col: 1, type: 'LETTER', answer: 'P' },
    { row: 4, col: 1, type: 'LETTER', answer: 'E' },
    { row: 5, col: 1, type: 'LETTER', answer: 'T' },

    // Row 1 - Kısır döngü (ANAFOR)
    { row: 1, col: 2, type: 'LETTER', answer: 'N' },
    { row: 1, col: 3, type: 'LETTER', answer: 'A' },
    { row: 1, col: 4, type: 'LETTER', answer: 'F' },
    { row: 1, col: 5, type: 'LETTER', answer: 'O' },
    { row: 1, col: 6, type: 'LETTER', answer: 'R' },

    // Row 3 - Sırlar (ESRAR)
    { row: 3, col: 2, type: 'LETTER', answer: 'E' },
    { row: 3, col: 3, type: 'LETTER', answer: 'S' },
    { row: 3, col: 4, type: 'LETTER', answer: 'R' },
    { row: 3, col: 5, type: 'LETTER', answer: 'A' },
    { row: 3, col: 6, type: 'LETTER', answer: 'R' },

    // Ut çalan (UDİ) - Column 4
    { row: 2, col: 4, type: 'LETTER', answer: 'U' },
    { row: 3, col: 4, type: 'LETTER', answer: 'D' }, // Overwrites ESRAR's R if I'm not careful
    { row: 4, col: 4, type: 'LETTER', answer: 'İ' },

    // Seylan (SRİ LANKA) - Column 13
    { row: 0, col: 13, type: 'LETTER', answer: 'S' },
    { row: 1, col: 13, type: 'LETTER', answer: 'R' },
    { row: 2, col: 13, type: 'LETTER', answer: 'İ' },
    { row: 3, col: 13, type: 'LETTER', answer: 'L' },
    { row: 4, col: 13, type: 'LETTER', answer: 'A' },
    { row: 5, col: 13, type: 'LETTER', answer: 'N' },
    { row: 6, col: 13, type: 'LETTER', answer: 'K' },
    { row: 7, col: 13, type: 'LETTER', answer: 'A' },

    // More Clues
    { row: 2, col: 6, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Akılcılıkla ilgili' },
    { row: 4, col: 6, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Bazısı' },
    { row: 4, col: 10, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Alüminyum simgesi' },
    { row: 6, col: 10, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Eski dilde çekirge' },
    { row: 8, col: 10, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Alfabenin ilk harfi' },
    { row: 5, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Bir tür yün örgüsü' },
    { row: 7, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Yasaklama' },
    { row: 9, col: 0, type: 'BLOCK' }
  ];

  const title = 'Genel Kültür Bulmacası - 9';

  await prisma.puzzle.deleteMany({
    where: {
      title: {
        in: ['Zorla Alma (Hürriyet)', title],
      },
    },
  });

  const puzzle = await prisma.puzzle.create({
    data: {
      title,
      difficulty: 'MEDIUM',
      width: 15,
      height: 10,
      points: 150,
      categoryId: category.id,
      gridData: gridData
    }
  });

  console.log(`+ ${puzzle.title} Eklendi`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
