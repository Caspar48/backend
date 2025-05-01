/**
 * backend/app.js
 * 
 * 應用入口文件，配置中間件、路由及連接數據庫。
 */
require('dotenv').config();
const express = require('express');
const path = require('path');

// 環境變數驗證
const validateEnv = require('./config/validateEnv');
const env = validateEnv();

// 導入工具和配置
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const securityMiddleware = require('./middleware/security');
const { errorHandler } = require('./middleware/errorHandler');
const { requestTimer, memoryUsage, startSystemMonitoring } = require('./middleware/performance');
const swaggerDocs = require('./config/swagger');

// 導入路由
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// 初始化 Express 應用
const app = express();

// 數據庫連接
logger.info('正在連接 MongoDB...');
connectDB();

// 安全中間件 (會設置 CORS, Helmet 等)
securityMiddleware(app);

// 請求解析中間件
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 性能監控中間件
app.use(requestTimer);
app.use(memoryUsage);

// 上傳目錄
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API 路由
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 健康檢查路由
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '伺服器運行中',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// 處理未定義路由
app.all('*', (req, res, next) => {
  logger.warn(`找不到路徑: ${req.originalUrl}`);
  const err = new Error(`找不到路徑: ${req.originalUrl}`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});

// 全局錯誤處理中間件
app.use(errorHandler);

// 設置 Swagger 文檔
swaggerDocs(app);

// 啟動系統監控
if (process.env.NODE_ENV === 'production') {
  startSystemMonitoring();
}

// 未捕獲的異常處理
process.on('uncaughtException', err => {
  logger.error('未捕獲的異常! 關閉中...');
  logger.error(err.name, err.message, err.stack);
  process.exit(1);
});

// 未處理的 Promise 拒絕處理
process.on('unhandledRejection', err => {
  logger.error('未處理的 Promise 拒絕! 關閉中...');
  logger.error(err.name, err.message, err.stack);
  process.exit(1);
});

module.exports = app;