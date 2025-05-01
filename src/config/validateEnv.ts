/**
 * 環境變數驗證
 * 確保必要的環境變數已經設置
 */
import { cleanEnv, str, port, url } from 'envalid';
import { Env } from '../types';

const validateEnv = (): Env => {
  return cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
    PORT: port({ default: 5000 }),
    MONGO_URI: url(),
    JWT_SECRET: str(),
    JWT_EXPIRES_IN: str({ default: '30d' }),
    CORS_ORIGIN: str({ default: 'http://localhost:3000' })
  });
};

export default validateEnv;