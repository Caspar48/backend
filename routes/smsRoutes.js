/**
 * routes/smsRoutes.js
 * 
 * 定義測試短信通知的接口
 */
const express = require('express');
const router = express.Router();
const { sendSMSNotification } = require('../controllers/smsNotificationController');
const auth = require('../middleware/auth');

// 測試接口：發送短信通知
router.post('/send', auth, async (req, res) => {
  const { phone, message } = req.body;
  if (!phone || !message) {
    return res.status(400).json({ msg: '請提供 phone 和 message' });
  }
  try {
    const result = await sendSMSNotification(phone, message);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ msg: '發送短信失敗' });
  }
});

module.exports = router;
