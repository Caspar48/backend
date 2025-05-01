/**
 * 應用程式服務器入口
 * 負責啟動 HTTP 服務器
 */
import dotenv from 'dotenv';
dotenv.config();

import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import app from './app';
import logger from './utils/logger';

// 獲取端口
const PORT = process.env.PORT || 5000;

// 啟動服務器
const server = app.listen(PORT, () => {
  logger.info(`伺服器運行在端口 ${PORT}`);
  logger.info(`環境: ${process.env.NODE_ENV}`);
  logger.info(`API 文檔: http://localhost:${PORT}/api-docs`);
});

// 處理未處理的異常
process.on('unhandledRejection', (err: Error) => {
  logger.error('未處理的 Promise 拒絕！關閉伺服器...');
  logger.error(err.stack || err.toString());
  server.close(() => {
    process.exit(1);
  });
});

export default server;