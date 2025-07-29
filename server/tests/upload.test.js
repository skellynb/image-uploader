const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../src/app'); // Adjust if needed

describe('POST /api/upload', () => {
  const testImagePath = path.join(__dirname, 'test-image.jpg');
  
  // Clean up any test files after each test
  afterEach(() => {
    const testFiles = ['fake.txt', 'big.jpg'];
    testFiles.forEach(file => {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  });

  it('should upload a valid image file', async () => {
    const res = await request(app)
      .post('/api/upload')
      .attach('file', testImagePath);

    expect(res.statusCode).toBe(200);
    expect(res.body.url).toMatch(/\/uploads\/.*\.jpg$/);

    // Clean up uploaded file
    const filename = res.body.url.split('/uploads/')[1];
    const uploadedPath = path.join(__dirname, '../uploads', filename);
    if (fs.existsSync(uploadedPath)) fs.unlinkSync(uploadedPath);
  });

  it('should fail when no file is sent', async () => {
    const res = await request(app).post('/api/upload');
    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/No file uploaded|Unexpected field/);
  });

  it('should reject unsupported file types', async () => {
    const fakeFile = path.join(__dirname, 'fake.txt');
    fs.writeFileSync(fakeFile, 'This is not an image');

    try {
      const res = await request(app)
        .post('/api/upload')
        .attach('file', fakeFile);

      // Check response
      expect(res.statusCode).toBe(400);
      expect(res.text).toMatch(/Only JPG, PNG, and GIF files are allowed/i);
    } catch (error) {
      // If there's a connection error, check if it's due to server validation
      if (error.code === 'ECONNRESET') {
        // This might indicate the server is properly rejecting the file
        // but not sending a proper HTTP response
        console.warn('Connection reset - server may need better error handling');
      }
      throw error;
    }
  });

  it('should reject file over size limit', async () => {
    const bigFile = path.join(__dirname, 'big.jpg');
    const twoMB = 2 * 1024 * 1024 + 1;
    fs.writeFileSync(bigFile, Buffer.alloc(twoMB));

    const res = await request(app)
      .post('/api/upload')
      .attach('file', bigFile);

    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/File too large/i);
  });
});