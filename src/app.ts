/**
 * backend/src/app.ts
 * 
 * 應用入口文件，配置中間件、路由及連接數據庫。
 */
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import path from 'path';

// 環境變數驗證
import validateEnv from './config/validateEnv';
const env = validateEnv();

// 導入工具和配置
import connectDB from './config/db';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';
import swaggerDocs from './config/swagger';

// 導入路由
import bookingRoutes from './routes/bookingRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

// 初始化 Express 應用
const app = express();

// 數據庫連接
logger.info('正在連接 MongoDB...');
connectDB();

// 安全中間件
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// 請求限制
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: '請求次數過多，請稍後再試'
});
app.use('/api', limiter);

// 請求解析中間件
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());
app.use(compression());

// 上傳目錄
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

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
app.all('*', (req, _res, next) => {
  logger.warn(`找不到路徑: ${req.originalUrl}`);
  next(new AppError(`找不到路徑: ${req.originalUrl}`, 404));
});

// 全局錯誤處理中間件
app.use(errorHandler);

// 設置 Swagger 文檔
swaggerDocs(app);

// 未捕獲的異常處理
process.on('uncaughtException', (err: Error) => {
  logger.error('未捕獲的異常! 關閉中...');
  logger.error(`${err.name}: ${err.message}`);
  logger.error(err.stack || '沒有堆疊追蹤');
  process.exit(1);
});

// 未處理的 Promise 拒絕處理
process.on('unhandledRejection', (reason: Error) => {
  logger.error('未處理的 Promise 拒絕! 關閉中...');
  logger.error(`${reason.name}: ${reason.message}`);
  logger.error(reason.stack || '沒有堆疊追蹤');
  process.exit(1);
});

export default app;