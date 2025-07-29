const path = require('path');
const fs = require('fs');

const downloadFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Download error:', err);
      return res.status(500).json({ message: 'Error downloading file' });
    }
  });
};

module.exports = { downloadFile };
