import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/PaymentService';
import { BookingService } from '../services/BookingService';
import { NotificationService } from '../services/NotificationService';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { sendSuccess, sendError } from '../utils/apiResponse';

const paymentService = new PaymentService();
const bookingService = new BookingService();
const notificationService = new NotificationService();

export const processPayment = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { bookingId, paymentMethod } = req.body;

  // 獲取預訂信息
  const booking = await bookingService.findById(bookingId);

  // 處理支付
  const paymentResult = await paymentService.processPayment(booking, paymentMethod);

  if (!paymentResult.success) {
    return next(new AppError('支付處理失敗', 400));
  }

  // 更新預訂狀態
  await bookingService.update(bookingId, {
    paymentStatus: 'paid',
    status: 'confirmed'
  });

  // 發送通知
  await notificationService.sendBookingConfirmation(booking);

  res.status(200).json(sendSuccess({
    transactionId: paymentResult.transactionId,
    booking
  }));
});

export const processRefund = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { bookingId, reason } = req.body;

  // 獲取預訂信息
  const booking = await bookingService.findById(bookingId);

  // 檢查是否可以退款
  if (booking.status === 'completed') {
    return next(new AppError('已完成的預訂不能退款', 400));
  }

  // 處理退款
  const refundResult = await paymentService.refundPayment(booking, reason);

  if (!refundResult.success) {
    return next(new AppError('退款處理失敗', 400));
  }

  // 更新預訂狀態
  await bookingService.update(bookingId, {
    paymentStatus: 'refunded',
    status: 'cancelled',
    cancelReason: reason
  });

  // 發送通知
  await notificationService.sendBookingCancellation(booking, reason);

  res.status(200).json(sendSuccess({
    transactionId: refundResult.transactionId,
    booking
  }));
});

export const getPaymentStatus = asyncHandler(async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { transactionId } = req.params;
  
  const status = await paymentService.getPaymentStatus(transactionId);
  
  res.status(200).json(sendSuccess({
    transactionId,
    status
  }));
});