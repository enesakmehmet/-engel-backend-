const { PrismaClient } = require('@prisma/client');

/**
 * "İşletmen" - Hürriyet Çengel Bulmaca
 * Grid: 22 sütun × 15 satır
 */

const W = 22;
const H = 15;

const PUZZLE_ENTRIES = [
  { clueText: 'İşletmen', answer: 'OPERATÖR' },
  { clueText: 'İnce urgan', answer: 'SİCİM' },
  { clueText: 'Tıraş etme, kazıma', answer: 'HALK' },
  { clueText: "Yer demirinin simgesi", answer: 'FE' },
  { clueText: 'Uzay', answer: 'FEZA' },
  { clueText: 'Bir çeşit papağan', answer: 'ARA' },
  { clueText: 'Kavuk tülbenti', answer: 'ABANİ' },
  { clueText: 'Koyu pekmez', answer: 'KARA' },
  { clueText: 'Karşıt anlamlı', answer: 'ZIT' },
  { clueText: 'Pamuk kozası', answer: 'KOZA' },
  { clueText: "Berkelyumun simgesi", answer: 'BK' },
  { clueText: 'En küçük izci', answer: 'YAVRUKURT' },
  { clueText: 'Bir opera parçası', answer: 'ARYA' },
  { clueText: 'Adlar, isimler', answer: 'İSİMLER' },
  { clueText: 'Akılsız, budala', answer: 'AHMAK' },
  { clueText: 'Panik', answer: 'ÜRKÜ' },
  { clueText: 'Mecburiyet', answer: 'ZORUNLULUK' },
  { clueText: 'Patlak çukur', answer: 'KÜVET' },
  { clueText: 'Soğanlı bir süs bitkisi', answer: 'LALE' },
  { clueText: 'Büyük keman', answer: 'VİYOLA' },
  { clueText: 'Gösteriş, çalım', answer: 'FİYAKA' },
  { clueText: 'Alfabenin ilk harfi', answer: 'A' },
  { clueText: 'Sıva aracı', answer: 'MALA' },
  { clueText: 'Zaviye', answer: 'AÇI' },
  { clueText: 'Eski dilde parlama', answer: 'LEMA' },
  { clueText: 'Su yolu', answer: 'KANAL' },
  { clueText: 'Şili plakası', answer: 'RCH' },
  { clueText: "Çin'in eski para birimi", answer: 'YUAN' },
  { clueText: 'Tehlike işareti', answer: 'SOS' },
  { clueText: 'İlaç, çare, deva', answer: 'İLAÇ' },
  { clueText: "Fas'ın plakası", answer: 'MA' },
  { clueText: "Kobalt'ın simgesi", answer: 'CO' },
  { clueText: 'İntikam', answer: 'ÖÇ' },
  { clueText: 'Baharlı bir bitki', answer: 'KEKİK' },
  { clueText: 'Sarımsaklı yiyecek', answer: 'CACIK' },
  { clueText: 'Botanikte köksap', answer: 'RİZOM' },
  { clueText: 'Gökteki ay', answer: 'KAMER' },
  { clueText: 'Üçüncü tekil şahıs', answer: 'O' },
];

function layoutOnce(entryOrder) {
  const grid = [];
  for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) grid.push({ row: r, col: c, type: 'BLOCK' });
  const cellMap = new Map(grid.map((cell) => [`${cell.row}-${cell.col}`, cell]));
  const cellAt = (row, col) => cellMap.get(`${row}-${col}`) || null;
  const setCell = (row, col, type, extra = {}) => {
    const cell = cellAt(row, col);
    if (!cell) return null;
    Object.assign(cell, { row, col, type }, extra);
    return cell;
  };
  const normalizeAnswer = (a) => String(a || '').trim().replace(/\s+/g, '').toUpperCase();
  const canPlace = (row, col, answer, arrowDir) => {
    const dr = arrowDir === 'DOWN' ? 1 : 0;
    const dc = arrowDir === 'RIGHT' ? 1 : 0;
    if (row - dr < 0 || col - dc < 0) return false;
    const clueCell = cellAt(row - dr, col - dc);
    if (!clueCell || clueCell.type !== 'BLOCK') return false;
    const beforeCell = cellAt(row - dr, col - dc);
    if (beforeCell && beforeCell.type !== 'BLOCK') return false;
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
    for (let i = 0; i < normalized.length; i++) setCell(row + dr * i, col + dc * i, 'LETTER', { answer: normalized[i] });
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
    for (const lc of usedLetters) for (let i = 0; i < answer.length; i++) {
      if (answer[i] !== lc.answer) continue;
      tryCandidate(lc.row, lc.col - i, 'RIGHT');
      tryCandidate(lc.row - i, lc.col, 'DOWN');
    }
    if (best) return best;
    for (let row = 0; row < H; row++) for (let col = 1; col < W; col++) {
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
  if (!canPlace(firstRow, firstCol, firstEntry.answer, 'RIGHT')) return { grid, skipped: entryOrder.slice() };
  placeEntry(firstRow, firstCol, firstEntry.clueText, firstEntry.answer, 'RIGHT');
  for (let i = 0; i < firstEntry.answer.length; i++) usedLetters.push({ row: firstRow, col: firstCol + i, answer: firstEntry.answer[i] });
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

function buildGrid() {
  const normalize = (a) => String(a || '').trim().replace(/\s+/g, '').toUpperCase();
  const baseEntries = PUZZLE_ENTRIES.map((entry, index) => ({ ...entry, index, answer: normalize(entry.answer) }))
    .sort((a, b) => b.answer.length - a.answer.length || a.index - b.index);
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

async function seedHurriyetIsletmen(prisma) {
  const title = 'Hürriyet - İşletmen';
  const existing = await prisma.puzzle.findFirst({ where: { title } });
  if (existing) {
    console.log(`"${title}" zaten mevcut, güncelleniyor...`);
    await prisma.puzzle.update({
      where: { id: existing.id },
      data: { gridData: buildGrid(), width: W, height: H, difficulty: 'MEDIUM', points: 150 },
    });
    console.log('✅ Güncellendi.');
  } else {
    const category = await prisma.category.findFirst({ where: { name: 'Genel Kültür' } });
    await prisma.puzzle.create({
      data: {
        title, difficulty: 'MEDIUM', width: W, height: H, points: 150,
        categoryId: category?.id || null, gridData: buildGrid(), isActive: true,
      },
    });
    console.log(`✅ "${title}" eklendi.`);
  }
}

module.exports = seedHurriyetIsletmen;

if (require.main === module) {
  const prisma = new PrismaClient();
  seedHurriyetIsletmen(prisma)
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
