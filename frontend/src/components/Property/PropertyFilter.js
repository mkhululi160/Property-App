import React, { useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const PropertyFilter = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setLocalFilters] = useState({
    keyword: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    city: '',
    state: '',
    amenities: [],
    status: 'for-sale',
    sort: 'newest',
  });

  const propertyTypes = [
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' },
  ];

  const amenitiesList = [
    'parking', 'pool', 'gym', 'security', 'elevator',
    'ac', 'heating', 'furnished', 'pet-friendly', 'wheelchair-access'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity) => {
    setLocalFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '' && value.length > 0)
    );
    onFilterChange(activeFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const reset = {
      keyword: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      city: '',
      state: '',
      amenities: [],
      status: 'for-sale',
      sort: 'newest',
    };
    setLocalFilters(reset);
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="keyword"
            value={filters.keyword}
            onChange={handleInputChange}
            placeholder="Search by title, description, or location..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2"
        >
          <FaFilter />
          <span>Filters</span>
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Advanced Filters</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Property Type</label>
                <select name="propertyType" value={filters.propertyType} onChange={handleInputChange} className="input-field">
                  <option value="">All Types</option>
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select name="status" value={filters.status} onChange={handleInputChange} className="input-field">
                  <option value="for-sale">For Sale</option>
                  <option value="for-rent">For Rent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sort By</label>
                <select name="sort" value={filters.sort} onChange={handleInputChange} className="input-field">
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Price Range ($)</label>
                <div className="flex space-x-2">
                  <input type="number" name="minPrice" value={filters.minPrice} onChange={handleInputChange} placeholder="Min" className="input-field" />
                  <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleInputChange} placeholder="Max" className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Bedrooms</label>
                  <select name="bedrooms" value={filters.bedrooms} onChange={handleInputChange} className="input-field">
                    <option value="">Any</option>
                    {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num}+</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bathrooms</label>
                  <select name="bathrooms" value={filters.bathrooms} onChange={handleInputChange} className="input-field">
                    <option value="">Any</option>
                    {[1, 2, 3, 4].map(num => <option key={num} value={num}>{num}+</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input type="text" name="city" value={filters.city} onChange={handleInputChange} placeholder="Enter city" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input type="text" name="state" value={filters.state} onChange={handleInputChange} placeholder="Enter state" className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {amenitiesList.map(amenity => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityChange(amenity)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.amenities.includes(amenity)
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {amenity.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button type="button" onClick={handleReset} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                Reset
              </button>
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PropertyFilter;