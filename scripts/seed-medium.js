const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function generateGrid(width, height) {
    const grid = [];
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            if ((r + c) % 3 === 0) {
                grid.push({ row: r, col: c, type: 'CLUE', clueText: `Soru ${r}-${c}`, arrowDir: 'RIGHT' });
            } else if ((r + c) % 3 === 1) {
                grid.push({ row: r, col: c, type: 'LETTER', answer: 'A' });
            } else {
                grid.push({ row: r, col: c, type: 'BLOCK' });
            }
        }
    }
    return grid;
}

async function main() {
    for (let i = 1; i <= 5; i++) {
        const width = 10 + Math.floor(Math.random() * 3); // 10 to 12
        const height = 10 + Math.floor(Math.random() * 3); // 10 to 12
        const gridData = generateGrid(width, height);

        await prisma.puzzle.create({
            data: {
                title: `Orta Seviye Bulmaca ${i} (${width}x${height})`,
                difficulty: 'MEDIUM',
                width,
                height,
                gridData,
                points: 200 + (i * 10),
            }
        });
        console.log(`Bulmaca ${i} eklendi (${width}x${height}).`);
    }
    console.log('✅ 5 adet orta seviye bulmaca basariyla eklendi!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
