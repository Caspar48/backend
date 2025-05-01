/**
 * 用戶控制器
 * 處理用戶相關的請求
 */
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import User from '../models/userModel';
import { AppError } from '../utils/AppError';
import { ErrorCodes } from '../constants/errorCodes';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger';

/**
 * 獲取用戶個人資料
 * @route GET /api/users/profile
 * @access Private
 */
export const getUserProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id).select('-password');
    
    if (!user) {
      return next(new AppError(ErrorCodes.USER_NOT_FOUND, 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新用戶個人資料
 * @route PUT /api/users/profile
 * @access Private
 */
export const updateUserProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email } = req.body;
    
    // 確認用戶存在
    const user = await User.findById(req.user!.id);
    if (!user) {
      return next(new AppError(ErrorCodes.USER_NOT_FOUND, 404));
    }
    
    // 檢查電子郵件是否已被其他用戶使用
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new AppError(ErrorCodes.USER_ALREADY_EXISTS, 400));
      }
      user.email = email;
    }
    
    // 更新用戶資料
    if (username) user.username = username;
    
    await user.save();
    
    // 移除密碼並返回用戶資料
    const userObj = user.toObject();
    const { password, ...userToReturn } = userObj;
    
    logger.info(`用戶 ${user._id} 更新個人資料`);
    
    res.status(200).json({
      status: 'success',
      data: { user: userToReturn }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 修改密碼
 * @route PUT /api/users/change-password
 * @access Private
 */
export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // 獲取用戶（包含密碼）
    const user = await User.findById(req.user!.id).select('+password');
    if (!user) {
      return next(new AppError(ErrorCodes.USER_NOT_FOUND, 404));
    }
    
    // 驗證當前密碼
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return next(new AppError(ErrorCodes.INVALID_CREDENTIALS, 401));
    }
    
    // 更新密碼
    user.password = newPassword;
    await user.save();
    
    logger.info(`用戶 ${user._id} 修改密碼`);
    
    res.status(200).json({
      status: 'success',
      message: '密碼修改成功'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 獲取所有用戶（管理員）
 * @route GET /api/users
 * @access Private/Admin
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 獲取特定用戶（管理員）
 * @route GET /api/users/:id
 * @access Private/Admin
 */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return next(new AppError(ErrorCodes.USER_NOT_FOUND, 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 刪除用戶（管理員）
 * @route DELETE /api/users/:id
 * @access Private/Admin
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return next(new AppError(ErrorCodes.USER_NOT_FOUND, 404));
    }
    
    logger.info(`管理員刪除用戶: ${req.params.id}`);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
}; 