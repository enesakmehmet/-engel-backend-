const fs = require('fs');

const words = [
  { word: "SPAM", clue: "İstenilmeyen e-posta", dir: "RIGHT" },
  { word: "İDE", clue: "Düşünce", dir: "RIGHT" },
  { word: "TEVCİH", clue: "Yöneltme", dir: "RIGHT" },
  { word: "ZR", clue: "Zirkonyum simgesi", dir: "RIGHT" },
  { word: "KU", clue: "Kurçatovyum simgesi", dir: "RIGHT" },
  { word: "ŞAL", clue: "Uzun omuz atkısı", dir: "RIGHT" },
  { word: "ISI", clue: "Hararet", dir: "RIGHT" },
  { word: "İL", clue: "Vilayet", dir: "RIGHT" },
  { word: "LENS", clue: "Mercek", dir: "RIGHT" },
  { word: "RG", clue: "Röntgenyum simgesi", dir: "RIGHT" },
  { word: "HAP", clue: "Yutularak alınan ilaç", dir: "RIGHT" },
  { word: "İM", clue: "İşaret, alamet", dir: "RIGHT" },
  { word: "ATA", clue: "Geçmişteki büyükler", dir: "RIGHT" },
  { word: "MANGAL", clue: "Üstü açık ayaklı ocak", dir: "RIGHT" },
  { word: "IH", clue: "Deveyi çöktürme komutu", dir: "RIGHT" },
  { word: "MİKADO", clue: "Japon imparatoru", dir: "RIGHT" },
  { word: "OD", clue: "Ateş", dir: "RIGHT" },
  { word: "İSEVİ", clue: "Hıristiyan", dir: "RIGHT" },
  { word: "AME", clue: "Divit, yazı hokkası", dir: "RIGHT" },
  { word: "AİL", clue: "Ailesine bakan", dir: "RIGHT" },
  { word: "AİLE", clue: "Familya", dir: "RIGHT" },
  { word: "GRAM", clue: "Bir ağırlık ölçüsü", dir: "RIGHT" },
  { word: "AFET", clue: "Yıkım, kıran", dir: "RIGHT" },
  { word: "ADET", clue: "Tane", dir: "RIGHT" },
  { word: "HAPİS", clue: "Cezaevi cezası", dir: "RIGHT" },
  { word: "SÜREK", clue: "Toplu olarak ava çıkma", dir: "RIGHT" },
  { word: "TUNA", clue: "Avrupa'da bir nehir", dir: "RIGHT" },
  { word: "HOL", clue: "Sofa", dir: "RIGHT" },
  { word: "GEREDE", clue: "Bolu ilçesi", dir: "RIGHT" },
  { word: "ABES", clue: "Saçma sapan söz", dir: "RIGHT" },
  { word: "SAHİ", clue: "Doğrusu, gerçekten", dir: "RIGHT" },
  { word: "KARARGAH", clue: "Askeri harekat merkezi", dir: "RIGHT" },
  { word: "KLOR", clue: "Dezenfekte aracı", dir: "RIGHT" },
  { word: "ODA", clue: "Ev bölümü", dir: "RIGHT" },
  { word: "NEFİY", clue: "Sürgün", dir: "RIGHT" },
  { word: "BORA", clue: "Bir tür şiddetli fırtına", dir: "RIGHT" },
  { word: "ALANYA", clue: "Antalya ilçesi", dir: "DOWN" },
  { word: "EK", clue: "İlave", dir: "DOWN" },
  { word: "ŞİVE", clue: "Söyleyiş özelliği", dir: "DOWN" },
  { word: "AFAK", clue: "Ufuklar", dir: "DOWN" },
  { word: "PRUVA", clue: "Geminin ön tarafı", dir: "DOWN" },
  { word: "TK", clue: "THY uçuş kodu", dir: "DOWN" },
  { word: "İMAJ", clue: "İmge", dir: "DOWN" },
  { word: "ASKER", clue: "Erler", dir: "DOWN" },
  { word: "İFA", clue: "Verme, ödeme", dir: "DOWN" },
  { word: "TARHANA", clue: "Bir çorba türü", dir: "DOWN" },
  { word: "DELİCE", clue: "Kırıkkale ilçesi", dir: "DOWN" },
  { word: "DO", clue: "Bir nota", dir: "DOWN" },
  { word: "SİNSİ", clue: "İçten pazarlıklı", dir: "DOWN" },
  { word: "TA", clue: "Tantal'ın simgesi", dir: "DOWN" },
  { word: "FAR", clue: "Oto lambası", dir: "DOWN" }
];

const width = 18;
const height = 18;
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

fs.writeFileSync('generated_grid_4.json', JSON.stringify(gridData, null, 2));
console.log("Generated gridData for", placed.length, "words");
