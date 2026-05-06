const fs = require('fs');

const words = [
  { word: "PİNHAN", clue: "Gizli, saklı, gizlenmiş", dir: "DOWN" },
  { word: "VADE", clue: "Kullanım süresi", dir: "DOWN" },
  { word: "TTK", clue: "Türk Tarih Kurumu", dir: "DOWN" },
  { word: "TRİO", clue: "Müzikte üçlü", dir: "DOWN" },
  { word: "RAFTİNG", clue: "Akarsu krosu", dir: "DOWN" },
  { word: "İLLEGAL", clue: "Meşru olmayan", dir: "DOWN" },
  { word: "VİDO", clue: "Bir bezik oyunu", dir: "DOWN" },
  { word: "BORAN", clue: "Karabulut", dir: "DOWN" },
  { word: "EMRAZ", clue: "Hastalıklar", dir: "DOWN" },
  { word: "NİKBİN", clue: "İyimser, optimist", dir: "RIGHT" },
  { word: "LOSTROMO", clue: "Gemide tayfa başı", dir: "RIGHT" },
  { word: "ENA", clue: "Kara yumuşakçası", dir: "RIGHT" },
  { word: "AYN", clue: "Eski dilde göz", dir: "RIGHT" },
  { word: "İMTİNA", clue: "Çekinme, sakınma", dir: "RIGHT" },
  { word: "BAYAĞI", clue: "Değersiz, sıradan", dir: "RIGHT" },
  { word: "FAZ", clue: "Evre (Elektrik)", dir: "RIGHT" },
  { word: "NAURE", clue: "Su dolabı", dir: "RIGHT" },
  { word: "MASAL", clue: "Hikaye, fıkra", dir: "RIGHT" },
  { word: "BEYN", clue: "Eski dilde uzaklık, ara", dir: "RIGHT" },
  { word: "TAASSUP", clue: "Bağnazlık", dir: "RIGHT" }
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

fs.writeFileSync('generated_grid_2.json', JSON.stringify(gridData, null, 2));
console.log("Generated gridData for", placed.length, "words");
