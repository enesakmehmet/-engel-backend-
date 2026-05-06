const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const wordList = [
  { answer: 'PAPALİNA', clue: 'Sardalye yavrusu' },
  { answer: 'LA', clue: "Lantan'ın simgesi" },
  { answer: 'GINA', clue: 'Bıkma, usanma' },
  { answer: 'İCTİNAP', clue: 'Çekinme, sakınma' },
  { answer: 'AZİZ', clue: 'Yüce, kudretli' },
  { answer: 'ÇIKI', clue: 'Küçük bohça' },
  { answer: 'JALE', clue: 'Çiy, kırağı' },
  { answer: 'ÇAR', clue: 'Rus imparatoru' },
  { answer: 'ABA', clue: 'Kalın kaba kumaş' },
  { answer: 'ŞAŞAA', clue: 'Parıltı' },
  { answer: 'EBEDİ', clue: 'Sonsuz, ölümsüz' },
  { answer: 'PARAFİN', clue: 'Mumun hammaddesi' },
  { answer: 'LEŞ', clue: 'Hayvan ölüsü' },
  { answer: 'MA', clue: "Fas'ın plakası" },
  { answer: 'AKIŞ', clue: 'Seyelan' },
  { answer: 'DEKAN', clue: 'Fakülte yöneticisi' },
  { answer: 'ANLAK', clue: 'Zeka' },
  { answer: 'YARIK', clue: 'Yarık, yırtık' },
  { answer: 'TİTAN', clue: "Satürn'ün bir uydusu" },
  { answer: 'FİDAN', clue: 'Taze ağaç, dikme' },
  { answer: 'SA', clue: 'Nazi hücum kıtası' },
  { answer: 'RNA', clue: 'Ribonükleik asit' },
  { answer: 'AR', clue: "Arjantin'in plakası" },
  { answer: 'RL', clue: 'Lübnan plakası' },
  { answer: 'NEDEN', clue: 'Sebep' }
];

const WIDTH = 20;
const HEIGHT = 20;
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
  const title = "Klasik Seri Bulmacası - 13";
  
  const oldPuzzles = await prisma.puzzle.findMany({
    where: {
      title: {
        in: ['Hürriyet Klasik Bulmaca - 13', title],
      },
    },
  });
  const oldIds = oldPuzzles.map(p => p.id);
  
  if (oldIds.length > 0) {
    await prisma.gameSession.deleteMany({ where: { puzzleId: { in: oldIds } } });
    await prisma.puzzle.deleteMany({ where: { id: { in: oldIds } } });
  }

  await prisma.puzzle.create({
    data: {
      title,
      difficulty: 'MEDIUM',
      width: WIDTH,
      height: HEIGHT,
      points: 1350,
      gridData: gridData,
      isActive: true
    }
  });
  console.log(`✅ ${wordList.length} soruluk yeni bulmaca (${title}) başarıyla oluşturuldu!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
