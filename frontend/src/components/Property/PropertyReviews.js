import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaStar, FaRegStar, FaUser, FaThumbsUp, FaFlag } from 'react-icons/fa';
import { useAddReviewMutation } from '../../redux/api/apiSlice';
import { toast } from 'react-toastify';

const PropertyReviews = ({ propertyId, reviews = [] }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    comment: '',
    pros: '',
    cons: '',
  });

  const [addReview, { isLoading }] = useAddReviewMutation();

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.floor(r.rating) === star).length,
    percentage: (reviews.filter(r => Math.floor(r.rating) === star).length / reviews.length) * 100,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReview({
        propertyId,
        reviewData: {
          ...formData,
          rating,
          pros: formData.pros.split(',').map(p => p.trim()),
          cons: formData.cons.split(',').map(c => c.trim()),
        },
      }).unwrap();
      toast.success('Review added successfully');
      setShowForm(false);
      setFormData({ title: '', comment: '', pros: '', cons: '' });
      setRating(5);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add review');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="text-center">
          <div className="text-5xl font-bold text-primary mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center mb-2">
            {[...Array(5)].map((_, i) => (
              i < Math.round(averageRating) ? (
                <FaStar key={i} className="text-yellow-400" />
              ) : (
                <FaRegStar key={i} className="text-yellow-400" />
              )
            ))}
          </div>
          <div className="text-gray-600">
            Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        <div className="space-y-2">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center space-x-2">
              <span className="w-12">{star} stars</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${percentage || 0}%` }}
                />
              </div>
              <span className="w-12 text-sm text-gray-600">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {userInfo && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 btn-primary"
        >
          Write a Review
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">Write Your Review</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  {(hoverRating || rating) >= star ? (
                    <FaStar className="text-yellow-400 text-2xl" />
                  ) : (
                    <FaRegStar className="text-yellow-400 text-2xl" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Review Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="Summarize your experience"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Your Review</label>
            <textarea
              rows="4"
              required
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="input-field"
              placeholder="Share your experience with this property..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pros (comma separated)</label>
              <input
                type="text"
                value={formData.pros}
                onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
                className="input-field"
                placeholder="Location, Amenities, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cons (comma separated)</label>
              <input
                type="text"
                value={formData.cons}
                onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
                className="input-field"
                placeholder="Noise, Traffic, etc."
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="border-b pb-6">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                {review.user?.profileImage?.url ? (
                  <img
                    src={review.user.profileImage.url}
                    alt={review.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <FaUser className="text-gray-500" />
                  </div>
                )}
                <div>
                  <div className="font-semibold">{review.user?.name}</div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      i < review.rating ? (
                        <FaStar key={i} className="text-yellow-400 text-sm" />
                      ) : (
                        <FaRegStar key={i} className="text-yellow-400 text-sm" />
                      )
                    ))}
                    {review.verified && (
                      <span className="text-xs text-green-600 ml-2">Verified Purchase</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>

            <h4 className="font-semibold mb-2">{review.title}</h4>
            <p className="text-gray-700 mb-3">{review.comment}</p>

            {review.pros?.length > 0 && (
              <div className="mb-2">
                <span className="text-sm font-semibold text-green-600">Pros: </span>
                <span className="text-sm text-gray-600">{review.pros.join(', ')}</span>
              </div>
            )}

            {review.cons?.length > 0 && (
              <div className="mb-3">
                <span className="text-sm font-semibold text-red-600">Cons: </span>
                <span className="text-sm text-gray-600">{review.cons.join(', ')}</span>
              </div>
            )}

            <div className="flex space-x-4">
              <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-primary">
                <FaThumbsUp />
                <span>Helpful ({review.helpful})</span>
              </button>
              <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600">
                <FaFlag />
                <span>Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyReviews;