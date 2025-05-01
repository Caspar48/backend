/**
 * 安全中間件
 * 實施多種安全最佳實踐
 */
import { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';

const securityMiddleware = (app: Express): void => {
  // Set security HTTP headers
  app.use(helmet());

  // Enable CORS
  app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  }));

  // Sanitize data against XSS
  app.use(xss());

  // Sanitize data against NoSQL query injection
  app.use(mongoSanitize());

  // Rate limiting
  const limiter = rateLimit({
    max: 100, // 每個 IP 每 15 分鐘最多 100 個請求
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: '來自此 IP 的請求過多，請稍後再試'
  });
  app.use('/api', limiter);

  // Prevent parameter pollution
  app.use(hpp({
    whitelist: [
      'startDate',
      'endDate',
      'status',
      'sort'
    ]
  }));
};

export default securityMiddleware;