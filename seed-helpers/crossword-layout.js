/**
 * Ortak çengel bulmaca yerleşim algoritması.
 * Tüm Hürriyet puzzle seed'leri tarafından kullanılır.
 */

const normalizeAnswer = (answer) =>
  String(answer || '').trim().replace(/\s+/g, '').toUpperCase();

function layoutOnce(entryOrder, W, H) {
  const grid = [];
  for (let r = 0; r < H; r++)
    for (let c = 0; c < W; c++)
      grid.push({ row: r, col: c, type: 'BLOCK' });

  const cellMap = new Map(grid.map((cell) => [`${cell.row}-${cell.col}`, cell]));
  const cellAt = (row, col) => cellMap.get(`${row}-${col}`) || null;
  const setCell = (row, col, type, extra = {}) => {
    const cell = cellAt(row, col);
    if (!cell) return null;
    Object.assign(cell, { row, col, type }, extra);
    return cell;
  };

  const canPlace = (row, col, answer, arrowDir) => {
    const dr = arrowDir === 'DOWN' ? 1 : 0;
    const dc = arrowDir === 'RIGHT' ? 1 : 0;
    if (row - dr < 0 || col - dc < 0) return false;
    const clueCell = cellAt(row - dr, col - dc);
    if (!clueCell || clueCell.type !== 'BLOCK') return false;
    const afterCell = cellAt(row + dr * answer.length, col + dc * answer.length);
    if (afterCell && afterCell.type !== 'BLOCK') return false;
    for (let i = 0; i < answer.length; i++) {
      const lr = row + dr * i, lc = col + dc * i;
      const cell = cellAt(lr, lc);
      if (!cell) return false;
      if (cell.type === 'CLUE') return false;
      const letter = answer[i];
      const isCrossing = cell.type === 'LETTER' && cell.answer === letter;
      if (cell.type === 'LETTER' && cell.answer !== letter) return false;
      if (arrowDir === 'RIGHT' && !isCrossing) {
        const up = cellAt(lr - 1, lc), down = cellAt(lr + 1, lc);
        if (up && up.type !== 'BLOCK') return false;
        if (down && down.type !== 'BLOCK') return false;
      }
      if (arrowDir === 'DOWN' && !isCrossing) {
        const left = cellAt(lr, lc - 1), right = cellAt(lr, lc + 1);
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
    setCell(row - dr, col - dc, 'CLUE', { clueText, answer: normalized, arrowDir });
    for (let i = 0; i < normalized.length; i++)
      setCell(row + dr * i, col + dc * i, 'LETTER', { answer: normalized[i] });
  };

  const candidateScore = (row, col, answer, arrowDir) => {
    const dr = arrowDir === 'DOWN' ? 1 : 0;
    const dc = arrowDir === 'RIGHT' ? 1 : 0;
    let crossingCount = 0;
    for (let i = 0; i < answer.length; i++) {
      const cell = cellAt(row + dr * i, col + dc * i);
      if (cell && cell.type === 'LETTER' && cell.answer === answer[i]) crossingCount++;
    }
    return crossingCount * 100 - (Math.abs(row - (H - 1) / 2) + Math.abs(col - (W - 1) / 2));
  };

  const findBestPlacement = (answer, usedLetters) => {
    let best = null;
    const tryCandidate = (row, col, arrowDir) => {
      if (!canPlace(row, col, answer, arrowDir)) return;
      const score = candidateScore(row, col, answer, arrowDir);
      if (!best || score > best.score) best = { row, col, arrowDir, score };
    };
    for (const lc of usedLetters)
      for (let i = 0; i < answer.length; i++) {
        if (answer[i] !== lc.answer) continue;
        tryCandidate(lc.row, lc.col - i, 'RIGHT');
        tryCandidate(lc.row - i, lc.col, 'DOWN');
      }
    if (best) return best;
    for (let row = 0; row < H; row++)
      for (let col = 1; col < W; col++) {
        tryCandidate(row, col, 'RIGHT');
        tryCandidate(row, col, 'DOWN');
      }
    return best;
  };

  const usedLetters = [], skipped = [];
  const firstEntry = entryOrder[0];
  if (!firstEntry) return { grid, skipped };
  const firstRow = Math.floor(H / 2);
  const firstCol = Math.max(2, Math.floor((W - firstEntry.answer.length) / 2));
  if (!canPlace(firstRow, firstCol, firstEntry.answer, 'RIGHT'))
    return { grid, skipped: entryOrder.slice() };
  placeEntry(firstRow, firstCol, firstEntry.clueText, firstEntry.answer, 'RIGHT');
  for (let i = 0; i < firstEntry.answer.length; i++)
    usedLetters.push({ row: firstRow, col: firstCol + i, answer: firstEntry.answer[i] });

  for (let i = 1; i < entryOrder.length; i++) {
    const entry = entryOrder[i];
    const placement = findBestPlacement(entry.answer, usedLetters);
    if (!placement) { skipped.push(entry); continue; }
    placeEntry(placement.row, placement.col, entry.clueText, entry.answer, placement.arrowDir);
    for (let j = 0; j < entry.answer.length; j++) {
      const row = placement.row + (placement.arrowDir === 'DOWN' ? j : 0);
      const col = placement.col + (placement.arrowDir === 'RIGHT' ? j : 0);
      if (cellAt(row, col)) usedLetters.push({ row, col, answer: entry.answer[j] });
    }
  }
  return { grid, skipped };
}

function buildGrid(entries, W, H) {
  // İlk entry = bulmacanın ana başlığı, mutlaka yerleşmeli → pin'liyoruz.
  const normalized = entries.map((entry, index) => ({
    ...entry, index, answer: normalizeAnswer(entry.answer),
  }));
  const pinned = normalized[0];
  const rest = normalized.slice(1).sort((a, b) =>
    b.answer.length - a.answer.length || a.index - b.index
  );

  const buildOrder = (shuffleSeed) => {
    if (shuffleSeed === 0) return [pinned, ...rest];
    const arr = [...rest];
    let seed = shuffleSeed * 1234567;
    for (let i = arr.length - 1; i > 0; i--) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const j = seed % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    arr.sort((a, b) => b.answer.length - a.answer.length);
    return [pinned, ...arr];
  };

  let best = null;
  for (let attempt = 0; attempt <= 30; attempt++) {
    const result = layoutOnce(buildOrder(attempt), W, H);
    if (!best || result.skipped.length < best.skipped.length) {
      best = result;
      if (best.skipped.length === 0) break;
    }
  }

  // Atılanlar için son şans: çapraz şartı olmaksızın, izole alana yerleştir.
  if (best.skipped.length > 0) {
    best = forcePlaceSkipped(best, W, H);
  }

  if (best.skipped.length > 0) {
    console.warn(`⚠️  ${best.skipped.length} ipucu yerleştirilemedi:`, best.skipped.map((e) => e.clueText));
  }
  return best.grid;
}

// Atılan ipuçlarını izole boş alanlara, çapraz şartı olmadan yerleştir.
function forcePlaceSkipped({ grid, skipped }, W, H) {
  const cellMap = new Map(grid.map((cell) => [`${cell.row}-${cell.col}`, cell]));
  const cellAt = (row, col) => cellMap.get(`${row}-${col}`) || null;
  const setCell = (row, col, type, extra = {}) => {
    const cell = cellAt(row, col);
    if (!cell) return;
    Object.assign(cell, { row, col, type }, extra);
  };

  const stillSkipped = [];

  const canForcePlace = (row, col, answer, arrowDir) => {
    const dr = arrowDir === 'DOWN' ? 1 : 0;
    const dc = arrowDir === 'RIGHT' ? 1 : 0;
    if (row - dr < 0 || col - dc < 0) return false;
    const clueCell = cellAt(row - dr, col - dc);
    if (!clueCell || clueCell.type !== 'BLOCK') return false;
    const afterCell = cellAt(row + dr * answer.length, col + dc * answer.length);
    if (afterCell && afterCell.type !== 'BLOCK') return false;
    for (let i = 0; i < answer.length; i++) {
      const lr = row + dr * i, lc = col + dc * i;
      const cell = cellAt(lr, lc);
      if (!cell || cell.type !== 'BLOCK') return false;
      // Komşu hücreler de tamamen boş olmalı (yan yana harf oluşmasın).
      if (arrowDir === 'RIGHT') {
        const up = cellAt(lr - 1, lc), down = cellAt(lr + 1, lc);
        if (up && up.type !== 'BLOCK') return false;
        if (down && down.type !== 'BLOCK') return false;
      } else {
        const left = cellAt(lr, lc - 1), right = cellAt(lr, lc + 1);
        if (left && left.type !== 'BLOCK') return false;
        if (right && right.type !== 'BLOCK') return false;
      }
    }
    return true;
  };

  const placeForced = (row, col, entry, arrowDir) => {
    const dr = arrowDir === 'DOWN' ? 1 : 0;
    const dc = arrowDir === 'RIGHT' ? 1 : 0;
    setCell(row - dr, col - dc, 'CLUE', { clueText: entry.clueText, answer: entry.answer, arrowDir });
    for (let i = 0; i < entry.answer.length; i++) {
      setCell(row + dr * i, col + dc * i, 'LETTER', { answer: entry.answer[i] });
    }
  };

  for (const entry of skipped) {
    let placed = false;
    for (let row = 0; row < H && !placed; row++) {
      for (let col = 1; col < W && !placed; col++) {
        if (canForcePlace(row, col, entry.answer, 'RIGHT')) {
          placeForced(row, col, entry, 'RIGHT');
          placed = true;
        } else if (canForcePlace(row, col, entry.answer, 'DOWN')) {
          placeForced(row, col, entry, 'DOWN');
          placed = true;
        }
      }
    }
    if (!placed) stillSkipped.push(entry);
  }

  return { grid, skipped: stillSkipped };
}

async function upsertPuzzle(prisma, { title, entries, W, H, points = 150, difficulty = 'MEDIUM' }) {
  const existing = await prisma.puzzle.findFirst({ where: { title } });
  if (existing) {
    console.log(`"${title}" zaten mevcut, güncelleniyor...`);
    await prisma.puzzle.update({
      where: { id: existing.id },
      data: { gridData: buildGrid(entries, W, H), width: W, height: H, difficulty, points },
    });
    console.log('✅ Güncellendi.');
  } else {
    const category = await prisma.category.findFirst({ where: { name: 'Genel Kültür' } });
    await prisma.puzzle.create({
      data: {
        title, difficulty, width: W, height: H, points,
        categoryId: category?.id || null,
        gridData: buildGrid(entries, W, H),
        isActive: true,
      },
    });
    console.log(`✅ "${title}" eklendi.`);
  }
}

module.exports = { layoutOnce, buildGrid, upsertPuzzle, normalizeAnswer };
