const User = require('../models/User');
const Driver = require('../models/Driver');
const Company = require('../models/Company');
const jwt = require('jsonwebtoken');

// 用戶註冊
exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    console.log('註冊請求:', { email, role }); // 調試信息

    // 檢查用戶是否已存在
    let user = await User.findOne({ email });
    if (user) {
      console.log('用戶已存在:', email); // 調試信息
      return res.status(400).json({ msg: '用戶已存在' });
    }

    // 創建新用戶
    user = new User({ email, password, role });
    await user.save();
    console.log('用戶創建成功:', user); // 調試信息

    // 生成 JWT
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        console.error('生成 JWT 時出錯:', err.message); // 調試信息
        throw err;
      }
      res.json({ token });
    });
  } catch (err) {
    console.error('註冊時出錯:', err.message); // 調試信息
    res.status(500).send('服務器錯誤');
  }
};

// 用戶登錄
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('登錄請求:', { email }); // 調試信息

    // 檢查用戶是否存在（先檢查 users 集合）
    let user = await User.findOne({ email });
    if (!user) {
      // 如果 users 集合中未找到，檢查 drivers 集合
      user = await Driver.findOne({ email });
      if (!user) {
        // 如果 drivers 集合中未找到，檢查 companies 集合
        user = await Company.findOne({ email });
        if (!user) {
          console.log('用戶未找到:', email); // 調試信息
          return res.status(400).json({ msg: '用戶不存在' });
        }
      }
    }

    // 驗證密碼
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('密碼錯誤:', email); // 調試信息
      return res.status(400).json({ msg: '密碼錯誤' });
    }

    // 生成 JWT
    const payload = { user: { id: user.id, role: user.role || 'company' } }; // 如果沒有 role 字段，默認為 company
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        console.error('生成 JWT 時出錯:', err.message); // 調試信息
        throw err;
      }
      console.log('登錄成功，生成 JWT:', token); // 調試信息
      res.json({ token });
    });
  } catch (err) {
    console.error('登錄時出錯:', err.message); // 調試信息
    res.status(500).send('服務器錯誤');
  }
};