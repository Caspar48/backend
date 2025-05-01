/**
 * 數據庫連接配置
 */
import mongoose from 'mongoose';
import logger from '../utils/logger';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    logger.info(`MongoDB 已連接: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB 連接失敗:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB 連接已斷開');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB 錯誤:', err);
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB 連接已關閉');
    process.exit(0);
  } catch (error) {
    logger.error('關閉 MongoDB 連接時出錯:', error);
    process.exit(1);
  }
});

export default connectDB;