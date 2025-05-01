"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
const securityMiddleware = (app) => {
    // 設置 HTTP 安全標頭
    app.use((0, helmet_1.default)());
    // 啟用 CORS
    app.use((0, cors_1.default)({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }));
    // 限制請求速率
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 分鐘
        max: 100, // 每個 IP 每 windowMs 時間最多 100 次請求
        message: { message: '請求過多，請稍後再試' },
        standardHeaders: true,
        legacyHeaders: false
    });
    app.use('/api', limiter);
    // API 路由特定的限制
    const authLimiter = (0, express_rate_limit_1.default)({
        windowMs: 60 * 60 * 1000, // 1 小時
        max: 10, // 每個 IP 每小時最多 10 次請求
        message: { message: '認證請求過多，請稍後再試' },
        standardHeaders: true,
        legacyHeaders: false
    });
    app.use('/api/auth', authLimiter);
    // 防止 NoSQL 注入
    app.use((0, express_mongo_sanitize_1.default)());
    // 防止 XSS 攻擊
    app.use((0, xss_clean_1.default)());
    // 防止參數污染
    app.use((0, hpp_1.default)({
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
exports.default = securityMiddleware;
