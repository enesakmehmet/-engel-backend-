const prisma = require('../utils/prisma');

// RevenueCat webhook'unu işle
const handleWebhook = async (req, res) => {
  try {
    const expectedAuthorization = process.env.REVENUECAT_WEBHOOK_AUTHORIZATION;
    const providedAuthorization = req.headers.authorization;

    // Webhook yetkilendirmesini doğrula
    if (expectedAuthorization && providedAuthorization !== expectedAuthorization) {
      return res.status(401).json({ success: false, message: 'Geçersiz webhook yetkilendirmesi' });
    }

    const body = req.body || {};
    const event = body.event;
    if (!event) {
      return res.status(400).json({ success: false, message: 'Event bulunamadı' });
    }

    const userId = event.app_user_id || event.original_app_user_id;
    const eventType = event.type;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'Kullanıcı bulunamadı' });
    }

    // Webhook event türüne göre işle
    switch (eventType) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
        if (_resolvePurchaseType(event.product_id) === 'GAME_PACK') {
          await _handleNonRenewingPurchase(userId, event);
        } else {
          await _handleSubscriptionActive(userId, event);
        }
        break;
      case 'NON_RENEWING_PURCHASE':
        await _handleNonRenewingPurchase(userId, event);
        break;
      case 'CANCELLATION':
      case 'EXPIRATION':
        await _handleSubscriptionEnded(userId, event);
        break;
      case 'BILLING_ISSUE':
        // Ödeme sorunu - premium erişim askıya alınabilir
        await _handleBillingIssue(userId, event);
        break;
      default:
        // Diğer event türleri (TEST, PRODUCT_CHANGE, vb.) göz ardı et
        break;
    }

    // RevenueCat'e başarı yanıtı gönder
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('RevenueCat webhook hatası:', error);
    // Hata durumunda da 200 döndür ki RevenueCat retry yapmasın
    res.status(200).json({ success: false, error: error.message });
  }
};

// Abonelik aktif hale geldi
const _handleSubscriptionActive = async (userId, event) => {
  const expiresAt = event.expiration_at_ms ? new Date(event.expiration_at_ms) : null;
  const transactionId = event.transaction_id;
  const purchaseType = _resolvePurchaseType(event.product_id);

  // Idempotency: aynı transactionId ile iki kez işlenmesin
  const existingPurchase = await prisma.purchase.findUnique({
    where: { transactionId },
  }).catch(() => null);

  if (existingPurchase) {
    // Zaten işlenmiş, güncelle
    await prisma.purchase.update({
      where: { transactionId },
      data: { status: 'COMPLETED' },
    });
  } else {
    // Yeni satın alma kaydı oluştur
    await prisma.purchase.create({
      data: {
        userId,
        platform: event.store === 'APP_STORE' || event.store === 'app_store' ? 'APPLE' : 'GOOGLE',
        purchaseType,
        productId: event.product_id,
        receiptData: JSON.stringify(event),
        transactionId,
        status: 'COMPLETED',
        expiresAt,
      },
    });
  }

  // Kullanıcının plan'ını PREMIUM olarak güncelle
  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: 'PREMIUM',
      planExpiresAt: expiresAt,
    },
  });
};

// Abonelik sona erdi
const _handleSubscriptionEnded = async (userId, event) => {
  // Kullanıcının plan'ını FREE olarak güncelle
  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: 'FREE',
      planExpiresAt: null,
    },
  });

  // Purchase kaydını güncelle
  const transactionId = event.transaction_id;
  if (transactionId) {
    await prisma.purchase.update({
      where: { transactionId },
      data: { status: 'CANCELLED' },
    }).catch(() => {});
  }
};

const _handleNonRenewingPurchase = async (userId, event) => {
  const transactionId = event.transaction_id;
  const existingPurchase = transactionId
    ? await prisma.purchase.findUnique({ where: { transactionId } }).catch(() => null)
    : null;

  if (existingPurchase) {
    await prisma.purchase.update({
      where: { transactionId },
      data: { status: 'COMPLETED' },
    });
    return;
  }

  await prisma.purchase.create({
    data: {
      userId,
      platform: event.store === 'APP_STORE' || event.store === 'app_store' ? 'APPLE' : 'GOOGLE',
      purchaseType: 'GAME_PACK',
      productId: event.product_id,
      receiptData: JSON.stringify(event),
      transactionId: transactionId || `rc_${event.id || Date.now()}`,
      status: 'COMPLETED',
      verifiedAt: new Date(event.event_timestamp_ms || Date.now()),
    },
  });
};

// Ödeme sorunu
const _handleBillingIssue = async (userId, event) => {
  // Ödeme sorunu durumunda premium erişimi askıya al
  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: 'FREE',
      planExpiresAt: null,
    },
  });
};

const _resolvePurchaseType = (productId) => {
  if (!productId) return 'SUBSCRIPTION_MONTHLY';
  if (productId.includes('weekly')) return 'SUBSCRIPTION_WEEKLY';
  if (productId.includes('yearly')) return 'SUBSCRIPTION_YEARLY';
  if (productId.includes('game_pack') || productId.includes('pack')) return 'GAME_PACK';
  return 'SUBSCRIPTION_MONTHLY';
};

module.exports = {
  handleWebhook,
};
