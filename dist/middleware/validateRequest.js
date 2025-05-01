"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchemas = exports.validateRequest = void 0;
const joi_1 = __importDefault(require("joi"));
const errorHandler_1 = require("./errorHandler");
/**
 * 驗證請求資料中間件
 * @param {Joi.Schema} schema - Joi 驗證模式
 * @param {string} source - 驗證資料源 (body, params, query)
 */
const validateRequest = (schema, source = 'body') => {
    return (req, _res, next) => {
        const data = req[source];
        const { error, value } = schema.validate(data, {
            abortEarly: false, // 返回所有錯誤
            stripUnknown: true, // 移除未在 schema 中定義的屬性
        });
        if (error) {
            const errorMessage = error.details
                .map(detail => detail.message)
                .join(', ');
            return next(new errorHandler_1.AppError(errorMessage, 400));
        }
        // 將驗證後的資料替換原始資料
        req[source] = value;
        return next();
    };
};
exports.validateRequest = validateRequest;
// 常用驗證模式
exports.validationSchemas = {
    // 用戶註冊驗證
    register: joi_1.default.object({
        username: joi_1.default.string().min(3).max(30).required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).required()
            .messages({ 'any.only': '確認密碼必須與密碼相同' }),
        role: joi_1.default.string().valid('user', 'admin', 'driver')
    }),
    // 用戶登入驗證
    login: joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required()
    }),
    // 預訂創建驗證
    createBooking: joi_1.default.object({
        vehicleId: joi_1.default.string().required(),
        startDate: joi_1.default.date().iso().required(),
        endDate: joi_1.default.date().iso().greater(joi_1.default.ref('startDate')).required()
            .messages({ 'date.greater': '結束日期必須大於開始日期' }),
        pickupLocation: joi_1.default.string().required(),
        dropoffLocation: joi_1.default.string().required(),
        totalAmount: joi_1.default.number().positive().required()
    })
};
