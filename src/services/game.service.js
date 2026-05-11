const prisma = require('../utils/prisma');
const subService = require('./subscription.service');
const notifService = require('./notification.service');
const leaderboardService = require('./leaderboard.service');

const LEGACY_PUZZLE_TITLES = {
  'Yabansı': 'Klasik Seri Bulmacası - 1',
  'Uzun Balık Oltası': 'Klasik Seri Bulmacası - 2',
  'Boğuk Boğuk Ağlama': 'Klasik Seri Bulmacası - 3',
  'Kadercilik': 'Klasik Seri Bulmacası - 4',
  'Hürriyet Gazetesi: Veri Bulmacası': 'Klasik Seri Bulmacası - 11',
  'Korkunç Hayal Bulmacası (Resimdeki)': 'Klasik Seri Bulmacası - 8',
  'Zorla Alma (Hürriyet)': 'Klasik Seri Bulmacası - 9',
  'Hitlerci (Hürriyet)': 'Gizem Serisi Bulmacası - 1',
  'Nazizm Bulmacası (Hürriyet)': 'Gizem Serisi Bulmacası - 1',
  'Resimdeki Bulmaca (Ferdi Tayfur Özel)': 'Klasik Seri Bulmacası - 10',
  'Test Bulmaca 1': 'Klasik Seri Bulmacası - Mini 1',
};

const normalizePuzzleTitle = (title) => {
  const rawTitle = String(title || '').trim();
  const classicSeriesMatch = rawTitle.match(/^Hürriyet Klasik Bulmaca(?:\s*-\s*(\d+))?$/u);
  if (classicSeriesMatch) {
    return `Klasik Seri Bulmacası - ${classicSeriesMatch[1] || '1'}`;
  }

  const mergedClassicMatch = rawTitle.match(/^Hürriyet Klasik Bulmaca\s*\(Birleşik\)$/u);
  if (mergedClassicMatch) {
    return 'Klasik Seri Bulmacası (Birleşik)';
  }

  return LEGACY_PUZZLE_TITLES[rawTitle] || rawTitle;
};

// ── Bulmaca Seçimi İçin Listeleme ───────────
const getPuzzles = async (userId) => {
  const puzzles = await prisma.puzzle.findMany({
    where: { isActive: true },
    select: {
      id: true, title: true, difficulty: true, width: true, height: true, points: true, categoryId: true, createdAt: true
    },
    orderBy: { createdAt: 'desc' },
  });

  const sessions = await prisma.gameSession.findMany({
    where: { userId },
    select: { puzzleId: true, status: true, completedCells: true },
  });

  return puzzles.map(p => {
    const s = sessions.find(s => s.puzzleId === p.id);
    const totalLetterCells = p.width && p.height ? Math.floor((p.width * p.height) / 2) : 50; 
    let progress = 0;
    
    if (s && s.completedCells && Array.isArray(s.completedCells)) {
      progress = Math.min(100, Math.round((s.completedCells.length / totalLetterCells) * 100));
    }
    if (s?.status === 'COMPLETED') progress = 100;

    return {
      ...p,
      title: normalizePuzzleTitle(p.title),
      progress,
      isOwned: !!s, 
    };
  });
};

