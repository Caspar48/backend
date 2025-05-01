/**
 * 認證控制器
 * 處理認證相關的請求
 */
import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

/**
 * 用戶註冊
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await registerUser(req.body);
    
    res.status(201).json({
      status: 'success',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    logger.error('註冊失敗:', error);
    next(error);
  }
};

/**
 * 用戶登入
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new AppError('請提供電子郵件和密碼', 400);
    }
    
    const result = await loginUser(email, password);
    
    res.status(200).json({
      status: 'success',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    logger.error('登入失敗:', error);
    next(error);
  }
};

/**
 * 獲取當前用戶資料
 * @route GET /api/auth/me
 * @access Private
 */
export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // req.user 由認證中間件設置
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 登出用戶
 * @route POST /api/auth/logout
 * @access Private
 */
export const logout = (
  _req: Request,
  res: Response
): Response => {
  return res.status(200).json({
    status: 'success',
    message: '成功登出'
  });
};