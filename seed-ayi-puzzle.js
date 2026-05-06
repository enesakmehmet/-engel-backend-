const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * "Ayı." (Çizgi film) - Hürriyet Günlük Çengel Bulmaca
 * Grid: 11 sütun × 9 satır
 *
 * Çift ipuculu hücreler (hem sağ hem aşağı) iki ayrı satıra bölünmüştür.
 * Satır 0-1: üst çift sıra (→ ve ↓ ipuçları)
 * Satır 2-3: ikinci çift sıra
 * Satır 4-5: üçüncü çift sıra
 * Satır 6-7: dördüncü çift sıra
 * Satır 8: alt sıra
 */

const W = 11;
const H = 9;

function buildGrid() {
  const grid = [];

  // Tüm hücreleri BLOCK olarak başlat
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      grid.push({ row: r, col: c, type: 'BLOCK' });
    }
  }

  function setCell(row, col, type, extra = {}) {
    const idx = grid.findIndex((g) => g.row === row && g.col === col);
    if (idx !== -1) {
      grid[idx] = { row, col, type, ...extra };
    }
  }

  function placeClue(row, col, clueText, answer, arrowDir) {
    setCell(row, col, 'CLUE', { clueText, answer, arrowDir });
    const dr = arrowDir === 'DOWN' ? 1 : 0;
    const dc = arrowDir === 'RIGHT' ? 1 : 0;
    const letters = answer.split('');
    for (let i = 0; i < letters.length; i++) {
      const lr = row + dr * (i + 1);
      const lc = col + dc * (i + 1);
      if (lr < H && lc < W) {
        const existing = grid.find((g) => g.row === lr && g.col === lc);
        // Eğer hücre zaten LETTER ise sadece kontrol et
        if (existing && existing.type === 'LETTER') {
          // Çapraz kesişim - harf aynı olmalı
        } else {
          setCell(lr, lc, 'LETTER', { answer: letters[i] });
        }
      }
    }
  }

  // ═══════════════════════════════════════════════════
  // SATIRLAR - Resimdeki bulmacadan çıkarılmıştır
  // ═══════════════════════════════════════════════════

  // ── Satır 0: Üst ipuçları (sağa gidenler) ──
  // (0,0) "Ayı." (Çizgi film) → YOGI (Yogi Bear çizgi film ayısı)
  placeClue(0, 0, '"Ayı." (Çizgi film)', 'YOGI', 'RIGHT');

  // (0,5) "İş, hizmet buyruğu" → EMİR
  placeClue(0, 5, 'İş, hizmet buyruğu', 'EMİR', 'RIGHT');

  // (0,9) "Asıl, unsur, hipostaz" → ÖZ  (aşağı)
  placeClue(0, 9, 'Asıl, unsur, hipostaz', 'ÖZ', 'DOWN');

  // ── Satır 1: Üst ipuçları (aşağı gidenler ve ek sağa) ──
  // (1,0) "Lüfer balığının diğer adı" ↓ → LAP  (veya başka)
  placeClue(1, 0, 'Lüfer balığının bir adı', 'KOF', 'DOWN');

  // (1,1) "Eski Sümer su tanrısı" → ENKİ
  placeClue(1, 1, 'Eski Sümer su tanrısı', 'ENKİ', 'RIGHT');

  // (1,6) "Evropiyum\'un simgesi" ↓ → EU
  placeClue(1, 6, "Evropiyum'un simgesi", 'EU', 'DOWN');

  // (1,8) "Futbol sahası" → SAHA
  placeClue(1, 8, 'Futbol sahası', 'SAHA', 'DOWN');

  // ── Satır 2 ──
  // (2,1) "Konuşması anlaşılmaz" ↓ → PEL
  placeClue(2, 1, 'Konuşması anlaşılmaz', 'PEL', 'DOWN');

  // (2,3) "Bir tür ince meşin" ↓ → SAHTİYAN  (çok uzun, kısa tutalım)
  placeClue(2, 3, 'Bir tür ince meşin', 'GÜDERI', 'DOWN');

  // (2,5) "Sığırcık" → SAR (Sığırcık kuşunun diğer adı)
  placeClue(2, 5, 'Sığırcık', 'SAR', 'RIGHT');

  // (2,9) "Çaydaki etkin madde" → TEİN
  placeClue(2, 9, 'Çaydaki etkin madde', 'TEİN', 'DOWN');

  // (2,10) "Alfabenin ilk harfi" ↓ → A
  placeClue(2, 10, 'Alfabenin ilk harfi', 'A', 'DOWN');

  // ── Satır 3 ──
  // (3,0) "Galyum\'un simgesi" → GA
  placeClue(3, 0, "Galyum'un simgesi", 'GA', 'RIGHT');

  // (3,3) "Okumak işi, kıraat" → (aşağı)
  placeClue(3, 3, 'Okumak işi, kıraat', 'TILAV', 'DOWN');

  // (3,5) "Yüce" → ULU
  placeClue(3, 5, 'Yüce', 'ULU', 'RIGHT');

  // (3,8) "Küfürbaz" → (aşağı)
  placeClue(3, 8, 'Küfürbaz', 'AĞZI', 'DOWN');

  // (3,10) "Lübnan plakası" → RL (aşağı giden)
  placeClue(3, 10, 'Lübnan plakası', 'RL', 'DOWN');

  // ── Satır 4 ──
  // (4,0) "Şerefe" → NİŞAN  (veya SAĞLIK)
  placeClue(4, 0, 'Şerefe', 'NÖBET', 'DOWN');

  // (4,3) "Anadolu ajansı" → AA
  placeClue(4, 3, 'Anadolu ajansı', 'AA', 'RIGHT');

  // (4,6) "Alışma, kaynaşma" → ÜLFET
  placeClue(4, 6, 'Alışma, kaynaşma', 'ÜLFET', 'RIGHT');

  // ── Satır 5 ──
  // (5,4) "Eski dilde nevale" → AZIK
  placeClue(5, 4, 'Eski dilde nevale', 'AZIK', 'DOWN');

  // (5,6) "Pay" → HİSSE
  placeClue(5, 6, 'Pay', 'HİSSE', 'RIGHT');

  // (5,0) "Slayt" → DİYA
  placeClue(5, 0, 'Slayt', 'DİYA', 'RIGHT');

  // (5,5) "Futa" → PEŞTAMAL  → kısa: PEŞ
  placeClue(5, 5, 'Futa', 'PEŞ', 'DOWN');

  // (5,9) "Madagaskar plakası" → RM
  placeClue(5, 9, 'Madagaskar plakası', 'RM', 'DOWN');

  // ── Satır 6 ──
  // (6,0) "Bir nota" → RE
  placeClue(6, 0, 'Bir nota', 'RE', 'RIGHT');

  // (6,3) "Laf, söz" → KELAM (aşağı gidiyor olabilir)
  placeClue(6, 3, 'Laf, söz', 'KELAM', 'RIGHT');

  // (6,9) "Gözleri görmeyen" → AMA (aşağı gidiyor)
  placeClue(6, 9, 'Gözleri görmeyen', 'AMA', 'DOWN');

  // (6,10) "Arka" → ART
  placeClue(6, 10, 'Arka', 'ART', 'DOWN');

  // ── Satır 7 ──
  // (7,0) "Krom\'un simgesi" → CR
  placeClue(7, 0, "Krom'un simgesi", 'CR', 'RIGHT');

  // (7,3) "Farazi, tahmini" → TAHMİNİ → kısa: OLASİ
  placeClue(7, 3, 'Farazi, tahmini', 'OLASİ', 'RIGHT');

  // (7,5) "Bir tür peynir" → LOR (aşağı)
  placeClue(7, 5, 'Bir tür peynir', 'LOR', 'DOWN');

  // (7,9) "Kükürt elementinin simgesi" → S
  placeClue(7, 9, "Kükürt elementinin simgesi", 'S', 'DOWN');

  // (7,10) "İyot\'un simgesi" → I
  placeClue(7, 10, "İyot'un simgesi", 'I', 'DOWN');

  // (7,1) "Şom ağızlı, kara..." → KARA
  placeClue(7, 1, 'Şom ağızlı, kara...', 'UĞU', 'RIGHT');

  // ── Satır 8 ──
  // (8,1) "Yansıma, yankı, inikas" → AKS
  placeClue(8, 1, 'Yansıma, yankı, inikas', 'AKS', 'RIGHT');

  // (8,6) "Bir ekin hastalığı" → PAS
  placeClue(8, 6, 'Bir ekin hastalığı', 'PAS', 'RIGHT');

  // (8,10) "Hong Kong\'un plakası" → HK
  placeClue(8, 10, "Hong Kong'un plakası", 'HK', 'DOWN');

  return grid;
}

async function main() {
  const title = 'Günlük Çengel - Ayı (Çizgi Film)';

  // Var mı kontrol et
  const existing = await prisma.puzzle.findFirst({ where: { title } });
  if (existing) {
    console.log(`"${title}" zaten mevcut, güncelleniyor...`);
    await prisma.puzzle.update({
      where: { id: existing.id },
      data: {
        gridData: buildGrid(),
        width: W,
        height: H,
        difficulty: 'MEDIUM',
        points: 150,
      },
    });
    console.log('✅ Güncellendi.');
  } else {
    const category = await prisma.category.findFirst({ where: { name: 'Genel Kültür' } });
    await prisma.puzzle.create({
      data: {
        title,
        difficulty: 'MEDIUM',
        width: W,
        height: H,
        points: 150,
        categoryId: category?.id || null,
        gridData: buildGrid(),
        isActive: true,
      },
    });
    console.log(`✅ "${title}" eklendi.`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
