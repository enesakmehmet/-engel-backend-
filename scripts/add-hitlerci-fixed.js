const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Görüntüdeki Hitlerci Bulmacası - 13 sütun x 9 satır
  // Her ipucu hücresinden sonra cevap harfleri gelir
  
  const gridData = [
    // Satır 0 - Üst ipucu satırı
    { row: 0, col: 0, type: 'CLUE', clueText: 'Hitlerci', arrowDir: 'DOWN' },
    { row: 0, col: 1, type: 'CLUE', clueText: 'Eski dilde kaş', arrowDir: 'DOWN' },
    { row: 0, col: 2, type: 'BLOCK' },
    { row: 0, col: 3, type: 'CLUE', clueText: 'Kayaç', arrowDir: 'DOWN' },
    { row: 0, col: 4, type: 'BLOCK' },
    { row: 0, col: 5, type: 'CLUE', clueText: 'Boksta yenilgi Nazi hücum...', arrowDir: 'DOWN' },
    { row: 0, col: 6, type: 'BLOCK' },
    { row: 0, col: 7, type: 'CLUE', clueText: 'Yiyecek', arrowDir: 'DOWN' },
    { row: 0, col: 8, type: 'BLOCK' },
    { row: 0, col: 9, type: 'CLUE', clueText: 'Vazgeçme', arrowDir: 'DOWN' },
    { row: 0, col: 10, type: 'BLOCK' },
    { row: 0, col: 11, type: 'CLUE', clueText: 'Şiir', arrowDir: 'DOWN' },
    { row: 0, col: 12, type: 'CLUE', clueText: 'Yardımcı yemek', arrowDir: 'DOWN' },

    // Satır 1
    { row: 1, col: 0, type: 'LETTER', answer: 'N' },
    { row: 1, col: 1, type: 'LETTER', answer: 'A' },
    { row: 1, col: 2, type: 'CLUE', clueText: 'Eski dilde hastalık', arrowDir: 'RIGHT' },
    { row: 1, col: 3, type: 'LETTER', answer: 'Ö' },
    { row: 1, col: 4, type: 'CLUE', clueText: 'Özsu', arrowDir: 'RIGHT' },
    { row: 1, col: 5, type: 'LETTER', answer: 'Z' },
    { row: 1, col: 6, type: 'CLUE', clueText: 'Kamış elek', arrowDir: 'RIGHT' },
    { row: 1, col: 7, type: 'BLOCK' },
    { row: 1, col: 8, type: 'BLOCK' },
    { row: 1, col: 9, type: 'CLUE', clueText: 'Hararet', arrowDir: 'RIGHT' },
    { row: 1, col: 10, type: 'CLUE', clueText: 'Tanrıtanım azlık', arrowDir: 'RIGHT' },
    { row: 1, col: 11, type: 'BLOCK' },
    { row: 1, col: 12, type: 'BLOCK' },

    // Satır 2
    { row: 2, col: 0, type: 'LETTER', answer: 'Z' },
    { row: 2, col: 1, type: 'BLOCK' },
    { row: 2, col: 2, type: 'CLUE', clueText: 'Sülük yapıştırma', arrowDir: 'DOWN' },
    { row: 2, col: 3, type: 'LETTER', answer: 'V' },
    { row: 2, col: 4, type: 'BLOCK' },
    { row: 2, col: 5, type: 'BLOCK' },
    { row: 2, col: 6, type: 'BLOCK' },
    { row: 2, col: 7, type: 'BLOCK' },
    { row: 2, col: 8, type: 'BLOCK' },
    { row: 2, col: 9, type: 'BLOCK' },
    { row: 2, col: 10, type: 'BLOCK' },
    { row: 2, col: 11, type: 'BLOCK' },
    { row: 2, col: 12, type: 'BLOCK' },

    // Satır 3
    { row: 3, col: 0, type: 'CLUE', clueText: 'Yavan, tatsız', arrowDir: 'RIGHT' },
    { row: 3, col: 1, type: 'BLOCK' },
    { row: 3, col: 2, type: 'BLOCK' },
    { row: 3, col: 3, type: 'BLOCK' },
    { row: 3, col: 4, type: 'BLOCK' },
    { row: 3, col: 5, type: 'BLOCK' },
    { row: 3, col: 6, type: 'BLOCK' },
    { row: 3, col: 7, type: 'CLUE', clueText: 'Argoda bit', arrowDir: 'RIGHT' },
    { row: 3, col: 8, type: 'CLUE', clueText: 'Maccullüğü benimse', arrowDir: 'RIGHT' },
    { row: 3, col: 9, type: 'BLOCK' },
    { row: 3, col: 10, type: 'BLOCK' },
    { row: 3, col: 11, type: 'BLOCK' },
    { row: 3, col: 12, type: 'BLOCK' },

    // Satır 4
    { row: 4, col: 0, type: 'CLUE', clueText: 'Gölge', arrowDir: 'DOWN' },
    { row: 4, col: 1, type: 'BLOCK' },
    { row: 4, col: 2, type: 'BLOCK' },
    { row: 4, col: 3, type: 'BLOCK' },
    { row: 4, col: 4, type: 'BLOCK' },
    { row: 4, col: 5, type: 'BLOCK' },
    { row: 4, col: 6, type: 'BLOCK' },
    { row: 4, col: 7, type: 'BLOCK' },
    { row: 4, col: 8, type: 'BLOCK' },
    { row: 4, col: 9, type: 'BLOCK' },
    { row: 4, col: 10, type: 'CLUE', clueText: 'Metal olmayan Bir tür dans', arrowDir: 'DOWN' },
    { row: 4, col: 11, type: 'BLOCK' },
    { row: 4, col: 12, type: 'CLUE', clueText: 'Millet bahçesi', arrowDir: 'DOWN' },

    // Satır 5
    { row: 5, col: 0, type: 'LETTER', answer: 'İ' },
    { row: 5, col: 1, type: 'CLUE', clueText: 'Aksaray\'da bir baraj', arrowDir: 'RIGHT' },
    { row: 5, col: 2, type: 'BLOCK' },
    { row: 5, col: 3, type: 'CLUE', clueText: 'Çekinme, korku', arrowDir: 'RIGHT' },
    { row: 5, col: 4, type: 'CLUE', clueText: 'Eski dilde aslan', arrowDir: 'RIGHT' },
    { row: 5, col: 5, type: 'BLOCK' },
    { row: 5, col: 6, type: 'BLOCK' },
    { row: 5, col: 7, type: 'BLOCK' },
    { row: 5, col: 8, type: 'CLUE', clueText: 'Adım', arrowDir: 'RIGHT' },
    { row: 5, col: 9, type: 'CLUE', clueText: 'Neon\'un simgesi', arrowDir: 'RIGHT' },
    { row: 5, col: 10, type: 'CLUE', clueText: 'Altın\'ın simgesi', arrowDir: 'RIGHT' },
    { row: 5, col: 11, type: 'BLOCK' },
    { row: 5, col: 12, type: 'BLOCK' },

    // Satır 6
    { row: 6, col: 0, type: 'LETTER', answer: 'M' },
    { row: 6, col: 1, type: 'BLOCK' },
    { row: 6, col: 2, type: 'BLOCK' },
    { row: 6, col: 3, type: 'BLOCK' },
    { row: 6, col: 4, type: 'BLOCK' },
    { row: 6, col: 5, type: 'BLOCK' },
    { row: 6, col: 6, type: 'CLUE', clueText: 'Gerilim yükluğü', arrowDir: 'RIGHT' },
    { row: 6, col: 7, type: 'CLUE', clueText: 'Altın\'ın simgesi', arrowDir: 'RIGHT' },
    { row: 6, col: 8, type: 'BLOCK' },
    { row: 6, col: 9, type: 'BLOCK' },
    { row: 6, col: 10, type: 'LETTER', answer: 'A' },
    { row: 6, col: 11, type: 'CLUE', clueText: 'Tantal\'ın simgesi', arrowDir: 'RIGHT' },
    { row: 6, col: 12, type: 'CLUE', clueText: 'Çinko\'nun simgesi', arrowDir: 'RIGHT' },

    // Satır 7
    { row: 7, col: 0, type: 'BLOCK' },
    { row: 7, col: 1, type: 'BLOCK' },
    { row: 7, col: 2, type: 'CLUE', clueText: 'Türk müziğinde bir makam', arrowDir: 'RIGHT' },
    { row: 7, col: 3, type: 'BLOCK' },
    { row: 7, col: 4, type: 'BLOCK' },
    { row: 7, col: 5, type: 'BLOCK' },
    { row: 7, col: 6, type: 'BLOCK' },
    { row: 7, col: 7, type: 'BLOCK' },
    { row: 7, col: 8, type: 'CLUE', clueText: 'Kasap', arrowDir: 'RIGHT' },
    { row: 7, col: 9, type: 'BLOCK' },
    { row: 7, col: 10, type: 'BLOCK' },
    { row: 7, col: 11, type: 'BLOCK' },
    { row: 7, col: 12, type: 'BLOCK' },

    // Satır 8
    { row: 8, col: 0, type: 'BLOCK' },
    { row: 8, col: 1, type: 'BLOCK' },
    { row: 8, col: 2, type: 'BLOCK' },
    { row: 8, col: 3, type: 'BLOCK' },
    { row: 8, col: 4, type: 'CLUE', clueText: 'Edepli', arrowDir: 'RIGHT' },
    { row: 8, col: 5, type: 'BLOCK' },
    { row: 8, col: 6, type: 'BLOCK' },
    { row: 8, col: 7, type: 'BLOCK' },
    { row: 8, col: 8, type: 'BLOCK' },
    { row: 8, col: 9, type: 'BLOCK' },
    { row: 8, col: 10, type: 'CLUE', clueText: 'Manganez\'in simgesi', arrowDir: 'RIGHT' },
    { row: 8, col: 11, type: 'BLOCK' },
    { row: 8, col: 12, type: 'CLUE', clueText: 'Potasyum\'un simgesi', arrowDir: 'RIGHT' },
  ];

  const title = 'Hitlerci - Genel Kültür Bulmacası';

  // Önce mevcut bulmacayı bul
  const existing = await prisma.puzzle.findFirst({ where: { title } });

  let puzzle;
  if (existing) {
    // Varsa güncelle
    puzzle = await prisma.puzzle.update({
      where: { id: existing.id },
      data: {
        width: 13,
        height: 9,
        difficulty: 'HARD',
        gridData: gridData,
        points: 500,
        isActive: true,
      }
    });
    console.log('🔄 Mevcut bulmaca güncellendi!');
  } else {
    // Yoksa yeni oluştur
    puzzle = await prisma.puzzle.create({
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
    console.log('✨ Yeni bulmaca oluşturuldu!');
  }

  console.log('✅ "Hitlerci" bulmacası başarıyla eklendi!');
  console.log('📊 Puzzle ID:', puzzle.id);
  console.log('📐 Boyut: 13x9');
  console.log('🎯 Zorluk: HARD');
  console.log('⭐ Puan: 500');
  console.log('\n📝 İpucu sayısı:', gridData.filter(c => c.type === 'CLUE').length);
  console.log('📝 Harf sayısı:', gridData.filter(c => c.type === 'LETTER').length);
  console.log('📝 Blok sayısı:', gridData.filter(c => c.type === 'BLOCK').length);
  console.log('\n⚠️  NOT: Cevaplar mobil uygulamada kullanıcı tarafından girilecek.');
  console.log('    İpucu hücrelerinden sonraki boş (LETTER) hücreler cevap için ayrılmıştır.');
}

main()
  .catch((error) => {
    console.error('❌ Hata:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
