// upload.test.js
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../server'); // adjust path if needed

describe('POST /api/upload', () => {
  const testImagePath = path.join(__dirname, 'test-image.jpg'); // add a sample test image here

  it('should upload a valid image file', async () => {
    const res = await request(app)
      .post('/api/upload')
      .attach('file', testImagePath); // 'file' is the field name expected

    expect(res.statusCode).toBe(200);
    expect(res.body.url).toMatch(/\/uploads\/.*\.jpg$/);
    
    // Optionally delete uploaded file
    const filename = res.body.url.split('/uploads/')[1];
    const uploadedPath = path.join(__dirname, '../uploads', filename);
    if (fs.existsSync(uploadedPath)) fs.unlinkSync(uploadedPath);
  });

  it('should fail when no file is sent', async () => {
    const res = await request(app).post('/api/upload');
    expect(res.statusCode).toBe(500);
    expect(res.text).toMatch(/Unexpected field|undefined/);
  });

  it('should reject unsupported file types', async () => {
    const fakeFile = path.join(__dirname, 'fake.txt'); // create this dummy file
    fs.writeFileSync(fakeFile, 'This is not an image.');

    const res = await request(app)
      .post('/api/upload')
      .attach('file', fakeFile);

    expect(res.statusCode).toBe(500);
    expect(res.text).toMatch(/only JPG, PNG, and GIF allowed/);

    fs.unlinkSync(fakeFile);
  });

  it('should reject file over size limit', async () => {
    const bigFile = path.join(__dirname, 'big.jpg');
    const twoMB = 2 * 1024 * 1024 + 1;
    fs.writeFileSync(bigFile, Buffer.alloc(twoMB)); // create >2MB dummy file

    const res = await request(app)
      .post('/api/upload')
      .attach('file', bigFile);

    expect(res.statusCode).toBe(500);
    expect(res.text).toMatch(/File too large/);

    fs.unlinkSync(bigFile);
  });
});
