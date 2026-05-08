const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.findFirst({
    where: { name: 'Günlük Bulmaca' },
  });

  const width = 19;
  const height = 10;
  const title = 'Hürriyet - Berkelyum Bulmacası';

  const gridData = [];

  const addClue = (row, col, clueText, answer, arrowDir = 'RIGHT') => {
    gridData.push({ row, col, type: 'CLUE', arrowDir, clueText, ans: answer });
  };

  // ── Row 0 (üst sıra) ─────────────────────────────────
  addClue(0, 0, "Berkelyum'un simgesi", 'BK', 'DOWN');
  addClue(0, 2, "Çinko'nun simgesi", 'ZN', 'DOWN');
  addClue(0, 4, 'Alçı taşı', 'ALÇITAŞI', 'DOWN');
  addClue(0, 6, 'Mekan, mahal', 'YER', 'DOWN');
  addClue(0, 8, 'İnce kabuklu...', 'ZAR', 'DOWN');
  addClue(0, 10, 'Suda soluma aracı', 'SOLUNGAÇ', 'DOWN');
  addClue(0, 12, "E. Mısır'da şehir devleti", 'NOM', 'DOWN');

  // ── Row 1 (üstünün altı) ─────────────────────────────
  addClue(1, 0, 'Eski dilde Kasım ayı', 'KASIM', 'DOWN');
  addClue(1, 2, 'Sunulan şey', 'İKRAM', 'DOWN');
  addClue(1, 4, 'Casus. Ajan', 'AJAN', 'DOWN');
  addClue(1, 6, 'Bağnazlık', 'YOBAZ', 'DOWN');
  addClue(1, 8, 'Rezonans', 'YANKI', 'DOWN');
  addClue(1, 14, "Libya'nın plaka işareti", 'LAR', 'DOWN');

  // ── Row 2 ────────────────────────────────────────────
  addClue(2, 0, 'Değerli taşlarla donanmış', 'MÜCEVHERLİ', 'RIGHT');
  addClue(2, 1, "Uranyum'un simgesi", 'U', 'DOWN');
  addClue(2, 3, 'Cihaz', 'ALET', 'RIGHT');
  addClue(2, 8, 'Ölüm Tarihi (Kısaca)', 'ÖT', 'RIGHT');

  // ── Row 3 ────────────────────────────────────────────
  addClue(3, 0, 'Bir bitki türü', 'NANE', 'RIGHT');
  addClue(3, 1, 'Öğütücü diş', 'AZI', 'RIGHT');
  addClue(3, 3, 'Maksimum', 'EN', 'DOWN');
  addClue(3, 4, 'Bir tür makineli...', 'BREN', 'RIGHT');
  addClue(3, 8, 'Öd', 'SAFRA', 'RIGHT');
  addClue(3, 12, 'Kuruş (Kısaca)', 'KR', 'RIGHT');
  addClue(3, 16, 'Ayakkabının üst bölümü', 'SAYA', 'DOWN');

  // ── Row 4 ────────────────────────────────────────────
  addClue(4, 1, 'Operatör', 'CERRAH', 'DOWN');
  addClue(4, 4, 'Eski dilde otlar', 'OT', 'DOWN');
  addClue(4, 12, 'Bir renk', 'KREM', 'DOWN');

  // ── Row 5 ────────────────────────────────────────────
  addClue(5, 0, 'Yiyicilik, rüşvet alma', 'İRTİKAP', 'RIGHT');
  addClue(5, 2, "Tayland'ın plaka işareti", 'T', 'RIGHT');
  addClue(5, 5, "Endonezya'nın para birimi", 'RUPİ', 'RIGHT');
  addClue(5, 10, 'Hadise, vaka', 'OLAY', 'RIGHT');
  addClue(5, 12, 'Parça', 'CÜZ', 'RIGHT');
  addClue(5, 14, 'Utanma duygusu', 'AR', 'DOWN');
  addClue(5, 16, "Arjantin'in plaka işareti", 'RA', 'RIGHT');

  // ── Row 7 ────────────────────────────────────────────
  addClue(7, 5, 'Eski bir çalgı', 'LAVTA', 'RIGHT');

  // ── Boş hücreleri LETTER olarak doldur ──────────────
  const clueCoords = new Set(gridData.map((c) => `${c.row}:${c.col}`));
  for (let r = 0; r < height; r += 1) {
    for (let c = 0; c < width; c += 1) {
      if (!clueCoords.has(`${r}:${c}`)) {
        gridData.push({ row: r, col: c, type: 'LETTER', answer: '' });
      }
    }
  }

  await prisma.puzzle.deleteMany({ where: { title } });

  await prisma.puzzle.create({
    data: {
      title,
      difficulty: 'MEDIUM',
      width,
      height,
      points: 250,
      categoryId: category?.id,
      gridData,
      isActive: true,
    },
  });

  console.log(`✅ ${title} başarıyla eklendi! (${gridData.length} hücre)`);
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
