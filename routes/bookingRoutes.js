/**
 * bookingRoutes.js
 * 預訂相關 API 路由：包括創建預訂和查詢當前用戶預訂列表
 */

const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings } = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// 創建預訂 - 移除 auth 中間件，允許非登入用戶創建預訂
router.post('/', createBooking);

// 獲取用戶預訂記錄 - 保持需要驗證，因為只有登入用戶才能查看自己的預訂
router.get('/user', auth, getUserBookings);

module.exports = router;
