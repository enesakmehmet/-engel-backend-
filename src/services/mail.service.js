const { Resend } = require('resend');

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const sendPasswordResetEmail = async (email, token) => {
  try {
    if (!resend) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const data = await resend.emails.send({
      from: process.env.MAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: 'Şifre Sıfırlama Kodu',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333;">Şifrenizi mi unuttunuz?</h2>
          <p>Cenegel hesabınız için bir şifre sıfırlama isteği aldık. Şifrenizi sıfırlamak için aşağıdaki kodu uygulamaya girin:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="background-color: #f4f4f5; color: #6C63FF; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 32px; letter-spacing: 4px;">${token}</span>
          </div>
          <p>Eğer bu isteği siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.</p>
          <p>Bu kod 1 saat boyunca geçerli kalacaktır.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">Cenegel - Eğlenceli Çengel Bulmaca Deneyimi</p>
        </div>
      `,
    });

    return data;
  } catch (error) {
    console.error('Email gönderme hatası:', error);
    throw new Error('E-posta gönderilemedi');
  }
};

const sendWelcomeEmail = async (email, username, welcomeBonus = 300) => {
  try {
    if (!resend) {
      console.warn('RESEND_API_KEY is missing; skipping welcome email send.');
      return null;
    }

    const data = await resend.emails.send({
      from: process.env.MAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: 'Cenegel Dünyasına Hoş Geldin!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #6C63FF; margin: 0;">NOCTURNE</h1>
            <h2 style="color: #333;">Aramıza Hoş Geldin, ${username}! 🎉</h2>
          </div>
          <p>Seni aramızda görmek harika! Hesabına başlangıç hediyesi olarak <strong>${welcomeBonus} yıldız</strong> ekledik.</p>
          <p>Bu yıldızlarla yeni bulmacalar açabilir, skor tablosunda yükselebilir ve zihnini zinde tutabilirsin.</p>
          <p>Daha fazla yıldız kazanmak istersen reklam izleyerek puan toplayabilir ve daha çok bulmacaya ulaşabilirsin.</p>
          <p>Hemen uygulamaya girip ilk bulmacanı çözmeye ne dersin?</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #888; text-align: center;">Cenegel - Eğlenceli Çengel Bulmaca Deneyimi</p>
        </div>
      `,
    });
    return data;
  } catch (error) {
    console.error('Hoş geldin maili gönderme hatası:', error);
    // Hoş geldin maili kritik olmadığı için throw fırlatmıyoruz, sadece logluyoruz.
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
