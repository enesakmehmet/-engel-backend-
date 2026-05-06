const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find category "Günlük Bulmaca"
  const category = await prisma.category.findFirst({
    where: { name: 'Günlük Bulmaca' },
  });

  const gridData = [
    // ROW 0
    { row: 0, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Zorla\nalma', ans: 'GASP' },
    { row: 0, col: 1, type: 'LETTER', answer: 'G' },
    { row: 0, col: 2, type: 'LETTER', answer: 'A' },
    { row: 0, col: 3, type: 'LETTER', answer: 'S' },
    { row: 0, col: 4, type: 'LETTER', answer: 'P' },
    { row: 0, col: 5, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Yön' },
    { row: 0, col: 6, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Çok yiyen,\nobur', ans: 'OBUR' },
    { row: 0, col: 7, type: 'LETTER', answer: 'O' },
    { row: 0, col: 8, type: 'LETTER', answer: 'B' },
    { row: 0, col: 9, type: 'LETTER', answer: 'U' },
    { row: 0, col: 10, type: 'LETTER', answer: 'R' },
    { row: 0, col: 11, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Sayı' },
    { row: 0, col: 12, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Boru sesi', ans: 'Tİ' },
    { row: 0, col: 13, type: 'LETTER', answer: 'T' },
    { row: 0, col: 14, type: 'LETTER', answer: 'İ' },

    // ROW 1
    { row: 1, col: 0, type: 'BLOCK' },
    { row: 1, col: 1, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Kısır\ndöngü', ans: 'FAK' },
    { row: 1, col: 2, type: 'LETTER', answer: 'F' },
    { row: 1, col: 3, type: 'LETTER', answer: 'A' },
    { row: 1, col: 4, type: 'LETTER', answer: 'K' },
    { row: 1, col: 5, type: 'LETTER', answer: 'A' },
    { row: 1, col: 6, type: 'BLOCK' },
    { row: 1, col: 7, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Neşeli\nolmak', ans: 'ŞEN' },
    { row: 1, col: 8, type: 'LETTER', answer: 'Ş' },
    { row: 1, col: 9, type: 'LETTER', answer: 'E' },
    { row: 1, col: 10, type: 'LETTER', answer: 'N' },
    { row: 1, col: 11, type: 'LETTER', answer: 'B' },
    { row: 1, col: 12, type: 'BLOCK' },
    { row: 1, col: 13, type: 'BLOCK' },
    { row: 1, col: 14, type: 'BLOCK' },

    // ROW 2
    { row: 2, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Ut çalan\nçalgıcı', ans: 'UDİ' },
    { row: 2, col: 1, type: 'LETTER', answer: 'U' },
    { row: 2, col: 2, type: 'LETTER', answer: 'D' },
    { row: 2, col: 3, type: 'LETTER', answer: 'İ' },
    { row: 2, col: 4, type: 'CLUE', arrowDir: 'DOWN', clueText: 'İri' },
    { row: 2, col: 5, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Sıvı', ans: 'KAN' },
    { row: 2, col: 6, type: 'LETTER', answer: 'K' },
    { row: 2, col: 7, type: 'LETTER', answer: 'A' },
    { row: 2, col: 8, type: 'LETTER', answer: 'N' },
    { row: 2, col: 9, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Yonga' },
    { row: 2, col: 10, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Bitki', ans: 'OT' },
    { row: 2, col: 11, type: 'LETTER', answer: 'O' },
    { row: 2, col: 12, type: 'LETTER', answer: 'T' },
    { row: 2, col: 13, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Şarkı' },
    { row: 2, col: 14, type: 'LETTER', answer: 'Ş' },

    // ROW 3
    { row: 3, col: 0, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Meyve' },
    { row: 3, col: 1, type: 'LETTER', answer: 'B' },
    { row: 3, col: 2, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'İri', ans: 'İRİ' },
    { row: 3, col: 3, type: 'LETTER', answer: 'İ' },
    { row: 3, col: 4, type: 'LETTER', answer: 'R' },
    { row: 3, col: 5, type: 'LETTER', answer: 'İ' },
    { row: 3, col: 6, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Yasaklama', ans: 'MEN' },
    { row: 3, col: 7, type: 'LETTER', answer: 'M' },
    { row: 3, col: 8, type: 'LETTER', answer: 'E' },
    { row: 3, col: 9, type: 'LETTER', answer: 'N' },
    { row: 3, col: 10, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Sıcak\niçecek', ans: 'ÇAY' },
    { row: 3, col: 11, type: 'LETTER', answer: 'Ç' },
    { row: 3, col: 12, type: 'LETTER', answer: 'A' },
    { row: 3, col: 13, type: 'LETTER', answer: 'Y' },
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
    { row: 5, col: 6, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Bitki öz\nsuyu', ans: 'SU' },
    { row: 5, col: 7, type: 'LETTER', answer: 'S' },
    { row: 5, col: 8, type: 'LETTER', answer: 'U' },
    { row: 5, col: 9, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Asker' },
    { row: 5, col: 10, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Ot', ans: 'OT' },
    { row: 5, col: 11, type: 'LETTER', answer: 'O' },
    { row: 5, col: 12, type: 'LETTER', answer: 'T' },
    { row: 5, col: 13, type: 'LETTER', answer: 'S' },
    { row: 5, col: 14, type: 'LETTER', answer: 'N' },

    // ROW 6
    { row: 6, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'İki', ans: 'SU' },
    { row: 6, col: 1, type: 'LETTER', answer: 'S' },
    { row: 6, col: 2, type: 'LETTER', answer: 'U' },
    { row: 6, col: 3, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Hayvan', ans: 'AT' },
    { row: 6, col: 4, type: 'LETTER', answer: 'A' },
    { row: 6, col: 5, type: 'LETTER', answer: 'T' },
    { row: 6, col: 6, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Ara' },
    { row: 6, col: 7, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Kas', ans: 'ET' },
    { row: 6, col: 8, type: 'LETTER', answer: 'E' },
    { row: 6, col: 9, type: 'LETTER', answer: 'T' },
    { row: 6, col: 10, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Fizikte iş\nbirimi', ans: 'ERG' },
    { row: 6, col: 11, type: 'LETTER', answer: 'E' },
    { row: 6, col: 12, type: 'LETTER', answer: 'R' },
    { row: 6, col: 13, type: 'LETTER', answer: 'G' },
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

  const title = 'Genel Kültür Bulmacası - 7';

  await prisma.puzzle.deleteMany({
    where: {
      title: {
        in: ['Hürriyet Gazetesi: Veri Bulmacası', title],
      },
    },
  });

  await prisma.puzzle.create({
    data: {
      title: title,
      difficulty: 'MEDIUM',
      width: 15,
      height: 9,
      points: 120,
      categoryId: category?.id,
      gridData: gridData,
      isActive: true,
    },
  });

  console.log(`✅ ${title} başarıyla eklendi! Resimdeki sorular eklendi.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
