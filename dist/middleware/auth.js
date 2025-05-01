"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("./errorHandler");
const userModel_1 = __importDefault(require("../models/userModel"));
const util_1 = require("util");
/**
 * 保護路由中間件
 * 驗證用戶是否已登入
 */
const protect = async (req, _res, next) => {
    try {
        // 1) 獲取令牌
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new errorHandler_1.AppError('您尚未登入，請先登入以獲取訪問權限', 401));
        }
        // 2) 驗證令牌
        const decoded = await (0, util_1.promisify)(jsonwebtoken_1.default.verify)(token, process.env.JWT_SECRET);
        // 3) 檢查用戶是否仍然存在
        const currentUser = await userModel_1.default.findById(decoded.id);
        if (!currentUser) {
            return next(new errorHandler_1.AppError('此令牌關聯的用戶不再存在', 401));
        }
        // 4) 將用戶資料附加到請求對象
        req.user = currentUser;
        next();
    }
    catch (error) {
        if (error instanceof Error && error.name === 'JsonWebTokenError') {
            return next(new errorHandler_1.AppError('無效的令牌，請重新登入', 401));
        }
        if (error instanceof Error && error.name === 'TokenExpiredError') {
            return next(new errorHandler_1.AppError('您的令牌已過期，請重新登入', 401));
        }
        next(error);
    }
};
exports.protect = protect;
/**
 * 限制角色訪問中間件
 * 確保只有特定角色的用戶可以訪問
 */
const restrictTo = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new errorHandler_1.AppError('用戶未認證', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new errorHandler_1.AppError('您沒有訪問此操作的權限', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
