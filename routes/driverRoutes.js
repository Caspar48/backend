/**
 * routes/driverRoutes.js
 * 
 * 定義與司機相關的 API 路由：
 * 1. GET /bookings - 獲取司機的訂單列表
 * 2. PUT /availability - 更新司機的可用狀態
 */

const express = require('express');
const { getDriverBookings, updateDriverAvailability } = require('../controllers/driverController');
const auth = require('../middleware/auth');

const router = express.Router();

// 獲取司機的訂單列表
router.get('/bookings', auth, getDriverBookings);

// 更新司機的可用狀態
router.put('/availability', auth, updateDriverAvailability);

module.exports = router;
