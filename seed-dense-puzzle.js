const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧩 Yoğun çengel bulmaca ekleniyor...');

  const category = await prisma.category.findFirst({ where: { name: 'Genel Kültür' } });

  // 10x10 yoğun çengel bulmaca - Hürriyet gazetesi tarzı
  // Çok az BLOCK hücresi, kelimeler birbirine bağlı
  const gridData = [
    // ═══ ROW 0 ═══
    // →ATEŞ (Yanıcı madde)  |  →ADA (Su ile çevrili kara)  |  ↓ clue
    { row: 0, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Yanıcı madde' },
    { row: 0, col: 1, type: 'LETTER', answer: 'A' },
    { row: 0, col: 2, type: 'LETTER', answer: 'T' },
    { row: 0, col: 3, type: 'LETTER', answer: 'E' },
    { row: 0, col: 4, type: 'LETTER', answer: 'Ş' },
    { row: 0, col: 5, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Denizle çevrili kara' },
    { row: 0, col: 6, type: 'LETTER', answer: 'A' },
    { row: 0, col: 7, type: 'LETTER', answer: 'D' },
    { row: 0, col: 8, type: 'LETTER', answer: 'A' },
    { row: 0, col: 9, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Binek hayvanı' },

    // ═══ ROW 1 ═══
    // ↓Araba  |  ↓Tepe  |  →AN (Kısa süre)  |  ↓Mavi  |  →İKİ (Sayı)
    { row: 1, col: 0, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Motorlu taşıt' },
    { row: 1, col: 1, type: 'LETTER', answer: 'R' },
    { row: 1, col: 2, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Yüksek yer' },
    { row: 1, col: 3, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Çok kısa süre' },
    { row: 1, col: 4, type: 'LETTER', answer: 'A' },
    { row: 1, col: 5, type: 'LETTER', answer: 'N' },
    { row: 1, col: 6, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Gökyüzü rengi' },
    { row: 1, col: 7, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Bir sayı' },
    { row: 1, col: 8, type: 'LETTER', answer: 'İ' },
    { row: 1, col: 9, type: 'LETTER', answer: 'K' },

    // ═══ ROW 2 ═══
    // →ABA (Kalın kumaş)  |  ↓İri  |  →KAN (Damar sıvısı)  |  ↓İl
    { row: 2, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Kalın yün kumaş' },
    { row: 2, col: 1, type: 'LETTER', answer: 'A' },
    { row: 2, col: 2, type: 'LETTER', answer: 'B' },
    { row: 2, col: 3, type: 'LETTER', answer: 'A' },
    { row: 2, col: 4, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Büyük, kocaman' },
    { row: 2, col: 5, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Damar sıvısı' },
    { row: 2, col: 6, type: 'LETTER', answer: 'K' },
    { row: 2, col: 7, type: 'LETTER', answer: 'A' },
    { row: 2, col: 8, type: 'LETTER', answer: 'N' },
    { row: 2, col: 9, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Şehir, vilayet' },

    // ═══ ROW 3 ═══
    // ↓Aba(devam)  |  →İRİ (Kocaman)  |  →KAR (Kışın yağan)
    { row: 3, col: 0, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Meyve ağacı' },
    { row: 3, col: 1, type: 'LETTER', answer: 'B' },
    { row: 3, col: 2, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Kocaman, ulu' },
    { row: 3, col: 3, type: 'LETTER', answer: 'İ' },
    { row: 3, col: 4, type: 'LETTER', answer: 'R' },
    { row: 3, col: 5, type: 'LETTER', answer: 'İ' },
    { row: 3, col: 6, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Kışın yağar' },
    { row: 3, col: 7, type: 'LETTER', answer: 'K' },
    { row: 3, col: 8, type: 'LETTER', answer: 'A' },
    { row: 3, col: 9, type: 'LETTER', answer: 'R' },

    // ═══ ROW 4 ═══
    // →AL (Kırmızı)  |  ↓Ana  |  →İL (Şehir)  |  →EL (Uzuv)
    { row: 4, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Kırmızı renk' },
    { row: 4, col: 1, type: 'LETTER', answer: 'A' },
    { row: 4, col: 2, type: 'LETTER', answer: 'L' },
    { row: 4, col: 3, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Haber verme' },
    { row: 4, col: 4, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Vilayet' },
    { row: 4, col: 5, type: 'LETTER', answer: 'İ' },
    { row: 4, col: 6, type: 'LETTER', answer: 'L' },
    { row: 4, col: 7, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Uzuv, kol' },
    { row: 4, col: 8, type: 'LETTER', answer: 'E' },
    { row: 4, col: 9, type: 'LETTER', answer: 'L' },

    // ═══ ROW 5 ═══
    // ↓Su  |  →ANA (Anne)  |  ↓At  |  →OK (Yay silahı)  |  ↓Er
    { row: 5, col: 0, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Hayat kaynağı sıvı' },
    { row: 5, col: 1, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Anne, valide' },
    { row: 5, col: 2, type: 'LETTER', answer: 'A' },
    { row: 5, col: 3, type: 'LETTER', answer: 'N' },
    { row: 5, col: 4, type: 'LETTER', answer: 'A' },
    { row: 5, col: 5, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Yarış hayvanı' },
    { row: 5, col: 6, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Yay mermisi' },
    { row: 5, col: 7, type: 'LETTER', answer: 'O' },
    { row: 5, col: 8, type: 'LETTER', answer: 'K' },
    { row: 5, col: 9, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Asker rütbesi' },

    // ═══ ROW 6 ═══
    // →SU (Sıvı)  |  →AT (Hayvan)  |  ↓Ara  |  →ET (Kas dokusu)
    { row: 6, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'İçilen sıvı' },
    { row: 6, col: 1, type: 'LETTER', answer: 'S' },
    { row: 6, col: 2, type: 'LETTER', answer: 'U' },
    { row: 6, col: 3, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Binek hayvanı' },
    { row: 6, col: 4, type: 'LETTER', answer: 'A' },
    { row: 6, col: 5, type: 'LETTER', answer: 'T' },
    { row: 6, col: 6, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Fasıla, mola' },
    { row: 6, col: 7, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Kas dokusu' },
    { row: 6, col: 8, type: 'LETTER', answer: 'E' },
    { row: 6, col: 9, type: 'LETTER', answer: 'T' },

    // ═══ ROW 7 ═══
    // BLK  |  →NAR (Meyve)  |  →ANİ (Beklenmedik)
    { row: 7, col: 0, type: 'BLOCK' },
    { row: 7, col: 1, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Kırmızı meyve' },
    { row: 7, col: 2, type: 'LETTER', answer: 'N' },
    { row: 7, col: 3, type: 'LETTER', answer: 'A' },
    { row: 7, col: 4, type: 'LETTER', answer: 'R' },
    { row: 7, col: 5, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Beklenmedik' },
    { row: 7, col: 6, type: 'LETTER', answer: 'A' },
    { row: 7, col: 7, type: 'LETTER', answer: 'N' },
    { row: 7, col: 8, type: 'LETTER', answer: 'İ' },
    { row: 7, col: 9, type: 'CLUE', arrowDir: 'DOWN', clueText: 'Olumsuzluk eki' },

    // ═══ ROW 8 ═══
    // →EL (Kol)  |  →AK (Beyaz)  |  →ARA (Mesafe)
    { row: 8, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Kol, uzuv' },
    { row: 8, col: 1, type: 'LETTER', answer: 'E' },
    { row: 8, col: 2, type: 'LETTER', answer: 'L' },
    { row: 8, col: 3, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Beyaz renk' },
    { row: 8, col: 4, type: 'LETTER', answer: 'A' },
    { row: 8, col: 5, type: 'LETTER', answer: 'K' },
    { row: 8, col: 6, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Mesafe, boşluk' },
    { row: 8, col: 7, type: 'LETTER', answer: 'A' },
    { row: 8, col: 8, type: 'LETTER', answer: 'R' },
    { row: 8, col: 9, type: 'LETTER', answer: 'A' },

    // ═══ ROW 9 ═══
    // →NE (Soru)  |  →ON (Sayı)  |  →ODA (Yer)
    { row: 9, col: 0, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Soru sözcüğü' },
    { row: 9, col: 1, type: 'LETTER', answer: 'N' },
    { row: 9, col: 2, type: 'LETTER', answer: 'E' },
    { row: 9, col: 3, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Bir sayı' },
    { row: 9, col: 4, type: 'LETTER', answer: 'O' },
    { row: 9, col: 5, type: 'LETTER', answer: 'N' },
    { row: 9, col: 6, type: 'CLUE', arrowDir: 'RIGHT', clueText: 'Ev bölümü' },
    { row: 9, col: 7, type: 'LETTER', answer: 'O' },
    { row: 9, col: 8, type: 'LETTER', answer: 'D' },
    { row: 9, col: 9, type: 'LETTER', answer: 'A' },
  ];

  const title = 'Genel Kültür Bulmacası - 6';

  await prisma.puzzle.deleteMany({
    where: {
      title: {
        in: ['Hürriyet Gazetesi: Veri Bulmacası', title],
      },
    },
  });

  await prisma.puzzle.create({
    data: {
      title,
      difficulty: 'MEDIUM',
      width: 10,
      height: 10,
      points: 150,
      categoryId: category?.id,
      gridData: gridData,
      isActive: true,
    },
  });

  console.log('✅ Klasik Çengel #1 başarıyla eklendi!');
  console.log('📊 Grid: 10x10, Toplam hücre: 100');

  const blocks = gridData.filter(c => c.type === 'BLOCK').length;
  const clues = gridData.filter(c => c.type === 'CLUE').length;
  const letters = gridData.filter(c => c.type === 'LETTER').length;
  console.log(`   BLOCK: ${blocks}, CLUE: ${clues}, LETTER: ${letters}`);
  console.log(`   Yoğunluk: %${Math.round(((clues + letters) / 100) * 100)}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
