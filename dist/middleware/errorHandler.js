"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, _next) => {
    // 處理 AppError 類型
    const statusCode = 'statusCode' in err ? err.statusCode : 500;
    const status = 'status' in err ? err.status : 'error';
    const isOperational = 'isOperational' in err ? err.isOperational : false;
    // 記錄錯誤
    if (statusCode >= 500) {
        logger_1.default.error(`伺服器錯誤: ${err.message} - 路徑: ${req.originalUrl}`);
        logger_1.default.error(err.stack || '沒有堆疊追蹤');
    }
    else {
        logger_1.default.warn(`客戶端錯誤 (${statusCode}): ${err.message} - 路徑: ${req.originalUrl}`);
    }
    // 開發環境返回詳細錯誤
    if (process.env.NODE_ENV === 'development') {
        return res.status(statusCode).json({
            status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
    // 生產環境返回簡化錯誤
    if (isOperational) {
        return res.status(statusCode).json({
            status,
            message: err.message
        });
    }
    // 非預期錯誤處理
    return res.status(500).json({
        status: 'error',
        message: '發生錯誤，請稍後再試'
    });
};
exports.errorHandler = errorHandler;
