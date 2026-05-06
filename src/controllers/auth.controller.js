const authService = require('../services/auth.service');
const { success, error } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return success(res, result, 'Kayıt başarılı', 201);
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return success(res, result, 'Giriş başarılı');
  } catch (err) { next(err); }
};

const guestLogin = async (req, res, next) => {
  try {
    const result = await authService.guestLogin();
    return success(res, result, 'Misafir girişi başarılı', 201);
  } catch (err) { next(err); }
};

const googleAuth = async (req, res, next) => {
  try {
    const result = await authService.googleAuth(req.body);
    return success(res, result, 'Google ile giriş başarılı');
  } catch (err) { next(err); }
};

const appleAuth = async (req, res, next) => {
  try {
    const result = await authService.appleAuth(req.body);
    return success(res, result, 'Apple ile giriş başarılı');
  } catch (err) { next(err); }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, 'Refresh token gerekli', 400);
    const result = await authService.refreshToken(refreshToken);
    return success(res, result, 'Token yenilendi');
  } catch (err) { next(err); }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    return success(res, {}, 'Çıkış yapıldı');
  } catch (err) { next(err); }
};

const me = async (req, res) => {
  return success(res, req.user, 'Kullanıcı bilgileri');
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return error(res, 'Email gerekli', 400);
    const result = await authService.forgotPassword(email);
    return success(res, result, 'Sıfırlama e-postası gönderildi');
  } catch (err) { next(err); }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return error(res, 'Token ve yeni şifre gerekli', 400);
    const result = await authService.resetPassword(token, newPassword);
    return success(res, result, 'Şifre başarıyla güncellendi');
  } catch (err) { next(err); }
};

const renderResetPage = (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).send('Geçersiz istek: Token bulunamadı.');
  }

  const html = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Şifre Sıfırlama | Cenegel</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .container {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 40px;
      border-radius: 24px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      text-align: center;
    }
    h2 { margin-top: 0; color: #818cf8; font-weight: 700; letter-spacing: -0.5px; }
    p { color: #94a3b8; font-size: 14px; margin-bottom: 24px; }
    input {
      width: 100%;
      padding: 14px;
      margin-bottom: 16px;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: #fff;
      font-size: 16px;
      box-sizing: border-box;
      outline: none;
      transition: all 0.3s;
    }
    input:focus { border-color: #818cf8; background: rgba(0, 0, 0, 0.4); box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2); }
    button {
      width: 100%;
      padding: 14px;
      background: linear-gradient(to right, #6366f1, #8b5cf6);
      border: none;
      border-radius: 12px;
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
    }
    button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6); }
    button:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    .message { margin-top: 16px; font-size: 14px; min-height: 20px; }
    .error { color: #ef4444; }
    .success { color: #22c55e; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Yeni Şifrenizi Belirleyin</h2>
    <p>Lütfen hesabınız için yeni ve güvenli bir şifre girin.</p>
    <form id="resetForm">
      <input type="password" id="newPassword" placeholder="Yeni Şifre (En az 6 karakter)" required minlength="6">
      <button type="submit" id="submitBtn">Şifremi Güncelle</button>
    </form>
    <div id="message" class="message"></div>
  </div>

  <script>
    document.getElementById('resetForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      const msg = document.getElementById('message');
      const password = document.getElementById('newPassword').value;
      const token = new URLSearchParams(window.location.search).get('token');

      btn.disabled = true;
      btn.innerText = 'Güncelleniyor...';
      msg.className = 'message';
      msg.innerText = '';

      try {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, newPassword: password })
        });
        const data = await res.json();
        
        if (data.success) {
          msg.className = 'message success';
          msg.innerText = 'Şifreniz başarıyla güncellendi! Uygulamaya dönebilirsiniz.';
          document.getElementById('newPassword').style.display = 'none';
          btn.style.display = 'none';
        } else {
          msg.className = 'message error';
          msg.innerText = data.message || 'Bir hata oluştu.';
          btn.disabled = false;
          btn.innerText = 'Şifremi Güncelle';
        }
      } catch (err) {
        msg.className = 'message error';
        msg.innerText = 'Bağlantı hatası oluştu.';
        btn.disabled = false;
        btn.innerText = 'Şifremi Güncelle';
      }
    });
  </script>
</body>
</html>
  `;
  res.send(html);
};

module.exports = { register, login, guestLogin, googleAuth, appleAuth, refresh, logout, me, forgotPassword, resetPassword, renderResetPage };
