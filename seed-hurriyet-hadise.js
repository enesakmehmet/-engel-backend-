const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.findFirst({
    where: { name: 'Günlük Bulmaca' },
  });

  const gridData = JSON.parse(fs.readFileSync('generated_grid_3.json', 'utf8'));

  const title = 'Hürriyet - Olay Bulmacası';

  await prisma.puzzle.deleteMany({
    where: { title: title },
  });

  await prisma.puzzle.create({
    data: {
      title: title,
      difficulty: 'HARD',
      width: 16,
      height: 16,
      points: 200,
      categoryId: category?.id,
      gridData: gridData,
      isActive: true,
    },
  });

  console.log(`✅ ${title} başarıyla eklendi! Resimsiz ve net soru/cevaplarla admin panele entegre edildi.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
