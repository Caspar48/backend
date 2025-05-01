import { Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/BookingService';
import { validate, bookingValidation } from '../utils/validation';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { PaginationOptions } from '../types/common';
import logger from '../utils/logger';

const bookingService = new BookingService();

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validate({ body: bookingValidation.create })(req);
    if (errors) {
      res.status(400).json(sendError(errors.join(', ')));
      return;
    }

    const booking = await bookingService.createBooking({
      ...req.body,
      userId: req.user?.id
    });

    logger.info(`新預訂已創建: ${booking._id}`);
    res.status(201).json(sendSuccess(booking, '預訂創建成功'));
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const options: PaginationOptions = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sort: req.query.sort as string
    };

    const filter = bookingService.buildFilter(req.query, [
      'status',
      'userId',
      'driverId'
    ]);

    const bookings = await bookingService.findAll(filter, options, ['userId', 'driverId']);
    res.json(sendSuccess(bookings));
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const booking = await bookingService.findById(req.params.id, ['userId', 'driverId']);
    res.json(sendSuccess(booking));
  } catch (error) {
    next(error);
  }
};

export const updateBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validate({ body: bookingValidation.update })(req);
    if (errors) {
      res.status(400).json(sendError(errors.join(', ')));
      return;
    }

    const booking = await bookingService.update(req.params.id, req.body);
    res.json(sendSuccess(booking, '預訂更新成功'));
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;
    const booking = await bookingService.updateBookingStatus(
      req.params.id,
      status,
      req.user?.id
    );
    res.json(sendSuccess(booking, '預訂狀態更新成功'));
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await bookingService.delete(req.params.id);
    res.status(204).json(sendSuccess(null, '預訂刪除成功'));
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bookings = await bookingService.getUserBookings(
      req.user?.id,
      req.query.status as string
    );
    res.json(sendSuccess(bookings));
  } catch (error) {
    next(error);
  }
};

export const getDriverBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bookings = await bookingService.getDriverBookings(
      req.user?.id,
      req.query.status as string
    );
    res.json(sendSuccess(bookings));
  } catch (error) {
    next(error);
  }
};

export const getBookingStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    
    const earnings = await bookingService.calculateTotalEarnings(
      req.user?.id,
      startDate,
      endDate
    );
    
    res.json(sendSuccess({ earnings }));
  } catch (error) {
    next(error);
  }
};