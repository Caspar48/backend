"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const logger_1 = __importDefault(require("../utils/logger"));
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
                url: process.env.API_URL || 'http://localhost:5000',
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
    apis: ['./src/routes/*.ts', './src/models/*.ts']
};
const specs = (0, swagger_jsdoc_1.default)(options);
const swaggerDocs = (app) => {
    // Swagger 頁面
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
    // Swagger JSON
    app.get('/api-docs.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
    logger_1.default.info(`API 文檔可訪問於: ${process.env.API_URL || 'http://localhost:5000'}/api-docs`);
};
exports.default = swaggerDocs;
