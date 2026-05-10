const { PrismaClient } = require('@prisma/client');

async function seedHurriyetOyuncuMedium(prisma) {
  const category = await prisma.category.findFirst({
    where: { name: 'Günlük Bulmaca' },
  });

  const width = 18;
  const height = 18;

  const words = [
    { clue: 'Film ya da tiyatroda rol alan kişi', word: 'OYUNCU', dir: 'RIGHT' },
    { clue: 'Oyun ya da filmin yazılı metni', word: 'SENARYO', dir: 'RIGHT' },
    { clue: 'Tiyatroda perde açılmadan önceki son tanıtım filmi', word: 'FRAGMAN', dir: 'RIGHT' },
    { clue: 'Görüntü kaydeden aygıt', word: 'KAMERA', dir: 'RIGHT' },
    { clue: 'Oyun ya da konserin oynandığı yer', word: 'SAHNE', dir: 'RIGHT' },
    { clue: 'Filmde yapay ses ve gürültüler', word: 'EFEKT', dir: 'RIGHT' },
    { clue: 'Gösteriyi izleyen topluluk', word: 'SEYIRCI', dir: 'RIGHT' },
    { clue: 'Oyunu yöneten kişi', word: 'YONETMEN', dir: 'DOWN' },
    { clue: 'Oyunda rol alan kişilerin tümü', word: 'KADRO', dir: 'DOWN' },
    { clue: 'Bir dizinin ya da filmin son bölümü', word: 'FINAL', dir: 'DOWN' },
    { clue: 'Ses ve görüntülerin birleşimiyle oluşturulan bütünlük', word: 'KURGU', dir: 'DOWN' },
    { clue: 'Sahnede kullanılan dekor ve eşyaların tümü', word: 'DEKOR', dir: 'DOWN' },
  ];

  const gridWidth = 18;
  const gridHeight = 18;
  const grid = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(null));

  function placeWord(wordObj, row, col) {
    const len = wordObj.word.length;
    if (wordObj.dir === 'RIGHT') {
      if (col + len >= gridWidth) return false;
      for (let i = 0; i <= len; i++) {
        const existing = grid[row][col + i];
        if (i === 0) {
          if (existing !== null) return false;
        } else {
          if (existing !== null && (existing.type !== 'LETTER' || existing.letter !== wordObj.word[i - 1])) return false;
        }
      }
      grid[row][col] = { type: 'CLUE', ...wordObj };
      for (let i = 0; i < len; i++) grid[row][col + 1 + i] = { type: 'LETTER', letter: wordObj.word[i] };
    } else {
      if (row + len >= gridHeight) return false;
      for (let i = 0; i <= len; i++) {
        const existing = grid[row + i][col];
        if (i === 0) {
          if (existing !== null) return false;
        } else {
          if (existing !== null && (existing.type !== 'LETTER' || existing.letter !== wordObj.word[i - 1])) return false;
        }
      }
      grid[row][col] = { type: 'CLUE', ...wordObj };
      for (let i = 0; i < len; i++) grid[row + 1 + i][col] = { type: 'LETTER', letter: wordObj.word[i] };
    }
    return true;
  }

  for (const word of words) {
    let placed = false;
    for (let r = 0; r < gridHeight && !placed; r++) {
      for (let c = 0; c < gridWidth && !placed; c++) {
        if (grid[r][c] === null && placeWord(word, r, c)) placed = true;
      }
    }
    if (!placed) console.log('Bulunamadı:', word.word);
  }

  const gridData = [];
  for (let r = 0; r < gridHeight; r++) {
    for (let c = 0; c < gridWidth; c++) {
      const cell = grid[r][c];
      if (!cell) {
        gridData.push({ row: r, col: c, type: 'BLOCK' });
      } else if (cell.type === 'CLUE') {
        gridData.push({ row: r, col: c, type: 'CLUE', arrowDir: cell.dir, clueText: cell.clue, ans: cell.word });
      } else if (cell.type === 'LETTER') {
        gridData.push({ row: r, col: c, type: 'LETTER', answer: cell.letter });
      }
    }
  }

  const title = 'Hürriyet - Oyuncu Bulmacası (Orta)';

  const existingPuzzles = await prisma.puzzle.findMany({ where: { title } });
  if (existingPuzzles.length > 0) {
    const puzzleIds = existingPuzzles.map(p => p.id);
    await prisma.gameSession.deleteMany({ where: { puzzleId: { in: puzzleIds } } });
    await prisma.puzzle.deleteMany({ where: { title } });
  }

  await prisma.puzzle.create({
    data: {
      title,
      difficulty: 'MEDIUM',
      width: gridWidth,
      height: gridHeight,
      points: 180,
      categoryId: category?.id,
      gridData,
      isActive: true,
    },
  });

  console.log(`✅ ${title} başarıyla eklendi!`);
}

module.exports = seedHurriyetOyuncuMedium;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetOyuncuMedium(prisma)
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
