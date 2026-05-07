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

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const imageBase64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const prompt = `Bu bir Türkçe çengel bulmaca ızgarasının fotoğrafıdır.

Görevin: Resmi analiz ederek bulmacadaki TÜM ipucu hücrelerini tespit et ve JSON olarak döndür.

Kurallar:
- Izgara hücreleri 0'dan başlayan satır (row) ve sütun (col) indeksleriyle tanımlanır.
- "İpucu hücresi": İçinde metin yazılı olan, yanında ok işareti bulunan hücredir.
- Ok aşağı gösteriyorsa arrowDir = "DOWN", sağa gösteriyorsa arrowDir = "RIGHT"
- Birden fazla metin satırı olabilir, tamamını clueText olarak yaz (tek string, yeni satır yerine boşluk kullan).
- Izgara boyutunu (width=sütun sayısı, height=satır sayısı) tahmin et.
- Cevap harflerini bilmiyorsan answer alanını boş bırak ("").

Kesinlikle SADECE aşağıdaki JSON formatını döndür, başka hiçbir şey yazma:

{
  "width": <sütun sayısı>,
  "height": <satır sayısı>,
  "clues": [
    {
      "row": <ipucu hücresinin satır indeksi, 0'dan başlar>,
      "col": <ipucu hücresinin sütun indeksi, 0'dan başlar>,
      "clueText": "<ipucu metni>",
      "arrowDir": "RIGHT" veya "DOWN",
      "answer": "<cevap varsa büyük harf, yoksa boş string>"
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
