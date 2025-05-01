import { Request, Response, NextFunction } from 'express';
import { GeocodingService } from '../services/GeocodingService';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';
import { CacheService } from '../services/CacheService';

const geocodingService = new GeocodingService();
const cacheService = new CacheService({
  stdTTL: 86400, // 24小時
  checkperiod: 3600 // 1小時
});

export const geocodeAddress = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { address } = req.body;

  if (!address) {
    return next(new AppError('請提供地址', 400));
  }

  const cacheKey = `geocode:${address}`;
  let location = cacheService.get(cacheKey);

  if (!location) {
    location = await geocodingService.geocode(address);
    cacheService.set(cacheKey, location);
  }

  res.json(sendSuccess(location));
});

export const reverseGeocode = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return next(new AppError('請提供經緯度', 400));
  }

  const cacheKey = `reverse:${lat},${lng}`;
  let location = cacheService.get(cacheKey);

  if (!location) {
    location = await geocodingService.reverseGeocode(
      parseFloat(lat as string),
      parseFloat(lng as string)
    );
    cacheService.set(cacheKey, location);
  }

  res.json(sendSuccess(location));
});

export const calculateDistance = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { origin, destination } = req.body;

  if (!origin || !destination) {
    return next(new AppError('請提供起點和終點', 400));
  }

  const cacheKey = `distance:${JSON.stringify(origin)}-${JSON.stringify(destination)}`;
  let distance = cacheService.get(cacheKey);

  if (!distance) {
    distance = await geocodingService.calculateDistance(origin, destination);
    cacheService.set(cacheKey, distance);
  }

  res.json(sendSuccess({
    ...distance,
    estimatedPrice: calculatePrice(distance.value)
  }));
});

export const validateAddresses = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { addresses } = req.body;

  if (!Array.isArray(addresses)) {
    return next(new AppError('請提供地址列表', 400));
  }

  const results = await Promise.all(
    addresses.map(async (address) => ({
      address,
      isValid: await geocodingService.validateAddress(address)
    }))
  );

  res.json(sendSuccess(results));
});

export const optimizeRoute = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { locations } = req.body;

  if (!Array.isArray(locations) || locations.length < 2) {
    return next(new AppError('請提供至少兩個位置點', 400));
  }

  const optimizedRoute = await geocodingService.optimizeRoute(locations);
  res.json(sendSuccess(optimizedRoute));
});

// 輔助函數：根據距離計算預估價格
function calculatePrice(distanceInMeters: number): number {
  const basePrice = 50; // 基本費
  const pricePerKm = 5; // 每公里費用
  const distanceInKm = distanceInMeters / 1000;
  return Math.round(basePrice + (distanceInKm * pricePerKm));
}