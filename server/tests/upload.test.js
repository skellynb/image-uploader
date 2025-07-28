const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../src/app'); // Adjust if needed

describe('POST /api/upload', () => {
  const testImagePath = path.join(__dirname, 'test-image.jpg');

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

  const res = await request(app)
    .post('/api/upload')
    .attach('file', fakeFile);

  // Clean up the test file
  fs.existsSync(fakeFile) && fs.unlinkSync(fakeFile);

  // Check response
  expect(res.statusCode).toBe(400);
  expect(res.text).toMatch(/Only JPG, PNG, and GIF files are allowed/i);
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

    fs.existsSync(bigFile) && fs.unlinkSync(bigFile);
  });
});
