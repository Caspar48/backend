"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'driver', 'company'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
});
// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password);
};
exports.default = mongoose_1.default.model('User', userSchema);
