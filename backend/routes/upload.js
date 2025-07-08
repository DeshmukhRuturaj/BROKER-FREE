const express = require('express');
const multer = require('multer');
const { Upload } = require('@aws-sdk/lib-storage');
const { auth } = require('../middleware/auth');
const { s3Client, deleteFileFromS3 } = require('../config/s3');

const router = express.Router();

// Use Multer memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
  }
});

// Single image upload
router.post('/image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const fileName = `properties/${Date.now()}-${req.file.originalname}`;
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    };

    const parallelUpload = new Upload({
      client: s3Client,
      params: uploadParams
    });

    const result = await parallelUpload.done();

    res.json({
      message: 'Image uploaded successfully',
      imageUrl: result.Location,
      imageKey: fileName,
      filename: req.file.originalname
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Multiple images upload
router.post('/images', auth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedImages = await Promise.all(req.files.map(async (file) => {
      const fileName = `properties/${Date.now()}-${file.originalname}`;
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
      };

      const parallelUpload = new Upload({
        client: s3Client,
        params: uploadParams
      });

      const result = await parallelUpload.done();

      return {
        url: result.Location,
        key: fileName,
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      };
    }));

    res.json({
      message: 'Images uploaded successfully',
      images: uploadedImages
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// DELETE image from S3
router.delete('/image/:key', auth, async (req, res) => {
  try {
    const { key } = req.params;
    const decodedKey = decodeURIComponent(key);
    const success = await deleteFileFromS3(decodedKey);
    if (success) {
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(500).json({ message: 'Failed to delete image' });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Delete failed' });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Maximum is 10 files.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected file field.' });
    }
  }
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ message: 'Only image files are allowed!' });
  }
  console.error('Upload middleware error:', error);
  res.status(500).json({ message: 'Upload failed' });
});

module.exports = router; 