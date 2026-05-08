const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const width = 14;
  const height = 9;

  const clues = [
    { row: 0, col: 0, dr: 0, dc: 1, text: "Berkelyum un simgesi", ans: "BK", len: 1 },
    { row: 0, col: 0, dr: 1, dc: 0, text: "Eski dilde Kasım ayı", ans: "TEŞRİN", len: 8 },
    { row: 0, col: 2, dr: 0, dc: 1, text: "Çinko'nun simgesi", ans: "ZN", len: 1 },
    { row: 0, col: 2, dr: 1, dc: 0, text: "Sunulan şey", ans: "SUNU", len: 4 },
    { row: 0, col: 4, dr: 0, dc: 1, text: "Alçı taşı", ans: "JİPS", len: 1 },
    { row: 0, col: 4, dr: 1, dc: 0, text: "Casus. Ajan", ans: "ÇAŞIT", len: 5 },
    { row: 0, col: 6, dr: 0, dc: 1, text: "Mekan, mahal", ans: "YER", len: 1 },
    { row: 0, col: 6, dr: 1, dc: 0, text: "Bağnazlık", ans: "TAASSUP", len: 7 },
    { row: 0, col: 8, dr: 0, dc: 1, text: "İnce kabuklu...", ans: "BADEM", len: 1 },
    { row: 0, col: 8, dr: 1, dc: 0, text: "Rezonans", ans: "TIN", len: 8 },
    { row: 0, col: 10, dr: 1, dc: 0, text: "Suda soluma aracı", ans: "SOLUNGAÇ", len: 8 },
    { row: 0, col: 12, dr: 1, dc: 0, text: "E. Mısır'da şehir devleti", ans: "NOM", len: 3 },
    
    { row: 1, col: 12, dr: 0, dc: 1, text: "Libya'nın plaka işareti", ans: "LAR", len: 1 },
    
    { row: 2, col: 0, dr: 1, dc: 0, text: "Değerli taşlarla donanmış", ans: "MURASSA", len: 6 },
    { row: 2, col: 1, dr: 1, dc: 0, text: "Uranyum'un simgesi", ans: "U", len: 1 },
    { row: 2, col: 3, dr: 0, dc: 1, text: "Cihaz", ans: "ALET", len: 1 },
    { row: 2, col: 3, dr: 1, dc: 0, text: "Maksimum", ans: "AZAMİ", len: 5 },
    { row: 2, col: 11, dr: 0, dc: 1, text: "Ölüm Tarihi (Kısaca)", ans: "ÖT", len: 2 },
    
    { row: 3, col: 12, dr: 0, dc: 1, text: "Ayakkabının üst bölümü", ans: "SAYA", len: 1 },
    
    { row: 4, col: 0, dr: 1, dc: 0, text: "Bir bitki türü", ans: "DARI", len: 4 },
    { row: 4, col: 1, dr: 0, dc: 1, text: "Öğütücü diş", ans: "AZI", len: 1 },
    { row: 4, col: 1, dr: 1, dc: 0, text: "Operatör", ans: "OP", len: 2 },
    { row: 4, col: 6, dr: 0, dc: 1, text: "Bir tür makineli..", ans: "TÜFEK", len: 1 },
    { row: 4, col: 6, dr: 1, dc: 0, text: "Eski dilde otlar", ans: "EŞA", len: 3 },
    { row: 4, col: 11, dr: 0, dc: 1, text: "Kuruş (Kısaca)", ans: "KR", len: 2 },
    { row: 4, col: 11, dr: 1, dc: 0, text: "Bir renk", ans: "AK", len: 2 },
    
    { row: 5, col: 7, dr: 0, dc: 1, text: "Öd", ans: "SAFRA", len: 2 },
    { row: 5, col: 12, dr: 1, dc: 0, text: "Utanma duygusu", ans: "AR", len: 3 },
    
    { row: 6, col: 7, dr: 0, dc: 1, text: "Parça", ans: "PORSİYON", len: 2 },
    
    { row: 7, col: 0, dr: 1, dc: 0, text: "Yiyicilik, rüşvet alma", ans: "İRTİŞA", len: 1 },
    { row: 7, col: 2, dr: 1, dc: 0, text: "Tayland'ın plaka işareti", ans: "T", len: 1 },
    { row: 7, col: 4, dr: 0, dc: 1, text: "Endonezya 'nın para birimi", ans: "RUPİ", len: 2 },
    { row: 7, col: 9, dr: 0, dc: 1, text: "Hadise, vaka", ans: "OLAY", len: 4 },
    
    { row: 8, col: 7, dr: 0, dc: 1, text: "Eski bir çalgı", ans: "LİR", len: 2 },
    { row: 8, col: 11, dr: 0, dc: 1, text: "Arjantin'in plaka işareti", ans: "RA", len: 2 } 
  ];

  const grid = [];
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      grid.push({ row: r, col: c, type: 'BLOCK' });
    }
  }

  for (const clue of clues) {
    const clueCell = grid.find((g) => g.row === clue.row && g.col === clue.col);
    if (clueCell) {
      clueCell.type = 'CLUE';
      clueCell.clueText = clue.text;
      clueCell.answer = clue.ans;
      clueCell.arrowDir = clue.dr === 1 ? 'DOWN' : 'RIGHT';
    }
    
    const startRow = clue.row + clue.dr;
    const startCol = clue.col + clue.dc;
    for (let i = 0; i < clue.len; i++) {
      const lr = startRow + clue.dr * i;
      const lc = startCol + clue.dc * i;
      const cell = grid.find((g) => g.row === lr && g.col === lc);
      if (cell && cell.type !== 'CLUE') {
        cell.type = 'LETTER';
        cell.answer = clue.ans ? clue.ans[i] : "";
      }
    }
  }

  const puzzle = await prisma.puzzle.create({
    data: {
      title: "Arjantin Düzeltilmiş (Yeni)",
      categoryId: null,
      difficulty: "HARD",
      points: 250,
      width,
      height,
      gridData: JSON.stringify(grid)
    }
  });

  console.log("Duzeltilmis bulmaca eklendi: " + puzzle.id);
}

main().finally(() => prisma.$disconnect());
