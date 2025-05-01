export const ROLES = {
  USER: 'user',
  DRIVER: 'driver',
  ADMIN: 'admin'
} as const;

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded'
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
} as const;

export const JWT = {
  EXPIRES_IN: '30d',
  COOKIE_EXPIRES_IN: 30
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: '無訪問權限。請先登入。',
  FORBIDDEN: '您沒有權限執行此操作。',
  NOT_FOUND: '找不到請求的資源。',
  VALIDATION_ERROR: '提供的數據無效。',
  SERVER_ERROR: '服務器內部錯誤。'
} as const;