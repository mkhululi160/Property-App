import express from 'express';
import {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking);

router.get('/mybookings', protect, getMyBookings);

router.route('/:id')
  .put(protect, updateBookingStatus)
  .delete(protect, cancelBooking);

export default router;