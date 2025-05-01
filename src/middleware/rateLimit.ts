import rateLimit from 'express-rate-limit';
import { ROLES } from '../constants';

export const createRateLimiter = (options: {
  windowMs?: number;
  max?: number;
  message?: string;
  skipRoles?: string[];
}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100,
    message = '請求次數過多，請稍後再試。',
    skipRoles = [ROLES.ADMIN]
  } = options;

  return rateLimit({
    windowMs,
    max,
    message,
    skip: (req) => {
      const userRole = req.user?.role;
      return userRole ? skipRoles.includes(userRole) : false;
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// 常用限制器
export const limiters = {
  // API 通用限制
  api: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100
  }),

  // 登入限制
  login: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: '登入嘗試次數過多，請15分鐘後再試。',
    skipRoles: []
  }),

  // 註冊限制
  register: createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: '註冊嘗試次數過多，請1小時後再試。',
    skipRoles: []
  }),

  // 預訂創建限制
  bookingCreate: createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: '創建預訂次數過多，請稍後再試。'
  })
};