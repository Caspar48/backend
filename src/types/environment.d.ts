declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      MONGO_URI: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      CORS_ORIGIN: string;
      EMAIL_HOST?: string;
      EMAIL_PORT?: string;
      EMAIL_USERNAME?: string;
      EMAIL_PASSWORD?: string;
      AWS_BUCKET_NAME?: string;
      AWS_ACCESS_KEY_ID?: string;
      AWS_SECRET_ACCESS_KEY?: string;
      AWS_REGION?: string;
      ALIPAY_APP_ID?: string;
      ALIPAY_PRIVATE_KEY?: string;
      ALIPAY_PUBLIC_KEY?: string;
    }
  }
}