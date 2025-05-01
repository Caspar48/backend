"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 認證相關路由
 */
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validateRequest_1 = require("../middleware/validateRequest");
const validateRequest_2 = require("../middleware/validateRequest");
const router = express_1.default.Router();
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
router.post('/register', (0, validateRequest_1.validateRequest)(validateRequest_2.validationSchemas.register), authController_1.register);
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
router.post('/login', (0, validateRequest_1.validateRequest)(validateRequest_2.validationSchemas.login), authController_1.login);
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
router.get('/me', auth_1.protect, authController_1.getMe);
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
router.post('/logout', auth_1.protect, authController_1.logout);
exports.default = router;
