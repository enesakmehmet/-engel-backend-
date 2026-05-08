const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Toplu Bulmaca Aktarımı Başlıyor (5 Yeni Bulmaca)...');

  const category = await prisma.category.findFirst({ where: { name: 'Genel Kültür' } });
  if (!category) {
    console.log('Kategori bulunamadı! Lütfen önce Genel Kültür kategorisini oluşturun.');
    return;
  }

  const puzzles = [
    {
      title: 'Genel Kültür Bulmacası - 1',
      legacyTitles: ['Yabansı'],
      width: 15,
      height: 9,
      gridData: [
        { row: 0, col: 0, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Yabansı' },
        { row: 1, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Bir şeyin kenarı' },
        { row: 0, col: 3, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Utanma duygusu' },
        { row: 0, col: 11, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Mali\'nin başkenti' },
        { row: 0, col: 10, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Irmak' },
        { row: 0, col: 1, type: 'LETTER', answer: 'E' },
        { row: 1, col: 1, type: 'LETTER', answer: 'G' },
        { row: 2, col: 1, type: 'LETTER', answer: 'Z' },
        { row: 3, col: 1, type: 'LETTER', answer: 'O' },
        { row: 4, col: 1, type: 'LETTER', answer: 'T' },
        { row: 5, col: 1, type: 'LETTER', answer: 'İ' },
        { row: 6, col: 1, type: 'LETTER', answer: 'K' },
        { row: 1, col: 3, type: 'LETTER', answer: 'A' },
        { row: 2, col: 3, type: 'LETTER', answer: 'R' },
        { row: 1, col: 10, type: 'LETTER', answer: 'N' },
        { row: 2, col: 10, type: 'LETTER', answer: 'E' },
        { row: 3, col: 10, type: 'LETTER', answer: 'H' },
        { row: 4, col: 10, type: 'LETTER', answer: 'İ' },
        { row: 5, col: 10, type: 'LETTER', answer: 'R' },
        { row: 1, col: 11, type: 'LETTER', answer: 'B' },
        { row: 2, col: 11, type: 'LETTER', answer: 'A' },
        { row: 3, col: 11, type: 'LETTER', answer: 'M' },
        { row: 4, col: 11, type: 'LETTER', answer: 'A' },
        { row: 5, col: 11, type: 'LETTER', answer: 'K' },
        { row: 6, col: 11, type: 'LETTER', answer: 'O' },
      ]
    },
    {
      title: 'Genel Kültür Bulmacası - 2',
      legacyTitles: ['Uzun Balık Oltası'],
      width: 15,
      height: 9,
      gridData: [
        { row: 0, col: 0, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Uzun balık oltası' },
        { row: 0, col: 2, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Biçem' },
        { row: 7, col: 12, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Alfabenin ilk harfi' },
        { row: 1, col: 2, type: 'LETTER', answer: 'S' },
        { row: 2, col: 2, type: 'LETTER', answer: 'T' },
        { row: 3, col: 2, type: 'LETTER', answer: 'İ' },
        { row: 4, col: 2, type: 'LETTER', answer: 'L' },
        { row: 7, col: 13, type: 'LETTER', answer: 'A' },
      ]
    },
    {
      title: 'Genel Kültür Bulmacası - 3',
      legacyTitles: ['Boğuk Boğuk Ağlama'],
      width: 15,
      height: 9,
      gridData: [
        { row: 0, col: 0, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Boğuk boğuk...' },
        { row: 1, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Talyum simgesi' },
        { row: 0, col: 2, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Posta beygiri' },
        { row: 0, col: 4, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Slayt' },
        { row: 1, col: 1, type: 'LETTER', answer: 'T' },
        { row: 1, col: 2, type: 'LETTER', answer: 'L' },
        { row: 1, col: 2, type: 'LETTER', answer: 'M' },
        { row: 2, col: 2, type: 'LETTER', answer: 'E' },
        { row: 3, col: 2, type: 'LETTER', answer: 'N' },
        { row: 4, col: 2, type: 'LETTER', answer: 'Z' },
        { row: 5, col: 2, type: 'LETTER', answer: 'İ' },
        { row: 6, col: 2, type: 'LETTER', answer: 'L' },
        { row: 1, col: 4, type: 'LETTER', answer: 'D' },
        { row: 2, col: 4, type: 'LETTER', answer: 'İ' },
        { row: 3, col: 4, type: 'LETTER', answer: 'Y' },
        { row: 4, col: 4, type: 'LETTER', answer: 'A' },
      ]
    },
    {
      title: 'Genel Kültür Bulmacası - 4',
      legacyTitles: ['Kadercilik'],
      width: 15,
      height: 9,
      gridData: [
        { row: 0, col: 0, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Kadercilik' },
        { row: 1, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Japon Mafyası' },
        { row: 3, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Gürültü, patırtı' },
        { row: 5, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Lüksemburg plaka' },
        { row: 1, col: 1, type: 'LETTER', answer: 'Y' },
        { row: 1, col: 2, type: 'LETTER', answer: 'A' },
        { row: 1, col: 3, type: 'LETTER', answer: 'K' },
        { row: 1, col: 4, type: 'LETTER', answer: 'U' },
        { row: 1, col: 5, type: 'LETTER', answer: 'Z' },
        { row: 1, col: 6, type: 'LETTER', answer: 'A' },
        { row: 3, col: 1, type: 'LETTER', answer: 'Ş' },
        { row: 3, col: 2, type: 'LETTER', answer: 'A' },
        { row: 3, col: 3, type: 'LETTER', answer: 'M' },
        { row: 3, col: 4, type: 'LETTER', answer: 'A' },
        { row: 3, col: 5, type: 'LETTER', answer: 'T' },
        { row: 3, col: 6, type: 'LETTER', answer: 'A' },
        { row: 5, col: 1, type: 'LETTER', answer: 'L' },
      ]
    },
  ];

  for (const p of puzzles) {
    await prisma.puzzle.deleteMany({
      where: {
        title: {
          in: [p.title, ...(p.legacyTitles || [])],
        },
      },
    });

    try {
      const created = await prisma.puzzle.create({
        data: {
          title: p.title,
          categoryId: category.id,
          difficulty: 'MEDIUM',
          width: p.width,
          height: p.height,
          gridData: p.gridData,
        },
      });
      console.log(`✅ ${p.title} bulmacası eklendi! ID: ${created.id}`);
    } catch (error) {
      console.error(`❌ ${p.title} eklenirken hata oluştu:`, error.message);
    }
  }

  console.log('Toplu aktarım tamamlandı.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
