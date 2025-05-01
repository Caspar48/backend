/**
 * 認證相關路由
 */
import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 註冊新用戶
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: 註冊成功
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 用戶登入
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 登入成功
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: 獲取當前登入用戶資料
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功獲取用戶資料
 */
router.get('/me', auth, getMe);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 用戶登出
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功登出
 */
router.post('/logout', auth, logout);

export default router;