import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Property',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending',
  },
  message: String,
  attendees: {
    type: Number,
    default: 1,
  },
  bookingType: {
    type: String,
    enum: ['viewing', 'inspection', 'consultation'],
    default: 'viewing',
  },
  reminderSent: {
    type: Boolean,
    default: false,
  },
  paymentRequired: {
    type: Boolean,
    default: false,
  },
  paymentAmount: Number,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  },
  cancelledAt: Date,
  cancellationReason: String,
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;