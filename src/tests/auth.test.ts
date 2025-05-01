import request from 'supertest';
import app from '../app';

describe('Auth API', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
  });

  it('should login an existing user', async () => {
    // First register a user
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      });

    // Then try to login
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
  });
});