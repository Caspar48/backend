import NodeCache from 'node-cache';
import logger from '../utils/logger';

interface CacheConfig {
  stdTTL: number;      // 默認過期時間（秒）
  checkperiod: number; // 檢查過期時間間隔（秒）
}

export class CacheService {
  private cache: NodeCache;

  constructor(config: CacheConfig) {
    this.cache = new NodeCache({
      stdTTL: config.stdTTL,
      checkperiod: config.checkperiod,
      useClones: false
    });

    this.cache.on('expired', (key: string) => {
      logger.info(`緩存過期: ${key}`);
    });
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    try {
      return this.cache.set(key, value, ttl);
    } catch (error) {
      logger.error('設置緩存失敗:', error);
      return false;
    }
  }

  get<T>(key: string): T | undefined {
    try {
      return this.cache.get<T>(key);
    } catch (error) {
      logger.error('獲取緩存失敗:', error);
      return undefined;
    }
  }

  delete(key: string | string[]): number {
    try {
      return this.cache.del(key);
    } catch (error) {
      logger.error('刪除緩存失敗:', error);
      return 0;
    }
  }

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const value = await fetcher();
    this.set(key, value, ttl);
    return value;
  }

  flush(): void {
    try {
      this.cache.flushAll();
      logger.info('緩存已清空');
    } catch (error) {
      logger.error('清空緩存失敗:', error);
    }
  }

  // 輔助方法：生成緩存鍵
  static generateKey(...parts: (string | number)[]): string {
    return parts.join(':');
  }

  // 批量操作方法
  mset(items: { key: string; value: any; ttl?: number }[]): boolean {
    try {
      const success = items.every(item => 
        this.cache.set(item.key, item.value, item.ttl)
      );
      return success;
    } catch (error) {
      logger.error('批量設置緩存失敗:', error);
      return false;
    }
  }

  mget<T>(keys: string[]): Record<string, T> {
    try {
      return this.cache.mget<T>(keys);
    } catch (error) {
      logger.error('批量獲取緩存失敗:', error);
      return {};
    }
  }

  // 獲取統計信息
  getStats() {
    return this.cache.getStats();
  }
}