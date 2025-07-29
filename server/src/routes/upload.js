const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');

// Upload route
router.post('/upload', uploadFile);

module.exports = router;