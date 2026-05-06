const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Klasik Seri Bulmacası birleştirmesi geri alınıyor...\n');

  // Birleşik bulmacayı sil
  const merged = await prisma.puzzle.findFirst({
    where: {
      title: 'Klasik Seri Bulmacası (Birleşik)',
    },
  });

  if (merged) {
    await prisma.puzzle.delete({
      where: { id: merged.id },
    });
    console.log(`✅ Birleşik bulmaca silindi: ${merged.title}`);
  }

  // Eski parçaları geri aktif et
  const updated = await prisma.puzzle.updateMany({
    where: {
      title: {
        startsWith: 'Klasik Seri Bulmacası',
      },
      isActive: false,
    },
    data: {
      isActive: true,
    },
  });

  console.log(`✅ ${updated.count} eski parça geri aktif edildi\n`);

  // Kontrol et
  const puzzles = await prisma.puzzle.findMany({
    where: {
      title: {
        startsWith: 'Klasik Seri Bulmacası',
      },
    },
    orderBy: { title: 'asc' },
  });

  console.log(`✨ Aktif Klasik Seri Bulmacaları: ${puzzles.length}`);
  puzzles.forEach((p) => {
    console.log(`   - ${p.title} (${p.width}x${p.height}, ${p.points}⭐, aktif: ${p.isActive})`);
  });

  console.log('\n✅ Geri alma tamamlandı!');
}

main()
  .catch((err) => {
    console.error('❌ Hata:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
