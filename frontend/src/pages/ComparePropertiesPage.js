import React, { useState } from 'react';
import { useGetPropertiesQuery } from '../redux/api/apiSlice';
import PropertyCard from '../components/Property/PropertyCard';
import { FaPlus, FaTrash, FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const ComparePropertiesPage = () => {
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading } = useGetPropertiesQuery({ keyword: searchTerm, pageNumber: 1 });

  const addProperty = (property) => {
    if (selectedProperties.length >= 3) {
      alert('You can compare up to 3 properties');
      return;
    }
    if (!selectedProperties.find(p => p._id === property._id)) {
      setSelectedProperties([...selectedProperties, property]);
    }
  };

  const removeProperty = (propertyId) => {
    setSelectedProperties(selectedProperties.filter(p => p._id !== propertyId));
  };

  const clearAll = () => {
    setSelectedProperties([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Compare Properties</h1>

      {selectedProperties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Select properties to compare</p>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Comparing {selectedProperties.length} properties</h2>
            <button onClick={clearAll} className="text-red-600 hover:text-red-800">
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedProperties.map((property) => (
              <div key={property._id} className="relative">
                <button
                  onClick={() => removeProperty(property._id)}
                  className="absolute top-2 right-2 z-10 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <FaTrash size={12} />
                </button>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedProperties.length > 0 && selectedProperties.length < 3 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Add more properties to compare</h3>
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field mb-4"
          />

          {isLoading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.properties
                ?.filter(p => !selectedProperties.find(sp => sp._id === p._id))
                .slice(0, 3)
                .map((property) => (
                  <div key={property._id} className="relative">
                    <button
                      onClick={() => addProperty(property)}
                      className="absolute top-2 right-2 z-10 bg-primary text-white p-1 rounded-full hover:bg-blue-700"
                    >
                      <FaPlus size={12} />
                    </button>
                    <PropertyCard property={property} />
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {selectedProperties.length >= 2 && (
        <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
          <h3 className="text-xl font-semibold p-6 border-b">Comparison Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feature</th>
                  {selectedProperties.map((property) => (
                    <th key={property._id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {property.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 font-medium">Price</td>
                  {selectedProperties.map((property) => (
                    <td key={property._id} className="px-6 py-4">${property.price.toLocaleString()}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Bedrooms</td>
                  {selectedProperties.map((property) => (
                    <td key={property._id} className="px-6 py-4">{property.bedrooms}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Bathrooms</td>
                  {selectedProperties.map((property) => (
                    <td key={property._id} className="px-6 py-4">{property.bathrooms}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Area (sq ft)</td>
                  {selectedProperties.map((property) => (
                    <td key={property._id} className="px-6 py-4">{property.area}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Property Type</td>
                  {selectedProperties.map((property) => (
                    <td key={property._id} className="px-6 py-4 capitalize">{property.propertyType}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Location</td>
                  {selectedProperties.map((property) => (
                    <td key={property._id} className="px-6 py-4">
                      {property.address?.city}, {property.address?.state}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Year Built</td>
                  {selectedProperties.map((property) => (
                    <td key={property._id} className="px-6 py-4">{property.yearBuilt || 'N/A'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Lot Size</td>
                  {selectedProperties.map((property) => (
                    <td key={property._id} className="px-6 py-4">{property.lotSize ? `${property.lotSize} sq ft` : 'N/A'}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePropertiesPage;