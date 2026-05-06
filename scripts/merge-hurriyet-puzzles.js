const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function normalizePuzzleTitle(title) {
  return String(title || '').replace(/\s*-\s*\d+\s*$/u, '').trim();
}

function getPuzzlePartNumber(title) {
  const match = String(title || '').match(/-\s*(\d+)\s*$/u);
  return match ? Number(match[1]) : 1;
}

function mergePuzzleGrids(puzzles) {
  if (!puzzles || puzzles.length === 0) return [];

  // Tüm puzzle'ları parça numarasına göre sırala
  const sorted = puzzles.sort((a, b) => {
    const partA = getPuzzlePartNumber(a.title);
    const partB = getPuzzlePartNumber(b.title);
    return partA - partB;
  });

  let mergedGrid = [];
  let rowOffset = 0;

  for (const puzzle of sorted) {
    let gridData = [];
    try {
      gridData = typeof puzzle.gridData === 'string' 
        ? JSON.parse(puzzle.gridData) 
        : (Array.isArray(puzzle.gridData) ? puzzle.gridData : []);
    } catch (e) {
      console.warn(`⚠️  ${puzzle.title} grid parse hatası:`, e.message);
      continue;
    }

    if (!Array.isArray(gridData)) continue;

    // Her puzzle'ın hücrelerini offset ile birleştir
    for (const cell of gridData) {
      const newCell = {
        ...cell,
        row: (cell.row || 0) + rowOffset,
      };
      mergedGrid.push(newCell);
    }

    // Sonraki puzzle için row offset'i artır
    const maxRow = Math.max(...gridData.map(c => c.row || 0), -1);
    rowOffset += maxRow + 2; // 1 satır boşluk bırak
  }

  return mergedGrid;
}

async function main() {
  console.log('🔍 Klasik Seri Bulmaca serisi taranıyor...\n');

  // Klasik Seri Bulmaca serisini bul
  const hurriyet = await prisma.puzzle.findMany({
    where: {
      title: {
        startsWith: 'Klasik Seri Bulmacası',
      },
    },
    orderBy: { title: 'asc' },
  });

  if (hurriyet.length === 0) {
    console.log('❌ Klasik Seri Bulmaca serisi bulunamadı.');
    await prisma.$disconnect();
    return;
  }

  console.log(`✅ ${hurriyet.length} parça bulundu:`);
  hurriyet.forEach((p) => {
    console.log(`   - ${p.title} (${p.width}x${p.height}, ${p.points}⭐)`);
  });
  console.log();

  // Grid'leri birleştir
  console.log('🔗 Grid\'ler birleştiriliyor...');
  const mergedGrid = mergePuzzleGrids(hurriyet);
  console.log(`✅ Birleşik grid oluşturuldu: ${mergedGrid.length} hücre\n`);

  // Birleşik bulmaca için yeni boyutlar hesapla
  const maxRow = Math.max(...mergedGrid.map(c => c.row || 0), 0);
  const maxCol = Math.max(...mergedGrid.map(c => c.col || 0), 0);
  const newWidth = maxCol + 1;
  const newHeight = maxRow + 1;

  console.log(`📐 Yeni boyutlar: ${newWidth}x${newHeight}`);
  console.log(`📊 Toplam yıldız: ${hurriyet.reduce((sum, p) => sum + (p.points || 0), 0)}\n`);

  // Birleşik bulmacayı oluştur
  const mergedTitle = 'Klasik Seri Bulmacası (Birleşik)';
  const totalPoints = hurriyet.reduce((sum, p) => sum + (p.points || 0), 0);

  console.log(`💾 Birleşik bulmaca kaydediliyor: "${mergedTitle}"`);
  
  const merged = await prisma.puzzle.create({
    data: {
      title: mergedTitle,
      difficulty: hurriyet[0].difficulty || 'MEDIUM',
      width: newWidth,
      height: newHeight,
      points: totalPoints,
      gridData: mergedGrid,
      categoryId: hurriyet[0].categoryId,
      isActive: true,
    },
  });

  console.log(`✅ Birleşik bulmaca oluşturuldu! ID: ${merged.id}\n`);

  // Eski parçaları deaktif et
  console.log('🔄 Eski parçalar deaktif ediliyor...');
  const updated = await prisma.puzzle.updateMany({
    where: {
      id: {
        in: hurriyet.map(p => p.id),
      },
    },
    data: {
      isActive: false,
    },
  });

  console.log(`✅ ${updated.count} parça deaktif edildi\n`);

  console.log('✨ Birleştirme tamamlandı!');
  console.log(`   Birleşik bulmaca: ${mergedTitle}`);
  console.log(`   Boyut: ${newWidth}x${newHeight}`);
  console.log(`   Yıldız: ${totalPoints}`);
  console.log(`   Hücre sayısı: ${mergedGrid.length}`);
}

main()
  .catch((err) => {
    console.error('❌ Hata:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
