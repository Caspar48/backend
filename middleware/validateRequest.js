/**
 * 請求資料驗證中間件
 * 使用 Joi 庫進行輸入驗證
 */
const Joi = require('joi');
const { AppError } = require('./errorHandler');

/**
 * 驗證請求資料中間件
 * @param {Object} schema - Joi 驗證模式
 * @param {String} source - 驗證資料源 (body, params, query)
 */
const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];
    
    const { error, value } = schema.validate(data, {
      abortEarly: false, // 返回所有錯誤
      stripUnknown: true, // 移除未在 schema 中定義的屬性
    });
    
    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      return next(new AppError(errorMessage, 400));
    }
    
    // 將驗證後的資料替換原始資料
    req[source] = value;
    return next();
  };
};

// 常用驗證模式
const validationSchemas = {
  // 用戶註冊驗證
  register: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({ 'any.only': '確認密碼必須與密碼相同' })
  }),
  
  // 用戶登入驗證
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  // 預訂創建驗證
  createBooking: Joi.object({
    vehicleId: Joi.string().required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).required()
      .messages({ 'date.greater': '結束日期必須大於開始日期' }),
    pickupLocation: Joi.string().required(),
    dropoffLocation: Joi.string().required()
  })
};

module.exports = {
  validateRequest,
  validationSchemas
}; 