# 車輛預訂系統 - 後端 API (TypeScript)

## 專案概述

這是一個車輛預訂系統的後端 API，提供完整的用戶認證、車輛預訂、支付處理等功能。使用 TypeScript 開發，提供更好的類型安全和開發體驗。

## 技術堆疊

- **Node.js** & **Express**: 服務器框架
- **TypeScript**: 類型安全的 JavaScript 超集
- **MongoDB** & **Mongoose**: 數據庫與 ORM
- **JWT**: 用戶認證
- **Docker**: 容器化部署
- **Swagger**: API 文檔
- **Winston**: 日誌管理
- **Jest**: 測試框架

## 功能特點

- 完整的用戶認證系統 (註冊、登入、JWT)
- 車輛預訂管理
- 文件上傳功能
- 錯誤處理機制
- API 請求驗證
- 自動生成 API 文檔
- 完整的日誌系統
- 安全性最佳實踐
- 性能監控

## 開始使用

### 環境要求

- Node.js 14+
- MongoDB 4.4+
- TypeScript 4.5+
- Docker (可選，用於容器化部署)

### 安裝

1. 克隆專案並安裝依賴：

```bash
git clone <repository-url>
cd vehicle-booking-system/backend
npm install
```

2. 安裝必要的類型定義：

```bash
npm install --save-dev @types/express @types/cors @types/mongoose @types/bcryptjs @types/jsonwebtoken @types/swagger-jsdoc @types/swagger-ui-express
```

3. 設置環境變數：

創建 `.env` 文件，參考 `.env.example` 填寫必要的環境變數。

```bash
cp .env.example .env
```

內容應包括：

```
# 應用環境
NODE_ENV=development

# 伺服器設置
PORT=5000
API_URL=http://localhost:5000

# 數據庫連接
MONGO_URI=mongodb://localhost:27017/vehicle-booking

# JWT 設置
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=30d

# CORS 設置
CORS_ORIGIN=http://localhost:3000
```

4. 編譯 TypeScript 代碼：

```bash
npm run build
```

5. 啟動開發伺服器：

```bash
npm run dev
```

伺服器將在 `http://localhost:5000` 運行，API 文檔可在 `http://localhost:5000/api-docs` 訪問。

### 使用 Docker

1. 構建並啟動容器：

```bash
npm run docker:build
npm run docker:up
```

2. 服務將在以下地址可用：
   - API: `http://localhost:5000`
   - MongoDB: `mongodb://localhost:27017`
   - Mongo Express (資料庫管理界面): `http://localhost:8081`

## API 文檔

啟動服務後，可以訪問 Swagger 文檔：`http://localhost:5000/api-docs`

## 主要 API 端點

- `POST /api/auth/register`: 用戶註冊
- `POST /api/auth/login`: 用戶登入
- `GET /api/auth/me`: 獲取當前用戶資料
- `POST /api/bookings`: 創建預訂
- `GET /api/bookings`: 獲取所有預訂
- `GET /api/bookings/:id`: 獲取特定預訂
- `PUT /api/bookings/:id`: 更新預訂
- `DELETE /api/bookings/:id`: 刪除預訂

## 測試

運行測試套件：

```bash
npm test
```

## 開發工具

- 代碼風格檢查：`npm run lint`
- 自動修復代碼風格：`npm run lint:fix`
- 代碼格式化：`npm run format`

## 專案結構

```
backend/
├── src/              # 源代碼目錄 
│   ├── config/       # 配置文件
│   ├── controllers/  # 控制器
│   ├── middleware/   # 中間件
│   ├── models/       # 數據模型
│   ├── routes/       # 路由定義
│   ├── services/     # 業務邏輯服務
│   ├── tests/        # 測試文件
│   ├── types/        # 類型定義
│   ├── utils/        # 工具函數
│   ├── app.ts        # Express 應用程式
│   └── server.ts     # HTTP 服務器入口
├── dist/             # 編譯後的代碼
├── logs/             # 日誌文件
├── uploads/          # 上傳文件
├── .env              # 環境變數
├── .env.example      # 環境變數樣本
├── tsconfig.json     # TypeScript 配置
└── package.json      # 項目依賴
```

## 部署

專案已配置 Docker，可以輕鬆部署到支持 Docker 的環境。

## 貢獻指南

1. 使用 [Conventional Commits](https://www.conventionalcommits.org/) 提交代碼
2. 確保測試通過
3. 提交前運行 lint 和格式化檢查

## 許可證

[MIT](LICENSE) 