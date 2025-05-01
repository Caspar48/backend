/**
 * 測試設置文件
 * 配置測試環境
 */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// 創建內存數據庫實例
let mongoServer;

// 在所有測試運行前連接到內存數據庫
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// 每個測試後清理所有集合
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

// 所有測試結束後關閉連接
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

// 全局測試超時設置
jest.setTimeout(30000);

// 環境變數模擬
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test'; 