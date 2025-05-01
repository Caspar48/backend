/**
 * 認證服務
 * 處理用戶註冊、登入等核心認證邏輯
 */
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * 生成 JWT 令牌
 * @param {string} userId - 用戶 ID
 * @returns {string} JWT 令牌
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

/**
 * 用戶註冊
 * @param {Object} userData - 用戶資料
 * @returns {Object} 用戶資料和令牌
 */
const registerUser = async (userData) => {
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
    role: role || 'user' // 默認為普通用戶
  });
  
  // 生成令牌
  const token = generateToken(user._id);
  
  // 移除密碼
  user.password = undefined;
  
  logger.info(`新用戶註冊: ${user._id}`);
  
  return { user, token };
};

/**
 * 用戶登入
 * @param {string} email - 用戶電子郵件
 * @param {string} password - 用戶密碼
 * @returns {Object} 用戶資料和令牌
 */
const loginUser = async (email, password) => {
  // 檢查用戶是否存在
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('電子郵件或密碼不正確', 401);
  }
  
  // 檢查密碼是否正確
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('電子郵件或密碼不正確', 401);
  }
  
  // 生成令牌
  const token = generateToken(user._id);
  
  // 移除密碼
  user.password = undefined;
  
  logger.info(`用戶登入: ${user._id}`);
  
  return { user, token };
};

module.exports = {
  registerUser,
  loginUser,
  generateToken
};