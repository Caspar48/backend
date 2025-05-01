import { Router } from 'express';
import {
  getDriverLocation,
  getDriverStatus,
  getNearbyDrivers
} from '../controllers/locationController';
import { auth } from '../middleware/auth';
import { limiters } from '../middleware/rateLimit';
import { validate } from '../utils/validation';
import Joi from 'joi';

const router = Router();

// 驗證模式
const locationSchema = {
  nearby: Joi.object({
    lat: Joi.number().required().min(-90).max(90),
    lng: Joi.number().required().min(-180).max(180),
    radius: Joi.number().required().min(0.1).max(50) // 限制搜索半徑在 0.1-50 公里
  })
};

/**
 * @swagger
 * /api/location/driver/{driverId}:
 *   get:
 *     summary: 獲取司機當前位置
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/driver/:driverId',
  auth,
  limiters.api,
  getDriverLocation
);

/**
 * @swagger
 * /api/location/driver/{driverId}/status:
 *   get:
 *     summary: 獲取司機在線狀態
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/driver/:driverId/status',
  auth,
  limiters.api,
  getDriverStatus
);

/**
 * @swagger
 * /api/location/drivers/nearby:
 *   get:
 *     summary: 獲取附近的司機
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/drivers/nearby',
  auth,
  limiters.api,
  validate({ query: locationSchema.nearby }),
  getNearbyDrivers
);

export default router;