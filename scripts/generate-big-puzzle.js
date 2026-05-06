const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const wordList = [
  { answer: 'EBAT', clue: 'Boyut' },
  { answer: 'ABURCUBUR', clue: 'Sırası, tadı, yararı gözetilmeksizin rastgele yenilen şeyler' },
  { answer: 'UĞUR', clue: 'Ongun' },
  { answer: 'UÇMAN', clue: 'Pilot' },
  { answer: 'EYVALLAH', clue: 'Derviş selamı' },
  { answer: 'CA', clue: 'Kalsiyum (Simge)' },
  { answer: 'SUNİ', clue: 'Yapay' },
  { answer: 'SAPAN', clue: 'Gemiye hayvan yüklerken kullanılan sandık' },
  { answer: 'RAMAN', clue: 'Batman\'da bir dağ' },
  { answer: 'AÇMA', clue: 'Bir çeşit susamsız, kalınca yağlı simit' },
  { answer: 'GÜLLE', clue: 'Atletizmde bir dal' },
  { answer: 'ANA', clue: 'Temel, esas, asıl' },
  { answer: 'AVRO', clue: 'Avrupa Birliği para birimi' },
  { answer: 'EKİM', clue: 'Bir ay' },
  { answer: 'DO', clue: 'Bir nota' },
  { answer: 'LEĞEN', clue: 'Yayvan ve kenarları geniş, büyük bakır kap' },
  { answer: 'TUTMAK', clue: 'Kaçan birini yakalamak' },
  { answer: 'RUS', clue: 'Bir Slav halkı' },
  { answer: 'ENLİ', clue: 'Geniş' },
  { answer: 'TOKALAŞMA', clue: 'El sıkışma' },
  { answer: 'TN', clue: 'Etna\'nın ortası' },
  { answer: 'TABL', clue: 'Davul (Eski dil)' },
  { answer: 'USANÇ', clue: 'Bıkma, bıkkınlık, melal' },
  { answer: 'AD', clue: 'İsim' },
  { answer: 'OTO', clue: 'Kendi kendine anlamında yabancı önek' },
  { answer: 'FAYANS', clue: 'Duvarları kaplayıp süslemek için kullanılan, bir yüzü sırlı...' },
  { answer: 'ÜLKÜDAŞ', clue: 'Aynı ülküye bağlı olanlardan her biri' },
  { answer: 'AKÜ', clue: 'Akımtoplar' },
  { answer: 'KAŞE', clue: 'Damga, mühür' },
  { answer: 'EDB', clue: 'Edebiyat (Kısaca)' },
  { answer: 'HL', clue: 'Hektolitrenin kısa yazılışı' },
  { answer: 'ŞANS', clue: 'Baht açıklığı' },
  { answer: 'ÜCRA', clue: 'Çok uçta, kenarda veya kıyıda köşede olan' },
  { answer: 'ÜNAL', clue: 'Ümit ... (Yönetmen)' },
  { answer: 'RULO', clue: 'Dürülerek boru biçim verilmiş deri ya da kağıt tomar' },
  { answer: 'FİL', clue: 'İri bir hayvan' },
  { answer: 'GEVAŞ', clue: 'Van ilçesi' },
  { answer: 'TAKMA', clue: 'Aldırış etme, önem verme' },
  { answer: 'DÜ', clue: 'Dicle Üniversitesi (Kısaca)' },
  { answer: 'SON', clue: 'En arkada bulunan' },
  { answer: 'ŞİR', clue: 'Aslan (Eski dil)' },
  { answer: 'MG', clue: 'Magnezyum (Simge)' },
  { answer: 'İNKA', clue: 'Eski bir uygarlık' },
  { answer: 'SEDA', clue: 'Ses yankısı' },
  { answer: 'OVA', clue: 'Yazı, kır' },
  { answer: 'GÜNEŞ', clue: 'Gözleri koruyan gözlük türü?' }
];

const WIDTH = 30;
const HEIGHT = 30;
let grid = Array(HEIGHT).fill(null).map(() => Array(WIDTH).fill(null));

