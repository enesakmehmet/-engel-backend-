const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Silme islemi basliyor...");
  
  // Önce ilişkili tabloları sil
  const delSessions = await prisma.gameSession.deleteMany();
  console.log(`${delSessions.count} GameSession silindi.`);
  
  const delReports = await prisma.report.deleteMany();
  console.log(`${delReports.count} Report silindi.`);
  
  // Şimdi bulmacaları sil
  const delPuzzles = await prisma.puzzle.deleteMany();
  console.log(`${delPuzzles.count} Puzzle silindi.`);
  
  console.log("Tum bulmacalar ve iliskili veriler veritabanindan basariyla silindi!");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
