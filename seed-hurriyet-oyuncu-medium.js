const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.findFirst({
    where: { name: 'Günlük Bulmaca' },
  });

  const width = 18;
  const height = 18;

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
      if (existing.type === 'CLUE') {
        return;
      }
      if (existing.type === 'BLOCK') {
        existing.type = 'LETTER';
        existing.answer = ch;
        cells.set(key, existing);
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

  // Yatay (RIGHT) ipuçları
  addClueRight(4, 7, 'Film ya da tiyatroda rol alan kişi', 'OYUNCU');
  addClueRight(5, 5, 'Oyun ya da filmin yazılı metni', 'SENARYO');
  addClueRight(8, 3, 'Tiyatroda perde açılmadan önceki son tanıtım filmi', 'FRAGMAN');
  addClueRight(2, 1, 'Görüntü kaydeden aygıt', 'KAMERA');
  addClueRight(13, 2, 'Oyun ya da konserin oynandığı yer', 'SAHNE');
  addClueRight(11, 11, 'Filmde yapay ses ve gürültüler', 'EFEKT');
  addClueRight(10, 9, 'Gösteriyi izleyen topluluk', 'SEYIRCI');

  // Dikey (DOWN) ipuçları
  addClueDown(2, 8, 'Oyunu yöneten kişi', 'YONETMEN');
  addClueDown(6, 6, 'Oyunda rol alan kişilerin tümü', 'KADRO');
  addClueDown(7, 4, 'Bir dizinin ya da filmin son bölümü', 'FINAL');
  addClueDown(2, 10, 'Ses ve görüntülerin birleşimiyle oluşturulan bütünlük', 'KURGU');
  addClueDown(1, 14, 'Sahnede kullanılan dekor ve eşyaların tümü', 'DEKOR');

  // Kalan hücreleri BLOCK ile doldur
  for (let r = 0; r < height; r += 1) {
    for (let c = 0; c < width; c += 1) {
      const key = coordKey(r, c);
      if (!cells.has(key)) {
        putCell({ row: r, col: c, type: 'BLOCK' });
      }
    }
  }

  const gridData = Array.from(cells.values());

  const title = 'Hürriyet - Oyuncu Bulmacası (Orta)';

  await prisma.puzzle.deleteMany({
    where: { title },
  });

  await prisma.puzzle.create({
    data: {
      title,
      difficulty: 'MEDIUM',
      width,
      height,
      points: 180,
      categoryId: category?.id,
      gridData,
      isActive: true,
    },
  });

  console.log(`✅ ${title} başarıyla eklendi! 18x18, MEDIUM zorluk, farklı soru/cevaplarla.`);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(() => prisma.$disconnect());
