const upload = require('../middleware/multerConfig');

const uploadFile = (req, res) => {
  console.log('Upload request received');

  try {
    upload.single('file')(req, res, (err) => {
      console.log('Multer callback executed');

      if (err) {
        console.log('Multer error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).send('File too large');
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).send('No file uploaded');
        }
        if (err.message?.includes('Only JPG, PNG, and GIF')) {
          return res.status(400).send('Only JPG, PNG, and GIF files are allowed');
        }
        return res.status(400).send(`Upload error: ${err.message}`);
      }

      if (!req.file) {
        return res.status(400).send('No file uploaded');
      }

      console.log('File uploaded:', req.file.filename);
      res.status(200).json({
        message: 'File uploaded successfully',
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename,
        size: req.file.size
      });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send('Unexpected server error');
  }
};

module.exports = { uploadFile };
