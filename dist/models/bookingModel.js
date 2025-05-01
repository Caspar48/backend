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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 預訂模型
 */
const mongoose_1 = __importStar(require("mongoose"));
const bookingSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, '預訂必須關聯一個使用者']
    },
    vehicleId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: [true, '預訂必須關聯一個車輛']
    },
    startDate: {
        type: Date,
        required: [true, '請提供預訂開始日期']
    },
    endDate: {
        type: Date,
        required: [true, '請提供預訂結束日期'],
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: '結束日期必須晚於開始日期'
        }
    },
    pickupLocation: {
        type: String,
        required: [true, '請提供取車地點']
    },
    dropoffLocation: {
        type: String,
        required: [true, '請提供還車地點']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: [true, '請提供預訂總金額']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// 索引
bookingSchema.index({ userId: 1, vehicleId: 1 });
bookingSchema.index({ startDate: 1, endDate: 1 });
bookingSchema.index({ status: 1 });
// 檢查日期衝突的靜態方法
bookingSchema.statics.checkAvailability = async function (vehicleId, startDate, endDate, excludeBookingId) {
    const query = {
        vehicleId,
        status: { $nin: ['cancelled'] },
        $or: [
            // 開始日期在預訂區間內
            { startDate: { $gte: startDate, $lte: endDate } },
            // 結束日期在預訂區間內
            { endDate: { $gte: startDate, $lte: endDate } },
            // 預訂包含整個區間
            { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
        ]
    };
    // 如果提供了排除ID，則排除該預訂
    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }
    const conflictingBookings = await this.find(query);
    return conflictingBookings.length === 0;
};
// 計算預訂的虛擬屬性
bookingSchema.virtual('durationInDays').get(function () {
    return Math.ceil((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24));
});
const Booking = mongoose_1.default.model('Booking', bookingSchema);
exports.default = Booking;
