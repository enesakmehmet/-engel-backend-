const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * POST /api/admin/puzzles/parse-image
 * Multipart: field "image" (jpeg/png/webp/gif)
 * Returns parsed crossword puzzle structure
 */
async function parsePuzzleImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Resim yüklenmedi.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'GEMINI_API_KEY ortam değişkeni tanımlı değil.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const imageBase64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const prompt = `Bu bir Türkçe çengel bulmaca ızgarasının yüksek çözünürlüklü fotoğrafıdır.

Görevin: Resmi santim santim analiz et. Izgaranın tam satır ve sütun sayısını say ve tüm soru (ipucu) hücrelerini bul.

ÇOK ÖNEMLİ KURALLAR:
1. Izgaranın kaç sütun (width) ve kaç satır (height) olduğunu dikkatlice say. (Örneğin resimdeki 14 sütun ve 9 satırdan oluşuyor olabilir).
2. Izgara sol üstten (0,0) başlar. X ekseni 'col', Y ekseni 'row' indeksidir.
3. İpucu hücresi: İçinde soru yazan, kalın çerçeveli ve cevap yönünü gösteren bir ok barındıran hücredir.
4. Ok işareti AŞAĞI gösteriyorsa arrowDir = "DOWN", SAĞA gösteriyorsa arrowDir = "RIGHT" yap.
5. Aynı hücrede 2 farklı soru/ok varsa, bunları JSON'da 2 ayrı obje olarak belirt.
6. "answerLength": Oku takip eden yöndeki boş beyaz kutucukların (harf yazılacak yerlerin) sayısını kesinlikle say ve yaz.
7. Eğer bulmacanın cevabını biliyorsan "answer" alanına BÜYÜK HARFLERLE yaz, bilmiyorsan boş string ("") bırak. 

SADECE geçerli JSON döndür:
{
  "width": <sütun sayısı>,
  "height": <satır sayısı>,
  "clues": [
    {
      "row": <y indeksi, 0'dan başlar>,
      "col": <x indeksi, 0'dan başlar>,
      "clueText": "<soru metni>",
      "arrowDir": "RIGHT" veya "DOWN",
      "answerLength": <cevap kutucuğu sayısı>,
      "answer": "<biliyorsan kelime>"
    }
  ]
}`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
    ]);

    const rawText = result.response.text().trim();

    // JSON bloğunu çıkar (``` işaretleri varsa temizle)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(422).json({
        success: false,
        message: 'Gemini geçerli JSON döndürmedi.',
        raw: rawText.slice(0, 500),
      });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.clues || !Array.isArray(parsed.clues)) {
      return res.status(422).json({ success: false, message: 'Beklenen JSON yapısı alınamadı.', raw: rawText.slice(0, 500) });
    }

    // Cevapları normalize et
    parsed.clues = parsed.clues.map((c) => ({
      ...c,
      answer: String(c.answer || '').toUpperCase().replace(/\s+/g, ''),
      clueText: String(c.clueText || '').trim(),
    }));

    return res.json({
      success: true,
      data: parsed,
    });
  } catch (err) {
    console.error('[puzzle-ocr] Hata:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Sunucu hatası',
    });
  }
}

module.exports = { parsePuzzleImage };
