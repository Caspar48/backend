/**
 * 認證相關測試
 */
const request = require('supertest');
const app = require('../app');
const User = require('../models/userModel');
const mongoose = require('mongoose');

describe('認證 API', () => {
  // 測試註冊功能
  describe('POST /api/auth/register', () => {
    it('成功註冊用戶', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        });
      
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('_id');
      expect(response.body.user.email).toBe('test@example.com');
    });
    
    it('註冊失敗 - 電子郵件已存在', async () => {
      // 先創建一個用戶
      await User.create({
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123'
      });
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'existing@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        });
      
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });
  
  // 測試登入功能
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // 在每個測試前創建測試用戶
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await User.create({
        username: 'loginuser',
        email: 'login@example.com',
        password: hashedPassword
      });
    });
    
    it('成功登入用戶', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('_id');
    });
    
    it('登入失敗 - 密碼錯誤', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        });
      
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });
}); 