import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getTopProperties,
  getPropertiesForMap,
} from '../controllers/propertyController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadMultiple } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProperties)
  .post(protect, uploadMultiple, createProperty);

router.get('/top', getTopProperties);
router.get('/map', getPropertiesForMap);
router.get('/:id', getPropertyById);
router.route('/:id')
  .put(protect, uploadMultiple, updateProperty)
  .delete(protect, admin, deleteProperty);

export default router;