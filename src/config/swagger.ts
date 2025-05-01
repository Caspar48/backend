/**
 * Swagger/OpenAPI 文檔配置
 */
import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import logger from '../utils/logger';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '車輛預訂系統 API',
      version: '1.0.0',
      description: '使用 Express 和 TypeScript 構建的車輛預訂系統 API'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: '開發伺服器'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [
    './src/routes/*.ts',
    './src/models/*.ts'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app: Express) => {
  // Swagger API 文檔路由
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Swagger JSON 格式文檔路由
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  logger.info('API 文檔可訪問於: http://localhost:5000/api-docs');
};

export default swaggerDocs;