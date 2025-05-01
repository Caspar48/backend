/**
 * 認證中間件
 * 用於保護路由，確保只有已認證的用戶可以訪問
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

interface JwtPayload {
  id: string;
  role: string;
  email: string;
  iat?: number;
  exp?: number;
}

interface JWTPayload {
  id: string;
  role: string;
  email: string;
}

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 獲取令牌
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      throw new AppError('無訪問權限。請先登入。', 401);
    }

    // 驗證令牌
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      // 將用戶信息添加到請求對象
      req.user = {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('登入已過期。請重新登入。', 401);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('無效的認證令牌。請重新登入。', 401);
      }
      throw error;
    }
  } catch (error) {
    logger.error('認證失敗:', error);
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('無訪問權限。請先登入。', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('您沒有權限執行此操作。', 403)
      );
    }

    next();
  };
};

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: '未提供認證令牌' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as JWTPayload;
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email
    };
    next();
  } catch (error) {
    res.status(401).json({ message: '認證失敗' });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: '您沒有權限執行此操作'
      });
    }
    next();
  };
};