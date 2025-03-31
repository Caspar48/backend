/**
 * bookingRoutes.js
 * 預訂相關 API 路由：包括創建預訂和查詢當前用戶預訂列表
 */

const express = require('express');
const { createBooking, getUserBookings } = require('../controllers/bookingController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createBooking);
router.get('/', auth, getUserBookings);

module.exports = router;
