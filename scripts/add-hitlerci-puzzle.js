const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Görüntüdeki Hitlerci Bulmacası - 13x9 grid
  const gridData = [
    // Satır 0
    { row: 0, col: 0, type: 'CLUE', clueText: 'Hitlerci', arrowDir: 'DOWN', answer: 'NAZİM' },
    { row: 0, col: 1, type: 'CLUE', clueText: 'Eski dilde kaş', arrowDir: 'DOWN', answer: 'NAY' },
    { row: 0, col: 2, type: 'BLOCK' },
    { row: 0, col: 3, type: 'CLUE', clueText: 'Kayaç', arrowDir: 'DOWN', answer: 'ÖZVAK' },
    { row: 0, col: 4, type: 'BLOCK' },
    { row: 0, col: 5, type: 'CLUE', clueText: 'Boksta yenilgi Nazi hücum...', arrowDir: 'DOWN', answer: 'KOEN' },
    { row: 0, col: 6, type: 'BLOCK' },
    { row: 0, col: 7, type: 'CLUE', clueText: 'Yiyecek', arrowDir: 'DOWN', answer: 'MAUN' },
    { row: 0, col: 8, type: 'BLOCK' },
    { row: 0, col: 9, type: 'CLUE', clueText: 'Vazgeçme', arrowDir: 'DOWN', answer: 'MAPK' },
    { row: 0, col: 10, type: 'BLOCK' },
    { row: 0, col: 11, type: 'CLUE', clueText: 'Şiir', arrowDir: 'DOWN', answer: 'NACSM' },
    { row: 0, col: 12, type: 'CLUE', clueText: 'Yardımcı yemek', arrowDir: 'DOWN', answer: 'AUAK' },

    // Satır 1
    { row: 1, col: 0, type: 'LETTER', answer: 'N' },
    { row: 1, col: 1, type: 'LETTER', answer: 'A' },
    { row: 1, col: 2, type: 'CLUE', clueText: 'Eski dilde hastalık..', arrowDir: 'RIGHT', answer: 'NA' },
    { row: 1, col: 3, type: 'LETTER', answer: 'Ö' },
    { row: 1, col: 4, type: 'CLUE', clueText: 'Özsu', arrowDir: 'RIGHT', answer: 'ÖZ' },
    { row: 1, col: 5, type: 'LETTER', answer: 'Z' },
    { row: 1, col: 6, type: 'CLUE', clueText: 'Kamış elek', arrowDir: 'RIGHT', answer: 'KO' },
    { row: 1, col: 7, type: 'LETTER', answer: 'O' },
    { row: 1, col: 8, type: 'BLOCK' },
    { row: 1, col: 9, type: 'BLOCK' },
    { row: 1, col: 10, type: 'CLUE', clueText: 'Hararet', arrowDir: 'RIGHT', answer: 'HARARET' },
    { row: 1, col: 11, type: 'CLUE', clueText: 'Tanrıtanım azlık', arrowDir: 'RIGHT', answer: 'NA' },
    { row: 1, col: 12, type: 'LETTER', answer: 'A' },

    // Satır 2
    { row: 2, col: 0, type: 'LETTER', answer: 'Z' },
    { row: 2, col: 1, type: 'LETTER', answer: 'Y' },
    { row: 2, col: 2, type: 'LETTER', answer: 'A' },
    { row: 2, col: 3, type: 'LETTER', answer: 'V' },
    { row: 2, col: 4, type: 'LETTER', answer: 'A' },
    { row: 2, col: 5, type: 'LETTER', answer: 'N' },
    { row: 2, col: 6, type: 'BLOCK' },
    { row: 2, col: 7, type: 'BLOCK' },
    { row: 2, col: 8, type: 'BLOCK' },
    { row: 2, col: 9, type: 'BLOCK' },
    { row: 2, col: 10, type: 'BLOCK' },
    { row: 2, col: 11, type: 'BLOCK' },
    { row: 2, col: 12, type: 'BLOCK' },

    // Satır 3
    { row: 3, col: 0, type: 'LETTER', answer: 'İ' },
    { row: 3, col: 1, type: 'BLOCK' },
    { row: 3, col: 2, type: 'CLUE', clueText: 'Sülük yapıştırma', arrowDir: 'DOWN', answer: 'ALİK' },
    { row: 3, col: 3, type: 'LETTER', answer: 'A' },
    { row: 3, col: 4, type: 'BLOCK' },
    { row: 3, col: 5, type: 'BLOCK' },
    { row: 3, col: 6, type: 'BLOCK' },
    { row: 3, col: 7, type: 'CLUE', clueText: 'Argoda bit', arrowDir: 'RIGHT', answer: 'MACU' },
    { row: 3, col: 8, type: 'CLUE', clueText: 'Maccullüğü benimse...', arrowDir: 'RIGHT', answer: 'MACU' },
    { row: 3, col: 9, type: 'LETTER', answer: 'M' },
    { row: 3, col: 10, type: 'LETTER', answer: 'A' },
    { row: 3, col: 11, type: 'LETTER', answer: 'C' },
    { row: 3, col: 12, type: 'LETTER', answer: 'U' },

    // Satır 4
    { row: 4, col: 0, type: 'LETTER', answer: 'M' },
    { row: 4, col: 1, type: 'CLUE', clueText: 'Aksaray\'da bir baraj', arrowDir: 'RIGHT', answer: 'İKER' },
    { row: 4, col: 2, type: 'LETTER', answer: 'İ' },
    { row: 4, col: 3, type: 'LETTER', answer: 'K' },
    { row: 4, col: 4, type: 'CLUE', clueText: 'Çekinme, korku', arrowDir: 'RIGHT', answer: 'ER' },
    { row: 4, col: 5, type: 'LETTER', answer: 'E' },
    { row: 4, col: 6, type: 'LETTER', answer: 'R' },
    { row: 4, col: 7, type: 'BLOCK' },
    { row: 4, col: 8, type: 'CLUE', clueText: 'Adım', arrowDir: 'RIGHT', answer: 'NEAU' },
    { row: 4, col: 9, type: 'CLUE', clueText: 'Neon\'un simgesi', arrowDir: 'RIGHT', answer: 'NE' },
    { row: 4, col: 10, type: 'LETTER', answer: 'A' },
    { row: 4, col: 11, type: 'CLUE', clueText: 'Altın\'ın simgesi', arrowDir: 'RIGHT', answer: 'AU' },
    { row: 4, col: 12, type: 'BLOCK' },

    // Satır 5
    { row: 5, col: 0, type: 'CLUE', clueText: 'Gölge', arrowDir: 'DOWN', answer: 'İM' },
    { row: 5, col: 1, type: 'BLOCK' },
    { row: 5, col: 2, type: 'LETTER', answer: 'L' },
    { row: 5, col: 3, type: 'LETTER', answer: 'İ' },
    { row: 5, col: 4, type: 'BLOCK' },
    { row: 5, col: 5, type: 'BLOCK' },
    { row: 5, col: 6, type: 'CLUE', clueText: 'Gerilim yükluğü', arrowDir: 'RIGHT', answer: 'GERAU' },
    { row: 5, col: 7, type: 'CLUE', clueText: 'Eski dilde aslan', arrowDir: 'RIGHT', answer: 'ER' },
    { row: 5, col: 8, type: 'LETTER', answer: 'E' },
    { row: 5, col: 9, type: 'LETTER', answer: 'R' },
    { row: 5, col: 10, type: 'CLUE', clueText: 'Metal olmayan.. Bir tür dans', arrowDir: 'DOWN', answer: 'AMETA' },
    { row: 5, col: 11, type: 'BLOCK' },
    { row: 5, col: 12, type: 'CLUE', clueText: 'Millet bahçesi', arrowDir: 'DOWN', answer: 'UAK' },

    // Satır 6
    { row: 6, col: 0, type: 'LETTER', answer: 'İ' },
    { row: 6, col: 1, type: 'BLOCK' },
    { row: 6, col: 2, type: 'LETTER', answer: 'K' },
    { row: 6, col: 3, type: 'BLOCK' },
    { row: 6, col: 4, type: 'BLOCK' },
    { row: 6, col: 5, type: 'BLOCK' },
    { row: 6, col: 6, type: 'LETTER', answer: 'G' },
    { row: 6, col: 7, type: 'LETTER', answer: 'E' },
    { row: 6, col: 8, type: 'LETTER', answer: 'R' },
    { row: 6, col: 9, type: 'CLUE', clueText: 'Türk müziğinde bir makam', arrowDir: 'RIGHT', answer: 'RAST' },
    { row: 6, col: 10, type: 'LETTER', answer: 'A' },
    { row: 6, col: 11, type: 'CLUE', clueText: 'Tantal\'ın simgesi', arrowDir: 'RIGHT', answer: 'TAKSM' },
    { row: 6, col: 12, type: 'LETTER', answer: 'T' },

    // Satır 7
    { row: 7, col: 0, type: 'LETTER', answer: 'M' },
    { row: 7, col: 1, type: 'BLOCK' },
    { row: 7, col: 2, type: 'BLOCK' },
    { row: 7, col: 3, type: 'BLOCK' },
    { row: 7, col: 4, type: 'CLUE', clueText: 'Edepli', arrowDir: 'RIGHT', answer: 'EDEP' },
    { row: 7, col: 5, type: 'LETTER', answer: 'E' },
    { row: 7, col: 6, type: 'LETTER', answer: 'D' },
    { row: 7, col: 7, type: 'LETTER', answer: 'E' },
    { row: 7, col: 8, type: 'LETTER', answer: 'P' },
    { row: 7, col: 9, type: 'BLOCK' },
    { row: 7, col: 10, type: 'CLUE', clueText: 'Manganez\'in simgesi', arrowDir: 'RIGHT', answer: 'MN' },
    { row: 7, col: 11, type: 'LETTER', answer: 'M' },
    { row: 7, col: 12, type: 'CLUE', clueText: 'Potasyum\'un simgesi', arrowDir: 'RIGHT', answer: 'K' },

    // Satır 8
    { row: 8, col: 0, type: 'BLOCK' },
    { row: 8, col: 1, type: 'BLOCK' },
    { row: 8, col: 2, type: 'BLOCK' },
    { row: 8, col: 3, type: 'BLOCK' },
    { row: 8, col: 4, type: 'CLUE', clueText: 'Kasap', arrowDir: 'RIGHT', answer: 'KASA' },
    { row: 8, col: 5, type: 'LETTER', answer: 'K' },
    { row: 8, col: 6, type: 'LETTER', answer: 'A' },
    { row: 8, col: 7, type: 'LETTER', answer: 'S' },
    { row: 8, col: 8, type: 'LETTER', answer: 'A' },
    { row: 8, col: 9, type: 'BLOCK' },
    { row: 8, col: 10, type: 'LETTER', answer: 'N' },
    { row: 8, col: 11, type: 'BLOCK' },
    { row: 8, col: 12, type: 'LETTER', answer: 'K' },
  ];

  const title = 'Hitlerci - Genel Kültür Bulmacası';

  // Eğer aynı isimde varsa sil
  await prisma.puzzle.deleteMany({ where: { title } });

  // Yeni bulmacayı ekle
  const puzzle = await prisma.puzzle.create({
    data: {
      title,
      width: 13,
      height: 9,
      difficulty: 'HARD',
      gridData: gridData,
      points: 500,
      isActive: true,
    }
  });

  console.log('✅ "Hitlerci" bulmacası başarıyla eklendi!');
  console.log('📊 Puzzle ID:', puzzle.id);
  console.log('📐 Boyut: 13x9');
  console.log('🎯 Zorluk: HARD');
  console.log('⭐ Puan: 500');
}

main()
  .catch((error) => {
    console.error('❌ Hata:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
