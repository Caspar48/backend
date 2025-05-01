/**
 * 統一錯誤處理中間件
 * 處理所有路由和中間件拋出的錯誤
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // 開發環境返回詳細錯誤
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  
  // 生產環境返回簡化錯誤
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  
  // 非預期錯誤處理
  console.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: '發生錯誤，請稍後再試'
  });
};

module.exports = { AppError, errorHandler }; 