const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    console.log('正在連接 MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // 添加額外的連接選項
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log(`MongoDB 連接成功: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('MongoDB 連接失敗', err);
    process.exit(1);
  }
};

// 監聽連接事件
mongoose.connection.on('connected', () => {
  console.log('Mongoose 已連接');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose 連接錯誤:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose 連接已斷開');
});

module.exports = connectDB;