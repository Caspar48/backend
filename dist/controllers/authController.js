"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getMe = exports.login = exports.register = void 0;
const authService_1 = require("../services/authService");
const errorHandler_1 = require("../middleware/errorHandler");
/**
 * 用戶註冊
 * @route POST /api/auth/register
 * @access Public
 */
const register = async (req, res, next) => {
    try {
        const result = await (0, authService_1.registerUser)(req.body);
        res.status(201).json({
            status: 'success',
            token: result.token,
            user: result.user
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
/**
 * 用戶登入
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new errorHandler_1.AppError('請提供電子郵件和密碼', 400));
        }
        const result = await (0, authService_1.loginUser)(email, password);
        res.status(200).json({
            status: 'success',
            token: result.token,
            user: result.user
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
/**
 * 獲取當前用戶資料
 * @route GET /api/auth/me
 * @access Private
 */
const getMe = async (req, res, next) => {
    try {
        // req.user 由認證中間件設置
        res.status(200).json({
            status: 'success',
            data: {
                user: req.user
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
/**
 * 登出用戶
 * @route POST /api/auth/logout
 * @access Private
 */
const logout = (_req, res) => {
    return res.status(200).json({
        status: 'success',
        message: '成功登出'
    });
};
exports.logout = logout;
