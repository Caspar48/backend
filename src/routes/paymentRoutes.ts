import { Router } from 'express';
import { 
  processPayment,
  processRefund,
  getPaymentStatus
} from '../controllers/paymentController';
import { auth, authorize } from '../middleware/auth';
import { limiters } from '../middleware/rateLimit';
import { validate } from '../utils/validation';
import Joi from 'joi';

const router = Router();

// 驗證模式
const paymentSchema = {
  processPayment: Joi.object({
    bookingId: Joi.string().required(),
    paymentMethod: Joi.object({
      type: Joi.string().valid('credit_card', 'alipay', 'wechat').required(),
      details: Joi.object().required()
    }).required()
  }),
  processRefund: Joi.object({
    bookingId: Joi.string().required(),
    reason: Joi.string().required().min(10)
  })
};

/**
 * @swagger
 * /api/payments/process:
 *   post:
 *     summary: 處理支付
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/process',
  auth,
  limiters.api,
  validate({ body: paymentSchema.processPayment }),
  processPayment
);

/**
 * @swagger
 * /api/payments/refund:
 *   post:
 *     summary: 處理退款
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/refund',
  auth,
  authorize('admin'),
  validate({ body: paymentSchema.processRefund }),
  processRefund
);

/**
 * @swagger
 * /api/payments/status/{transactionId}:
 *   get:
 *     summary: 獲取支付狀態
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/status/:transactionId',
  auth,
  getPaymentStatus
);

export default router;