// tests/download.test.js

const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../src/app'); 

describe('GET /api/download/:filename', () => {
  const filename = 'sample.jpg';
  const filePath = path.join(__dirname, '../uploads', filename);

  beforeAll(() => {
    // Ensure a file exists in uploads folder before testing
    fs.writeFileSync(filePath, 'dummy content');
  });

  afterAll(() => {
    // Clean up after test
    fs.unlinkSync(filePath);
  });

  it('should download a valid file', async () => {
    const res = await request(app)
      .get(`/api/download/${filename}`)
      .buffer()
      .parse((res, callback) => {
        res.setEncoding('utf8');
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => callback(null, data));
      });

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-disposition']).toContain(`attachment; filename="${filename}"`);
    expect(res.body).toBe('dummy content');
  });

  it('should return 404 for a non-existent file', async () => {
    const res = await request(app).get('/api/download/nonexistent.jpg');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('File not found');
  });
});
