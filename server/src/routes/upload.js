const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const { downloadFile } = require('../controllers/downloadController');

// Upload route
router.post('/upload', uploadFile);

// Download route
router.get('/download/:filename', downloadFile)

module.exports = router;