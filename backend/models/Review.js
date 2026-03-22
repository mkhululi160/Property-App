import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Property',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  pros: [String],
  cons: [String],
  helpful: {
    type: Number,
    default: 0,
  },
  reported: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;