const fs = require('fs');

const words = [
  { word: "SALAMURA", clue: "Tuzlu suda saklanan yiyecek", dir: "RIGHT" },
  { word: "MARTAVAL", clue: "Yalan dolan", dir: "RIGHT" },
  { word: "DESİSE", clue: "Düzen, hile", dir: "RIGHT" },
  { word: "TABAKA", clue: "Sınıf (sosyoloji)", dir: "RIGHT" },
  { word: "BEKRİ", clue: "Ayyaş", dir: "RIGHT" },
  { word: "NEBZE", clue: "Az bir miktar", dir: "RIGHT" },
  { word: "UYLUK", clue: "Kalçayla diz arası", dir: "RIGHT" },
  { word: "NİMET", clue: "Rızık", dir: "RIGHT" },
  { word: "AÇIK", clue: "Kapalı olmayan", dir: "RIGHT" },
  { word: "ABA", clue: "Kalın kaba kumaş", dir: "RIGHT" },
  { word: "FON", clue: "Ödenti", dir: "RIGHT" },
  { word: "ÇAK", clue: "Eski dilde yırtma", dir: "RIGHT" },
  { word: "EBE", clue: "Nine (halk ağzı)", dir: "RIGHT" },
  { word: "ZAM", clue: "Ekleme, katma, ilave etme", dir: "RIGHT" },
  { word: "RE", clue: "Viteste geri işareti", dir: "RIGHT" },
  { word: "AN", clue: "En kısa zaman", dir: "RIGHT" },
  { word: "LU", clue: "Lütesyum'un simgesi", dir: "RIGHT" },
  { word: "AB", clue: "Bir kan grubu", dir: "RIGHT" },
  { word: "MARLEY", clue: "Bir tür yer döşemesi", dir: "DOWN" },
  { word: "ÖRGÜTÜ", clue: "Uluslararası af...", dir: "DOWN" },
  { word: "İPTAL", clue: "Geçersiz kılma", dir: "DOWN" },
  { word: "İLKEL", clue: "İptidai", dir: "DOWN" },
  { word: "GAYE", clue: "Amaç, hedef", dir: "DOWN" },
  { word: "EKOL", clue: "Çığır, tarz", dir: "DOWN" },
  { word: "DAVA", clue: "Sav (hukuk)", dir: "DOWN" },
  { word: "EAT", clue: "Tanzanya plakası", dir: "DOWN" },
  { word: "HAS", clue: "Özel", dir: "DOWN" },
  { word: "KG", clue: "Kırgızistan'ın internet alanı", dir: "DOWN" }
];

const width = 15;
const height = 15;
const grid = Array.from({ length: height }, () => Array(width).fill(null));

function placeWord(wordObj, row, col) {
  if (wordObj.dir === 'RIGHT') {
    if (col + wordObj.word.length >= width) return false;
    for (let i = 0; i < wordObj.word.length + 1; i++) {
      if (grid[row][col + i] !== null && grid[row][col + i].letter !== (i === 0 ? '#' : wordObj.word[i - 1])) return false;
    }
    grid[row][col] = { type: 'CLUE', ...wordObj };
    for (let i = 0; i < wordObj.word.length; i++) {
      grid[row][col + 1 + i] = { type: 'LETTER', letter: wordObj.word[i] };
    }
  } else {
    if (row + wordObj.word.length >= height) return false;
    for (let i = 0; i < wordObj.word.length + 1; i++) {
      if (grid[row + i][col] !== null && grid[row + i][col].letter !== (i === 0 ? '#' : wordObj.word[i - 1])) return false;
    }
    grid[row][col] = { type: 'CLUE', ...wordObj };
    for (let i = 0; i < wordObj.word.length; i++) {
      grid[row + 1 + i][col] = { type: 'LETTER', letter: wordObj.word[i] };
    }
  }
  return true;
}

let placed = [];
for (const word of words) {
  let isPlaced = false;
  for (let r = 0; r < height && !isPlaced; r++) {
    for (let c = 0; c < width && !isPlaced; c++) {
      if (grid[r][c] === null) {
        if (placeWord(word, r, c)) {
          isPlaced = true;
          placed.push(word);
        }
      }
    }
  }
  if (!isPlaced) console.log("FAILED TO PLACE", word.word);
}

const gridData = [];
for (let r = 0; r < height; r++) {
  for (let c = 0; c < width; c++) {
    const cell = grid[r][c];
    if (cell === null) {
      gridData.push({ row: r, col: c, type: 'BLOCK' });
    } else if (cell.type === 'CLUE') {
      gridData.push({ row: r, col: c, type: 'CLUE', arrowDir: cell.dir, clueText: cell.clue, ans: cell.word });
    } else if (cell.type === 'LETTER') {
      gridData.push({ row: r, col: c, type: 'LETTER', answer: cell.letter });
    }
  }
}

fs.writeFileSync('generated_grid.json', JSON.stringify(gridData, null, 2));
console.log("Generated gridData for", placed.length, "words");
