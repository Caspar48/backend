import WebSocket from 'ws';
import { Server } from 'http';
import { verify } from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';
import { Redis } from 'ioredis';

interface Location {
  lat: number;
  lng: number;
  timestamp: number;
}

interface Driver {
  id: string;
  location: Location;
  bookingId?: string;
  ws: WebSocket;
}

export class LocationTrackingService {
  private wss: WebSocket.Server;
  private drivers: Map<string, Driver>;
  private userConnections: Map<string, Set<WebSocket>>;
  private redis: Redis;
  private readonly LOCATION_EXPIRE_TIME = 300; // 5 minutes in seconds

  constructor(server: Server, redisClient: Redis) {
    this.wss = new WebSocket.Server({ server });
    this.drivers = new Map();
    this.userConnections = new Map();
    this.redis = redisClient;
    this.init();
  }

  private init() {
    this.wss.on('connection', async (ws: WebSocket, req) => {
      try {
        const token = this.extractToken(req.url);
        if (!token) {
          throw new AppError('未授權的連接', 401);
        }

        const decoded = await this.verifyToken(token);
        const { id, role } = decoded;

        if (role === 'driver') {
          this.handleDriverConnection(id, ws);
        } else {
          this.handleUserConnection(id, ws);
        }

      } catch (error) {
        logger.error('WebSocket 連接錯誤:', error);
        ws.close();
      }
    });
  }

  private handleDriverConnection(driverId: string, ws: WebSocket) {
    // 存儲司機連接
    this.drivers.set(driverId, {
      id: driverId,
      location: { lat: 0, lng: 0, timestamp: Date.now() },
      ws
    });

    logger.info(`司機已連接: ${driverId}`);

    ws.on('message', async (data: string) => {
      try {
        const message = JSON.parse(data);
        
        if (message.type === 'location_update') {
          await this.updateDriverLocation(driverId, message.location);
        }
      } catch (error) {
        logger.error('處理司機消息錯誤:', error);
      }
    });

    ws.on('close', async () => {
      this.drivers.delete(driverId);
      await this.clearDriverLocation(driverId);
      logger.info(`司機已斷開連接: ${driverId}`);
    });
  }

  private handleUserConnection(userId: string, ws: WebSocket) {
    // 存儲用戶連接
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set());
    }
    this.userConnections.get(userId)?.add(ws);

    logger.info(`用戶已連接: ${userId}`);

    ws.on('message', (data: string) => {
      try {
        const message = JSON.parse(data);
        
        if (message.type === 'subscribe_driver') {
          this.subscribeToDriver(userId, message.driverId);
        }
      } catch (error) {
        logger.error('處理用戶消息錯誤:', error);
      }
    });

    ws.on('close', () => {
      this.userConnections.get(userId)?.delete(ws);
      if (this.userConnections.get(userId)?.size === 0) {
        this.userConnections.delete(userId);
      }
      logger.info(`用戶已斷開連接: ${userId}`);
    });
  }

  async updateDriverLocation(driverId: string, location: Location): Promise<void> {
    const key = `driver:location:${driverId}`;
    await this.redis.setex(
      key,
      this.LOCATION_EXPIRE_TIME,
      JSON.stringify(location)
    );

    const driver = this.drivers.get(driverId);
    if (!driver) return;

    driver.location = {
      ...location,
      timestamp: Date.now()
    };

    // 通知訂閱該司機的用戶
    this.notifySubscribers(driverId, location);
  }

  async getDriverLocation(driverId: string): Promise<Location | null> {
    const key = `driver:location:${driverId}`;
    const locationData = await this.redis.get(key);
    
    if (!locationData) {
      return null;
    }

    try {
      return JSON.parse(locationData);
    } catch (err) {
      console.error('解析位置數據錯誤:', err);
      return null;
    }
  }

  async getNearbyDrivers(
    centerLat: number,
    centerLng: number,
    radiusKm: number
  ): Promise<Array<{ driverId: string; location: Location }>> {
    // 獲取所有活躍司機的位置
    const keys = await this.redis.keys('driver:location:*');
    const locations = await Promise.all(
      keys.map(async (key) => {
        const driverId = key.split(':')[2];
        const location = await this.getDriverLocation(driverId);
        return { driverId, location };
      })
    );

    // 過濾無效數據並計算距離
    return locations.filter(({ location }) => {
      if (!location) return false;

      const distance = this.calculateDistance(
        centerLat,
        centerLng,
        location.lat,
        location.lng
      );
      
      return distance <= radiusKm;
    });
  }

  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // 地球半徑（公里）
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  async clearDriverLocation(driverId: string): Promise<void> {
    const key = `driver:location:${driverId}`;
    await this.redis.del(key);
  }

  private notifySubscribers(driverId: string, location: Location) {
    const message = JSON.stringify({
      type: 'driver_location',
      driverId,
      location
    });

    this.userConnections.forEach((connections) => {
      connections.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    });
  }

  private subscribeToDriver(userId: string, driverId: string) {
    const userConnections = this.userConnections.get(userId);
    const driver = this.drivers.get(driverId);

    if (userConnections && driver) {
      // 立即發送當前位置
      const message = JSON.stringify({
        type: 'driver_location',
        driverId,
        location: driver.location
      });

      userConnections.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    }
  }

  private extractToken(url: string | undefined): string | null {
    if (!url) return null;
    const match = url.match(/token=([^&]*)/);
    return match ? match[1] : null;
  }

  private async verifyToken(token: string): Promise<any> {
    try {
      return verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      throw new AppError('無效的令牌', 401);
    }
  }

  // 公共方法：獲取司機最後已知位置
  getDriverLastLocation(driverId: string): Location | null {
    return this.drivers.get(driverId)?.location || null;
  }

  // 公共方法：檢查司機是否在線
  isDriverOnline(driverId: string): boolean {
    return this.drivers.has(driverId);
  }

  // 公共方法：獲取特定區域內的在線司機
  getDriversInArea(center: Location, radiusKm: number): Driver[] {
    const drivers: Driver[] = [];
    this.drivers.forEach((driver) => {
      if (this.isWithinRadius(center, driver.location, radiusKm)) {
        drivers.push(driver);
      }
    });
    return drivers;
  }

  private isWithinRadius(
    center: Location,
    point: Location,
    radiusKm: number
  ): boolean {
    const R = 6371; // 地球半徑（公里）
    const lat1 = this.toRad(center.lat);
    const lat2 = this.toRad(point.lat);
    const dLat = this.toRad(point.lat - center.lat);
    const dLon = this.toRad(point.lng - center.lng);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return distance <= radiusKm;
  }
}