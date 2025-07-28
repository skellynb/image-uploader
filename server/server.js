const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const uploadRoute = require('./src/routes/upload');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// ROUTES
console.log('Mounting upload route at /api/upload');
app.use('/api/upload', uploadRoute);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));