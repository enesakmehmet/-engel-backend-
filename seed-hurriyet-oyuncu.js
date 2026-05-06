const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.findFirst({
    where: { name: 'Günlük Bulmaca' },
  });

  const gridData = JSON.parse(fs.readFileSync('generated_grid_4.json', 'utf8'));

  const title = 'Hürriyet - Oyuncu Bulmacası';

  await prisma.puzzle.deleteMany({
    where: { title: title },
  });

  await prisma.puzzle.create({
    data: {
      title: title,
      difficulty: 'HARD',
      width: 18,
      height: 18,
      points: 250,
      categoryId: category?.id,
      gridData: gridData,
      isActive: true,
    },
  });

  console.log(`✅ ${title} başarıyla eklendi! Resimsiz kurgu ile eklendi.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
