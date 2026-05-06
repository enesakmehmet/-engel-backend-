const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Birleşik bulmaca doğrulanıyor...\n');

  // Birleşik bulmacayı bul
  const merged = await prisma.puzzle.findFirst({
    where: {
      title: 'Klasik Seri Bulmacası (Birleşik)',
    },
  });

  if (!merged) {
    console.log('❌ Birleşik bulmaca bulunamadı.');
    await prisma.$disconnect();
    return;
  }

  let gridData = [];
  try {
    gridData = typeof merged.gridData === 'string' 
      ? JSON.parse(merged.gridData) 
      : (Array.isArray(merged.gridData) ? merged.gridData : []);
  } catch (e) {
    console.log('❌ Grid parse hatası:', e.message);
    await prisma.$disconnect();
    return;
  }

  const clues = gridData.filter(c => c.type === 'CLUE');
  const letters = gridData.filter(c => c.type === 'LETTER');
  const blocks = gridData.filter(c => c.type === 'BLOCK');

  console.log('✅ Birleşik Bulmaca Bilgileri:');
  console.log(`   Başlık: ${merged.title}`);
  console.log(`   Boyut: ${merged.width}x${merged.height}`);
  console.log(`   Yıldız: ${merged.points}`);
  console.log(`   Zorluk: ${merged.difficulty}`);
  console.log(`   Aktif: ${merged.isActive}`);
  console.log();

  console.log('📊 Grid İstatistikleri:');
  console.log(`   Toplam hücre: ${gridData.length}`);
  console.log(`   İpuçları (CLUE): ${clues.length}`);
  console.log(`   Harfler (LETTER): ${letters.length}`);
  console.log(`   Bloklar (BLOCK): ${blocks.length}`);
  console.log();

  // Örnek ipuçları göster
  console.log('📝 İlk 5 İpucu:');
  clues.slice(0, 5).forEach((clue, idx) => {
    console.log(`   ${idx + 1}. "${clue.clueText}" (${clue.arrowDir}) @ (${clue.row}, ${clue.col})`);
  });
  console.log();

  // Eski parçaları kontrol et
  const oldPuzzles = await prisma.puzzle.findMany({
    where: {
      title: {
        startsWith: 'Klasik Seri Bulmaca',
      },
      isActive: false,
    },
  });

  console.log(`🔒 Deaktif Parçalar: ${oldPuzzles.length}`);
  oldPuzzles.forEach((p) => {
    console.log(`   - ${p.title}`);
  });
  console.log();

  // Aktif Hürriyet bulmacalarını kontrol et
  const activePuzzles = await prisma.puzzle.findMany({
    where: {
      title: {
        startsWith: 'Klasik Seri Bulmaca',
      },
      isActive: true,
    },
  });

  console.log(`✅ Aktif Klasik Seri Bulmacaları: ${activePuzzles.length}`);
  activePuzzles.forEach((p) => {
    console.log(`   - ${p.title} (${p.width}x${p.height})`);
  });
  console.log();

  console.log('✨ Doğrulama tamamlandı!');
}

main()
  .catch((err) => {
    console.error('❌ Hata:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
