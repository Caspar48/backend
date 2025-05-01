import { Request, Response, NextFunction } from 'express';
import { LocationTrackingService } from '../services/LocationTrackingService';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';
import { Server } from 'http';

let locationTrackingService: LocationTrackingService;

export const initializeLocationTracking = (server: Server) => {
  locationTrackingService = new LocationTrackingService(server);
};

export const getDriverLocation = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { driverId } = req.params;

  const location = locationTrackingService.getDriverLastLocation(driverId);
  
  if (!location) {
    return next(new AppError('無法獲取司機位置', 404));
  }

  res.json(sendSuccess(location));
});

export const getDriverStatus = asyncHandler(async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { driverId } = req.params;

  const isOnline = locationTrackingService.isDriverOnline(driverId);

  res.json(sendSuccess({
    driverId,
    online: isOnline,
    lastSeen: isOnline ? Date.now() : null
  }));
});

export const getNearbyDrivers = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { lat, lng, radius } = req.query;

  if (!lat || !lng || !radius) {
    return next(new AppError('請提供位置和搜索半徑', 400));
  }

  const center = {
    lat: parseFloat(lat as string),
    lng: parseFloat(lng as string),
    timestamp: Date.now()
  };

  const radiusKm = parseFloat(radius as string);

  const drivers = locationTrackingService.getDriversInArea(center, radiusKm);

  res.json(sendSuccess({
    count: drivers.length,
    drivers: drivers.map(d => ({
      id: d.id,
      location: d.location,
      distance: calculateDistance(center, d.location)
    }))
  }));
});

// 輔助函數：計算兩點之間的距離（公里）
function calculateDistance(point1: any, point2: any): number {
  const R = 6371; // 地球半徑（公里）
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lng - point1.lng);
  const lat1 = toRad(point1.lat);
  const lat2 = toRad(point2.lat);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
           Math.cos(lat1) * Math.cos(lat2) * 
           Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * Math.PI / 180;
}