const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const width = 14;
  const height = 9;
  const clues = [
    { row: 0, col: 0, arrowDir: "RIGHT", clueText: "Berkelyum un simgesi", answer: "BK", answerLength: 2 },
    { row: 0, col: 0, arrowDir: "DOWN", clueText: "Eski dilde Kasım ayı", answer: "TEŞRİNİEVVEL", answerLength: 8 },
    { row: 0, col: 2, arrowDir: "RIGHT", clueText: "Çinko'nun simgesi\nSunulan şey", answer: "ZN", answerLength: 2 },
    { row: 0, col: 2, arrowDir: "DOWN", clueText: "Çinko'nun simgesi\nSunulan şey", answer: "SUNU", answerLength: 4 },
    { row: 0, col: 4, arrowDir: "RIGHT", clueText: "Alçı taşı\nCasus. Ajan", answer: "JİPS", answerLength: 4 },
    { row: 0, col: 4, arrowDir: "DOWN", clueText: "Alçı taşı\nCasus. Ajan", answer: "ÇAŞIT", answerLength: 5 },
    { row: 0, col: 6, arrowDir: "RIGHT", clueText: "Mekan, mahal\nBağnazlık", answer: "YER", answerLength: 3 },
    { row: 0, col: 6, arrowDir: "DOWN", clueText: "Mekan, mahal\nBağnazlık", answer: "TAASSUP", answerLength: 7 },
    { row: 0, col: 9, arrowDir: "RIGHT", clueText: "İnce kabuklu...\nRezonans", answer: "BADEM", answerLength: 5 },
    { row: 0, col: 9, arrowDir: "DOWN", clueText: "İnce kabuklu...\nRezonans", answer: "TINLAŞIM", answerLength: 8 },
    { row: 0, col: 11, arrowDir: "DOWN", clueText: "Suda soluma aracı", answer: "SOLUNGAÇ", answerLength: 8 },
    { row: 0, col: 13, arrowDir: "DOWN", clueText: "E. Mısır'da şehir devleti", answer: "NOM", answerLength: 3 },
    { row: 1, col: 12, arrowDir: "DOWN", clueText: "Libya'nın plaka işareti", answer: "LAR", answerLength: 3 },
    { row: 2, col: 0, arrowDir: "DOWN", clueText: "Değerli taşlarla donanmış", answer: "MURASSA", answerLength: 7 },
    { row: 2, col: 1, arrowDir: "DOWN", clueText: "Uranyum'un simgesi", answer: "U", answerLength: 1 },
    { row: 2, col: 3, arrowDir: "RIGHT", clueText: "Cihaz\nMaksimum", answer: "ALET", answerLength: 4 },
    { row: 2, col: 3, arrowDir: "DOWN", clueText: "Cihaz\nMaksimum", answer: "AZAMİ", answerLength: 5 },
    { row: 2, col: 11, arrowDir: "RIGHT", clueText: "Ölüm Tarihi (Kısaca)", answer: "ÖT", answerLength: 2 },
    { row: 3, col: 13, arrowDir: "DOWN", clueText: "Ayakkabının üst bölümü", answer: "SAYA", answerLength: 4 },
    { row: 4, col: 0, arrowDir: "DOWN", clueText: "Bir bitki türü", answer: "DARI", answerLength: 4 },
    { row: 4, col: 1, arrowDir: "RIGHT", clueText: "Öğütücü diş\nOperatör", answer: "AZI", answerLength: 3 },
    { row: 4, col: 1, arrowDir: "DOWN", clueText: "Öğütücü diş\nOperatör", answer: "OP", answerLength: 2 },
    { row: 4, col: 6, arrowDir: "RIGHT", clueText: "Bir tür makineli..\nEski dilde otlar", answer: "TÜFEK", answerLength: 5 },
    { row: 4, col: 6, arrowDir: "DOWN", clueText: "Bir tür makineli..\nEski dilde otlar", answer: "EŞA", answerLength: 3 },
    { row: 4, col: 11, arrowDir: "RIGHT", clueText: "Kuruş (Kısaca)\nBir renk", answer: "KR", answerLength: 2 },
    { row: 4, col: 11, arrowDir: "DOWN", clueText: "Kuruş (Kısaca)\nBir renk", answer: "AK", answerLength: 2 },
    { row: 5, col: 8, arrowDir: "RIGHT", clueText: "Öd", answer: "SAFRA", answerLength: 5 },
    { row: 5, col: 13, arrowDir: "DOWN", clueText: "Utanma duygusu", answer: "AR", answerLength: 2 },
    { row: 6, col: 8, arrowDir: "RIGHT", clueText: "Parça", answer: "PORSİYON", answerLength: 8 },
    { row: 7, col: 0, arrowDir: "DOWN", clueText: "Yiyicilik, rüşvet alma", answer: "İRTİŞA", answerLength: 6 },
    { row: 7, col: 2, arrowDir: "DOWN", clueText: "Tayland'ın plaka işareti", answer: "T", answerLength: 1 },
    { row: 7, col: 4, arrowDir: "RIGHT", clueText: "Endonezya 'nın para birimi", answer: "RUPİ", answerLength: 4 },
    { row: 7, col: 10, arrowDir: "RIGHT", clueText: "Hadise, vaka", answer: "OLAY", answerLength: 4 },
    { row: 8, col: 8, arrowDir: "RIGHT", clueText: "Eski bir çalgı", answer: "LİR", answerLength: 3 },
    { row: 8, col: 12, arrowDir: "RIGHT", clueText: "Arjantin'in plaka işareti", answer: "RA", answerLength: 2 }
  ];

  const grid = [];
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      grid.push({ row: r, col: c, type: 'BLOCK' });
    }
  }

  for (const clue of clues) {
    const dr = clue.arrowDir === 'DOWN' ? 1 : 0;
    const dc = clue.arrowDir === 'RIGHT' ? 1 : 0;
    const clueCell = grid.find((g) => g.row === clue.row && g.col === clue.col);
    if (clueCell) {
      clueCell.type = 'CLUE';
      clueCell.clueText = clue.clueText;
      clueCell.answer = clue.answer;
      clueCell.arrowDir = clue.arrowDir;
    }
    const len = clue.answer ? clue.answer.length : clue.answerLength;
    if (len > 0) {
      const startRow = clue.row + dr;
      const startCol = clue.col + dc;
      for (let i = 0; i < len; i++) {
        const lr = startRow + dr * i;
        const lc = startCol + dc * i;
        const cell = grid.find((g) => g.row === lr && g.col === lc);
        if (cell && cell.type !== 'CLUE') {
          cell.type = 'LETTER';
          cell.answer = clue.answer ? clue.answer[i] : "";
        }
      }
    }
  }

  // Create puzzle
  const puzzle = await prisma.puzzle.create({
    data: {
      title: "Özel Hürriyet Bulmacası (Kullanıcı İsteği)",
      categoryId: null, // Default category
      difficulty: "HARD",
      points: 250,
      width,
      height,
      gridData: JSON.stringify(grid)
    }
  });

  console.log("Bulmaca basariyla eklendi! ID:", puzzle.id);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
