/**
 * 🧩 Çöz ve Geç (Cenegel Game) - Yük Testi (Load Test) Scripti
 * 
 * Bu script, uygulamanızın API sunucusunu test etmek için gerçek kullanıcı
 * yaşam döngüsünü (Giriş -> Bulmacaları Çek -> Oyun Başlat -> Harf Gönder)
 * eşzamanlı olarak simüle eder.
 * 
 * Çalıştırmak için:
 * node scripts/load-test.js <Eşzamanlı_Kullanıcı> <Döngü_Sayısı> [Hedef_URL]
 * Örnek: node scripts/load-test.js 50 5 http://localhost:5000
 */

const http = require('http');
const { performance } = require('perf_hooks');

// ANSI Renk Kodları
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m'
};

// Argümanları al
const concurrency = parseInt(process.argv[2], 10) || 10; // Eşzamanlı kullanıcı (VU) sayısı
const loops = parseInt(process.argv[3], 10) || 3;       // Her kullanıcının yapacağı döngü sayısı
const targetUrl = process.argv[4] || 'http://localhost:5000';

console.clear();
console.log(`${COLORS.bright}${COLORS.magenta}══════════════════════════════════════════════════════════════${COLORS.reset}`);
console.log(`${COLORS.bright}${COLORS.cyan}🚀 ÇÖZ VE GEÇ (CENEGEL GAME) - API YÜK TESTİ BAŞLIYOR${COLORS.reset}`);
console.log(`${COLORS.bright}${COLORS.magenta}══════════════════════════════════════════════════════════════${COLORS.reset}`);
console.log(`${COLORS.dim}Hedef URL:${COLORS.reset} ${COLORS.bright}${targetUrl}${COLORS.reset}`);
console.log(`${COLORS.dim}Eşzamanlı Sanal Kullanıcı (VU):${COLORS.reset} ${COLORS.green}${concurrency}${COLORS.reset}`);
console.log(`${COLORS.dim}Kullanıcı Başına Döngü:${COLORS.reset} ${COLORS.green}${loops}${COLORS.reset}`);
console.log(`${COLORS.dim}Toplam Simüle Edilecek Adım:${COLORS.reset} ${COLORS.yellow}${concurrency * loops * 4}${COLORS.reset} adet istek`);
console.log(`${COLORS.magenta}──────────────────────────────────────────────────────────────${COLORS.reset}\n`);

// İstatistik verileri
const stats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  latencies: [],
  statusCodes: {},
  errors: []
};

