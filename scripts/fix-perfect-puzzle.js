const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const width = 14;
  const height = 9;

  const cluesMap = {
    "0,0": { text: "Berkelyum un simgesi\nEski dilde Kasım ayı", arrowDir: "RIGHT" },
    "0,2": { text: "Çinko'nun simgesi\nSunulan şey", arrowDir: "RIGHT" },
    "0,4": { text: "Alçı taşı\nCasus. Ajan", arrowDir: "RIGHT" },
    "0,6": { text: "Mekan, mahal\nBağnazlık", arrowDir: "RIGHT" },
    "0,8": { text: "İnce kabuklu...\nRezonans", arrowDir: "RIGHT" },
    "0,10": { text: "Suda soluma aracı", arrowDir: "DOWN" },
    "0,12": { text: "E. Mısır'da şehir devleti", arrowDir: "DOWN" },

    "1,12": { text: "Libya'nın plaka işareti", arrowDir: "RIGHT" },

    "2,0": { text: "Değerli taşlarla donanmış", arrowDir: "DOWN" },
    "2,1": { text: "Uranyum'un simgesi", arrowDir: "DOWN" },
    "2,3": { text: "Cihaz\nMaksimum", arrowDir: "RIGHT" },
    "2,11": { text: "Ölüm Tarihi (Kısaca)", arrowDir: "RIGHT" },

    "3,12": { text: "Ayakkabının üst bölümü", arrowDir: "DOWN" },

    "4,0": { text: "Bir bitki türü", arrowDir: "DOWN" },
    "4,1": { text: "Öğütücü diş\nOperatör", arrowDir: "RIGHT" },
    "4,6": { text: "Bir tür makineli..\nEski dilde otlar", arrowDir: "RIGHT" },
    "4,10": { text: "Kuruş (Kısaca)\nBir renk", arrowDir: "RIGHT" },

    "5,7": { text: "Öd", arrowDir: "RIGHT" },
    "5,12": { text: "Utanma duygusu", arrowDir: "DOWN" },

    "6,7": { text: "Parça", arrowDir: "RIGHT" },

    "7,0": { text: "Yiyicilik, rüşvet alma", arrowDir: "DOWN" },
    "7,2": { text: "Tayland'ın plaka işareti", arrowDir: "DOWN" },
    "7,4": { text: "Endonezya 'nın para birimi", arrowDir: "RIGHT" },
    "7,10": { text: "Hadise, vaka", arrowDir: "RIGHT" },

    "8,7": { text: "Eski bir çalgı", arrowDir: "RIGHT" },
    "8,11": { text: "Arjantin'in plaka işareti", arrowDir: "RIGHT" }
  };

  const grid = [];
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const key = `${r},${c}`;
      if (cluesMap[key]) {
        grid.push({
          row: r,
          col: c,
          type: 'CLUE',
          clueText: cluesMap[key].text,
          arrowDir: cluesMap[key].arrowDir,
          answer: ''
        });
      } else {
        grid.push({
          row: r,
          col: c,
          type: 'LETTER',
          answer: ''
        });
      }
    }
  }

  const puzzle = await prisma.puzzle.create({
    data: {
      title: "Hürriyet Kusursuz (Kullanıcı İsteği)",
      categoryId: null,
      difficulty: "HARD",
      points: 250,
      width,
      height,
      gridData: JSON.stringify(grid)
    }
  });

  console.log("Kusursuz bulmaca eklendi: " + puzzle.id);
}

main().finally(() => prisma.$disconnect());
