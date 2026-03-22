import Review from '../models/Review.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';

export const addReview = async (req, res) => {
  try {
    const { rating, title, comment, pros, cons } = req.body;
    const propertyId = req.params.propertyId;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const hasBooked = await Booking.findOne({
      property: propertyId,
      user: req.user._id,
      status: { $in: ['confirmed', 'completed'] },
    });

    const alreadyReviewed = await Review.findOne({
      property: propertyId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Property already reviewed' });
    }

    const review = await Review.create({
      user: req.user._id,
      property: propertyId,
      rating: Number(rating),
      title,
      comment,
      pros: pros ? pros.split(',').map(p => p.trim()) : [],
      cons: cons ? cons.split(',').map(c => c.trim()) : [],
      verified: !!hasBooked,
    });

    const reviews = await Review.find({ property: propertyId });
    const averageRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

    property.averageRating = averageRating;
    property.numReviews = reviews.length;
    await property.save();

    await review.populate('user', 'name profileImage');

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await review.deleteOne();

    const property = await Property.findById(review.property);
    const reviews = await Review.find({ property: review.property });
    const averageRating = reviews.length > 0
      ? reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
      : 0;

    property.averageRating = averageRating;
    property.numReviews = reviews.length;
    await property.save();

    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    review.helpful += 1;
    await review.save();
    res.json({ helpful: review.helpful });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};