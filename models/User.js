const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, default: '' }, // 用戶名稱，可在註冊或個人資料更新中設置
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },    // 手機號，可選
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer', 'driver', 'company'], default: 'customer' },
}, {
  timestamps: true, // 自動生成 createdAt 和 updatedAt 字段
});

// 保存前加密密碼，如果密碼未修改則跳過
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 定義方法：驗證輸入密碼是否與存儲的加密密碼匹配
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
