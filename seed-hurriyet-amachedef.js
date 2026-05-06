const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.findFirst({
    where: { name: 'Günlük Bulmaca' },
  });

  const gridData = JSON.parse(fs.readFileSync('generated_grid.json', 'utf8'));

  const title = 'Hürriyet - Amaç Hedef Bulmacası';

  await prisma.puzzle.deleteMany({
    where: { title: title },
  });

  await prisma.puzzle.create({
    data: {
      title: title,
      difficulty: 'HARD',
      width: 15,
      height: 15,
      points: 200,
      categoryId: category?.id,
      gridData: gridData,
      isActive: true,
    },
  });

  console.log(`✅ ${title} başarıyla eklendi! Resimdeki sorular birebir aktarıldı.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
