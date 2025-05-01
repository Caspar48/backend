"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 使用者模型
 */
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: [true, '請提供用戶名'],
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
}, {
    timestamps: true, // 自動添加 createdAt 和 updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// 索引
userSchema.index({ email: 1 });
// 保存前加密密碼
userSchema.pre('save', async function (next) {
    // 只有在密碼被修改時才重新加密
    if (!this.isModified('password'))
        return next();
    try {
        // 生成鹽並加密密碼
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            next(error);
        }
    }
});
// 比較密碼方法
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
