"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 應用程式服務器入口
 * 負責啟動 HTTP 服務器
 */
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dns_1 = __importDefault(require("dns"));
dns_1.default.setDefaultResultOrder('ipv4first');
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./utils/logger"));
// 獲取端口
const PORT = process.env.PORT || 5000;
// 啟動服務器
const server = app_1.default.listen(PORT, () => {
    logger_1.default.info(`伺服器運行在端口 ${PORT}`);
    logger_1.default.info(`環境: ${process.env.NODE_ENV}`);
    if (process.env.NODE_ENV === 'development') {
        logger_1.default.info(`API 文檔: http://localhost:${PORT}/api-docs`);
    }
});
// 處理未處理的異常
process.on('unhandledRejection', (err) => {
    logger_1.default.error('未處理的 Promise 拒絕！關閉伺服器...');
    logger_1.default.error(err.stack || err.toString());
    server.close(() => {
        process.exit(1);
    });
});
exports.default = server;
