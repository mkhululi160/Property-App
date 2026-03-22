import React from 'react';
import { useSelector } from 'react-redux';
import PropertyCard from '../components/Property/PropertyCard';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

const SavedPropertiesPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const savedProperties = userInfo?.savedProperties || [];

  if (savedProperties.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FaHeart className="text-gray-300 text-6xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">No Saved Properties</h2>
        <p className="text-gray-600 mb-6">You haven't saved any properties yet.</p>
        <Link to="/properties" className="btn-primary">
          Browse Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Properties ({savedProperties.length})</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedProperties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default SavedPropertiesPage;