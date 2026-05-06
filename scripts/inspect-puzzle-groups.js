const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function normalizeTitle(title) {
  return String(title || '').replace(/\s*-\s*\d+\s*$/u, '').trim();
}

async function main() {
  const puzzles = await prisma.puzzle.findMany({
    select: { id: true, title: true, width: true, height: true, points: true, isActive: true },
    orderBy: [{ title: 'asc' }, { createdAt: 'asc' }],
  });

  const groups = new Map();
  for (const p of puzzles) {
    const key = normalizeTitle(p.title);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  }

  const result = Array.from(groups.entries())
    .map(([series, items]) => ({
      series,
      count: items.length,
      items: items.map((p) => ({ title: p.title, width: p.width, height: p.height, points: p.points, isActive: p.isActive, id: p.id })),
    }))
    .sort((a, b) => b.count - a.count || a.series.localeCompare(b.series));

  console.log(JSON.stringify(result, null, 2));
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
