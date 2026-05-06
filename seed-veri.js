const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Veri Bulmacası (Hürriyet) ekleniyor...');

  const category = await prisma.category.findFirst({ where: { name: 'Genel Kültür' } });
  if (!category) {
    console.log('Kategori bulunamadı!');
    return;
  }

  // 15 sütun, 8 satırlık grid verisi
  const gridData = [
    // --- CLUES (Sorular) ---
    { row: 0, col: 0, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Veri' },
    { row: 1, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Elmasın yontulmuş hali' },
    { row: 2, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Gelin başı süsü' },
    { row: 3, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Aristokrasi' },
    { row: 4, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Kutuların katlama yeri' },
    { row: 6, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Kalın bağırsak' },
    
    { row: 0, col: 2, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Huysuz, şirret' },
    { row: 0, col: 4, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Kıyı, kenar' },
    { row: 0, col: 6, type: 'CLUE', arrowDir: 'DOWN', clueText: 'San Marino (Plaka)' },
    { row: 4, col: 5, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Ailesine bakan' },
    { row: 5, col: 5, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Baba, cet' },
    
    { row: 6, col: 10, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Nazi hücum kıtası' },
    { row: 6, col: 12, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Dünya\'nın uydusu' },
    { row: 0, col: 12, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Matkap' },

    // --- BLOCKS (Boş siyah/pasif hücreler - Gerekirse eklenebilir) ---

    // --- LETTERS (Cevaplar) ---
    // Veri -> DATA (Örnek)
    { row: 0, col: 1, type: 'LETTER', answer: 'D', isHint: true },
    { row: 1, col: 1, type: 'LETTER', answer: 'A' },
    { row: 2, col: 1, type: 'LETTER', answer: 'T' },
    { row: 3, col: 1, type: 'LETTER', answer: 'A' },

    // Kutuların katlama yeri -> RİL
    { row: 4, col: 1, type: 'LETTER', answer: 'R' },
    { row: 4, col: 2, type: 'LETTER', answer: 'İ' },
    { row: 4, col: 3, type: 'LETTER', answer: 'L' },

    // Kalın bağırsak -> KOLON
    { row: 6, col: 1, type: 'LETTER', answer: 'K' },
    { row: 6, col: 2, type: 'LETTER', answer: 'O' },
    { row: 6, col: 3, type: 'LETTER', answer: 'L' },
    { row: 6, col: 4, type: 'LETTER', answer: 'O' },
    { row: 6, col: 5, type: 'LETTER', answer: 'N' },

    // Kıyı, kenar -> YAKA
    { row: 0, col: 5, type: 'LETTER', answer: 'Y' },
    { row: 0, col: 7, type: 'LETTER', answer: 'A' },
    { row: 0, col: 8, type: 'LETTER', answer: 'K' },
    { row: 0, col: 9, type: 'LETTER', answer: 'A' },

    // San Marino plaka -> RSM
    { row: 1, col: 6, type: 'LETTER', answer: 'R' },
    { row: 2, col: 6, type: 'LETTER', answer: 'S' },
    { row: 3, col: 6, type: 'LETTER', answer: 'M' },

    // Ailesine bakan -> AİL
    { row: 5, col: 5, type: 'LETTER', answer: 'A' },
    { row: 6, col: 5, type: 'LETTER', answer: 'İ' },
    { row: 7, col: 5, type: 'LETTER', answer: 'L' },

    // Baba, cet -> ATA
    { row: 6, col: 5, type: 'LETTER', answer: 'A' },
    { row: 7, col: 5, type: 'LETTER', answer: 'T' },
    { row: 8, col: 5, type: 'LETTER', answer: 'A' },

    // Nazi hücum kıtası -> SS
    { row: 7, col: 10, type: 'LETTER', answer: 'S' },
    { row: 8, col: 10, type: 'LETTER', answer: 'S' },

    // Dünya'nın uydusu -> AY
    { row: 7, col: 12, type: 'LETTER', answer: 'A' },
    { row: 8, col: 12, type: 'LETTER', answer: 'Y' },
    
    // Matkap -> DELGİ
    { row: 1, col: 12, type: 'LETTER', answer: 'D' },
    { row: 2, col: 12, type: 'LETTER', answer: 'E' },
    { row: 3, col: 12, type: 'LETTER', answer: 'L' },
    { row: 4, col: 12, type: 'LETTER', answer: 'G' },
    { row: 5, col: 12, type: 'LETTER', answer: 'İ' },
  ];

  const title = 'Genel Kültür Bulmacası - 11';

  await prisma.puzzle.deleteMany({
    where: {
      title: {
        in: ['Hürriyet Gazetesi: Veri Bulmacası', title],
      },
    },
  });

  const puzzle = await prisma.puzzle.create({
    data: {
      title,
      categoryId: category.id,
      difficulty: 'MEDIUM',
      width: 15,
      height: 9,
      gridData: gridData,
    },
  });

  console.log('✅ Yeni bulmaca başarıyla veritabanına eklendi! ID:', puzzle.id);
}

main().catch(console.error).finally(() => prisma.$disconnect());
