/**
 * 用戶相關路由
 */
import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import { 
  getUserProfile, 
  updateUserProfile, 
  changePassword, 
  getAllUsers, 
  getUserById, 
  deleteUser 
} from '../controllers/userController';
import { validateRequest, validationSchemas } from '../middleware/validateRequest';

const router = express.Router();

// 保護所有用戶路由，需要登入
router.use(protect);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: 獲取用戶個人資料
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功獲取用戶資料
 */
router.get('/profile', getUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: 更新用戶個人資料
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功更新用戶資料
 */
router.put('/profile', validateRequest(validationSchemas.updateProfile), updateUserProfile);

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: 修改密碼
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: 密碼修改成功
 */
router.put('/change-password', validateRequest(validationSchemas.changePassword), changePassword);

// 以下路由僅供管理員訪問
router.use(restrictTo('admin'));

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 獲取所有用戶 (僅管理員)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功獲取用戶列表
 */
router.get('/', getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: 獲取特定用戶 (僅管理員)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功獲取用戶詳情
 */
router.get('/:id', getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: 刪除用戶 (僅管理員)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: 成功刪除用戶
 */
router.delete('/:id', deleteUser);

export default router; 