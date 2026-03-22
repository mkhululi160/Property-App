import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPropertyByIdQuery, useUpdatePropertyMutation } from '../redux/api/apiSlice';
import ImageUpload from '../components/common/ImageLoad';
import { toast } from 'react-toastify';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: property, isLoading: loading, error } = useGetPropertyByIdQuery(id);
  const [updateProperty, { isLoading: updating }] = useUpdatePropertyMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
    },
    propertyType: 'house',
    status: 'for-sale',
    features: [],
    amenities: [],
    yearBuilt: '',
    lotSize: '',
    hoaFees: '',
    taxAnnual: '',
  });

  const [featuresList, setFeaturesList] = useState([]);
  const [featureName, setFeatureName] = useState('');
  const [featureValue, setFeatureValue] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        price: property.price || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        area: property.area || '',
        address: property.address || { street: '', city: '', state: '', zipCode: '', country: 'USA' },
        propertyType: property.propertyType || 'house',
        status: property.status || 'for-sale',
        features: property.features || [],
        amenities: property.amenities || [],
        yearBuilt: property.yearBuilt || '',
        lotSize: property.lotSize || '',
        hoaFees: property.hoaFees || '',
        taxAnnual: property.taxAnnual || '',
      });
      setFeaturesList(property.features || []);
      setImages(property.images || []);
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addFeature = () => {
    if (featureName && featureValue) {
      setFeaturesList([...featuresList, { name: featureName, value: featureValue }]);
      setFeatureName('');
      setFeatureValue('');
    }
  };

  const removeFeature = (index) => {
    setFeaturesList(featuresList.filter((_, i) => i !== index));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const propertyData = new FormData();
    propertyData.append('title', formData.title);
    propertyData.append('description', formData.description);
    propertyData.append('price', formData.price);
    propertyData.append('bedrooms', formData.bedrooms);
    propertyData.append('bathrooms', formData.bathrooms);
    propertyData.append('area', formData.area);
    propertyData.append('address', JSON.stringify(formData.address));
    propertyData.append('propertyType', formData.propertyType);
    propertyData.append('status', formData.status);
    propertyData.append('features', JSON.stringify(featuresList));
    propertyData.append('amenities', formData.amenities.join(','));
    propertyData.append('yearBuilt', formData.yearBuilt);
    propertyData.append('lotSize', formData.lotSize);
    propertyData.append('hoaFees', formData.hoaFees);
    propertyData.append('taxAnnual', formData.taxAnnual);

    const newImages = images.filter(img => !img.publicId?.startsWith('existing'));
    newImages.forEach((image) => {
      propertyData.append('images', image.file);
    });

    try {
      await updateProperty({ id, ...propertyData }).unwrap();
      toast.success('Property updated successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message type="error">{error?.data?.message || error.error}</Message>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Property</h1>

        <form onSubmit={submitHandler} className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Property Type *</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="for-sale">For Sale</option>
                <option value="for-rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Bedrooms *</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Bathrooms *</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Area (sq ft) *</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Year Built</label>
              <input
                type="number"
                name="yearBuilt"
                value={formData.yearBuilt}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="input-field"
              required
            />
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 mb-2">Address</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="Street Address"
                className="input-field"
              />
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="City"
                className="input-field"
              />
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                placeholder="State"
                className="input-field"
              />
              <input
                type="text"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                placeholder="ZIP Code"
                className="input-field"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 mb-2">Features</label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={featureName}
                onChange={(e) => setFeatureName(e.target.value)}
                placeholder="Feature name"
                className="flex-1 input-field"
              />
              <input
                type="text"
                value={featureValue}
                onChange={(e) => setFeatureValue(e.target.value)}
                placeholder="Value"
                className="flex-1 input-field"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {featuresList.map((feature, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span><strong>{feature.name}:</strong> {feature.value}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 mb-2">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['parking', 'pool', 'gym', 'security', 'elevator', 'ac', 'heating', 'furnished', 'pet-friendly', 'wheelchair-access'].map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          amenities: [...formData.amenities, amenity],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          amenities: formData.amenities.filter(a => a !== amenity),
                        });
                      }
                    }}
                    className="rounded"
                  />
                  <span className="capitalize">{amenity.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 mb-2">Images</label>
            <ImageUpload
              onUpload={(uploadedImages) => setImages(uploadedImages)}
              multiple={true}
              existingImages={images}
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
            >
              {updating ? 'Updating...' : 'Update Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyPage;