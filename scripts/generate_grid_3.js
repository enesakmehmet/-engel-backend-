const fs = require('fs');

const words = [
  { word: "HADİSE", clue: "Olay / Resimdeki ünlü pop şarkıcımız", dir: "RIGHT" },
  { word: "KAVARA", clue: "Balı alınmış petek", dir: "RIGHT" },
  { word: "VİYA", clue: "Gemiyi düz yürütme", dir: "RIGHT" },
  { word: "BARAKA", clue: "Eğreti yapı", dir: "DOWN" },
  { word: "OBUA", clue: "Tahtadan nefesli bir çalgı", dir: "DOWN" },
  { word: "RİDA", clue: "Derviş omuz örtüsü", dir: "DOWN" },
  { word: "ZAYİ", clue: "Kayıp", dir: "DOWN" },
  { word: "ASIR", clue: "Yüzyıl", dir: "RIGHT" },
  { word: "TOKLU", clue: "Bir yıllık kuzu", dir: "RIGHT" },
  { word: "GRAVÜR", clue: "Oyma baskı", dir: "RIGHT" },
  { word: "TERSANE", clue: "Gemi yapılan yer", dir: "RIGHT" },
  { word: "KÜNDE", clue: "Güreşte bir oyun", dir: "RIGHT" },
  { word: "RAFTİNG", clue: "Akarsu krosu", dir: "RIGHT" },
  { word: "EŞSİZ", clue: "İyi, güzel, mükemmel", dir: "RIGHT" },
  { word: "İMKAN", clue: "Olanak", dir: "RIGHT" },
  { word: "GASP", clue: "Bir malı izinsiz zorla alma", dir: "RIGHT" },
  { word: "DEK", clue: "Hile, düzen", dir: "RIGHT" },
  { word: "ŞOM", clue: "Uğursuz", dir: "RIGHT" },
  { word: "MOR", clue: "Kırmızı, mavi karışımı renk", dir: "RIGHT" },
  { word: "AHD", clue: "Antlaşma", dir: "RIGHT" },
  { word: "HEP", clue: "Her zaman", dir: "RIGHT" },
  { word: "ÜTÜ", clue: "Kırışık giderme aracı", dir: "RIGHT" },
  { word: "ÜLKÜ", clue: "İdeal", dir: "RIGHT" },
  { word: "GAR", clue: "Büyük tren istasyonu", dir: "RIGHT" },
  { word: "ALG", clue: "Su yosunu", dir: "RIGHT" },
  { word: "GÜR", clue: "Dolu, çok", dir: "RIGHT" },
  { word: "AZA", clue: "Üye", dir: "RIGHT" },
  { word: "ARA", clue: "Mesafe", dir: "RIGHT" },
  { word: "NAM", clue: "Ad, unvan", dir: "RIGHT" }
];

const width = 16;
const height = 16;
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

fs.writeFileSync('generated_grid_3.json', JSON.stringify(gridData, null, 2));
console.log("Generated gridData for", placed.length, "words");