// ── Bulmaca Başlat (Çengel) ─────────────────
const startGame = async (userId, { puzzleId, difficulty = 'MEDIUM' }) => {
  let selectedPuzzle = null;

  if (puzzleId) {
    selectedPuzzle = await prisma.puzzle.findUnique({ where: { id: puzzleId, isActive: true } });
  } else {
    const available = await prisma.puzzle.findMany({ where: { difficulty, isActive: true } });
    if (available.length > 0) {
      selectedPuzzle = available[Math.floor(Math.random() * available.length)];
    }
  }

  if (!selectedPuzzle) throw Object.assign(new Error('Aktif bulmaca bulunamadı'), { statusCode: 404 });

  const existingSession = await prisma.gameSession.findFirst({
    where: { userId, puzzleId: selectedPuzzle.id },
  });

  if (existingSession) {
    // Kullanıcı daha önce bu bulmacayı bırakmışsa, aynı oturumu
    // devam ettir. Aksi halde yardım/cevap akışı "Oyun zaten bitmiş"
    // hatasına düşebiliyor.
    if (existingSession.status === 'ABANDONED') {
      const resumedSession = await prisma.gameSession.update({
        where: { id: existingSession.id },
        data: { status: 'IN_PROGRESS', finishedAt: null },
      });

      return {
        sessionId: resumedSession.id,
        puzzle: {
          id: selectedPuzzle.id,
          title: normalizePuzzleTitle(selectedPuzzle.title),
          width: selectedPuzzle.width,
          height: selectedPuzzle.height,
          gridData: selectedPuzzle.gridData,
        }
      };
    }

    return {
      sessionId: existingSession.id,
      puzzle: {
        id: selectedPuzzle.id,
        title: normalizePuzzleTitle(selectedPuzzle.title),
        width: selectedPuzzle.width,
        height: selectedPuzzle.height,
        gridData: selectedPuzzle.gridData,
      }
    };
  }

  const isOwned = !!existingSession;

  if (!isOwned) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const puzzleCost = selectedPuzzle.points || 150; 

    if (user.totalScore < puzzleCost) {
      throw Object.assign(new Error(`Bu bulmacayı oynamak için ${puzzleCost} yıldıza ihtiyacınız var. Bakiyeniz: ${user.totalScore} Yıldız. Lütfen yıldız satın alın.`), { statusCode: 403 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { totalScore: { decrement: puzzleCost } }
    });
  }

  const session = await prisma.gameSession.create({
    data: {
      userId,
      puzzleId: selectedPuzzle.id,
      status: 'IN_PROGRESS',
      completedCells: [],
    },
  });

  return {
    sessionId: session.id,
    puzzle: {
      id: selectedPuzzle.id,
      title: normalizePuzzleTitle(selectedPuzzle.title),
      width: selectedPuzzle.width,
      height: selectedPuzzle.height,
      gridData: selectedPuzzle.gridData,
    }
  };
};

// ── Mevcut Bulmaca Durumu ───────────────────
const getGameStatus = async (sessionId) => {
  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: { puzzle: true },
  });
  if (!session) throw Object.assign(new Error('Oturum bulunamadı'), { statusCode: 404 });
  return {
    ...session,
    puzzle: {
      ...session.puzzle,
      title: normalizePuzzleTitle(session.puzzle?.title),
    },
  };
};

// ── Harf Gönderme ───────────────────────────
const submitAnswer = async (sessionId, { row, col, letter }) => {
  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: { puzzle: true }
  });

  if (!session) throw Object.assign(new Error('Oturum bulunamadı'), { statusCode: 404 });
  if (session.status !== 'IN_PROGRESS') throw Object.assign(new Error('Oyun zaten bitmiş'), { statusCode: 400 });

  const gridData = session.puzzle.gridData;
  const cell = gridData.find(c => c.row === row && c.col === col);
  
  if (!cell || cell.type !== 'LETTER') {
    throw Object.assign(new Error('Geçersiz hücre (sadece harf kutularına girilebilir)'), { statusCode: 400 });
  }

  // Daha önce bu hücre doldurulmuş mu?
  let completed = session.completedCells || [];
  const alreadyCompleted = completed.find(c => c.row === row && c.col === col);

  const isCorrect = cell.answer.toUpperCase() === letter.toUpperCase();

  if (isCorrect && !alreadyCompleted) {
    completed.push({ row, col, letter: letter.toUpperCase() });
    
    // Zorluk bazlı harf puanı: EASY=5 | MEDIUM=10 | HARD=20
    const diffPoints = { EASY: 5, MEDIUM: 10, HARD: 20 };
    const letterPoints = diffPoints[session.puzzle.difficulty] || 10;
    const newScore = session.score + letterPoints;
    
    // Tüm harfler tamamlandı mı?
    const totalLetterCells = gridData.filter(c => c.type === 'LETTER').length;
    const isFinished = completed.length === totalLetterCells;

    await prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        score: newScore,
        completedCells: completed,
        status: isFinished ? 'COMPLETED' : 'IN_PROGRESS',
        finishedAt: isFinished ? new Date() : null,
      }
    });

    if (isFinished) {
      await prisma.user.update({
        where: { id: session.userId },
        data: {
          gamesPlayed: { increment: 1 },
          totalCorrect: { increment: completed.length },
        }
      });
      
      // Oyun sonu bildirimi
      try {
        const userRank = await leaderboardService.getUserRank(session.userId);
        await notifService.sendGameResult(session.userId, { score: newScore, rank: userRank.rank });
      } catch(e){}
    }

    return { isCorrect: true, isFinished, score: newScore, completedCells: completed };
  }

  // Yanlış harf veya zaten dolu
  return { isCorrect: false, isFinished: false, score: session.score, completedCells: completed };
};

