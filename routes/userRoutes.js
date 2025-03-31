/**
 * routes/userRoutes.js
 *
 * 定義與用戶資料相關的 API 路由，包含 GET 和 PUT /profile 接口
 */

const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');

// 獲取當前用戶資料（需驗證）
router.get('/profile', auth, getUserProfile);

// 更新當前用戶資料（需驗證）
router.put('/profile', auth, updateUserProfile);

module.exports = router;
