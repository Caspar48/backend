/**
 * 認證控制器
 * 處理認證相關的請求
 */
const { registerUser, loginUser } = require('../services/authService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * 用戶註冊
 * @route POST /api/auth/register
 * @access Public
 */
const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    
    res.status(201).json({
      status: 'success',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 用戶登入
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return next(new AppError('請提供電子郵件和密碼', 400));
    }
    
    const result = await loginUser(email, password);
    
    res.status(200).json({
      status: 'success',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 獲取當前用戶資料
 * @route GET /api/auth/me
 * @access Private
 */
const getMe = async (req, res, next) => {
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
const logout = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '成功登出'
  });
};

module.exports = {
  register,
  login,
  getMe,
  logout
};