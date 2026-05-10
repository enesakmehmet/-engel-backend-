const { PrismaClient } = require('@prisma/client');

/**
 * "Karagöz'de Kambur" - Hürriyet Çengel Bulmaca
 * Grid: 22 sütun × 15 satır
 *
 * Yerleşim otomatik üretilir:
 * - En uzun cevaplar önce yerleştirilir
 * - Sonraki cevaplar kesişim noktalarıyla eklenir
 * - Çakışma ve bitişik harf kuralları korunur
 */

const W = 22;
const H = 15;

const PUZZLE_ENTRIES = [
  { clueText: "Karagöz'de kambur", answer: 'HACİVAT' },
  { clueText: 'Aşılması güç doğa engeli', answer: 'SARP' },
  { clueText: 'Manevi varlık', answer: 'RUH' },
  { clueText: 'Bir yağış türü', answer: 'KAR' },
  { clueText: 'Baba, cet', answer: 'ATA' },
  { clueText: 'Başörtüsü', answer: 'YAŞMAK' },
  { clueText: 'Kalbin düzensiz çalışması', answer: 'ARİTMİ' },
  { clueText: 'Avrupa Birliği', answer: 'AB' },
  { clueText: 'Böbürlenme', answer: 'KİBİR' },
  { clueText: 'Bir tür zeytin', answer: 'GEMLİK' },
  { clueText: 'Meta', answer: 'MAL' },
  { clueText: 'Bağırıp çağırma', answer: 'ÇIĞLIK' },
  { clueText: "Rutenyum'un simgesi", answer: 'RU' },
  { clueText: 'İncirden sızan sıvı', answer: 'SÜT' },
  { clueText: 'Lokal', answer: 'YEREL' },
  { clueText: 'Arapça', answer: 'ARABİ' },
  { clueText: 'Dar ve kalın tahta', answer: 'LATA' },
  { clueText: 'Bakı', answer: 'NAZAR' },
  { clueText: 'Derinin cilalanması', answer: 'PERDAH' },
  { clueText: 'Tümör', answer: 'UR' },
  { clueText: 'Karadeniz teknesi', answer: 'TAKA' },
  { clueText: 'Tarım toprağı', answer: 'ARAZİ' },
  { clueText: 'Buyuran', answer: 'AMİR' },
  { clueText: 'Sıkıntı', answer: 'DERT' },
  { clueText: 'Makam, mevki', answer: 'PAYE' },
  { clueText: 'At ayakkabısı', answer: 'NAL' },
  { clueText: 'Bozkır', answer: 'STEP' },
  { clueText: 'Dağ tavuğu', answer: 'ÇİL' },
  { clueText: 'Dökme demir', answer: 'PİK' },
  { clueText: 'Gelin başı süsü', answer: 'TAÇ' },
  { clueText: 'Bir nota', answer: 'RE' },
  { clueText: 'Bey, emir', answer: 'HAN' },
  { clueText: "Radyum'un simgesi", answer: 'RA' },
  { clueText: "Protaktinyum'un simgesi", answer: 'PA' },
  { clueText: 'Bir nota (2)', answer: 'LA' },
  { clueText: 'Japon intiharı', answer: 'HARAKİRİ' },
  { clueText: 'Alışveriş torbası', answer: 'POŞET' },
  { clueText: 'Seçkin', answer: 'ELİT' },
  { clueText: 'Tehlike işareti', answer: 'SOS' },
  { clueText: 'Ağabey (Halk ağzı)', answer: 'AĞA' },
];

