const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function createGridData(rightWord, downWords, clues) {
    const grid = [];
    const width = 10;
    const height = 10;

    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            grid.push({ row: r, col: c, type: 'BLOCK' });
        }
    }

    const getCell = (r, c) => grid.find(x => x.row === r && x.col === c);
    
    const rc = getCell(1, 0);
    rc.type = 'CLUE';
    rc.clueText = clues.right;
    rc.arrowDir = 'RIGHT';

    for (let i = 0; i < downWords.length; i++) {
        const c = i + 1;
        const cc = getCell(0, c);
        cc.type = 'CLUE';
        cc.clueText = clues.downs[i];
        cc.arrowDir = 'DOWN';

        const word = downWords[i];
        for(let j=0; j<word.length; j++) {
            const lc = getCell(j+1, c);
            lc.type = 'LETTER';
            lc.answer = word[j];
        }
    }
    return grid;
}

const puzzles = [
    {
        title: "Orta Seviye - Hayvanlar ve Nesneler",
        rightWord: "KEDİ",
        downWords: ["KİTAP", "ELMA", "DERS", "İSİM"],
        clues: { right: "Miyavlayan hayvan", downs: ["Sayfaları olan nesne", "Kırmızı meyve", "Okulda işlenen konu", "Ad, unvan"] }
    },
    {
        title: "Orta Seviye - Eşyalar ve Kavramlar",
        rightWord: "MASA",
        downWords: ["MOTOR", "AYAK", "SAAT", "AKIL"],
        clues: { right: "Dört ayaklı mobilya", downs: ["Araçların güç kaynağı", "Yürümeyi sağlayan organ", "Zamanı gösteren alet", "Düşünme yeteneği"] }
    },
    {
        title: "Orta Seviye - Doğa ve Çevre",
        rightWord: "UÇAK",
        downWords: ["UYKU", "ÇİÇEK", "AYNA", "KAPI"],
        clues: { right: "Hava taşıtı", downs: ["Dinlenme durumu", "Bitkilerin renkli kısmı", "Kendimize baktığımız cam", "Odaya giriş yeri"] }
    },
    {
        title: "Orta Seviye - Eğitim ve Mekan",
        rightWord: "OKUL",
        downWords: ["OYUN", "KEDİ", "UZAY", "LALE"],
        clues: { right: "Eğitim yuvası", downs: ["Eğlence etkinliği", "Miyavlayan hayvan", "Gezegenlerin boşluğu", "Bahar çiçeği"] }
    },
    {
        title: "Orta Seviye - Aile ve Yaşam",
        rightWord: "BABA",
        downWords: ["BARIŞ", "ATEŞ", "BALIK", "AĞAÇ"],
        clues: { right: "Erkek ebeveyn", downs: ["Savaşsızlık", "Yakıcı unsur", "Suda yaşayan canlı", "Odunsu bitki"] }
    }
];

async function main() {
    // Bulmacaları bul
    const oldPuzzles = await prisma.puzzle.findMany({
        where: { title: { startsWith: 'Orta Seviye Bulmaca' } },
        select: { id: true }
    });
    
    const puzzleIds = oldPuzzles.map(p => p.id);

    if (puzzleIds.length > 0) {
        // Önce bunlara ait oyun oturumlarını (GameSession) sil
        await prisma.gameSession.deleteMany({
            where: { puzzleId: { in: puzzleIds } }
        });

        // Sonra bulmacaları sil
        await prisma.puzzle.deleteMany({
            where: { id: { in: puzzleIds } }
        });
    }

    // Create the 5 real puzzles
    for (let i = 0; i < puzzles.length; i++) {
        const p = puzzles[i];
        const gridData = createGridData(p.rightWord, p.downWords, p.clues);
        await prisma.puzzle.create({
            data: {
                title: p.title,
                difficulty: 'MEDIUM',
                width: 10,
                height: 10,
                gridData: gridData,
                points: 200 + (i * 10),
                isActive: true
            }
        });
        console.log(`Gerçek Bulmaca Eklendi: ${p.title}`);
    }
    console.log('✅ 5 adet sorulu orta seviye bulmaca başarıyla oluşturuldu!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
