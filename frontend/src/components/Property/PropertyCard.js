import React from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa';

const PropertyCard = ({ property }) => {
  const primaryImage = property.images?.find(img => img.isPrimary) || property.images?.[0];

  return (
    <Link to={`/property/${property._id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
        <div className="relative h-48">
          <img
            src={primaryImage?.url || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-sm font-semibold">
            ${property.price.toLocaleString()}
          </div>
          {property.isFeatured && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Featured
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 truncate">{property.title}</h3>

          <div className="flex items-center text-gray-600 mb-2">
            <FaMapMarkerAlt className="mr-1 flex-shrink-0" />
            <span className="text-sm truncate">
              {property.address?.city}, {property.address?.state}
            </span>
          </div>

          <div className="flex justify-between text-gray-600">
            <div className="flex items-center">
              <FaBed className="mr-1" />
              <span>{property.bedrooms} beds</span>
            </div>
            <div className="flex items-center">
              <FaBath className="mr-1" />
              <span>{property.bathrooms} baths</span>
            </div>
            <div className="flex items-center">
              <FaRulerCombined className="mr-1" />
              <span>{property.area} sqft</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;