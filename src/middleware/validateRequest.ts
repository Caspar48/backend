/**
 * 請求資料驗證中間件
 * 使用 Joi 庫進行輸入驗證
 */
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from './errorHandler';

/**
 * 驗證請求資料中間件
 * @param {Joi.ObjectSchema} schema - Joi 驗證模式
 */
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      return next(new AppError(errorMessage, 400));
    }

    next();
  };
};

// 常用驗證模式
export const validationSchemas = {
  createBooking: Joi.object({
    vehicleId: Joi.string().required().messages({
      'string.empty': '請提供車輛ID',
      'any.required': '請提供車輛ID'
    }),
    startDate: Joi.date().required().messages({
      'date.base': '請提供有效的開始日期',
      'any.required': '請提供開始日期'
    }),
    endDate: Joi.date().required().min(Joi.ref('startDate')).messages({
      'date.base': '請提供有效的結束日期',
      'date.min': '結束日期必須晚於開始日期',
      'any.required': '請提供結束日期'
    }),
    pickupLocation: Joi.string().required().messages({
      'string.empty': '請提供上車地點',
      'any.required': '請提供上車地點'
    }),
    dropoffLocation: Joi.string().required().messages({
      'string.empty': '請提供下車地點',
      'any.required': '請提供下車地點'
    }),
    totalAmount: Joi.number().required().min(0).messages({
      'number.base': '總金額必須為數字',
      'number.min': '總金額不能小於0',
      'any.required': '請提供總金額'
    })
  })
};