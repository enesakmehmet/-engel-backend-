const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧩 Hürriyet Görsel Bulmacası ekleniyor...');

  const category = await prisma.category.findFirst({ where: { name: 'Günlük Bulmaca' } });

  const width = 13;
  const height = 15;

  const cells = new Map();
  const coordKey = (row, col) => `${row}:${col}`;

  const putCell = (cell) => {
    cells.set(coordKey(cell.row, cell.col), cell);
  };

  const putLetter = (row, col, ch) => {
    if (row < 0 || row >= height || col < 0 || col >= width) return;
    const key = coordKey(row, col);
    const existing = cells.get(key);

    if (existing) {
      if (existing.type === 'LETTER') {
        if (!existing.answer) existing.answer = ch;
        return;
      }
      if (existing.type === 'CLUE' || existing.type === 'BLOCK') {
        // Overwrite block with letter
        if (existing.type === 'BLOCK') {
           cells.set(key, { row, col, type: 'LETTER', answer: ch });
        }
        return;
      }
    }

    putCell({ row, col, type: 'LETTER', answer: ch });
  };

  const addClueRight = (row, col, clueText, answer) => {
    putCell({ row, col, type: 'CLUE', arrowDir: 'RIGHT', clueText, ans: answer });
    const letters = answer.split('');
    letters.forEach((ch, i) => {
      const c = col + 1 + i;
      if (c < width) {
        putLetter(row, c, ch);
      }
    });
  };

  const addClueDown = (row, col, clueText, answer) => {
    putCell({ row, col, type: 'CLUE', arrowDir: 'DOWN', clueText, ans: answer });
    const letters = answer.split('');
    letters.forEach((ch, i) => {
      const r = row + 1 + i;
      if (r < height) {
        putLetter(r, col, ch);
      }
    });
  };

  // Adding the clues extracted from the image without intersections
  // ROW 0
  addClueRight(0, 0, 'Şiddetli yağmur', 'SAGANAK');
  addClueRight(0, 8, 'Baba, cet', 'ATA');
  
  // ROW 2
  addClueRight(2, 0, 'Bağnazlık', 'YOBAZLIK');
  addClueRight(2, 9, 'Beyin elektrosu', 'EEG');
  
  // ROW 4
  addClueRight(4, 0, 'Kıl elek', 'ELEK');
  addClueRight(4, 5, 'Tutturgaç', 'ATAS');
  
  // ROW 6
  addClueRight(6, 0, 'Erzak odası', 'KILER');
  addClueRight(6, 6, 'Gelincik', 'AS');
  addClueRight(6, 9, 'Kutup', 'POL');
  
  // ROW 8
  addClueRight(8, 0, 'Modern Yunanca', 'ROMEYKA');
  addClueRight(8, 8, 'Zamir', 'BEN');
  
  // ROW 10
  addClueRight(10, 0, 'Bayağılık', 'ADILIK');
  
  // ROW 12
  addClueRight(12, 0, 'Göz bebeği', 'HADEKA');
  
  // ROW 14
  addClueRight(14, 0, 'Bir tür kimlik', 'PASAPORT');


  // Fill remaining with BLOCK
  for (let r = 0; r < height; r += 1) {
    for (let c = 0; c < width; c += 1) {
      const key = coordKey(r, c);
      if (!cells.has(key)) {
        putCell({ row: r, col: c, type: 'BLOCK' });
      }
    }
  }

  const gridData = Array.from(cells.values());

  const title = 'Hürriyet Görsel Bulmacası - Yeni';

  await prisma.puzzle.deleteMany({
    where: { title },
  });

  await prisma.puzzle.create({
    data: {
      title,
      difficulty: 'MEDIUM',
      width,
      height,
      points: 150,
      categoryId: category?.id,
      gridData,
      isActive: true,
    },
  });

  console.log(`✅ ${title} başarıyla eklendi!`);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(() => prisma.$disconnect());
