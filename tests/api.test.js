// tests/api.test.js
const request = require('supertest');
const { app } = require('../index');
const mongoose = require('mongoose');

describe('GET /api/activities', () => {

  it('should return 200 OK and activity array', async () => {
    const res = await request(app).get('/api/activities');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return 429 after excessive requests', async () => {

    let res;

    for (let i = 0; i < 105; i++) {
      res = await request(app).get('/api/activities');
    }

    expect(res.statusCode).toBe(429);
  });

});

afterAll(async () => {
  await mongoose.connection.close();
});