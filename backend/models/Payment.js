import mongoose from 'mongoose';

const paymentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  },
  stripePaymentIntentId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'usd',
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'cash'],
    default: 'card',
  },
  paymentType: {
    type: String,
    enum: ['deposit', 'full', 'booking_fee', 'rent', 'purchase'],
    required: true,
  },
  receiptUrl: String,
  refundId: String,
  paidAt: Date,
  refundedAt: Date,
}, {
  timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;