import { Request } from 'express';
import { Document, Model } from 'mongoose';

// 請求擴展類型，包含認證使用者
export interface AuthRequest extends Request {
  user?: any;
}

// 使用者文檔類型
export interface UserDocument extends Document {
  email: string;
  password: string;
  role: 'user' | 'driver' | 'company';
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 預訂文檔類型
export interface BookingDocument extends Document {
  userId: string;
  vehicleId: string;
  startDate: Date;
  endDate: Date;
  pickupLocation: string;
  dropoffLocation: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 預訂模型靜態方法
export interface BookingModel extends Model<BookingDocument> {
  checkAvailability(
    vehicleId: string,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: string
  ): Promise<boolean>;
}

// 環境變數類型
export interface Env {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CORS_ORIGIN: string;
}

// JWT Payload 類型
export interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

// 服務響應類型
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

// 認證結果類型
export interface AuthResult {
  user: Partial<UserDocument>;
  token: string;
}