const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.findFirst({
    where: { name: 'Günlük Bulmaca' },
  });

  const width = 14;
  const height = 8;
  const title = 'Hürriyet - Güçlü Korku Bulmacası';
  const cells = new Map();
  const key = (row, col) => `${row}:${col}`;

  const put = (cell) => {
    cells.set(key(cell.row, cell.col), cell);
  };

  const letter = (row, col, answer) => {
    if (row < 0 || row >= height || col < 0 || col >= width) return;
    const existing = cells.get(key(row, col));
    if (existing?.type === 'CLUE') return;
    if (existing?.type === 'LETTER' && existing.answer && existing.answer !== answer) return;
    put({ row, col, type: 'LETTER', answer });
  };

  const clue = (row, col, clueText, answer, arrowDir) => {
    const ans = String(answer || '').toUpperCase().replace(/\s+/g, '');
    put({ row, col, type: 'CLUE', arrowDir, clueText, ans, answer: ans });
    const dr = arrowDir === 'DOWN' ? 1 : 0;
    const dc = arrowDir === 'RIGHT' ? 1 : 0;
    ans.split('').forEach((ch, i) => letter(row + dr * (i + 1), col + dc * (i + 1), ch));
  };

  clue(0, 0, 'Güçlü korku...', 'PANİK', 'DOWN');
  clue(0, 2, 'Elde bulunan...', 'MEVCUT', 'DOWN');
  clue(0, 4, 'Büyük erkek kardeş', 'AĞABEY', 'DOWN');
  clue(0, 6, 'Akaju', 'MAUN', 'DOWN');
  clue(0, 8, 'Benekli bir hayvan', 'ÇİTA', 'DOWN');
  clue(0, 10, 'Kandaki sıvı', 'PLAZMA', 'DOWN');
  clue(0, 12, 'Bilinmezcilik', 'AGNOSTİSİZM', 'DOWN');
  clue(1, 0, 'Müzik alfabesi', 'NOTA', 'RIGHT');
  clue(1, 2, 'Bir başlık türü', 'BÖRK', 'DOWN');
  clue(1, 4, 'Roma iffet tanrıçası', 'VESTA', 'RIGHT');
  clue(1, 12, 'Kükürt elementinin simgesi', 'S', 'DOWN');
  clue(2, 0, 'Seyyar ızgara', 'MANGAL', 'RIGHT');
  clue(2, 8, 'Yumuşak deri', 'SÜET', 'RIGHT');
  clue(3, 0, 'Yağmur damlası', 'DAMLA', 'RIGHT');
  clue(3, 3, 'Eski dilde derin hale getirme', 'TAMİK', 'DOWN');
  clue(3, 5, 'Balıkların tuzlaması', 'LAKERDA', 'RIGHT');
  clue(3, 12, 'Eski Türklerde Tanrı', 'GÖK', 'DOWN');
  clue(4, 0, 'Eski dilde civa', 'ZIBAK', 'DOWN');
  clue(4, 1, 'Katliam', 'KIYIM', 'RIGHT');
  clue(4, 5, 'Leyleğe benzer b...', 'BALIKÇIL', 'DOWN');
  clue(4, 7, 'Anadolu ajansı', 'AA', 'RIGHT');
  clue(4, 10, 'Bir renk', 'AL', 'RIGHT');
  clue(5, 1, 'Böğürtlen', 'MORUK', 'DOWN');
  clue(5, 4, 'Bir yağ türü', 'OLEİN', 'RIGHT');
  clue(5, 7, 'Çok sarhoş (argo)', 'ZOM', 'DOWN');
  clue(5, 10, 'Yabancı', 'EL', 'DOWN');
  clue(6, 0, 'Kadın oyuncu', 'AKTRİS', 'RIGHT');
  clue(6, 2, 'Eşeysiz bölünme', 'MİTOZ', 'RIGHT');
  clue(6, 9, 'Viteste geri harfi', 'R', 'DOWN');
  clue(6, 11, "Dünya'nın uydusu", 'AY', 'RIGHT');
  clue(7, 6, 'Yiğitçe, erkeğe yakışan', 'MERTÇE', 'RIGHT');

  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      if (!cells.has(key(row, col))) {
        put({ row, col, type: 'BLOCK' });
      }
    }
  }

  const gridData = Array.from(cells.values()).sort((a, b) => a.row - b.row || a.col - b.col);

  await prisma.puzzle.deleteMany({ where: { title } });
  await prisma.puzzle.create({
    data: {
      title,
      difficulty: 'HARD',
      width,
      height,
      points: 250,
      categoryId: category?.id,
      gridData,
      isActive: true,
    },
  });

  console.log(`✅ ${title} başarıyla eklendi! (${width}x${height})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
