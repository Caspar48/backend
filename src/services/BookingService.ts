import { BaseService } from './BaseService';
import { BookingDocument } from '../types';
import Booking from '../models/bookingModel';
import { AppError } from '../utils/AppError';

export class BookingService extends BaseService<BookingDocument> {
  constructor() {
    super(Booking, 'Booking');
  }

  async createBooking(bookingData: Partial<BookingDocument>): Promise<BookingDocument> {
    const { startDate, endDate, vehicleId } = bookingData;

    // 檢查車輛在指定時間段是否可用
    const isVehicleAvailable = await this.checkVehicleAvailability(
      vehicleId as string,
      startDate as Date,
      endDate as Date
    );

    if (!isVehicleAvailable) {
      throw new AppError('所選車輛在指定時間段內不可用', 400);
    }

    return this.create(bookingData);
  }

  async updateBookingStatus(
    bookingId: string,
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
    userId: string
  ): Promise<BookingDocument> {
    const booking = await this.findById(bookingId);

    // 檢查是否有權限更新狀態
    if (booking.userId.toString() !== userId) {
      throw new AppError('無權更新此預訂', 403);
    }

    return this.update(bookingId, { status });
  }

  private async checkVehicleAvailability(
    vehicleId: string,
    startDate: Date,
    endDate: Date
  ): Promise<boolean> {
    const existingBooking = await this.findOne({
      vehicleId,
      status: { $ne: 'cancelled' },
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate }
        }
      ]
    });

    return !existingBooking;
  }

  async getUserBookings(userId: string, status?: string): Promise<BookingDocument[]> {
    const filter: any = { userId };
    if (status) {
      filter.status = status;
    }

    const bookings = await this.model
      .find(filter)
      .sort({ startDate: -1 })
      .populate('vehicleId')
      .exec();

    return bookings;
  }

  async getDriverBookings(driverId: string, status?: string): Promise<BookingDocument[]> {
    const filter: any = { driverId };
    if (status) {
      filter.status = status;
    }

    const bookings = await this.model
      .find(filter)
      .sort({ startDate: -1 })
      .populate('userId', 'email phone')
      .exec();

    return bookings;
  }

  async calculateTotalEarnings(driverId: string, startDate?: Date, endDate?: Date): Promise<number> {
    const matchStage: any = {
      driverId,
      status: 'completed'
    };

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = startDate;
      if (endDate) matchStage.createdAt.$lte = endDate;
    }

    const result = await this.model.aggregate([
      { $match: matchStage },
      { $group: {
        _id: null,
        totalEarnings: { $sum: '$totalAmount' }
      }}
    ]);

    return result[0]?.totalEarnings || 0;
  }
}