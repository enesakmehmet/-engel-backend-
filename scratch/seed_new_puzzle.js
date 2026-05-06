const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const categoryId = 'cmoa56yn80001sxtwed5kcvxy'; // Genel Kültür
  
  const gridData = [
    // --- ROW 0 ---
    { row: 0, col: 0, type: 'CLUE', clueText: 'Geri çevirme', arrowDir: 'RIGHT' },
    { row: 0, col: 1, type: 'LETTER', answer: 'İ' },
    { row: 0, col: 2, type: 'CLUE', clueText: 'Kayıp', arrowDir: 'DOWN' },
    { row: 0, col: 3, type: 'LETTER', answer: 'Y' },
    { row: 0, col: 4, type: 'CLUE', clueText: 'Türk müziği makamı', arrowDir: 'DOWN' },
    { row: 0, col: 5, type: 'LETTER', answer: 'R' },
    { row: 0, col: 6, type: 'CLUE', clueText: 'Tanıtma yazısı', arrowDir: 'DOWN' },
    { row: 0, col: 7, type: 'LETTER', answer: 'S' },
    { row: 0, col: 8, type: 'CLUE', clueText: 'Dalkavuk', arrowDir: 'DOWN' },
    { row: 0, col: 9, type: 'LETTER', answer: 'Ş' },
    { row: 0, col: 10, type: 'CLUE', clueText: 'Yarık, yırtık', arrowDir: 'DOWN' },
    { row: 0, col: 11, type: 'LETTER', answer: 'F' },
    { row: 0, col: 12, type: 'CLUE', clueText: 'Tanrı', arrowDir: 'DOWN' },

    // --- ROW 1 ---
    { row: 1, col: 0, type: 'CLUE', clueText: 'Hindistan Prensi', arrowDir: 'RIGHT' },
    { row: 1, col: 1, type: 'LETTER', answer: 'R' },
    { row: 1, col: 2, type: 'CLUE', clueText: 'İran pilavı', arrowDir: 'RIGHT' },
    { row: 1, col: 3, type: 'LETTER', answer: 'A' },
    { row: 1, col: 4, type: 'CLUE', clueText: 'Osman Gazi\'nin...', arrowDir: 'RIGHT' },
    { row: 1, col: 5, type: 'LETTER', answer: 'C' },
    { row: 1, col: 6, type: 'CLUE', clueText: 'Bir nota', arrowDir: 'RIGHT' },
    { row: 1, col: 7, type: 'LETTER', answer: 'A' },
    { row: 1, col: 8, type: 'CLUE', clueText: 'Baba, şeyh...', arrowDir: 'RIGHT' },
    { row: 1, col: 9, type: 'LETTER', answer: 'P' },
    { row: 1, col: 10, type: 'LETTER', answer: 'İ' },
    { row: 1, col: 11, type: 'LETTER', answer: 'R' },
    { row: 1, col: 12, type: 'CLUE', clueText: 'Açık deniz, engin', arrowDir: 'RIGHT' },

    // --- ROW 2 ---
    { row: 2, col: 0, type: 'CLUE', clueText: 'Köşegen', arrowDir: 'RIGHT' },
    { row: 2, col: 1, type: 'LETTER', answer: 'T' },
    { row: 2, col: 2, type: 'LETTER', answer: 'İ' },
    { row: 2, col: 3, type: 'LETTER', answer: 'C' },
    { row: 2, col: 4, type: 'LETTER', answer: 'A' },
    { row: 2, col: 5, type: 'LETTER', answer: 'S' },
    { row: 2, col: 6, type: 'LETTER', answer: 'U' },
    { row: 2, col: 7, type: 'LETTER', answer: 'N' },
    { row: 2, col: 8, type: 'LETTER', answer: 'U' },
    { row: 2, col: 9, type: 'LETTER', answer: 'Ş' },
    { row: 2, col: 10, type: 'LETTER', answer: 'İ' },
    { row: 2, col: 11, type: 'LETTER', answer: 'L' },
    { row: 2, col: 12, type: 'LETTER', answer: 'A' },

    // --- ROW 3 ---
    { row: 3, col: 0, type: 'CLUE', clueText: 'Oğul otu', arrowDir: 'RIGHT' },
    { row: 3, col: 1, type: 'LETTER', answer: 'M' },
    { row: 3, col: 2, type: 'LETTER', answer: 'E' },
    { row: 3, col: 3, type: 'LETTER', answer: 'L' },
    { row: 3, col: 4, type: 'LETTER', answer: 'İ' },
    { row: 3, col: 5, type: 'LETTER', answer: 'S' },
    { row: 3, col: 6, type: 'LETTER', answer: 'A' },
    { row: 3, col: 7, type: 'LETTER', answer: 'L' },
    { row: 3, col: 8, type: 'LETTER', answer: 'A' },
    { row: 3, col: 9, type: 'LETTER', answer: 'K' },
    { row: 3, col: 10, type: 'LETTER', answer: 'L' },
    { row: 3, col: 11, type: 'LETTER', answer: 'A' },
    { row: 3, col: 12, type: 'LETTER', answer: 'H' },

    // --- ROW 4 ---
    { row: 4, col: 0, type: 'LETTER', answer: 'E' },
    { row: 4, col: 1, type: 'LETTER', answer: 'İ' },
    { row: 4, col: 2, type: 'LETTER', answer: 'K' },
    { row: 4, col: 3, type: 'LETTER', answer: 'A' },
    { row: 4, col: 4, type: 'LETTER', answer: 'H' },
    { row: 4, col: 5, type: 'CLUE', clueText: 'Çobanaldatan', arrowDir: 'RIGHT' },
    { row: 4, col: 6, type: 'LETTER', answer: 'K' },
    { row: 4, col: 7, type: 'LETTER', answer: 'U' },
    { row: 4, col: 8, type: 'LETTER', answer: 'Ş' },
    { row: 4, col: 9, type: 'LETTER', answer: 'A' },
    { row: 4, col: 10, type: 'LETTER', answer: 'M' },
    { row: 4, col: 11, type: 'LETTER', answer: 'E' },
    { row: 4, col: 12, type: 'LETTER', answer: 'L' },

    // --- ROW 5 ---
    { row: 5, col: 0, type: 'CLUE', clueText: 'Sezar selâmı', arrowDir: 'RIGHT' },
    { row: 5, col: 1, type: 'LETTER', answer: 'A' },
    { row: 5, col: 2, type: 'LETTER', answer: 'V' },
    { row: 5, col: 3, type: 'CLUE', clueText: 'Kağıt cilası', arrowDir: 'DOWN' },
    { row: 5, col: 4, type: 'LETTER', answer: 'E' },
    { row: 5, col: 5, type: 'CLUE', clueText: 'Ermiş', arrowDir: 'RIGHT' },
    { row: 5, col: 6, type: 'LETTER', answer: 'A' },
    { row: 5, col: 7, type: 'LETTER', answer: 'Z' },
    { row: 5, col: 8, type: 'LETTER', answer: 'İ' },
    { row: 5, col: 9, type: 'LETTER', answer: 'Z' },
    { row: 5, col: 10, type: 'LETTER', answer: 'U' },
    { row: 5, col: 11, type: 'LETTER', answer: 'M' },
    { row: 5, col: 12, type: 'LETTER', answer: 'M' },

    // --- ROW 6 ---
    { row: 6, col: 0, type: 'LETTER', answer: 'T' },
    { row: 6, col: 1, type: 'LETTER', answer: 'M' },
    { row: 6, col: 2, type: 'LETTER', answer: 'E' },
    { row: 6, col: 3, type: 'LETTER', answer: 'A' },
    { row: 6, col: 4, type: 'LETTER', answer: 'H' },
    { row: 6, col: 5, type: 'CLUE', clueText: 'Erkek deve', arrowDir: 'RIGHT' },
    { row: 6, col: 6, type: 'LETTER', answer: 'L' },
    { row: 6, col: 7, type: 'LETTER', answer: 'Ö' },
    { row: 6, col: 8, type: 'LETTER', answer: 'K' },
    { row: 6, col: 9, type: 'LETTER', answer: 'M' },
    { row: 6, col: 10, type: 'CLUE', clueText: 'Plaka (AR)', arrowDir: 'RIGHT' },
    { row: 6, col: 11, type: 'LETTER', answer: 'R' },
    { row: 6, col: 12, type: 'LETTER', answer: 'A' },

    // --- ROW 7 ---
    { row: 7, col: 0, type: 'CLUE', clueText: 'Çelişki', arrowDir: 'RIGHT' },
    { row: 7, col: 1, type: 'LETTER', answer: 'T' },
    { row: 7, col: 2, type: 'LETTER', answer: 'E' },
    { row: 7, col: 3, type: 'LETTER', answer: 'Z' },
    { row: 7, col: 4, type: 'LETTER', answer: 'A' },
    { row: 7, col: 5, type: 'LETTER', answer: 'T' },
    { row: 7, col: 6, type: 'CLUE', clueText: 'Melodi', arrowDir: 'RIGHT' },
    { row: 7, col: 7, type: 'LETTER', answer: 'E' },
    { row: 7, col: 8, type: 'LETTER', answer: 'Z' },
    { row: 7, col: 9, type: 'LETTER', answer: 'G' },
    { row: 7, col: 10, type: 'LETTER', answer: 'İ' },
    { row: 7, col: 11, type: 'LETTER', answer: 'A' },
    { row: 7, col: 12, type: 'LETTER', answer: 'Z' },
  ];

  const puzzle = await prisma.puzzle.create({
    data: {
      title: 'Hürriyet Günlük Çengel',
      difficulty: 'MEDIUM',
      width: 13,
      height: 8,
      gridData: gridData,
      points: 150,
      categoryId: categoryId
    }
  });

  console.log('Puzzle created with ID:', puzzle.id);
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
