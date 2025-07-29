const express = require('express');
const path = require('path');
const uploadRoutes = require('./routes/upload');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', uploadRoutes);

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // Handle multer errors that might slip through
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).send('File too large');
  }
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).send('No file uploaded');
  }

  if (error.code === 'INVALID_FILE_TYPE') {
    return res.status(400).send('Only JPG, PNG, and GIF files are allowed');
  }
  
  // Generic error response
  res.status(500).send('Something went wrong');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;