"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = exports.generateToken = void 0;
/**
 * 認證服務
 * 處理用戶註冊、登入等核心認證邏輯
 */
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * 生成 JWT 令牌
 * @param {string} userId - 用戶 ID
 * @returns {string} JWT 令牌
 */
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '30d' });
};
exports.generateToken = generateToken;
/**
 * 用戶註冊
 * @param {RegisterUserData} userData - 用戶資料
 * @returns {Promise<AuthResult>} 用戶資料和令牌
 */
const registerUser = async (userData) => {
    const { username, email, password, role } = userData;
    // 檢查用戶是否已存在
    const existingUser = await userModel_1.default.findOne({ email });
    if (existingUser) {
        throw new errorHandler_1.AppError('該電子郵件已經註冊', 400);
    }
    // 創建新用戶
    const user = await userModel_1.default.create({
        username,
        email,
        password,
        ...(role && { role }) // 只有在提供 role 時才加入
    });
    // 生成令牌
    const token = (0, exports.generateToken)(user._id.toString());
    // 移除密碼
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    logger_1.default.info(`新用戶註冊: ${user._id}`);
    return { user: userWithoutPassword, token };
};
exports.registerUser = registerUser;
/**
 * 用戶登入
 * @param {string} email - 用戶電子郵件
 * @param {string} password - 用戶密碼
 * @returns {Promise<AuthResult>} 用戶資料和令牌
 */
const loginUser = async (email, password) => {
    // 檢查用戶是否存在
    const user = await userModel_1.default.findOne({ email }).select('+password');
    if (!user) {
        throw new errorHandler_1.AppError('電子郵件或密碼不正確', 401);
    }
    // 檢查密碼是否正確
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new errorHandler_1.AppError('電子郵件或密碼不正確', 401);
    }
    // 生成令牌
    const token = (0, exports.generateToken)(user._id.toString());
    // 移除密碼
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    logger_1.default.info(`用戶登入: ${user._id}`);
    return { user: userWithoutPassword, token };
};
exports.loginUser = loginUser;
