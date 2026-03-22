import React from 'react';
import { useGetMyBookingsQuery, useCancelBookingMutation } from '../redux/api/apiSlice';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTimes, FaCheck } from 'react-icons/fa';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { toast } from 'react-toastify';
import { formatDate, formatPrice } from '../utils/formatters';

const MyBookingsPage = () => {
  const { data: bookings, isLoading, error, refetch } = useGetMyBookingsQuery();
  const [cancelBooking] = useCancelBookingMutation();

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(id).unwrap();
        toast.success('Booking cancelled successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message type="error">{error?.data?.message || error.error}</Message>;

  if (!bookings || bookings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No Bookings Yet</h2>
        <p className="text-gray-600 mb-6">You haven't scheduled any property viewings yet.</p>
        <Link to="/properties" className="btn-primary">
          Browse Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      <div className="grid grid-cols-1 gap-6">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img
                  src={booking.property?.images?.[0]?.url || 'https://via.placeholder.com/400x300'}
                  alt={booking.property?.title}
                  className="w-full h-48 md:h-full object-cover"
                />
              </div>
              <div className="p-6 md:w-2/3">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold">
                    <Link to={`/property/${booking.property?._id}`} className="hover:text-primary">
                      {booking.property?.title}
                    </Link>
                  </h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status?.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 mb-2">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>
                    {booking.property?.address?.city}, {booking.property?.address?.state}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 mb-2">
                  <FaCalendarAlt className="mr-2" />
                  <span>{formatDate(booking.bookingDate)}</span>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <FaClock className="mr-2" />
                  <span>{booking.timeSlot}</span>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <span className="font-semibold mr-2">Attendees:</span>
                  <span>{booking.attendees}</span>
                </div>

                {booking.message && (
                  <div className="bg-gray-50 p-3 rounded mb-3">
                    <p className="text-sm text-gray-600">{booking.message}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-primary font-bold">
                    {formatPrice(booking.property?.price)}
                  </div>

                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                    >
                      <FaTimes />
                      <span>Cancel Booking</span>
                    </button>
                  )}

                  {booking.status === 'confirmed' && (
                    <div className="flex items-center text-green-600">
                      <FaCheck className="mr-1" />
                      <span>Confirmed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookingsPage;