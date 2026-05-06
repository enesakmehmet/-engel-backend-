const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const categoryId = 'cmoa56yn80001sxtwed5kcvxy'; // Genel Kültür
  
  const gridData = [
    // --- ROW 0 ---
    { row: 0, col: 0, type: 'CLUE', clueText: 'Hacca gitmiş...', arrowDir: 'RIGHT' },
    { row: 0, col: 1, type: 'LETTER', answer: 'H' },
    { row: 0, col: 2, type: 'CLUE', clueText: 'Keten dövmeye..', arrowDir: 'DOWN' },
    { row: 0, col: 3, type: 'LETTER', answer: 'F' },
    { row: 0, col: 4, type: 'CLUE', clueText: 'Agaragar', arrowDir: 'DOWN' },
    { row: 0, col: 5, type: 'LETTER', answer: 'J' },
    { row: 0, col: 6, type: 'CLUE', clueText: 'Muço', arrowDir: 'DOWN' },
    { row: 0, col: 7, type: 'LETTER', answer: 'M' },
    { row: 0, col: 8, type: 'CLUE', clueText: 'Durulacak yer', arrowDir: 'DOWN' },
    { row: 0, col: 9, type: 'LETTER', answer: 'D' },
    { row: 0, col: 10, type: 'CLUE', clueText: 'Taraf', arrowDir: 'DOWN' },
    { row: 0, col: 11, type: 'LETTER', answer: 'Y' },
    { row: 0, col: 12, type: 'CLUE', clueText: 'Küçük boyutlu', arrowDir: 'DOWN' },
    { row: 0, col: 13, type: 'LETTER', answer: 'U' },

    // --- ROW 1 ---
    { row: 1, col: 0, type: 'CLUE', clueText: 'Bir bitki', arrowDir: 'RIGHT' },
    { row: 1, col: 1, type: 'LETTER', answer: 'A' },
    { row: 1, col: 2, type: 'CLUE', clueText: 'Botanik', arrowDir: 'DOWN' },
    { row: 1, col: 3, type: 'LETTER', answer: 'İ' },
    { row: 1, col: 4, type: 'CLUE', clueText: 'Fas plaka', arrowDir: 'RIGHT' },
    { row: 1, col: 5, type: 'LETTER', answer: 'E' },
    { row: 1, col: 6, type: 'LETTER', answer: 'İ' },
    { row: 1, col: 7, type: 'LETTER', answer: 'İ' },
    { row: 1, col: 8, type: 'CLUE', clueText: 'İbibik', arrowDir: 'DOWN' },
    { row: 1, col: 9, type: 'LETTER', answer: 'U' },
    { row: 1, col: 10, type: 'CLUE', clueText: 'Gittikçe', arrowDir: 'DOWN' },
    { row: 1, col: 11, type: 'LETTER', answer: 'A' },
    { row: 1, col: 12, type: 'CLUE', clueText: 'Öğrenci', arrowDir: 'RIGHT' },
    { row: 1, col: 13, type: 'LETTER', answer: 'T' },

    // --- ROW 2 ---
    { row: 2, col: 0, type: 'CLUE', clueText: 'Öfke', arrowDir: 'RIGHT' },
    { row: 2, col: 1, type: 'LETTER', answer: 'C' },
    { row: 2, col: 2, type: 'LETTER', answer: 'L' },
    { row: 2, col: 3, type: 'LETTER', answer: 'L' },
    { row: 2, col: 4, type: 'LETTER', answer: 'L' },
    { row: 2, col: 5, type: 'CLUE', clueText: 'Ciro eden', arrowDir: 'RIGHT' },
    { row: 2, col: 6, type: 'LETTER', answer: 'Ç' },
    { row: 2, col: 7, type: 'LETTER', answer: 'O' },
    { row: 2, col: 8, type: 'LETTER', answer: 'R' },
    { row: 2, col: 9, type: 'LETTER', answer: 'A' },
    { row: 2, col: 10, type: 'LETTER', answer: 'N' },
    { row: 2, col: 11, type: 'LETTER', answer: 'N' },
    { row: 2, col: 12, type: 'LETTER', answer: 'A' },
    { row: 2, col: 13, type: 'LETTER', answer: 'A' },

    // --- ROW 3 ---
    { row: 3, col: 0, type: 'CLUE', clueText: 'Eski faiz', arrowDir: 'RIGHT' },
    { row: 3, col: 1, type: 'LETTER', answer: 'I' },
    { row: 3, col: 2, type: 'LETTER', answer: 'A' },
    { row: 3, col: 3, type: 'LETTER', answer: 'A' },
    { row: 3, col: 4, type: 'CLUE', clueText: 'Hiçbir zaman', arrowDir: 'DOWN' },
    { row: 3, col: 5, type: 'CLUE', clueText: 'Bir hayvan', arrowDir: 'DOWN' },
    { row: 3, col: 6, type: 'LETTER', answer: 'O' },
    { row: 3, col: 7, type: 'LETTER', answer: 'K' },
    { row: 3, col: 8, type: 'LETTER', answer: 'A' },
    { row: 3, col: 9, type: 'LETTER', answer: 'K' },
    { row: 3, col: 10, type: 'CLUE', clueText: 'Beyaz', arrowDir: 'RIGHT' },
    { row: 3, col: 11, type: 'LETTER', answer: 'A' },
    { row: 3, col: 12, type: 'LETTER', answer: 'K' },
    { row: 3, col: 13, type: 'LETTER', answer: 'L' },

    // --- ROW 4 ---
    { row: 4, col: 0, type: 'CLUE', clueText: 'İki ayrı ırk', arrowDir: 'RIGHT' },
    { row: 4, col: 1, type: 'LETTER', answer: 'M' },
    { row: 4, col: 2, type: 'CLUE', clueText: 'Ada', arrowDir: 'RIGHT' },
    { row: 4, col: 3, type: 'LETTER', answer: 'E' },
    { row: 4, col: 4, type: 'LETTER', answer: 'L' },
    { row: 4, col: 5, type: 'LETTER', answer: 'E' },
    { row: 4, col: 6, type: 'LETTER', answer: 'Z' },
    { row: 4, col: 7, type: 'CLUE', clueText: 'Baht açıklığı', arrowDir: 'DOWN' },
    { row: 4, col: 8, type: 'LETTER', answer: 'K' },
    { row: 4, col: 9, type: 'LETTER', answer: 'E' },
    { row: 4, col: 10, type: 'LETTER', answer: 'B' },
    { row: 4, col: 11, type: 'LETTER', answer: 'İ' },
    { row: 4, col: 12, type: 'LETTER', answer: 'E' },
    { row: 4, col: 13, type: 'CLUE', clueText: 'İnsan (Kul)', arrowDir: 'DOWN' },

    // --- ROW 5 ---
    { row: 5, col: 0, type: 'LETTER', answer: 'A' },
    { row: 5, col: 1, type: 'CLUE', clueText: 'Tavır', arrowDir: 'RIGHT' },
    { row: 5, col: 2, type: 'LETTER', answer: 'D' },
    { row: 5, col: 3, type: 'LETTER', answer: 'A' },
    { row: 5, col: 4, type: 'CLUE', clueText: 'Dudak', arrowDir: 'RIGHT' },
    { row: 5, col: 5, type: 'LETTER', answer: 'L' },
    { row: 5, col: 6, type: 'LETTER', answer: 'E' },
    { row: 5, col: 7, type: 'LETTER', answer: 'B' },
    { row: 5, col: 8, type: 'CLUE', clueText: 'Sodyum', arrowDir: 'DOWN' },
    { row: 5, col: 9, type: 'LETTER', answer: 'İ' },
    { row: 5, col: 10, type: 'CLUE', clueText: 'İlave', arrowDir: 'RIGHT' },
    { row: 5, col: 11, type: 'LETTER', answer: 'E' },
    { row: 5, col: 12, type: 'LETTER', answer: 'K' },
    { row: 5, col: 13, type: 'LETTER', answer: 'B' },

    // --- ROW 6 ---
    { row: 6, col: 0, type: 'CLUE', clueText: 'Saçsız', arrowDir: 'RIGHT' },
    { row: 6, col: 1, type: 'LETTER', answer: 'K' },
    { row: 6, col: 2, type: 'LETTER', answer: 'E' },
    { row: 6, col: 3, type: 'LETTER', answer: 'L' },
    { row: 6, col: 4, type: 'LETTER', answer: 'İ' },
    { row: 6, col: 5, type: 'LETTER', answer: 'Z' },
    { row: 6, col: 6, type: 'CLUE', clueText: 'Keklik', arrowDir: 'RIGHT' },
    { row: 6, col: 7, type: 'LETTER', answer: 'U' },
    { row: 6, col: 8, type: 'LETTER', answer: 'N' },
    { row: 6, col: 9, type: 'LETTER', answer: 'K' },
    { row: 6, col: 10, type: 'LETTER', answer: 'E' },
    { row: 6, col: 11, type: 'LETTER', answer: 'L' },
    { row: 6, col: 12, type: 'LETTER', answer: 'İ' },
    { row: 6, col: 13, type: 'LETTER', answer: 'E' },

    // --- ROW 7 ---
    { row: 7, col: 0, type: 'CLUE', clueText: 'Takoz', arrowDir: 'RIGHT' },
    { row: 7, col: 1, type: 'LETTER', answer: 'K' },
    { row: 7, col: 2, type: 'LETTER', answer: 'A' },
    { row: 7, col: 3, type: 'LETTER', answer: 'M' },
    { row: 7, col: 4, type: 'LETTER', answer: 'A' },
    { row: 7, col: 5, type: 'CLUE', clueText: 'Olanak', arrowDir: 'RIGHT' },
    { row: 7, col: 6, type: 'LETTER', answer: 'İ' },
    { row: 7, col: 7, type: 'LETTER', answer: 'M' },
    { row: 7, col: 8, type: 'LETTER', answer: 'K' },
    { row: 7, col: 9, type: 'LETTER', answer: 'A' },
    { row: 7, col: 10, type: 'LETTER', answer: 'N' },
    { row: 7, col: 11, type: 'CLUE', clueText: 'Sıra', arrowDir: 'RIGHT' },
    { row: 7, col: 12, type: 'LETTER', answer: 'S' },
    { row: 7, col: 13, type: 'LETTER', answer: 'A' },
  ];

  const puzzle = await prisma.puzzle.create({
    data: {
      title: 'Hacca Gitmiş Olan Çengel',
      difficulty: 'MEDIUM',
      width: 14,
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