function canPlace(word, r, c, dir) {
  if (dir === 'RIGHT') {
    if (c < 1 || c + word.length > WIDTH) return false;
    if (grid[r][c-1] !== null) return false; 
    for (let i = 0; i < word.length; i++) {
      const nr = r, nc = c + i;
      if (grid[nr][nc] !== null) {
        if (grid[nr][nc].type !== 'LETTER' || grid[nr][nc].char !== word[i]) return false;
      } else {
        if (nr > 0 && grid[nr-1][nc] !== null && grid[nr-1][nc].type === 'LETTER') return false;
        if (nr < HEIGHT-1 && grid[nr+1][nc] !== null && grid[nr+1][nc].type === 'LETTER') return false;
      }
    }
    if (c + word.length < WIDTH && grid[r][c + word.length] !== null && grid[r][c + word.length].type === 'LETTER') return false;
    return true;
  } else {
    if (r < 1 || r + word.length > HEIGHT) return false;
    if (grid[r-1][c] !== null) return false; 
    for (let i = 0; i < word.length; i++) {
      const nr = r + i, nc = c;
      if (grid[nr][nc] !== null) {
        if (grid[nr][nc].type !== 'LETTER' || grid[nr][nc].char !== word[i]) return false;
      } else {
        if (nc > 0 && grid[nr][nc-1] !== null && grid[nr][nc-1].type === 'LETTER') return false;
        if (nc < WIDTH-1 && grid[nr][nc+1] !== null && grid[nr][nc+1].type === 'LETTER') return false;
      }
    }
    if (r + word.length < HEIGHT && grid[r + word.length][c] !== null && grid[r + word.length][c].type === 'LETTER') return false;
    return true;
  }
}

function placeWord(wordObj, r, c, dir) {
  const { answer, clue } = wordObj;
  if (dir === 'RIGHT') {
    grid[r][c-1] = { type: 'CLUE', text: clue, dir: 'RIGHT' };
    for (let i = 0; i < answer.length; i++) {
      grid[r][c+i] = { type: 'LETTER', char: answer[i] };
    }
  } else {
    grid[r-1][c] = { type: 'CLUE', text: clue, dir: 'DOWN' };
    for (let i = 0; i < answer.length; i++) {
      grid[r+i][c] = { type: 'LETTER', char: answer[i] };
    }
  }
}

function generate() {
  wordList.sort((a, b) => b.answer.length - a.answer.length);

  for (const w of wordList) {
    let placed = false;
    
    // Shuffle rows and cols to prevent clustering at top-left
    const rows = Array.from({length: HEIGHT}, (_, i) => i).sort(() => Math.random() - 0.5);
    const cols = Array.from({length: WIDTH}, (_, i) => i).sort(() => Math.random() - 0.5);

    for (const r of rows) {
      if (placed) break;
      for (const c of cols) {
        if (grid[r][c] && grid[r][c].type === 'LETTER') {
          for (let i = 0; i < w.answer.length; i++) {
            if (w.answer[i] === grid[r][c].char) {
              const dirs = Math.random() > 0.5 ? ['RIGHT', 'DOWN'] : ['DOWN', 'RIGHT'];
              for (const dir of dirs) {
                if (dir === 'RIGHT' && canPlace(w.answer, r, c - i, 'RIGHT')) {
                  placeWord(w, r, c - i, 'RIGHT');
                  placed = true;
                  break;
                }
                if (dir === 'DOWN' && canPlace(w.answer, r - i, c, 'DOWN')) {
                  placeWord(w, r - i, c, 'DOWN');
                  placed = true;
                  break;
                }
              }
            }
            if (placed) break;
          }
        }
      }
    }
    
    let attempts = 0;
    while (!placed && attempts < 5000) {
      const r = Math.floor(Math.random() * HEIGHT);
      const c = Math.floor(Math.random() * WIDTH);
      const dir = Math.random() > 0.5 ? 'RIGHT' : 'DOWN';
      if (canPlace(w.answer, r, c, dir)) {
        placeWord(w, r, c, dir);
        placed = true;
      }
      attempts++;
    }
    
    if (!placed) {
      console.log('UYARI: Yerlestirilemedi ->', w.answer);
    }
  }
}

generate();

const gridData = [];
for (let r = 0; r < HEIGHT; r++) {
  for (let c = 0; c < WIDTH; c++) {
    const cell = grid[r][c];
    if (cell) {
      if (cell.type === 'CLUE') {
        gridData.push({ row: r, col: c, type: 'CLUE', clueText: cell.text, arrowDir: cell.dir });
      } else if (cell.type === 'LETTER') {
        gridData.push({ row: r, col: c, type: 'LETTER', answer: cell.char });
      }
    } else {
      gridData.push({ row: r, col: c, type: 'BLOCK' });
    }
  }
}

async function main() {
  // Öncekileri sil
  const oldPuzzles = await prisma.puzzle.findMany({ where: { title: "Devasa Kullanıcı Bulmacası (Tüm Sorular)" } });
  const oldIds = oldPuzzles.map(p => p.id);
  
  if (oldIds.length > 0) {
    await prisma.gameSession.deleteMany({ where: { puzzleId: { in: oldIds } } });
    await prisma.puzzle.deleteMany({ where: { id: { in: oldIds } } });
  }

  await prisma.puzzle.create({
    data: {
      title: "Devasa Kullanıcı Bulmacası (Tüm Sorular)",
      difficulty: 'HARD',
      width: WIDTH,
      height: HEIGHT,
      points: 1000,
      gridData: gridData,
      isActive: true
    }
  });
  console.log("✅ 46 soruluk dev bulmaca başarıyla oluşturuldu!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
