const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = require('../controllers/uploadController');

console.log('Upload router loaded');

router.get('/', (req, res) => {
  console.log('GET / hit in upload router');
  res.json({ message: 'Upload route is accessible' });
});

router.post('/', (req, res) => {
  console.log('POST / hit in upload router');
  
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err.message);
      
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large (max 2MB)' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ error: 'Unexpected field name. Use "file" as field name.' });
        }
      }
      
      if (err.message === 'only JPG, PNG, and GIF allowed') {
        return res.status(400).json({ error: 'Only JPG, PNG, and GIF files are allowed' });
      }
      
      return res.status(400).json({ error: 'Upload failed', details: err.message });
    }
    
    if (!req.file) {
      console.log('No file received');
      return res.status(400).json({ error: 'No file uploaded. Make sure to use "file" as the field name.' });
    }
    
    console.log('File uploaded successfully:', req.file.filename);
    res.json({ 
      message: 'File uploaded successfully',
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename 
    });
  });
});

module.exports = router;