import { Request, Response, NextFunction } from 'express';
import { FileUploadService } from '../services/FileUploadService';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';

// 配置文件上傳服務
const fileUploadService = new FileUploadService({
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx']
});

// 文件上傳中間件
export const uploadMiddleware = fileUploadService.upload.single('file');

export const uploadFile = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return next(new AppError('請選擇要上傳的文件', 400));
  }

  const { folder = 'general' } = req.body;
  const result = await fileUploadService.uploadToS3(req.file, folder);

  res.status(200).json(sendSuccess(result, '文件上傳成功'));
});

export const deleteFile = asyncHandler(async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { key } = req.params;
  await fileUploadService.deleteFromS3(key);
  
  res.status(200).json(sendSuccess(null, '文件刪除成功'));
});

export const getFileUrl = asyncHandler(async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { key } = req.params;
  const { expiresIn } = req.query;
  
  const url = await fileUploadService.getSignedUrl(
    key,
    expiresIn ? parseInt(expiresIn as string) : undefined
  );
  
  res.status(200).json(sendSuccess({ url }));
});