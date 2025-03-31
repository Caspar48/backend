const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// 用戶註冊
router.post('/register', register);

// 用戶登錄
router.post('/login', login);

// 添加測試路由
router.get('/test', (req, res) => {
    res.json({ message: '後端服務器連接成功' });
  });
  
module.exports = router;