const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// 註冊（使用 JSON）
router.post('/register', register);

// 登入
router.post('/login', login);

module.exports = router;