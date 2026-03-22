import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true,
};

const PropertyMap = ({ properties, center, zoom = 12 }) => {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const mapRef = useRef(null);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center || defaultCenter}
        zoom={zoom}
        options={options}
        onLoad={onLoad}
      >
        {properties?.map((property) => (
          property.address?.coordinates?.lat && property.address?.coordinates?.lng && (
            <Marker
              key={property._id}
              position={{
                lat: property.address.coordinates.lat,
                lng: property.address.coordinates.lng,
              }}
              onClick={() => setSelectedProperty(property)}
              icon={{
                url: property.propertyType === 'house'
                  ? '/house-marker.png'
                  : '/apartment-marker.png',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          )
        ))}

        {selectedProperty && (
          <InfoWindow
            position={{
              lat: selectedProperty.address.coordinates.lat,
              lng: selectedProperty.address.coordinates.lng,
            }}
            onCloseClick={() => setSelectedProperty(null)}
          >
            <div className="p-2 max-w-xs">
              <img
                src={selectedProperty.images?.[0]?.url || 'https://via.placeholder.com/200x150'}
                alt={selectedProperty.title}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <h3 className="font-semibold text-lg">{selectedProperty.title}</h3>
              <p className="text-gray-600 text-sm">
                {selectedProperty.address?.city}, {selectedProperty.address?.state}
              </p>
              <p className="text-primary font-bold mt-1">
                ${selectedProperty.price?.toLocaleString()}
              </p>
              <div className="flex space-x-2 text-sm text-gray-500 mt-1">
                <span>{selectedProperty.bedrooms} beds</span>
                <span>{selectedProperty.bathrooms} baths</span>
                <span>{selectedProperty.area} sqft</span>
              </div>
              <button
                onClick={() => navigate(`/property/${selectedProperty._id}`)}
                className="mt-2 w-full bg-primary text-white py-1 rounded hover:bg-blue-700"
              >
                View Details
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default PropertyMap;