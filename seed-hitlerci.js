const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seyrüsefer Bulmacası ekleniyor...');

  const category = await prisma.category.findFirst({ where: { name: 'Genel Kültür' } });
  if (!category) {
    console.log('Kategori bulunamadı, lütfen önce kategorileri oluşturun.');
    return;
  }

  const width = 17;
  const height = 15;

  const gridData = Array.from({ length: height }, (_, row) =>
    Array.from({ length: width }, (_, col) => ({ row, col, type: 'BLOCK' }))
  ).flat();

  const setCell = (row, col, cell) => {
    const index = row * width + col;
    gridData[index] = { row, col, ...cell };
  };

  const placeClue = (row, col, clueText, answer) => {
    const cleanAnswer = String(answer || '').toUpperCase().replace(/\s+/g, '');

    setCell(row, col, {
      type: 'CLUE',
      arrowDir: 'RIGHT',
      clueText,
      answer: cleanAnswer,
    });

    for (let i = 0; i < cleanAnswer.length; i += 1) {
      setCell(row, col + i + 1, {
        type: 'LETTER',
        answer: cleanAnswer[i],
      });
    }
  };

  placeClue(0, 0, 'Seyrüsefer', 'TRAFIK');
  placeClue(0, 8, "Zirkonyum'un simgesi", 'ZR');

  placeClue(1, 0, 'Lokanta', 'RESTORAN');
  placeClue(1, 10, 'Nine (halk ağzı)', 'NENE');

  placeClue(2, 0, 'Ana ırmağa karışan akarsu', 'GELEĞEN');
  placeClue(2, 10, 'Eski bir hacim ölçüsü', 'KA');

  placeClue(3, 0, 'Arap reisinin evi', 'ZAMALA');
  placeClue(3, 10, 'Sayma, sayılma', 'AD');

  placeClue(4, 0, 'İki tepe arası', 'BOĞAZ');
  placeClue(4, 10, 'Amerika Birleşik Devletleri', 'ABD');

  placeClue(5, 0, 'Mihrak (fizik)', 'ODAK');
  placeClue(5, 10, 'Bakraç', 'HELKE');

  placeClue(6, 0, 'Yayla', 'PLATO');
  placeClue(6, 6, 'Tepki', 'REAKSİYON');

  placeClue(7, 0, 'Kıranlar', 'AFAT');
  placeClue(7, 8, 'Bir cins orkide', 'ADA');

  placeClue(8, 0, 'Sunulan şey', 'İKRAM');
  placeClue(8, 10, 'Tavır, davranış', 'EDA');

  placeClue(9, 0, 'Bir tür iskambil oyunu', 'BRİÇ');
  placeClue(9, 8, 'Dinle', 'İŞİT');

  placeClue(10, 0, 'Baba, şeyh, önder', 'BAB');
  placeClue(10, 6, 'Tanrı', 'İLAH');
  placeClue(10, 12, 'Bunama', 'KISIT');

  placeClue(11, 0, 'Vietnam krallık hanedanı', 'LE');
  placeClue(11, 5, '01 plakalı ilimiz', 'ADANA');

  placeClue(12, 0, 'Halk dilinde bahane', 'MAHNA');
  placeClue(12, 10, 'El gün, yabancılar', 'ELALEM');

  placeClue(13, 0, 'Hayvanca duygu', 'BEHİMİ');

  placeClue(14, 0, 'Bir soru eki', 'Mİ');
  placeClue(14, 5, 'Yüce, yüksek', 'ALİ');
  placeClue(14, 11, "İyot'un simgesi", 'I');

  await prisma.puzzle.deleteMany({
    where: {
      title: {
        in: [
          'Hitlerci (Hürriyet)',
          'Nazizm Bulmacası (Hürriyet)',
          'Nazizm Bulmacası - 1',
          'Seyrüsefer - Genel Kültür Bulmacası',
          'Seyrüsefer Bulmacası - 1',
        ],
      },
    },
  });

  const puzzle = await prisma.puzzle.create({
    data: {
      title: 'Seyrüsefer Bulmacası - 1',
      difficulty: 'MEDIUM',
      width,
      height,
      points: 150,
      categoryId: category.id,
      gridData,
      isActive: true,
    },
  });

  console.log(`+ ${puzzle.title} eklendi`);
  console.log('✨ Cevaplar clue hücrelerine de işlendi.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
