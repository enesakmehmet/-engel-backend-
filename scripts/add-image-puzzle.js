const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const gridData = [
  { row: 0, col: 2, type: 'CLUE', clueText: 'Buyuran, üst', arrowDir: 'DOWN' },
  
  { row: 1, col: 0, type: 'CLUE', clueText: 'Yat limanı', arrowDir: 'RIGHT' },
  { row: 1, col: 1, type: 'LETTER', answer: 'M' },
  { row: 1, col: 2, type: 'LETTER', answer: 'A' },
  { row: 1, col: 3, type: 'LETTER', answer: 'R' },
  { row: 1, col: 4, type: 'LETTER', answer: 'İ' },
  { row: 1, col: 5, type: 'LETTER', answer: 'N' },
  { row: 1, col: 6, type: 'LETTER', answer: 'A' },
  
  { row: 2, col: 2, type: 'LETTER', answer: 'M' },
  { row: 2, col: 4, type: 'CLUE', clueText: 'Kullanma süresi', arrowDir: 'DOWN' },
  
  { row: 3, col: 1, type: 'CLUE', clueText: 'Antrenman', arrowDir: 'RIGHT' },
  { row: 3, col: 2, type: 'LETTER', answer: 'İ' },
  { row: 3, col: 3, type: 'LETTER', answer: 'D' },
  { row: 3, col: 4, type: 'LETTER', answer: 'M' },
  { row: 3, col: 5, type: 'LETTER', answer: 'A' },
  { row: 3, col: 6, type: 'LETTER', answer: 'N' },
  
  { row: 4, col: 2, type: 'LETTER', answer: 'R' },
  { row: 4, col: 4, type: 'LETTER', answer: 'İ' },
  { row: 4, col: 5, type: 'CLUE', clueText: 'Seslenme', arrowDir: 'DOWN' },
  { row: 4, col: 7, type: 'CLUE', clueText: 'Eğitim yuvası', arrowDir: 'DOWN' },
  
  { row: 5, col: 0, type: 'CLUE', clueText: 'Gökadamız', arrowDir: 'RIGHT' },
  { row: 5, col: 1, type: 'LETTER', answer: 'S' },
  { row: 5, col: 2, type: 'LETTER', answer: 'A' },
  { row: 5, col: 3, type: 'LETTER', answer: 'M' },
  { row: 5, col: 4, type: 'LETTER', answer: 'A' },
  { row: 5, col: 5, type: 'LETTER', answer: 'N' },
  { row: 5, col: 6, type: 'LETTER', answer: 'Y' },
  { row: 5, col: 7, type: 'LETTER', answer: 'O' },
  { row: 5, col: 8, type: 'LETTER', answer: 'L' },
  { row: 5, col: 9, type: 'LETTER', answer: 'U' },
  
  { row: 6, col: 3, type: 'CLUE', clueText: 'Bir element', arrowDir: 'DOWN' },
  { row: 6, col: 4, type: 'LETTER', answer: 'T' },
  { row: 6, col: 5, type: 'LETTER', answer: 'İ' },
  { row: 6, col: 7, type: 'LETTER', answer: 'K' },
  
  { row: 7, col: 2, type: 'CLUE', clueText: "Muğla'nın ilçesi", arrowDir: 'RIGHT' },
  { row: 7, col: 3, type: 'LETTER', answer: 'B' },
  { row: 7, col: 4, type: 'LETTER', answer: 'O' },
  { row: 7, col: 5, type: 'LETTER', answer: 'D' },
  { row: 7, col: 6, type: 'LETTER', answer: 'R' },
  { row: 7, col: 7, type: 'LETTER', answer: 'U' },
  { row: 7, col: 8, type: 'LETTER', answer: 'M' },
  
  { row: 8, col: 3, type: 'LETTER', answer: 'O' },
  { row: 8, col: 5, type: 'LETTER', answer: 'A' },
  { row: 8, col: 7, type: 'LETTER', answer: 'L' },
  
  { row: 9, col: 3, type: 'LETTER', answer: 'R' },
  
  { row: 10, col: 5, type: 'CLUE', clueText: 'Çay kıvamı', arrowDir: 'DOWN' },
  { row: 10, col: 6, type: 'CLUE', clueText: 'Dolaylı anlatım', arrowDir: 'DOWN' },
  
  { row: 11, col: 1, type: 'CLUE', clueText: 'Bireysel, tekil', arrowDir: 'RIGHT' },
  { row: 11, col: 2, type: 'LETTER', answer: 'F' },
  { row: 11, col: 3, type: 'LETTER', answer: 'E' },
  { row: 11, col: 4, type: 'LETTER', answer: 'R' },
  { row: 11, col: 5, type: 'LETTER', answer: 'D' },
  { row: 11, col: 6, type: 'LETTER', answer: 'İ' },
  
  { row: 12, col: 5, type: 'LETTER', answer: 'E' },
  { row: 12, col: 6, type: 'LETTER', answer: 'M' },
  
  { row: 13, col: 0, type: 'CLUE', clueText: 'Yedinci sanat', arrowDir: 'RIGHT' },
  { row: 13, col: 1, type: 'LETTER', answer: 'S' },
  { row: 13, col: 2, type: 'LETTER', answer: 'İ' },
  { row: 13, col: 3, type: 'LETTER', answer: 'N' },
  { row: 13, col: 4, type: 'LETTER', answer: 'E' },
  { row: 13, col: 5, type: 'LETTER', answer: 'M' },
  { row: 13, col: 6, type: 'LETTER', answer: 'A' }
];

// Fill the rest with blocks
const fullGrid = [];
for (let r = 0; r <= 13; r++) {
  for (let c = 0; c <= 9; c++) {
    const existing = gridData.find(cell => cell.row === r && cell.col === c);
    if (existing) {
      fullGrid.push(existing);
    } else {
      fullGrid.push({ row: r, col: c, type: 'BLOCK' });
    }
  }
}

async function main() {
  const title = 'Klasik Seri Bulmacası - 10';

  await prisma.puzzle.deleteMany({
    where: {
      title: {
        in: ['Resimdeki Bulmaca (Ferdi Tayfur Özel)', title],
      },
    },
  });

  await prisma.puzzle.create({
    data: {
      title,
      difficulty: 'HARD',
      width: 10,
      height: 14,
      points: 500,
      gridData: fullGrid,
      isActive: true
    }
  });
  console.log("✅ Resimdeki bulmaca başarıyla eklendi!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
