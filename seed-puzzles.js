const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Bulmaca (Puzzle) ekleniyor...');

  const category = await prisma.category.findFirst({ where: { name: 'Genel Kültür' } });

  const puzzles = [
    {
      title: 'Haftanın Kolay Bulmacası',
      difficulty: 'EASY',
      width: 7,
      height: 6,
      points: 50,
      categoryId: category?.id,
      gridData: [
        { row: 0, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Bir Renge Adını Veren Meyve', answer: 'TURUNÇ' },
        { row: 0, col: 1, type: 'LETTER', answer: 'T' },
        { row: 0, col: 2, type: 'LETTER', answer: 'U' },
        { row: 0, col: 3, type: 'LETTER', answer: 'R' },
        { row: 0, col: 4, type: 'LETTER', answer: 'U' },
        { row: 0, col: 5, type: 'LETTER', answer: 'N' },
        { row: 0, col: 6, type: 'LETTER', answer: 'Ç' },
        { row: 1, col: 0, type: 'BLOCK' },
        { row: 1, col: 1, type: 'BLOCK' },
        { row: 1, col: 2, type: 'BLOCK' },
        { row: 1, col: 3, type: 'BLOCK' },
        { row: 1, col: 4, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Gökyüzü Rengi', answer: 'MAVİ' },
        { row: 1, col: 5, type: 'BLOCK' },
        { row: 1, col: 6, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Beyaz Zıddı', answer: 'KARA' },
        { row: 2, col: 0, type: 'BLOCK' },
        { row: 2, col: 1, type: 'BLOCK' },
        { row: 2, col: 2, type: 'BLOCK' },
        { row: 2, col: 3, type: 'BLOCK' },
        { row: 2, col: 4, type: 'LETTER', answer: 'M' },
        { row: 2, col: 5, type: 'BLOCK' },
        { row: 2, col: 6, type: 'LETTER', answer: 'K' },
        { row: 3, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Başkentimiz', answer: 'ANKARA' },
        { row: 3, col: 1, type: 'LETTER', answer: 'A' },
        { row: 3, col: 2, type: 'LETTER', answer: 'N' },
        { row: 3, col: 3, type: 'LETTER', answer: 'K' },
        { row: 3, col: 4, type: 'LETTER', answer: 'A' },
        { row: 3, col: 5, type: 'LETTER', answer: 'R' },
        { row: 3, col: 6, type: 'LETTER', answer: 'A' },
        { row: 4, col: 0, type: 'BLOCK' },
        { row: 4, col: 1, type: 'BLOCK' },
        { row: 4, col: 2, type: 'BLOCK' },
        { row: 4, col: 3, type: 'BLOCK' },
        { row: 4, col: 4, type: 'LETTER', answer: 'V' },
        { row: 4, col: 5, type: 'BLOCK' },
        { row: 4, col: 6, type: 'LETTER', answer: 'R' },
        { row: 5, col: 0, type: 'BLOCK' },
        { row: 5, col: 1, type: 'BLOCK' },
        { row: 5, col: 2, type: 'BLOCK' },
        { row: 5, col: 3, type: 'BLOCK' },
        { row: 5, col: 4, type: 'LETTER', answer: 'İ' },
        { row: 5, col: 5, type: 'BLOCK' },
        { row: 5, col: 6, type: 'LETTER', answer: 'A' }
      ]
    },
    {
      title: 'Tarih Rüzgarı',
      difficulty: 'HARD',
      width: 4,
      height: 4,
      points: 200,
      categoryId: category?.id,
      gridData: [
        { row: 0, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Eski Bir Medeniyet', answer: 'ROM' },
        { row: 0, col: 1, type: 'LETTER', answer: 'R' },
        { row: 0, col: 2, type: 'LETTER', answer: 'O' },
        { row: 0, col: 3, type: 'LETTER', answer: 'M' },
        { row: 1, col: 0, type: 'BLOCK' },
        { row: 1, col: 1, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Bir Tarih Dönemi', answer: 'ÇAĞ' },
        { row: 1, col: 2, type: 'BLOCK' },
        { row: 1, col: 3, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Eski Mısır Kralı', answer: 'FIRAVUN' },
        { row: 2, col: 0, type: 'BLOCK' },
        { row: 2, col: 1, type: 'LETTER', answer: 'Ç' },
        { row: 2, col: 2, type: 'BLOCK' },
        { row: 2, col: 3, type: 'LETTER', answer: 'F' },
        { row: 3, col: 0, type: 'BLOCK' },
        { row: 3, col: 1, type: 'LETTER', answer: 'A' },
        { row: 3, col: 2, type: 'BLOCK' },
        { row: 3, col: 3, type: 'LETTER', answer: 'R' }
      ]
    }
  ];

  for (const p of puzzles) {
    const result = await prisma.puzzle.updateMany({
      where: { title: p.title },
      data: {
        title: p.title,
        difficulty: p.difficulty,
        width: p.width,
        height: p.height,
        points: p.points,
        categoryId: p.categoryId,
        gridData: p.gridData,
        isActive: true,
      },
    });

    if (result.count > 0) {
      console.log(`~ ${p.title} güncellendi (${result.count} kayıt)`);
    } else {
      await prisma.puzzle.create({ data: p });
      console.log(`+ ${p.title} eklendi`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
