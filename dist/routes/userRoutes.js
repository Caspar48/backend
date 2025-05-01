"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 用戶相關路由
 */
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
// 注意: 這裡僅創建路由結構，需要實現控制器
const router = express_1.default.Router();
// 保護所有用戶路由，需要登入
router.use(auth_1.protect);
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
router.get('/profile', (req, res) => {
    // 暫時返回測試響應
    res.json({
        message: '獲取用戶個人資料 (需實現控制器)'
    });
});
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
router.put('/profile', (req, res) => {
    // 暫時返回測試響應
    res.json({
        message: '更新用戶個人資料 (需實現控制器)',
        data: req.body
    });
});
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
router.put('/change-password', (req, res) => {
    // 暫時返回測試響應
    res.json({
        message: '修改密碼 (需實現控制器)'
    });
});
// 以下路由僅供管理員訪問
router.use((0, auth_1.restrictTo)('admin'));
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
router.get('/', (req, res) => {
    // 暫時返回測試響應
    res.json({
        message: '獲取所有用戶 (需實現控制器)'
    });
});
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
router.get('/:id', (req, res) => {
    // 暫時返回測試響應
    res.json({
        message: `獲取用戶 ID: ${req.params.id} (需實現控制器)`
    });
});
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
router.delete('/:id', (req, res) => {
    // 暫時返回測試響應
    res.status(204).end();
});
exports.default = router;
