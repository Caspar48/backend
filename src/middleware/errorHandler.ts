import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

const handleCastErrorDB = (err: MongooseError.CastError) => {
  const message = `無效的 ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: MongoError) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)?.[0];
  const message = `重複的值: ${value}。請使用其他值`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: MongooseError.ValidationError) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `無效的輸入資料。${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('無效的令牌', 401);

const handleJWTExpiredError = () => new AppError('令牌已過期', 401);

const sendErrorDev = (err: AppError, req: Request, res: Response) => {
  logger.error('開發環境錯誤:', {
    path: req.path,
    error: err
  });

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  logger.error('生產環境錯誤:', {
    path: req.path,
    message: err.message
  });

  // 可操作的、可信的錯誤
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  
  // 程式錯誤：不洩漏詳情給客戶端
  res.status(500).json({
    status: 'error',
    message: '發生錯誤，請稍後再試'
  });
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};