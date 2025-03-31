const express = require('express');
const { createPayment } = require('../controllers/paymentController');
const auth = require('../middleware/auth');

const router = express.Router();

// 創建支付訂單
router.post('/', auth, createPayment);

module.exports = router;