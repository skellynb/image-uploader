const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Parse allowed types
const allowedTypes = (process.env.ALLOWED_TYPES || '').split(',');

// Set up storage
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now()+ ext);
  }
});

const upload = multer({
  storage,
  limits: {fileSize: 2 * 1024 * 1024},
  fileFilter:(req, file, cb) => {
    const types = ['image/jpeg', 'image/png', 'image/gif'];
    if (types.includes(file.mimetype)) cb(null, true);
    else cb(new Error('only JPG, PNG, and GIF allowed'));
  }
})

module.exports = upload;
