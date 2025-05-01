"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * backend/src/app.ts
 *
 * 應用入口文件，配置中間件、路由及連接數據庫。
 */
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
// 環境變數驗證
const validateEnv_1 = __importDefault(require("./config/validateEnv"));
const env = (0, validateEnv_1.default)();
// 導入工具和配置
const db_1 = __importDefault(require("./config/db"));
const logger_1 = __importDefault(require("./utils/logger"));
const security_1 = __importDefault(require("./middleware/security"));
const errorHandler_1 = require("./middleware/errorHandler");
const performance_1 = require("./middleware/performance");
const swagger_1 = __importDefault(require("./config/swagger"));
// 導入路由
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
// 初始化 Express 應用
const app = (0, express_1.default)();
// 數據庫連接
logger_1.default.info('正在連接 MongoDB...');
(0, db_1.default)();
// 安全中間件 (會設置 CORS, Helmet 等)
(0, security_1.default)(app);
// 請求解析中間件
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
// 性能監控中間件
app.use(performance_1.requestTimer);
app.use(performance_1.memoryUsage);
// 上傳目錄
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
// API 路由
app.use('/api/bookings', bookingRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
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
    logger_1.default.warn(`找不到路徑: ${req.originalUrl}`);
    next(new errorHandler_1.AppError(`找不到路徑: ${req.originalUrl}`, 404));
});
// 全局錯誤處理中間件
app.use(errorHandler_1.errorHandler);
// 設置 Swagger 文檔
(0, swagger_1.default)(app);
// 啟動系統監控
if (process.env.NODE_ENV === 'production') {
    (0, performance_1.startSystemMonitoring)();
}
// 未捕獲的異常處理
process.on('uncaughtException', (err) => {
    logger_1.default.error('未捕獲的異常! 關閉中...');
    logger_1.default.error(`${err.name}: ${err.message}`);
    logger_1.default.error(err.stack || '沒有堆疊追蹤');
    process.exit(1);
});
// 未處理的 Promise 拒絕處理
process.on('unhandledRejection', (reason) => {
    logger_1.default.error('未處理的 Promise 拒絕! 關閉中...');
    logger_1.default.error(`${reason.name}: ${reason.message}`);
    logger_1.default.error(reason.stack || '沒有堆疊追蹤');
    process.exit(1);
});
exports.default = app;
