import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetPropertiesQuery } from '../redux/api/apiSlice';
import PropertyCard from '../components/Property/PropertyCard';
import PropertyFilter from '../components/Property/PropertyFilter';
import PropertyMap from '../components/Property/PropertyMap';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { FaMapMarkedAlt, FaThLarge } from 'react-icons/fa';
import { setFilters } from '../redux/slices/filterSlice';

const PropertyListPage = () => {
  const [view, setView] = useState('grid');
  const [pageNumber, setPageNumber] = useState(1);
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);

  const { data, isLoading, error } = useGetPropertiesQuery({
    ...filters,
    pageNumber,
  });

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    setPageNumber(1);
  };

  if (isLoading) return <Loader />;
  if (error) return <Message type="error">{error?.data?.message || error.error}</Message>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Find Your Perfect Property</h1>
        <PropertyFilter onFilterChange={handleFilterChange} />
      </div>

      <div className="flex justify-end mb-4 space-x-2">
        <button
          onClick={() => setView('grid')}
          className={`p-2 rounded ${view === 'grid' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          <FaThLarge />
        </button>
        <button
          onClick={() => setView('map')}
          className={`p-2 rounded ${view === 'map' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          <FaMapMarkedAlt />
        </button>
      </div>

      {view === 'map' ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <PropertyMap
            properties={data?.properties || []}
            center={filters.center}
            radius={filters.radius}
          />
          <div className="p-4 max-h-96 overflow-y-auto">
            <h3 className="font-semibold mb-3">Properties ({data?.properties?.length})</h3>
            <div className="space-y-3">
              {data?.properties?.map(property => (
                <div key={property._id} className="flex space-x-3 border-b pb-3">
                  <img
                    src={property.images[0]?.url || 'https://via.placeholder.com/80x60'}
                    alt={property.title}
                    className="w-20 h-16 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-semibold">{property.title}</h4>
                    <p className="text-primary font-bold">${property.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{property.address?.city}, {property.address?.state}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {data?.properties?.length === 0 ? (
            <Message type="info">No properties found matching your criteria</Message>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.properties?.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>

              {data?.pages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <button
                    onClick={() => setPageNumber(pageNumber - 1)}
                    disabled={pageNumber === 1}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {pageNumber} of {data.pages}
                  </span>
                  <button
                    onClick={() => setPageNumber(pageNumber + 1)}
                    disabled={pageNumber === data.pages}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PropertyListPage;