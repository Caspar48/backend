/**
 * controllers/userController.js
 *
 * 提供用戶資料的獲取與更新接口
 */

const User = require('../models/User');

/**
 * GET /api/users/profile
 * 獲取當前用戶的基本資料
 * @param {object} req - 請求對象（req.user 由 auth 中間件提供）
 * @param {object} res - 響應對象
 */
exports.getUserProfile = async (req, res) => {
  try {
    // 從數據庫中查找當前用戶，排除敏感字段（例如密碼）
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: '用戶未找到' });
    }
    res.json(user);
  } catch (error) {
    console.error('獲取用戶資料出錯:', error.message);
    res.status(500).send('服務器錯誤');
  }
};

/**
 * PUT /api/users/profile
 * 更新當前用戶的資料（支持更新用戶名、電子郵件、手機號）
 * @param {object} req - 請求對象，包含更新字段（username, email, phone）
 * @param {object} res - 響應對象
 */
exports.updateUserProfile = async (req, res) => {
  const { username, email, phone } = req.body;
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: '用戶未找到' });
    }

    // 根據請求數據更新用戶資料，若未提供則保留原值
    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();
    res.json({ msg: '用戶資料更新成功', user: { username: user.username, email: user.email, phone: user.phone } });
  } catch (error) {
    console.error('更新用戶資料時出錯:', error.message);
    res.status(500).send('服務器錯誤');
  }
};
