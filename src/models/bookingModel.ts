/**
 * 預訂模型
 */
import mongoose, { Schema } from 'mongoose';
import { BookingDocument } from '../types';

const bookingSchema = new Schema<BookingDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '請提供用戶ID']
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
    required: [true, '請提供司機ID']
  },
  startDate: {
    type: Date,
    required: [true, '請提供開始日期']
  },
  endDate: {
    type: Date,
    required: [true, '請提供結束日期']
  },
  pickupLocation: {
    type: String,
    required: [true, '請提供上車地點']
  },
  dropoffLocation: {
    type: String,
    required: [true, '請提供下車地點']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'completed', 'cancelled'],
      message: '狀態必須是: pending, confirmed, completed, cancelled 其中之一'
    },
    default: 'pending'
  },
  passengers: {
    type: Number,
    required: [true, '請提供乘客數量'],
    min: [1, '乘客數量最少為1人']
  },
  luggage: {
    type: Number,
    required: [true, '請提供行李數量'],
    min: [0, '行李數量不能為負數']
  },
  totalAmount: {
    type: Number,
    required: [true, '請提供總金額'],
    min: [0, '金額不能為負數']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  notes: String,
  cancelReason: String,
  rating: {
    type: Number,
    min: [1, '評分最低為1'],
    max: [5, '評分最高為5']
  },
  review: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 索引
bookingSchema.index({ userId: 1, startDate: -1 });
bookingSchema.index({ driverId: 1, status: 1 });
bookingSchema.index({ startDate: 1, status: 1 });

// 虛擬字段
bookingSchema.virtual('duration').get(function(this: BookingDocument) {
  return Math.ceil((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60));
});

// 驗證結束日期必須晚於開始日期
bookingSchema.pre('validate', function(next) {
  if (this.startDate && this.endDate && this.endDate <= this.startDate) {
    this.invalidate('endDate', '結束日期必須晚於開始日期');
  }
  next();
});

// 取消預訂時必須提供取消原因
bookingSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'cancelled' && !this.cancelReason) {
    this.invalidate('cancelReason', '取消預訂時必須提供取消原因');
  }
  next();
});

const Booking = mongoose.model<BookingDocument>('Booking', bookingSchema);

export default Booking;