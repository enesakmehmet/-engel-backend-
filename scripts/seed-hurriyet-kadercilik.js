const { PrismaClient } = require('@prisma/client');

async function seedHurriyetKadercilik(prisma) {
  const category = await prisma.category.findFirst({
    where: { name: 'Günlük Bulmaca' },
  });

  const words = [
    { clue: 'Kadercilik', word: 'FATALİZM', dir: 'DOWN' },
    { clue: 'Japon mafyası', word: 'YAKUZA', dir: 'RIGHT' },
    { clue: 'Vekiller, bakanlar', word: 'VÜKELA', dir: 'DOWN' },
    { clue: 'Gürültü, patırtı', word: 'ŞAMATA', dir: 'RIGHT' },
    { clue: 'Bundan böyle', word: 'ARTIK', dir: 'RIGHT' },
    { clue: 'Lüksemburg plaka', word: 'L', dir: 'DOWN' },
    { clue: 'Bir kış sebzesi', word: 'PIRASA', dir: 'RIGHT' },
    { clue: 'Çinkonun simgesi', word: 'ZN', dir: 'RIGHT' },
    { clue: 'Argoda sevgili', word: 'MANİTA', dir: 'RIGHT' },
    { clue: 'Arttırma, bindirme', word: 'ZAM', dir: 'RIGHT' },
    { clue: 'Kenarları eşit olan', word: 'EŞKENAR', dir: 'DOWN' },
    { clue: 'Tüzük', word: 'NİZAMNAME', dir: 'RIGHT' },
    { clue: 'Galyumun simgesi', word: 'GA', dir: 'DOWN' },
    { clue: 'Ateşli silah', word: 'TABANCA', dir: 'RIGHT' },
    { clue: 'Kuş gagası', word: 'MİNKAR', dir: 'DOWN' },
    { clue: 'Bir yarış yelkenlisi', word: 'KOTRA', dir: 'DOWN' },
    { clue: 'Telli bir çalgı', word: 'GİTAR', dir: 'DOWN' },
    { clue: 'Alaka', word: 'İLGİ', dir: 'RIGHT' },
    { clue: 'İç Anadoluda bir göl', word: 'TUZ', dir: 'RIGHT' },
    { clue: 'İnce urgan', word: 'SİCİM', dir: 'RIGHT' },
    { clue: 'Ortodoks resmi', word: 'İKONA', dir: 'DOWN' },
    { clue: 'Güzel, hoş (kadın)', word: 'RANA', dir: 'RIGHT' },
    { clue: 'Eski dilde haberci', word: 'SAİ', dir: 'DOWN' },
    { clue: 'Ribonükleik asit', word: 'RNA', dir: 'DOWN' },
    { clue: 'Kent', word: 'ŞEHİR', dir: 'RIGHT' },
    { clue: 'Üzüm kütüğü', word: 'ASMA', dir: 'DOWN' },
    { clue: 'Anadolu ajansı', word: 'AA', dir: 'RIGHT' },
    { clue: 'Beyaz', word: 'AK', dir: 'RIGHT' },
    { clue: 'Akıntılı hastalık', word: 'NEZLE', dir: 'RIGHT' },
    { clue: 'O yer', word: 'ORA', dir: 'RIGHT' },
    { clue: 'Tek tohumluk kuru yemiş', word: 'FINDIK', dir: 'RIGHT' },
    { clue: 'Potasyumun simgesi', word: 'K', dir: 'DOWN' }
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

  const title = 'Hürriyet - Kadercilik Bulmacası';

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

module.exports = seedHurriyetKadercilik;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetKadercilik(prisma)
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
