const request = require('supertest');
const app = require('../index');
const { User } = require('../Models/models');
const sequelize = require('../DB');

describe('Integration: User Registration and Login', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('POST /api/user/registration  - should create user and return success', async () => {
    const res = await request(app)
      .post('/api/user/registration')
      .send({ email: 'testuser@example.com', password: 'passw123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User registered successfully');

    const user = await User.findOne({ where: { email: 'testuser@example.com' } });
    expect(user).not.toBeNull();
  });

  test('POST /api/user/login - should authenticate and return token', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({ email: 'testuser@example.com', password: 'passw123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('POST /api/user/login - wrong password returns error', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({ email: 'testuser@example.com', password: 'wrongpass' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });
});
