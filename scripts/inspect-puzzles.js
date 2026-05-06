const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const puzzles = await prisma.puzzle.findMany({
    select: {
      id: true,
      title: true,
      difficulty: true,
      width: true,
      height: true,
      points: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: [{ title: 'asc' }, { createdAt: 'asc' }],
  });

  console.log(JSON.stringify(puzzles, null, 2));
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