// Yardımcı HTTP İstek fonksiyonu
function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(path, targetUrl);
    const options = {
      method: method,
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname + urlObj.search,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const start = performance.now();
    stats.totalRequests++;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const latency = performance.now() - start;
        stats.latencies.push(latency);
        
        // Status code kaydet
        stats.statusCodes[res.statusCode] = (stats.statusCodes[res.statusCode] || 0) + 1;

        if (res.statusCode >= 200 && res.statusCode < 300) {
          stats.successfulRequests++;
          try {
            resolve({ statusCode: res.statusCode, body: JSON.parse(data), latency });
          } catch (e) {
            resolve({ statusCode: res.statusCode, body: data, latency });
          }
        } else {
          stats.failedRequests++;
          reject({ statusCode: res.statusCode, error: data, latency });
        }
      });
    });

    req.on('error', (err) => {
      const latency = performance.now() - start;
      stats.latencies.push(latency);
      stats.failedRequests++;
      stats.errors.push(err.message);
      reject({ statusCode: 0, error: err.message, latency });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Tek bir kullanıcı senaryosu
async function runUserScenario(userId) {
  let token = null;
  let score = 0;

  for (let i = 1; i <= loops; i++) {
    const prefix = `${COLORS.dim}[VU-${userId} Döngü-${i}]${COLORS.reset}`;
    try {
      // 1. Misafir Girişi Yap (Sadece ilk döngüde)
      if (!token) {
        // console.log(`${prefix} Giriş yapılıyor...`);
        const loginRes = await request('POST', '/api/auth/guest');
        token = loginRes.body.data.accessToken;
        score = loginRes.body.data.user.totalScore;
        // console.log(`${prefix} Giriş başarılı! Bakiye: ⭐ ${score}`);
      }

      // 2. Bulmacaları Çek
      // console.log(`${prefix} Bulmacalar çekiliyor...`);
      const puzzlesRes = await request('GET', '/api/game/puzzles', null, token);
      const puzzles = puzzlesRes.body.data || [];
      if (puzzles.length === 0) {
        throw new Error('Aktif bulmaca bulunamadı, test durduruldu.');
      }

      // Rastgele bir bulmaca seç
      const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
      
      // 3. Oyunu Başlat
      // console.log(`${prefix} "${randomPuzzle.title}" başlatılıyor...`);
      const startRes = await request('POST', '/api/game/start', { puzzleId: randomPuzzle.id }, token);
      const sessionId = startRes.body.data?.sessionId || startRes.body.data?.data?.sessionId;

      if (!sessionId) {
        throw new Error('Oturum ID (sessionId) alınamadı.');
      }

      // 4. Doğru Harf Gönder (Bulmaca şemasından bir harf hücresi bul)
      const gridData = randomPuzzle.gridData || [];
      const letterCells = gridData.filter(cell => cell.type === 'LETTER');
      
      if (letterCells.length > 0) {
        // Rastgele bir harf hücresi seç ve doğru harfi gönder
        const targetCell = letterCells[Math.floor(Math.random() * letterCells.length)];
        
        // console.log(`${prefix} (${targetCell.row}, ${targetCell.col}) koordinatına '${targetCell.answer}' harfi gönderiliyor...`);
        await request('POST', `/api/game/session/${sessionId}/answer`, {
          row: targetCell.row,
          col: targetCell.col,
          letter: targetCell.answer
        }, token);
      } else {
        // Izgara boş ise varsayılan test harfi yolla
        await request('POST', `/api/game/session/${sessionId}/answer`, {
          row: 1,
          col: 1,
          letter: 'A'
        }, token);
      }

    } catch (err) {
      const errMsg = err.error || err.message || 'Bilinmeyen hata';
      stats.errors.push(`VU-${userId} Hata: ${errMsg} (Status: ${err.statusCode || '0'})`);
    }
  }
}

// Ana çalışma kontrolcüsü
async function main() {
  const startTime = performance.now();
  
  console.log(`${COLORS.bright}${COLORS.yellow}🔄 Test çalıştırılıyor, lütfen bekleyin...${COLORS.reset}\n`);

  // Eşzamanlı kullanıcı senaryolarını başlat
  const vus = [];
  for (let i = 1; i <= concurrency; i++) {
    vus.push(runUserScenario(i));
  }

  // Tüm sanal kullanıcıların işini bitirmesini bekle
  await Promise.all(vus);

  const totalTimeSec = ((performance.now() - startTime) / 1000).toFixed(2);
  
  // Metrikleri hesapla
  const successful = stats.successfulRequests;
  const failed = stats.failedRequests;
  const total = stats.totalRequests;
  
  const minLatency = stats.latencies.length ? Math.min(...stats.latencies).toFixed(1) : 0;
  const maxLatency = stats.latencies.length ? Math.max(...stats.latencies).toFixed(1) : 0;
  const avgLatency = stats.latencies.length ? (stats.latencies.reduce((a, b) => a + b, 0) / stats.latencies.length).toFixed(1) : 0;
  const rps = (total / totalTimeSec).toFixed(1);
  const successRate = total > 0 ? ((successful / total) * 100).toFixed(1) : 0;

  // Sonuçları yazdır
  console.log(`${COLORS.bright}${COLORS.green}══════════════════════════════════════════════════════════════${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.green}📊 YÜK TESTİ SONUÇLARI${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.green}══════════════════════════════════════════════════════════════${COLORS.reset}`);
  
  console.log(`${COLORS.bright}⏱️  Toplam Süre:${COLORS.reset} ${COLORS.cyan}${totalTimeSec} saniye${COLORS.reset}`);
  console.log(`${COLORS.bright}🔄 Toplam İstek:${COLORS.reset} ${total}`);
  console.log(`${COLORS.bright}✅ Başarılı İstek (2xx):${COLORS.reset} ${COLORS.green}${successful}${COLORS.reset}`);
  console.log(`${COLORS.bright}❌ Başarısız İstek:${COLORS.reset} ${failed > 0 ? COLORS.red : COLORS.dim}${failed}${COLORS.reset}`);
  console.log(`${COLORS.bright}📈 Başarı Oranı:${COLORS.reset} ${successRate >= 95 ? COLORS.green : COLORS.yellow}%${successRate}${COLORS.reset}`);
  console.log(`${COLORS.bright}⚡ Saniyedeki İstek (RPS):${COLORS.reset} ${COLORS.bright}${COLORS.magenta}${rps}${COLORS.reset} req/sec`);
  
  console.log(`\n${COLORS.bright}🕒 Gecikme (Latency) Verileri:${COLORS.reset}`);
  console.log(`   └─ En Hızlı İstek:  ${COLORS.green}${minLatency} ms${COLORS.reset}`);
  console.log(`   └─ En Yavaş İstek:  ${COLORS.red}${maxLatency} ms${COLORS.reset}`);
  console.log(`   └─ Ortalama Tepki:  ${COLORS.yellow}${avgLatency} ms${COLORS.reset}`);

  console.log(`\n${COLORS.bright}📌 HTTP Durum Kodları Dağılımı:${COLORS.reset}`);
  Object.keys(stats.statusCodes).forEach(code => {
    const isSuccess = code >= 200 && code < 300;
    const color = isSuccess ? COLORS.green : COLORS.red;
    console.log(`   └─ HTTP ${color}${code}${COLORS.reset}: ${stats.statusCodes[code]} adet`);
  });

  if (stats.errors.length > 0) {
    console.log(`\n${COLORS.bright}${COLORS.red}⚠️  Yakalanan Hatalar (İlk 5):${COLORS.reset}`);
    const uniqueErrors = [...new Set(stats.errors)].slice(0, 5);
    uniqueErrors.forEach((err, idx) => {
      console.log(`   ${idx + 1}. ${COLORS.red}${err}${COLORS.reset}`);
    });
  }

  console.log(`\n${COLORS.bright}${COLORS.magenta}══════════════════════════════════════════════════════════════${COLORS.reset}\n`);
}

main().catch(console.error);
