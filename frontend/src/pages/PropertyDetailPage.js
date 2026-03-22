import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetPropertyByIdQuery, useCreateBookingMutation, useSavePropertyMutation } from '../redux/api/apiSlice';
import PropertyGallery from '../components/Property/PropertyGallery';
import PropertyMap from '../components/Property/PropertyMap';
import PropertyReviews from '../components/Property/PropertyReviews';
import {
  FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaCalendarAlt,
  FaHeart, FaShare, FaPrint, FaStar, FaRegHeart, FaCheck
} from 'react-icons/fa';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { toast } from 'react-toastify';
import { formatPrice, formatDate } from '../utils/formatters';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    bookingDate: '',
    timeSlot: '',
    message: '',
    bookingType: 'viewing',
    attendees: 1,
  });

  const { data: property, isLoading, error, refetch } = useGetPropertyByIdQuery(id);
  const [createBooking, { isLoading: bookingLoading }] = useCreateBookingMutation();
  const [saveProperty] = useSavePropertyMutation();

  const isSaved = userInfo?.savedProperties?.includes(id);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      navigate('/login');
      return;
    }

    try {
      await createBooking({
        propertyId: id,
        ...bookingData,
      }).unwrap();

      toast.success('Booking request sent successfully!');
      setShowBooking(false);
      setBookingData({
        bookingDate: '',
        timeSlot: '',
        message: '',
        bookingType: 'viewing',
        attendees: 1,
      });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleSaveProperty = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    try {
      await saveProperty(id).unwrap();
      toast.success(isSaved ? 'Property removed from saved' : 'Property saved to your list');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <Loader />;
  if (error) return <Message type="error">{error?.data?.message || error.error}</Message>;
  if (!property) return <Message type="info">Property not found</Message>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end space-x-2 mb-4 print:hidden">
        <button
          onClick={handleSaveProperty}
          className="p-2 border rounded-lg hover:bg-gray-50"
          title={isSaved ? 'Remove from saved' : 'Save property'}
        >
          {isSaved ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-600" />}
        </button>
        <button
          onClick={handleShare}
          className="p-2 border rounded-lg hover:bg-gray-50"
          title="Share"
        >
          <FaShare className="text-gray-600" />
        </button>
        <button
          onClick={handlePrint}
          className="p-2 border rounded-lg hover:bg-gray-50"
          title="Print"
        >
          <FaPrint className="text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PropertyGallery images={property.images} videos={property.videos} />

          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold">{property.title}</h1>
                <div className="flex items-center text-gray-600 mt-2">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>
                    {property.address?.street}, {property.address?.city}, {property.address?.state} {property.address?.zipCode}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(property.price)}
                </div>
                <div className="text-sm text-gray-500 capitalize">
                  {property.status?.replace('-', ' ')}
                </div>
              </div>
            </div>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < Math.round(property.averageRating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {property.averageRating?.toFixed(1)} ({property.reviewCount} reviews)
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <FaBed className="mx-auto text-primary text-2xl mb-2" />
                <div className="font-semibold">{property.bedrooms} Beds</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <FaBath className="mx-auto text-primary text-2xl mb-2" />
                <div className="font-semibold">{property.bathrooms} Baths</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <FaRulerCombined className="mx-auto text-primary text-2xl mb-2" />
                <div className="font-semibold">{property.area} Sq Ft</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <FaCalendarAlt className="mx-auto text-primary text-2xl mb-2" />
                <div className="font-semibold">{property.yearBuilt || 'N/A'}</div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </div>

            {property.features?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Features</h2>
                <div className="grid grid-cols-2 gap-2">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <FaCheck className="text-green-500 mr-2" />
                      <span className="font-medium">{feature.name}:</span>
                      <span className="ml-1">{feature.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.amenities?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {amenity.split('-').map(word =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {property.address?.coordinates && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Location</h2>
                <PropertyMap
                  properties={[property]}
                  center={property.address.coordinates}
                  zoom={15}
                />
              </div>
            )}

            <PropertyReviews propertyId={id} reviews={property.reviews || []} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Listed By</h3>
              <div className="flex items-center space-x-3">
                {property.user?.profileImage?.url ? (
                  <img
                    src={property.user.profileImage.url}
                    alt={property.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <FaRegHeart className="text-gray-500" />
                  </div>
                )}
                <div>
                  <div className="font-semibold">{property.user?.name}</div>
                  <div className="text-sm text-gray-600">{property.user?.email}</div>
                  <div className="text-sm text-gray-600">{property.user?.phone}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowBooking(!showBooking)}
              className="w-full btn-primary mb-4"
            >
              <FaCalendarAlt className="inline mr-2" />
              Schedule Viewing
            </button>

            {showBooking && (
              <form onSubmit={handleBooking} className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Booking Type</label>
                  <select
                    value={bookingData.bookingType}
                    onChange={(e) => setBookingData({ ...bookingData, bookingType: e.target.value })}
                    className="input-field"
                  >
                    <option value="viewing">Property Viewing</option>
                    <option value="inspection">Home Inspection</option>
                    <option value="consultation">Consultation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingData.bookingDate}
                    onChange={(e) => setBookingData({ ...bookingData, bookingDate: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Time Slot</label>
                  <select
                    required
                    value={bookingData.timeSlot}
                    onChange={(e) => setBookingData({ ...bookingData, timeSlot: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Number of Attendees</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bookingData.attendees}
                    onChange={(e) => setBookingData({ ...bookingData, attendees: parseInt(e.target.value) })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Message (Optional)</label>
                  <textarea
                    rows="3"
                    value={bookingData.message}
                    onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                    className="input-field"
                    placeholder="Any specific questions or requests?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full btn-primary"
                >
                  {bookingLoading ? 'Scheduling...' : 'Confirm Booking'}
                </button>
              </form>
            )}

            {property.nearbyProperties?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Similar Properties Nearby</h3>
                <div className="space-y-3">
                  {property.nearbyProperties.map((nearby) => (
                    <div
                      key={nearby._id}
                      onClick={() => navigate(`/property/${nearby._id}`)}
                      className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <img
                        src={nearby.images?.[0]?.url || 'https://via.placeholder.com/60x45'}
                        alt={nearby.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium text-sm">{nearby.title}</h4>
                        <p className="text-primary font-semibold text-sm">{formatPrice(nearby.price)}</p>
                        <p className="text-xs text-gray-500">{nearby.bedrooms} beds | {nearby.bathrooms} baths</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;