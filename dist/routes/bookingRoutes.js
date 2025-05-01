"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 預訂相關路由
 */
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const validateRequest_1 = require("../middleware/validateRequest");
// 注意: 這裡僅創建路由結構，需要實現控制器
const router = express_1.default.Router();
// 保護所有預訂路由，需要登入
router.use(auth_1.protect);
/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: 獲取所有預訂
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: 按預訂狀態過濾
 *     responses:
 *       200:
 *         description: 成功獲取預訂列表
 */
router.get('/', (req, res) => {
    // 暫時返回測試響應
    res.json({ message: '獲取所有預訂 (需實現控制器)' });
});
/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: 獲取特定預訂
 *     tags: [Bookings]
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
 *         description: 成功獲取預訂詳情
 */
router.get('/:id', (req, res) => {
    // 暫時返回測試響應
    res.json({ message: `獲取預訂 ID: ${req.params.id} (需實現控制器)` });
});
/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: 創建新預訂
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleId
 *               - startDate
 *               - endDate
 *               - pickupLocation
 *               - dropoffLocation
 *             properties:
 *               vehicleId:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               pickupLocation:
 *                 type: string
 *               dropoffLocation:
 *                 type: string
 *     responses:
 *       201:
 *         description: 成功創建預訂
 */
router.post('/', (0, validateRequest_1.validateRequest)(validateRequest_1.validationSchemas.createBooking), (req, res) => {
    // 暫時返回測試響應
    res.status(201).json({
        message: '創建新預訂 (需實現控制器)',
        data: req.body
    });
});
/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: 更新預訂
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *     responses:
 *       200:
 *         description: 成功更新預訂
 */
router.put('/:id', (req, res) => {
    // 暫時返回測試響應
    res.json({
        message: `更新預訂 ID: ${req.params.id} (需實現控制器)`,
        data: req.body
    });
});
/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: 刪除預訂
 *     tags: [Bookings]
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
 *         description: 成功刪除預訂
 */
router.delete('/:id', (req, res) => {
    // 暫時返回測試響應
    res.status(204).json({
        message: `刪除預訂 ID: ${req.params.id} (需實現控制器)`
    });
});
// 管理員路由
router.use((0, auth_1.restrictTo)('admin'));
/**
 * @swagger
 * /api/bookings/admin/stats:
 *   get:
 *     summary: 獲取預訂統計數據 (僅管理員)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功獲取統計數據
 */
router.get('/admin/stats', (req, res) => {
    // 暫時返回測試響應
    res.json({
        message: '獲取預訂統計數據 (需實現控制器)',
        stats: {
            total: 125,
            pending: 34,
            confirmed: 56,
            cancelled: 20,
            completed: 15
        }
    });
});
exports.default = router;
