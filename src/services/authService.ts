/**
 * 認證服務
 * 處理用戶註冊、登入等核心認證邏輯
 */
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { UserDocument, JwtPayload } from '../types';

/**
 * 生成 JWT 令牌
 * @param {string} userId - 用戶 ID
 * @returns {string} JWT 令牌
 */
export const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId } as JwtPayload,
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

interface RegisterUserData {
  email: string;
  password: string;
  role: string;
}

interface AuthResult {
  user: Partial<UserDocument>;
  token: string;
}

/**
 * 用戶註冊
 * @param {RegisterUserData} userData - 用戶資料
 * @returns {Promise<AuthResult>} 用戶資料和令牌
 */
export const registerUser = async (userData: RegisterUserData): Promise<AuthResult> => {
  const { email, password, role } = userData;
  
  // 檢查用戶是否已存在
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('該電子郵件已經註冊', 400);
  }
  
  // 創建新用戶
  const user = await User.create({
    email,
    password,
    role
  });
  
  // 生成令牌
  const token = generateToken(user._id.toString());
  
  // 移除密碼
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  
  logger.info(`新用戶註冊: ${user._id}`);
  
  return { user: userWithoutPassword, token };
};

/**
 * 用戶登入
 * @param {string} email - 用戶電子郵件
 * @param {string} password - 用戶密碼
 * @returns {Promise<AuthResult>} 用戶資料和令牌
 */
export const loginUser = async (email: string, password: string): Promise<AuthResult> => {
  // 檢查用戶是否存在
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('電子郵件或密碼不正確', 401);
  }
  
  // 檢查密碼是否正確
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('電子郵件或密碼不正確', 401);
  }
  
  // 生成令牌
  const token = generateToken(user._id.toString());
  
  // 移除密碼
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  
  logger.info(`用戶登入: ${user._id}`);
  
  return { user: userWithoutPassword, token };
};