function layoutOnce(entryOrder) {
  const grid = [];

  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      grid.push({ row: r, col: c, type: 'BLOCK' });
    }
  }

  const cellMap = new Map(grid.map((cell) => [`${cell.row}-${cell.col}`, cell]));

  const cellAt = (row, col) => cellMap.get(`${row}-${col}`) || null;

  const setCell = (row, col, type, extra = {}) => {
    const cell = cellAt(row, col);
    if (!cell) return null;
    Object.assign(cell, { row, col, type }, extra);
    return cell;
  };

  const normalizeAnswer = (answer) => String(answer || '')
    .trim()
    .replace(/\s+/g, '')
    .toUpperCase();

  const canPlace = (row, col, answer, arrowDir) => {
    const dr = arrowDir === 'DOWN' ? 1 : 0;
    const dc = arrowDir === 'RIGHT' ? 1 : 0;
    const clueRow = row - dr;
    const clueCol = col - dc;

    if (clueRow < 0 || clueCol < 0) return false;

    const clueCell = cellAt(clueRow, clueCol);
    if (!clueCell || clueCell.type !== 'BLOCK') return false;

    const beforeCell = cellAt(row - dr, col - dc);
    if (beforeCell && beforeCell.type !== 'BLOCK') return false;

    const afterCell = cellAt(row + dr * answer.length, col + dc * answer.length);
    if (afterCell && afterCell.type !== 'BLOCK') return false;

    for (let i = 0; i < answer.length; i++) {
      const lr = row + dr * i;
      const lc = col + dc * i;
      const cell = cellAt(lr, lc);
      if (!cell) return false;
      if (cell.type === 'CLUE') return false;

      const letter = answer[i];
      const isCrossing = cell.type === 'LETTER' && cell.answer === letter;
      if (cell.type === 'LETTER' && cell.answer !== letter) return false;

      if (arrowDir === 'RIGHT' && !isCrossing) {
        const up = cellAt(lr - 1, lc);
        const down = cellAt(lr + 1, lc);
        if (up && up.type !== 'BLOCK') return false;
        if (down && down.type !== 'BLOCK') return false;
      }

      if (arrowDir === 'DOWN' && !isCrossing) {
        const left = cellAt(lr, lc - 1);
        const right = cellAt(lr, lc + 1);
        if (left && left.type !== 'BLOCK') return false;
        if (right && right.type !== 'BLOCK') return false;
      }
    }

    return true;
  };

  const placeEntry = (row, col, clueText, answer, arrowDir) => {
    const normalized = normalizeAnswer(answer);
    const dr = arrowDir === 'DOWN' ? 1 : 0;
    const dc = arrowDir === 'RIGHT' ? 1 : 0;

    setCell(row - dr, col - dc, 'CLUE', {
      clueText,
      answer: normalized,
      arrowDir,
    });

    for (let i = 0; i < normalized.length; i++) {
      const lr = row + dr * i;
      const lc = col + dc * i;
      setCell(lr, lc, 'LETTER', { answer: normalized[i] });
    }
  };

  const candidateScore = (row, col, answer, arrowDir) => {
    const dr = arrowDir === 'DOWN' ? 1 : 0;
    const dc = arrowDir === 'RIGHT' ? 1 : 0;
    let crossingCount = 0;

    for (let i = 0; i < answer.length; i++) {
      const cell = cellAt(row + dr * i, col + dc * i);
      if (cell && cell.type === 'LETTER' && cell.answer === answer[i]) {
        crossingCount += 1;
      }
    }

    const centerRow = (H - 1) / 2;
    const centerCol = (W - 1) / 2;
    const distance = Math.abs(row - centerRow) + Math.abs(col - centerCol);
    return crossingCount * 100 - distance;
  };

  const findBestPlacement = (answer, usedLetters) => {
    let best = null;

    const tryCandidate = (row, col, arrowDir) => {
      if (!canPlace(row, col, answer, arrowDir)) return;
      const score = candidateScore(row, col, answer, arrowDir);
      if (!best || score > best.score) {
        best = { row, col, arrowDir, score };
      }
    };

    for (const letterCell of usedLetters) {
      for (let i = 0; i < answer.length; i++) {
        if (answer[i] !== letterCell.answer) continue;
        tryCandidate(letterCell.row, letterCell.col - i, 'RIGHT');
        tryCandidate(letterCell.row - i, letterCell.col, 'DOWN');
      }
    }

    if (best) return best;

    for (let row = 0; row < H; row++) {
      for (let col = 1; col < W; col++) {
        tryCandidate(row, col, 'RIGHT');
        tryCandidate(row, col, 'DOWN');
      }
    }

    return best;
  };

  const usedLetters = [];
  const skipped = [];

  const firstEntry = entryOrder[0];
  if (!firstEntry) return { grid, skipped };

  const firstRow = Math.floor(H / 2);
  const firstCol = Math.max(2, Math.floor((W - firstEntry.answer.length) / 2));
  if (!canPlace(firstRow, firstCol, firstEntry.answer, 'RIGHT')) {
    return { grid, skipped: entryOrder.slice() };
  }
  placeEntry(firstRow, firstCol, firstEntry.clueText, firstEntry.answer, 'RIGHT');
  for (let i = 0; i < firstEntry.answer.length; i++) {
    usedLetters.push({
      row: firstRow,
      col: firstCol + i,
      answer: firstEntry.answer[i],
    });
  }

  for (let i = 1; i < entryOrder.length; i++) {
    const entry = entryOrder[i];
    const placement = findBestPlacement(entry.answer, usedLetters);
    if (!placement) {
      skipped.push(entry);
      continue;
    }

    placeEntry(placement.row, placement.col, entry.clueText, entry.answer, placement.arrowDir);

    for (let j = 0; j < entry.answer.length; j++) {
      const row = placement.row + (placement.arrowDir === 'DOWN' ? j : 0);
      const col = placement.col + (placement.arrowDir === 'RIGHT' ? j : 0);
      const cell = cellAt(row, col);
      if (cell) {
        usedLetters.push({ row, col, answer: entry.answer[j] });
      }
    }
  }

  return { grid, skipped };
}

function buildGrid() {
  const normalize = (answer) => String(answer || '').trim().replace(/\s+/g, '').toUpperCase();
  const baseEntries = PUZZLE_ENTRIES.map((entry, index) => ({
    ...entry,
    index,
    answer: normalize(entry.answer),
  })).sort((a, b) => b.answer.length - a.answer.length || a.index - b.index);

  const orderings = [baseEntries];

  for (let attempt = 1; attempt <= 24; attempt++) {
    const shuffled = [...baseEntries];
    let seed = attempt * 1234567;
    for (let i = shuffled.length - 1; i > 0; i--) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const j = seed % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    shuffled.sort((a, b) => b.answer.length - a.answer.length);
    orderings.push(shuffled);
  }

  let best = null;
  for (const order of orderings) {
    const result = layoutOnce(order);
    if (!best || result.skipped.length < best.skipped.length) {
      best = result;
      if (best.skipped.length === 0) break;
    }
  }

  if (best.skipped.length > 0) {
    console.warn(`⚠️  ${best.skipped.length} ipucu yerleştirilemedi:`, best.skipped.map((e) => e.clueText));
  }

  return best.grid;
}

async function seedHurriyetKaragoz(prisma) {
  const title = "Hürriyet - Karagöz'de Kambur";

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

module.exports = seedHurriyetKaragoz;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetKaragoz(prisma)
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
