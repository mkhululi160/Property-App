import React, { useState, useRef } from 'react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const LocationSearch = ({ onLocationSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  const searchLocation = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.results) {
        setSuggestions(data.results);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      searchLocation(value);
    }, 500);
  };

  const handleSelect = (suggestion) => {
    const location = {
      lat: suggestion.geometry.location.lat(),
      lng: suggestion.geometry.location.lng(),
      address: suggestion.formatted_address,
    };
    setSearchTerm(suggestion.formatted_address);
    setSuggestions([]);
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search by city, address, or ZIP code..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {loading && (
        <div className="absolute mt-1 w-full bg-white rounded-lg shadow-lg p-4 z-20">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </div>
      )}

      {suggestions.length > 0 && !loading && (
        <div className="absolute mt-1 w-full bg-white rounded-lg shadow-lg max-h-64 overflow-y-auto z-20">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-start space-x-2"
            >
              <FaMapMarkerAlt className="text-gray-400 mt-1 flex-shrink-0" />
              <span className="text-sm">{suggestion.formatted_address}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;