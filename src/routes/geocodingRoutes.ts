import { Router } from 'express';
import {
  geocodeAddress,
  reverseGeocode,
  calculateDistance,
  validateAddresses,
  optimizeRoute
} from '../controllers/geocodingController';
import { auth } from '../middleware/auth';
import { limiters } from '../middleware/rateLimit';
import { validate } from '../utils/validation';
import Joi from 'joi';

const router = Router();

// 驗證模式
const geocodingSchema = {
  geocode: Joi.object({
    address: Joi.string().required().min(3)
  }),
  distance: Joi.object({
    origin: Joi.object({
      lat: Joi.number().required(),
      lng: Joi.number().required()
    }).required(),
    destination: Joi.object({
      lat: Joi.number().required(),
      lng: Joi.number().required()
    }).required()
  }),
  validateAddresses: Joi.object({
    addresses: Joi.array().items(Joi.string()).min(1).required()
  }),
  optimizeRoute: Joi.object({
    locations: Joi.array().items(
      Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required(),
        address: Joi.string().required()
      })
    ).min(2).required()
  })
};

/**
 * @swagger
 * /api/geocoding/geocode:
 *   post:
 *     summary: 將地址轉換為經緯度
 *     tags: [Geocoding]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/geocode',
  auth,
  limiters.api,
  validate({ body: geocodingSchema.geocode }),
  geocodeAddress
);

/**
 * @swagger
 * /api/geocoding/reverse:
 *   get:
 *     summary: 將經緯度轉換為地址
 *     tags: [Geocoding]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/reverse',
  auth,
  limiters.api,
  reverseGeocode
);

/**
 * @swagger
 * /api/geocoding/distance:
 *   post:
 *     summary: 計算兩點之間的距離
 *     tags: [Geocoding]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/distance',
  auth,
  limiters.api,
  validate({ body: geocodingSchema.distance }),
  calculateDistance
);

/**
 * @swagger
 * /api/geocoding/validate:
 *   post:
 *     summary: 驗證地址列表
 *     tags: [Geocoding]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/validate',
  auth,
  limiters.api,
  validate({ body: geocodingSchema.validateAddresses }),
  validateAddresses
);

/**
 * @swagger
 * /api/geocoding/optimize:
 *   post:
 *     summary: 優化路線
 *     tags: [Geocoding]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/optimize',
  auth,
  limiters.api,
  validate({ body: geocodingSchema.optimizeRoute }),
  optimizeRoute
);

export default router;