const express = require('express');
const { getCompanyBookings, updateCompanyAvailability } = require('../controllers/companyController');
const auth = require('../middleware/auth');

const router = express.Router();

// 獲取公司的訂單列表
router.get('/bookings', auth, getCompanyBookings);

// 更新公司的可用狀態
router.put('/availability', auth, updateCompanyAvailability);

module.exports = router;