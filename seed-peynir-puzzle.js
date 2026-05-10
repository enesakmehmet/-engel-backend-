const { PrismaClient } = require('@prisma/client');

/**
 * "Bir tür peynir" - Hürriyet Çengel Bulmaca
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
  { clueText: 'Bir tür peynir', answer: 'KAŞAR' },
  { clueText: 'Basıcı, yayıncı', answer: 'NAŞİR' },
  { clueText: 'Sinema oyuncusu', answer: 'ARTİST' },
  { clueText: 'Eski dilde kovma', answer: 'TARD' },
  { clueText: 'Kumar oyunu', answer: 'POKER' },
  { clueText: 'Yayla atılan', answer: 'OK' },
  { clueText: "Antimon'un simgesi", answer: 'SB' },
  { clueText: "Çin'in para birimi", answer: 'YUAN' },
  { clueText: 'Ferman', answer: 'BUYRUK' },
  { clueText: 'Lübnan plakası', answer: 'RL' },
  { clueText: 'Büyük tencere', answer: 'KAZAN' },
  { clueText: 'Yardımcı yemek', answer: 'GARNİTÜR' },
  { clueText: 'Mersin\'deki antik bir şehir', answer: 'SOLİ' },
  { clueText: 'Tibet öküzü', answer: 'YAK' },
  { clueText: 'Bir cins orkide', answer: 'SALEP' },
  { clueText: 'Sayı boncuğu', answer: 'ABAKÜS' },
  { clueText: 'Bayındırlık', answer: 'İMAR' },
  { clueText: 'Peygamber', answer: 'NEBİ' },
  { clueText: 'Bıkma, usanma', answer: 'USANÇ' },
  { clueText: 'Çok tanrılı dinden', answer: 'PAGAN' },
  { clueText: 'Bir harman türü', answer: 'SAMAN' },
  { clueText: 'Tavır, davranış', answer: 'EDA' },
  { clueText: 'Anadolu ajansı', answer: 'AA' },
  { clueText: 'Bezginlik anlatan sözcük', answer: 'OF' },
  { clueText: 'Özgür', answer: 'HÜR' },
  { clueText: 'Çarpık, eğri ağız', answer: 'YAMUK' },
  { clueText: 'Dağdan inen sel', answer: 'SEYL' },
  { clueText: 'Standart boyutlu', answer: 'NORMAL' },
  { clueText: 'Saflık derecesi', answer: 'AYAR' },
  { clueText: 'Limited (Kısaltma)', answer: 'LTD' },
  { clueText: 'Sevgilinin dudağı', answer: 'LEB' },
  { clueText: 'Eski Sümer su tanrısı', answer: 'ENKİ' },
  { clueText: "İsrail'in plakası", answer: 'IL' },
  { clueText: "Ukrayna'nın plakası", answer: 'UA' },
  { clueText: 'O yere, o yöne', answer: 'ORA' },
  { clueText: 'Göçebelik', answer: 'GÖÇERLİK' },
  { clueText: 'Ailesine bakan / Yoksul', answer: 'AİL' },
  { clueText: 'Alfabenin ilk harfi', answer: 'A' },
  { clueText: 'Bir cins orkide (2)', answer: 'VANİLYA' },
  { clueText: 'Lantanın simgesi', answer: 'LA' },
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

async function seedHurriyetPeynir(prisma) {
  const title = 'Hürriyet - Bir Tür Peynir';

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

module.exports = seedHurriyetPeynir;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetPeynir(prisma)
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
