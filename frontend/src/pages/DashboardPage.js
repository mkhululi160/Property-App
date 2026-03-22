import React, { useState } from 'react';
import { useGetPropertiesQuery, useDeletePropertyMutation, useGetMyBookingsQuery } from '../redux/api/apiSlice';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaChartLine } from 'react-icons/fa';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useGetPropertiesQuery({ pageNumber: page });
  const { data: bookings } = useGetMyBookingsQuery();
  const [deleteProperty] = useDeletePropertyMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await deleteProperty(id).unwrap();
        toast.success('Property deleted successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message type="error">{error?.data?.message || error.error}</Message>;

  const stats = {
    totalProperties: data?.total || 0,
    totalBookings: bookings?.length || 0,
    pendingBookings: bookings?.filter(b => b.status === 'pending').length || 0,
    confirmedBookings: bookings?.filter(b => b.status === 'confirmed').length || 0,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Properties</p>
              <p className="text-2xl font-bold">{stats.totalProperties}</p>
            </div>
            <FaChartLine className="text-primary text-3xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
            </div>
            <FaChartLine className="text-green-500 text-3xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Bookings</p>
              <p className="text-2xl font-bold">{stats.pendingBookings}</p>
            </div>
            <FaChartLine className="text-yellow-500 text-3xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Confirmed Bookings</p>
              <p className="text-2xl font-bold">{stats.confirmedBookings}</p>
            </div>
            <FaChartLine className="text-blue-500 text-3xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">All Properties</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.properties?.map((property) => (
                <tr key={property._id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={property.images?.[0]?.url || 'https://via.placeholder.com/40'}
                        alt={property.title}
                        className="w-10 h-10 object-cover rounded mr-3"
                      />
                      <span className="font-medium">{property.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">${property.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      property.status === 'for-sale' ? 'bg-green-100 text-green-800' :
                      property.status === 'for-rent' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {property.status?.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">{property.views} views</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/property/${property._id}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="View"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        to={`/edit-property/${property._id}`}
                        className="text-green-600 hover:text-green-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => deleteHandler(property._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data?.pages > 1 && (
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {data.pages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === data.pages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;