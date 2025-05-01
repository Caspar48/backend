/**
 * 使用者模型
 */
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserDocument } from '../types';

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: false, // Changed from required: true
      trim: true,
      minlength: [3, '用戶名至少需要3個字符'],
      maxlength: [30, '用戶名不能超過30個字符']
    },
    email: {
      type: String,
      required: [true, '請提供電子郵件'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        '請提供有效的電子郵件地址'
      ]
    },
    password: {
      type: String,
      required: [true, '請提供密碼'],
      minlength: [6, '密碼至少需要6個字符'],
      select: false // 默認查詢不返回密碼
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'driver'],
      default: 'user'
    }
  },
  {
    timestamps: true, // 自動添加 createdAt 和 updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 保存前加密密碼
userSchema.pre<UserDocument>('save', async function(next) {
  // 只有在密碼被修改時才重新加密
  if (!this.isModified('password')) return next();
  
  try {
    // 生成鹽並加密密碼
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    }
  }
});

// 比較密碼方法
userSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;