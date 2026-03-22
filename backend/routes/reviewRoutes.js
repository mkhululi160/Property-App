import express from 'express';
import {
  addReview,
  getReviews,
  deleteReview,
  markHelpful,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:propertyId')
  .get(getReviews)
  .post(protect, addReview);

router.route('/:id')
  .delete(protect, deleteReview);

router.post('/:id/helpful', protect, markHelpful);

export default router;