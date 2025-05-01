import { S3 } from 'aws-sdk';
import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

interface FileUploadConfig {
  maxSize: number;
  allowedTypes: string[];
}

interface UploadResult {
  url: string;
  key: string;
  mimetype: string;
  size: number;
}

export class FileUploadService {
  private s3: S3;
  private bucket: string;
  private config: FileUploadConfig;

  constructor(config: FileUploadConfig) {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });

    this.bucket = process.env.AWS_BUCKET_NAME as string;
    this.config = config;
  }

  private storage = multer.memoryStorage();

  private fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (!this.config.allowedTypes.includes(ext)) {
      cb(new AppError(`不支持的文件類型: ${ext}`, 400));
      return;
    }

    cb(null, true);
  };

  public upload = multer({
    storage: this.storage,
    fileFilter: this.fileFilter,
    limits: {
      fileSize: this.config.maxSize
    }
  });

  async uploadToS3(
    file: Express.Multer.File,
    folder: string
  ): Promise<UploadResult> {
    try {
      const key = `${folder}/${Date.now()}-${file.originalname}`;
      
      const params = {
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
      };

      const result = await this.s3.upload(params).promise();

      logger.info(`文件上傳成功: ${result.Location}`);

      return {
        url: result.Location,
        key: result.Key,
        mimetype: file.mimetype,
        size: file.size
      };
    } catch (error) {
      logger.error('文件上傳失敗:', error);
      throw new AppError('文件上傳失敗', 500);
    }
  }

  async deleteFromS3(key: string): Promise<void> {
    try {
      await this.s3.deleteObject({
        Bucket: this.bucket,
        Key: key
      }).promise();

      logger.info(`文件刪除成功: ${key}`);
    } catch (error) {
      logger.error('文件刪除失敗:', error);
      throw new AppError('文件刪除失敗', 500);
    }
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
      const url = await this.s3.getSignedUrlPromise('getObject', {
        Bucket: this.bucket,
        Key: key,
        Expires: expiresIn
      });

      return url;
    } catch (error) {
      logger.error('獲取簽名URL失敗:', error);
      throw new AppError('獲取文件訪問URL失敗', 500);
    }
  }
}