"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 環境變數驗證
 * 確保必要的環境變數已經設置
 */
const envalid_1 = require("envalid");
const validateEnv = () => {
    return (0, envalid_1.cleanEnv)(process.env, {
        NODE_ENV: (0, envalid_1.str)({
            choices: ['development', 'production', 'test'],
            default: 'development'
        }),
        PORT: (0, envalid_1.port)({ default: 5000 }),
        MONGO_URI: (0, envalid_1.url)({ desc: 'MongoDB connection string' }),
        JWT_SECRET: (0, envalid_1.str)({ desc: 'JWT secret key' }),
        JWT_EXPIRES_IN: (0, envalid_1.str)({ desc: 'JWT expiration time', default: '30d' }),
        CORS_ORIGIN: (0, envalid_1.str)({ desc: 'CORS allowed origin', default: 'http://localhost:3000' }),
        // 其他環境變數可根據需要添加
    });
};
exports.default = validateEnv;
