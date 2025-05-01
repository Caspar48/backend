FROM node:18-alpine AS build

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm ci --only=production

# 複製源代碼
COPY . .

# 創建生產階段
FROM node:18-alpine AS production

# 設置工作目錄
WORKDIR /app

# 環境變數
ENV NODE_ENV=production

# 複製打包好的應用程序
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/. ./

# 創建日誌目錄
RUN mkdir -p logs
RUN mkdir -p uploads

# 創建不具特權用戶
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001 -G nodejs
RUN chown -R nodejs:nodejs /app/logs
RUN chown -R nodejs:nodejs /app/uploads

# 切換到不具特權用戶
USER nodejs

# 暴露應用端口
EXPOSE 5000

# 啟動應用
CMD ["node", "server.js"] 