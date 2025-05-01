/**
 * 環境變數驗證
 * 確保必要的環境變數已經設置
 */
const { cleanEnv, str, port, url, num } = require('envalid');

const validateEnv = () => {
  return cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'production', 'test'],
      default: 'development'
    }),
    PORT: port({ default: 5000 }),
    MONGO_URI: url({ desc: 'MongoDB connection string' }),
    JWT_SECRET: str({ desc: 'JWT secret key' }),
    JWT_EXPIRES_IN: str({ desc: 'JWT expiration time', default: '30d' }),
    CORS_ORIGIN: str({ desc: 'CORS allowed origin', default: 'http://localhost:3000' }),
    // 其他環境變數可根據需要添加
  });
};

module.exports = validateEnv; 