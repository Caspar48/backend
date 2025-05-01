/**
 * 日誌系統工具
 * 使用 Winston 記錄應用程式日誌
 */
const winston = require('winston');
const path = require('path');

// 定義日誌級別
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 根據環境選擇日誌級別
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// 自定義日誌格式
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// 定義日誌輸出目標
const transports = [
  // 控制台輸出
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      format
    ),
  }),
  // 錯誤日誌文件
  new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
  }),
  // 所有日誌文件
  new winston.transports.File({ 
    filename: path.join('logs', 'combined.log') 
  }),
];

// 創建 logger 實例
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

module.exports = logger; 