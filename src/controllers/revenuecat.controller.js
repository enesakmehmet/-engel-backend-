const handleWebhook = async (_req, res) => {
  return res.status(410).json({ success: false, message: 'Bu webhook kapatıldı.' });
};

module.exports = {
  handleWebhook,
};
