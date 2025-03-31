const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// 連接數據庫
connectDB();

// 啟動服務器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});