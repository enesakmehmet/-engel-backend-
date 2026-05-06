const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧩 15x9 Yoğun çengel bulmaca ekleniyor...');

  const category = await prisma.category.findFirst({ where: { name: 'Genel Kültür' } });

  const gridData = [
    // ROW 0
    { row: 0, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Yanıcı', ans: 'ATEŞ' },
    { row: 0, col: 1, type: 'LETTER', answer: 'A' },
    { row: 0, col: 2, type: 'LETTER', answer: 'T' },
    { row: 0, col: 3, type: 'LETTER', answer: 'E' },
    { row: 0, col: 4, type: 'LETTER', answer: 'Ş' },
    { row: 0, col: 5, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Su ortası', ans: 'ADA' },
    { row: 0, col: 6, type: 'LETTER', answer: 'A' },
    { row: 0, col: 7, type: 'LETTER', answer: 'D' },
    { row: 0, col: 8, type: 'LETTER', answer: 'A' },
    { row: 0, col: 9, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Temiz', ans: 'PAK' },
    { row: 0, col: 10, type: 'LETTER', answer: 'P' },
    { row: 0, col: 11, type: 'LETTER', answer: 'A' },
    { row: 0, col: 12, type: 'LETTER', answer: 'K' },
    { row: 0, col: 13, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Dağ' },
    { row: 0, col: 14, type: 'CLUE', arrowDir: 'DOWN', clueText: 'İl' },

    // ROW 1
    { row: 1, col: 0, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Taşıt' },
    { row: 1, col: 1, type: 'LETTER', answer: 'R' },
    { row: 1, col: 2, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Tepe' },
    { row: 1, col: 3, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Zaman', ans: 'AN' },
    { row: 1, col: 4, type: 'LETTER', answer: 'A' },
    { row: 1, col: 5, type: 'LETTER', answer: 'N' },
    { row: 1, col: 6, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Renk' },
    { row: 1, col: 7, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Rakam', ans: 'İKİ' },
    { row: 1, col: 8, type: 'LETTER', answer: 'İ' },
    { row: 1, col: 9, type: 'LETTER', answer: 'K' },
    { row: 1, col: 10, type: 'LETTER', answer: 'İ' },
    { row: 1, col: 11, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Sayı' },
    { row: 1, col: 12, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Büyük', ans: 'İRİ' },
    { row: 1, col: 13, type: 'LETTER', answer: 'İ' },
    { row: 1, col: 14, type: 'LETTER', answer: 'R' },

    // ROW 2
    { row: 2, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Kumaş', ans: 'ABA' },
    { row: 2, col: 1, type: 'LETTER', answer: 'A' },
    { row: 2, col: 2, type: 'LETTER', answer: 'B' },
    { row: 2, col: 3, type: 'LETTER', answer: 'A' },
    { row: 2, col: 4, type: 'CLUE', arrowDir: 'DOWN', clueText: 'İri' },
    { row: 2, col: 5, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Sıvı', ans: 'KAN' },
    { row: 2, col: 6, type: 'LETTER', answer: 'K' },
    { row: 2, col: 7, type: 'LETTER', answer: 'A' },
    { row: 2, col: 8, type: 'LETTER', answer: 'N' },
    { row: 2, col: 9, type: 'CLUE', arrowDir: 'DOWN', clueText: 'İl' },
    { row: 2, col: 10, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Bitki', ans: 'OT' },
    { row: 2, col: 11, type: 'LETTER', answer: 'O' },
    { row: 2, col: 12, type: 'LETTER', answer: 'T' },
    { row: 2, col: 13, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Şarkı' },
    { row: 2, col: 14, type: 'LETTER', answer: 'İ' },

    // ROW 3
    { row: 3, col: 0, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Meyve' },
    { row: 3, col: 1, type: 'LETTER', answer: 'B' },
    { row: 3, col: 2, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'İri', ans: 'İRİ' },
    { row: 3, col: 3, type: 'LETTER', answer: 'İ' },
    { row: 3, col: 4, type: 'LETTER', answer: 'R' },
    { row: 3, col: 5, type: 'LETTER', answer: 'İ' },
    { row: 3, col: 6, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Kış', ans: 'KAR' },
    { row: 3, col: 7, type: 'LETTER', answer: 'K' },
    { row: 3, col: 8, type: 'LETTER', answer: 'A' },
    { row: 3, col: 9, type: 'LETTER', answer: 'R' },
    { row: 3, col: 10, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Ev', ans: 'ODA' },
    { row: 3, col: 11, type: 'LETTER', answer: 'O' },
    { row: 3, col: 12, type: 'LETTER', answer: 'D' },
    { row: 3, col: 13, type: 'LETTER', answer: 'A' },
    { row: 3, col: 14, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Yön' },

    // ROW 4
    { row: 4, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Kırmızı', ans: 'AL' },
    { row: 4, col: 1, type: 'LETTER', answer: 'A' },
    { row: 4, col: 2, type: 'LETTER', answer: 'L' },
    { row: 4, col: 3, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Haber' },
    { row: 4, col: 4, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'İl', ans: 'İL' },
    { row: 4, col: 5, type: 'LETTER', answer: 'İ' },
    { row: 4, col: 6, type: 'LETTER', answer: 'L' },
    { row: 4, col: 7, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Uzuv', ans: 'EL' },
    { row: 4, col: 8, type: 'LETTER', answer: 'E' },
    { row: 4, col: 9, type: 'LETTER', answer: 'L' },
    { row: 4, col: 10, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Ad', ans: 'AD' },
    { row: 4, col: 11, type: 'LETTER', answer: 'A' },
    { row: 4, col: 12, type: 'LETTER', answer: 'D' },
    { row: 4, col: 13, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Su' },
    { row: 4, col: 14, type: 'LETTER', answer: 'E' },

    // ROW 5
    { row: 5, col: 0, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Sıvı' },
    { row: 5, col: 1, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Anne', ans: 'ANA' },
    { row: 5, col: 2, type: 'LETTER', answer: 'A' },
    { row: 5, col: 3, type: 'LETTER', answer: 'N' },
    { row: 5, col: 4, type: 'LETTER', answer: 'A' },
    { row: 5, col: 5, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Binek' },
    { row: 5, col: 6, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Yay', ans: 'OK' },
    { row: 5, col: 7, type: 'LETTER', answer: 'O' },
    { row: 5, col: 8, type: 'LETTER', answer: 'K' },
    { row: 5, col: 9, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Asker' },
    { row: 5, col: 10, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Ot', ans: 'OT' },
    { row: 5, col: 11, type: 'LETTER', answer: 'O' },
    { row: 5, col: 12, type: 'LETTER', answer: 'T' },
    { row: 5, col: 13, type: 'LETTER', answer: 'S' },
    { row: 5, col: 14, type: 'LETTER', answer: 'N' },

    // ROW 6
    { row: 6, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'İçki', ans: 'SU' },
    { row: 6, col: 1, type: 'LETTER', answer: 'S' },
    { row: 6, col: 2, type: 'LETTER', answer: 'U' },
    { row: 6, col: 3, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Hayvan', ans: 'AT' },
    { row: 6, col: 4, type: 'LETTER', answer: 'A' },
    { row: 6, col: 5, type: 'LETTER', answer: 'T' },
    { row: 6, col: 6, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Ara' },
    { row: 6, col: 7, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Kas', ans: 'ET' },
    { row: 6, col: 8, type: 'LETTER', answer: 'E' },
    { row: 6, col: 9, type: 'LETTER', answer: 'T' },
    { row: 6, col: 10, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Birlik', ans: 'BİR' },
    { row: 6, col: 11, type: 'LETTER', answer: 'B' },
    { row: 6, col: 12, type: 'LETTER', answer: 'İ' },
    { row: 6, col: 13, type: 'LETTER', answer: 'R' },
    { row: 6, col: 14, type: 'BLOCK' },

    // ROW 7
    { row: 7, col: 0, type: 'BLOCK' },
    { row: 7, col: 1, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Meyve', ans: 'NAR' },
    { row: 7, col: 2, type: 'LETTER', answer: 'N' },
    { row: 7, col: 3, type: 'LETTER', answer: 'A' },
    { row: 7, col: 4, type: 'LETTER', answer: 'R' },
    { row: 7, col: 5, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Aniden', ans: 'ANİ' },
    { row: 7, col: 6, type: 'LETTER', answer: 'A' },
    { row: 7, col: 7, type: 'LETTER', answer: 'N' },
    { row: 7, col: 8, type: 'LETTER', answer: 'İ' },
    { row: 7, col: 9, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Olumsuz' },
    { row: 7, col: 10, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Şehir', ans: 'İL' },
    { row: 7, col: 11, type: 'LETTER', answer: 'İ' },
    { row: 7, col: 12, type: 'LETTER', answer: 'L' },
    { row: 7, col: 13, type: 'BLOCK' },
    { row: 7, col: 14, type: 'BLOCK' },

    // ROW 8
    { row: 8, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Kol', ans: 'EL' },
    { row: 8, col: 1, type: 'LETTER', answer: 'E' },
    { row: 8, col: 2, type: 'LETTER', answer: 'L' },
    { row: 8, col: 3, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Beyaz', ans: 'AK' },
    { row: 8, col: 4, type: 'LETTER', answer: 'A' },
    { row: 8, col: 5, type: 'LETTER', answer: 'K' },
    { row: 8, col: 6, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Mesafe', ans: 'ARA' },
    { row: 8, col: 7, type: 'LETTER', answer: 'A' },
    { row: 8, col: 8, type: 'LETTER', answer: 'R' },
    { row: 8, col: 9, type: 'LETTER', answer: 'A' },
    { row: 8, col: 10, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Yabancı', ans: 'EL' },
    { row: 8, col: 11, type: 'LETTER', answer: 'E' },
    { row: 8, col: 12, type: 'LETTER', answer: 'L' },
    { row: 8, col: 13, type: 'BLOCK' },
    { row: 8, col: 14, type: 'BLOCK' },
  ];

  const title = 'Genel Kültür Bulmacası - 5';

  await prisma.puzzle.deleteMany({
    where: {
      title: {
        in: ['Hürriyet Gazetesi: Veri Bulmacası', title],
      },
    },
  });

  // Delete existing broken puzzle
  await prisma.puzzle.create({
    data: {
      title: title,
      difficulty: 'MEDIUM',
      width: 15,
      height: 9,
      points: 100,
      categoryId: category?.id,
      gridData: gridData,
      isActive: true,
    },
  });

  console.log(`✅ ${title} başarıyla eklendi!`);
  
  const blocks = gridData.filter(c => c.type === 'BLOCK').length;
  const clues = gridData.filter(c => c.type === 'CLUE').length;
  const letters = gridData.filter(c => c.type === 'LETTER').length;
  console.log(`📊 Grid: 15x9, Toplam hücre: 135`);
  console.log(`   BLOCK: ${blocks}, CLUE: ${clues}, LETTER: ${letters}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
