import { ErrorCode } from './errorCodes';

export const ErrorMessages: Record<ErrorCode, string> = {
  // 通用錯誤訊息
  INTERNAL_SERVER_ERROR: '伺服器內部錯誤',
  INVALID_INPUT: '無效的輸入資料',
  NOT_FOUND: '找不到請求的資源',
  UNAUTHORIZED: '未經授權的訪問',
  FORBIDDEN: '禁止訪問',
  VALIDATION_ERROR: '資料驗證錯誤',

  // 用戶相關錯誤訊息
  USER_NOT_FOUND: '找不到該用戶',
  USER_ALREADY_EXISTS: '用戶已存在',
  INVALID_CREDENTIALS: '無效的登入憑證',
  PASSWORD_MISMATCH: '密碼不匹配',
  INVALID_TOKEN: '無效的令牌',
  TOKEN_EXPIRED: '令牌已過期',

  // 預訂相關錯誤訊息
  BOOKING_NOT_FOUND: '找不到該預訂',
  BOOKING_CONFLICT: '預訂時間衝突',
  INVALID_BOOKING_DATES: '無效的預訂日期',
  BOOKING_CANCELLED: '預訂已被取消',
  BOOKING_COMPLETED: '預訂已完成',
  VEHICLE_NOT_AVAILABLE: '車輛不可用',
}; 