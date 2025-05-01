/**
 * Swagger/OpenAPI 文檔配置
 */
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '車輛預訂系統 API',
      version: '1.0.0',
      description: '車輛預訂系統 RESTful API 文檔',
      contact: {
        name: '技術支持團隊'
      }
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
  apis: ['./routes/*.js', './models/*.js']
};

const specs = swaggerJsDoc(options);

const swaggerDocs = (app) => {
  // Swagger 頁面
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  
  // Swagger JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
  
  console.log(`API 文檔可訪問於: http://localhost:${process.env.PORT || 5000}/api-docs`);
};

module.exports = swaggerDocs; 