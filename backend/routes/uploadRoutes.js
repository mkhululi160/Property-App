import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSingle, uploadMultiple } from '../middleware/uploadMiddleware.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

const router = express.Router();

router.post('/images', protect, uploadMultiple, async (req, res) => {
  try {
    const uploadedImages = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'properties',
      });
      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
      fs.unlinkSync(file.path);
    }
    res.json(uploadedImages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/single', protect, uploadSingle, async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'properties',
    });
    fs.unlinkSync(req.file.path);
    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:publicId', protect, async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.publicId);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;