// ── Yardım Al (Hint) ─────────────────────────
const useHint = async (userId, sessionId, { type, row, col }) => {
  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: { puzzle: true }
  });

  if (!session) throw Object.assign(new Error('Oturum bulunamadı'), { statusCode: 404 });
  if (session.status !== 'IN_PROGRESS') throw Object.assign(new Error('Oyun zaten bitmiş'), { statusCode: 400 });

  const gridData = session.puzzle.gridData;
  const cell = gridData.find(c => c.row === row && c.col === col);
  
  if (!cell || cell.type !== 'LETTER') {
    throw Object.assign(new Error('Sadece harf kutuları için yardım alınabilir.'), { statusCode: 400 });
  }

  let completed = session.completedCells || [];
  const alreadyCompleted = completed.find(c => c.row === row && c.col === col);
  if (alreadyCompleted) {
    throw Object.assign(new Error('Bu hücre zaten çözülmüş.'), { statusCode: 400 });
  }

  // Type kontrolü (POINTS için bakiye düş)
  if (type === 'POINTS') {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.totalScore < 20) {
      throw Object.assign(new Error('Yeterli puanınız yok. (20 puan gerekli)'), { statusCode: 400 });
    }
    await prisma.user.update({
      where: { id: userId },
      data: { totalScore: { decrement: 20 } }
    });
  }

  // İpucunu doldur (puan eklemiyoruz, sadece hücresini tamamlıyoruz)
  const letter = cell.answer.toUpperCase();
  completed.push({ row, col, letter, isHint: true });

  const totalLetterCells = gridData.filter(c => c.type === 'LETTER').length;
  const isFinished = completed.length === totalLetterCells;

  await prisma.gameSession.update({
    where: { id: sessionId },
    data: {
      completedCells: completed,
      status: isFinished ? 'COMPLETED' : 'IN_PROGRESS',
      finishedAt: isFinished ? new Date() : null,
    }
  });

  if (isFinished) {
    await prisma.user.update({
      where: { id: session.userId },
      data: { gamesPlayed: { increment: 1 } }
    });
  }

  return { letter, isFinished, score: session.score, completedCells: completed };
};

// ── Oyun Sonucu ─────────────────────────────
const getSessionResult = async (userId, sessionId) => {
  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: { puzzle: { select: { id: true, title: true, difficulty: true } } },
  });
  if (!session) throw Object.assign(new Error('Oturum bulunamadı'), { statusCode: 404 });
  if (session.userId !== userId) throw Object.assign(new Error('Yetkisiz erişim'), { statusCode: 403 });
  
  const totalLetterCells = Array.isArray(session.puzzle?.gridData)
    ? session.puzzle.gridData.filter(c => c.type === 'LETTER').length
    : 0;
  const completedCount = Array.isArray(session.completedCells) ? session.completedCells.length : 0;

  return {
    sessionId: session.id,
    status: session.status,
    score: session.score,
    completedCells: session.completedCells,
    totalCells: totalLetterCells,
    completedCount,
    completionRate: totalLetterCells > 0 ? Math.round((completedCount / totalLetterCells) * 100) : 0,
    startedAt: session.startedAt,
    finishedAt: session.finishedAt,
    puzzle: session.puzzle,
  };
};

// ── Oyunu Yarım Bırakma ─────────────────────
const finishGame = async (sessionId) => {
  const session = await prisma.gameSession.update({
    where: { id: sessionId },
    data: { status: 'ABANDONED', finishedAt: new Date() },
  });
  return session;
};

module.exports = { getPuzzles, startGame, getGameStatus, submitAnswer, useHint, finishGame, getSessionResult };
