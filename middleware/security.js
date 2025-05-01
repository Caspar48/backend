// backend/middleware/security.js
/**
 * 安全中間件
 * 實施多種安全最佳實踐
 */
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const securityMiddleware = (app) => {
  // 設置 HTTP 安全標頭
  app.use(helmet());
  
  // 啟用 CORS
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
  
  // 限制請求速率
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 分鐘
    max: 100, // 每個 IP 每 windowMs 時間最多 100 次請求
    message: '請求過多，請稍後再試'
  });
  app.use('/api', limiter);
  
  // API 路由特定的限制
  const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 小時
    max: 10, // 每個 IP 每小時最多 10 次請求
    message: '認證請求過多，請稍後再試'
  });
  app.use('/api/auth', authLimiter);
  
  // 防止 NoSQL 注入
  app.use(mongoSanitize());
  
  // 防止 XSS 攻擊
  app.use(xss());
  
  // 防止參數污染
  app.use(hpp({
    whitelist: ['price', 'date', 'rating'] // 允許這些字段重複
  }));
  
  // 添加響應頭安全標記
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
};

module.exports = securityMiddleware;