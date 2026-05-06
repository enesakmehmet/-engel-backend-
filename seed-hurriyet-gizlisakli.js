const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.findFirst({
    where: { name: 'Günlük Bulmaca' },
  });

  const gridData = JSON.parse(fs.readFileSync('generated_grid_2.json', 'utf8'));

  const title = 'Hürriyet - Gizli Saklı Bulmacası';

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

  console.log(`✅ ${title} başarıyla eklendi!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
