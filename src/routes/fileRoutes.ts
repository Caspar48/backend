import { Router } from 'express';
import {
  uploadFile,
  deleteFile,
  getFileUrl,
  uploadMiddleware
} from '../controllers/fileController';
import { auth, authorize } from '../middleware/auth';
import { limiters } from '../middleware/rateLimit';

const router = Router();

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: 上傳文件
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/upload',
  auth,
  limiters.api,
  uploadMiddleware,
  uploadFile
);

/**
 * @swagger
 * /api/files/{key}:
 *   delete:
 *     summary: 刪除文件
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  '/:key',
  auth,
  authorize('admin'),
  deleteFile
);

/**
 * @swagger
 * /api/files/{key}/url:
 *   get:
 *     summary: 獲取文件訪問 URL
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/:key/url',
  auth,
  getFileUrl
);

export default router;