const { PrismaClient } = require('@prisma/client');

async function seedHurriyetUkrayna(prisma) {
  const category = await prisma.category.findFirst({
    where: { name: 'Günlük Bulmaca' },
  });

  const words = [
    { clue: 'Ukrayna plakası', word: 'UA', dir: 'DOWN' },
    { clue: 'Aktif', word: 'FAAL', dir: 'RIGHT' },
    { clue: 'Tibet öküzü', word: 'YAK', dir: 'DOWN' },
    { clue: 'Alfabenin ilk harfi', word: 'A', dir: 'RIGHT' },
    { clue: 'İşaret çentiği', word: 'KERTE', dir: 'DOWN' },
    { clue: 'Yüce', word: 'ULVİ', dir: 'RIGHT' },
    { clue: 'Kalp', word: 'YÜREK', dir: 'DOWN' },
    { clue: 'Limited (Kısaltma)', word: 'LTD', dir: 'DOWN' },
    { clue: 'Duygu kapanıklığı', word: 'APATİ', dir: 'DOWN' },
    { clue: 'Büyük delikli kalbur', word: 'GÖZER', dir: 'DOWN' },
    { clue: 'Konuşma bozukluğu', word: 'AFAZİ', dir: 'DOWN' },
    { clue: 'Kareli kumaş', word: 'EKOSE', dir: 'RIGHT' },
    { clue: 'Bir kuş cinsi', word: 'SAKA', dir: 'RIGHT' },
    { clue: 'Yön bulucu alet', word: 'PUSULA', dir: 'RIGHT' },
    { clue: 'Sinek', word: 'CİBİN', dir: 'DOWN' },
    { clue: 'Ay takvimi 7. ayı', word: 'RECEP', dir: 'RIGHT' },
    { clue: 'Bir nota', word: 'Mİ', dir: 'RIGHT' },
    { clue: 'Düzlek yapı', word: 'OVALIK', dir: 'DOWN' },
    { clue: 'Eklem romatizması', word: 'NİKRİS', dir: 'RIGHT' },
    { clue: 'Bir meyve', word: 'ELMA', dir: 'RIGHT' },
    { clue: 'Eğleşme', word: 'İKAMET', dir: 'RIGHT' },
    { clue: 'Tanrı', word: 'HAK', dir: 'RIGHT' },
    { clue: 'Eksiksiz', word: 'TAM', dir: 'RIGHT' },
    { clue: 'Lantanın simgesi', word: 'LA', dir: 'DOWN' },
    { clue: 'Kilogram (Kısaca)', word: 'KG', dir: 'DOWN' },
    { clue: 'Otomobil satılan yer', word: 'GALERİ', dir: 'RIGHT' },
    { clue: 'Yavru', word: 'BALA', dir: 'RIGHT' },
    { clue: 'Merbut', word: 'BAĞLI', dir: 'RIGHT' },
    { clue: 'Roma imparatorlarının tacı', word: 'TİARA', dir: 'RIGHT' },
    { clue: 'Gabon plaka işareti', word: 'G', dir: 'RIGHT' }
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

  const title = 'Hürriyet - Ukrayna Plakası Bulmacası';

  const existingPuzzles = await prisma.puzzle.findMany({ where: { title } });
  if (existingPuzzles.length > 0) {
    const puzzleIds = existingPuzzles.map(p => p.id);
    await prisma.gameSession.deleteMany({ where: { puzzleId: { in: puzzleIds } } });
    await prisma.puzzle.deleteMany({ where: { title } });
  }

  await prisma.puzzle.create({
    data: {
      title,
      difficulty: 'HARD',
      width: gridWidth,
      height: gridHeight,
      points: 250,
      categoryId: category?.id,
      gridData,
      isActive: true,
    },
  });

  console.log(`✅ ${title} başarıyla eklendi!`);
}

module.exports = seedHurriyetUkrayna;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetUkrayna(prisma)
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
