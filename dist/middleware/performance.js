"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSystemMonitoring = exports.memoryUsage = exports.requestTimer = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
// 請求計時中間件
const requestTimer = (req, res, next) => {
    // 記錄開始時間
    req.startTime = Date.now();
    // 原始 end 函數
    const originalEnd = res.end;
    // 重寫 end 函數
    res.end = function (chunk, encoding) {
        // 計算請求處理時間
        const responseTime = Date.now() - req.startTime;
        // 添加響應時間頭
        res.set('X-Response-Time', `${responseTime}ms`);
        // 記錄請求詳情
        const logData = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            responseTime: `${responseTime}ms`,
            userAgent: req.get('user-agent') || '-',
            ip: req.ip || req.connection.remoteAddress
        };
        // 根據響應狀態碼選擇日誌級別
        if (res.statusCode >= 500) {
            logger_1.default.error(`服務器錯誤: ${JSON.stringify(logData)}`);
        }
        else if (res.statusCode >= 400) {
            logger_1.default.warn(`客戶端錯誤: ${JSON.stringify(logData)}`);
        }
        else {
            logger_1.default.info(`請求完成: ${logData.method} ${logData.url} ${logData.status} ${logData.responseTime}`);
        }
        // 執行原始 end 函數
        return originalEnd.call(this, chunk, encoding);
    };
    next();
};
exports.requestTimer = requestTimer;
// 內存使用監控
const memoryUsage = (req, res, next) => {
    const memBefore = process.memoryUsage();
    // 請求處理完成後
    res.on('finish', () => {
        const memAfter = process.memoryUsage();
        const memUsed = {
            rss: (memAfter.rss - memBefore.rss) / 1024 / 1024, // 轉換為 MB
            heapTotal: (memAfter.heapTotal - memBefore.heapTotal) / 1024 / 1024,
            heapUsed: (memAfter.heapUsed - memBefore.heapUsed) / 1024 / 1024
        };
        // 大於閾值才記錄
        if (memUsed.heapUsed > 5) { // 超過 5MB 記憶體增加
            logger_1.default.warn(`記憶體用量高: ${req.method} ${req.originalUrl}, 增加: ${memUsed.heapUsed.toFixed(2)}MB`);
        }
    });
    next();
};
exports.memoryUsage = memoryUsage;
// 定期記錄系統狀態
const startSystemMonitoring = (interval = 5 * 60 * 1000) => {
    return setInterval(() => {
        const mem = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        logger_1.default.info(`系統狀態: 記憶體 RSS: ${(mem.rss / 1024 / 1024).toFixed(2)}MB, ` +
            `Heap: ${(mem.heapUsed / 1024 / 1024).toFixed(2)}MB / ` +
            `${(mem.heapTotal / 1024 / 1024).toFixed(2)}MB, ` +
            `CPU: 用戶 ${cpuUsage.user}, 系統 ${cpuUsage.system}`);
    }, interval);
};
exports.startSystemMonitoring = startSystemMonitoring;
