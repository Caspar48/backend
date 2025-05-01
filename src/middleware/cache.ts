import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../services/CacheService';
import logger from '../utils/logger';

// 創建緩存服務實例
const cacheService = new CacheService({
  stdTTL: 3600, // 1小時
  checkperiod: 600 // 10分鐘
});

export interface CacheOptions {
  key?: string;
  ttl?: number;
  condition?: (req: Request) => boolean;
}

export const cacheMiddleware = (options: CacheOptions = {}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 只緩存 GET 請求
    if (req.method !== 'GET') {
      return next();
    }

    // 檢查是否滿足緩存條件
    if (options.condition && !options.condition(req)) {
      return next();
    }

    // 生成緩存鍵
    const cacheKey = options.key || 
      CacheService.generateKey(
        req.originalUrl,
        req.user?.id || 'anonymous'
      );

    try {
      // 檢查緩存
      const cachedData = cacheService.get(cacheKey);
      if (cachedData) {
        logger.info(`從緩存返回數據: ${cacheKey}`);
        return res.json(cachedData);
      }

      // 如果沒有緩存，攔截響應
      const originalJson = res.json.bind(res);
      res.json = function(data) {
        // 存儲到緩存
        cacheService.set(cacheKey, data, options.ttl);
        logger.info(`數據已緩存: ${cacheKey}`);
        return originalJson(data);
      };

      next();
    } catch (error) {
      logger.error('緩存中間件錯誤:', error);
      next();
    }
  };
};

// 清除特定路徑的緩存
export const clearCache = (pattern: string) => {
  return (_req: Request, _res: Response, next: NextFunction) => {
    try {
      const keys = cacheService.get<string[]>('cache_keys') || [];
      const matchingKeys = keys.filter(key => key.includes(pattern));
      
      if (matchingKeys.length > 0) {
        cacheService.delete(matchingKeys);
        logger.info(`已清除緩存: ${matchingKeys.join(', ')}`);
      }

      next();
    } catch (error) {
      logger.error('清除緩存失敗:', error);
      next();
    }
  };
};

// 緩存預熱中間件
export const warmupCache = (
  fetcher: () => Promise<any>,
  options: CacheOptions
) => {
  return async (_req: Request, _res: Response, next: NextFunction) => {
    try {
      const cacheKey = options.key as string;
      if (!cacheService.get(cacheKey)) {
        const data = await fetcher();
        cacheService.set(cacheKey, data, options.ttl);
        logger.info(`緩存預熱完成: ${cacheKey}`);
      }
      next();
    } catch (error) {
      logger.error('緩存預熱失敗:', error);
      next();
    }
  };
};