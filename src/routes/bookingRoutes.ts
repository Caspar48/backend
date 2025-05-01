import { Router } from 'express';
import { auth } from '../middleware/auth';
import { 
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  getUserBookings,
  getDriverBookings,
  getBookingStats
} from '../controllers/bookingController';
import { authorize } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: 創建新預訂
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', auth, createBooking);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: 獲取所有預訂
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', auth, getAllBookings);

/**
 * @swagger
 * /api/bookings/user:
 *   get:
 *     summary: 獲取用戶的預訂
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.get('/user', auth, getUserBookings);

/**
 * @swagger
 * /api/bookings/driver:
 *   get:
 *     summary: 獲取司機的預訂
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.get('/driver', auth, authorize('driver'), getDriverBookings);

/**
 * @swagger
 * /api/bookings/stats:
 *   get:
 *     summary: 獲取預訂統計
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.get('/stats', auth, authorize('admin'), getBookingStats);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: 通過ID獲取預訂
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', auth, getBookingById);

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: 更新預訂
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', auth, updateBooking);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   patch:
 *     summary: 更新預訂狀態
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/status', auth, updateBookingStatus);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: 刪除預訂
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', auth, deleteBooking);

export default router;