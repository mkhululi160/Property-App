import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import PropertyMarker from './PropertyMarker';
import LocationSearch from './LocationSearch';

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

const MapView = ({ properties, onLocationChange, onBoundsChange }) => {
  const [center, setCenter] = useState(defaultCenter);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [map, setMap] = useState(null);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onBoundsChanged = useCallback(() => {
    if (map && onBoundsChange) {
      const bounds = map.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      onBoundsChange({
        bounds: {
          ne: { lat: ne.lat(), lng: ne.lng() },
          sw: { lat: sw.lat(), lng: sw.lng() },
        },
        center: map.getCenter().toJSON(),
        zoom: map.getZoom(),
      });
    }
  }, [map, onBoundsChange]);

  const handleLocationSelect = (location) => {
    setCenter(location);
    if (onLocationChange) {
      onLocationChange(location);
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <div className="relative">
        <div className="absolute top-4 left-4 z-10 w-96">
          <LocationSearch onLocationSelect={handleLocationSelect} />
        </div>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          onLoad={onLoad}
          onDragEnd={onBoundsChanged}
          onZoomChanged={onBoundsChanged}
        >
          {properties?.map((property) => (
            <PropertyMarker
              key={property._id}
              property={property}
              onClick={setSelectedProperty}
            />
          ))}

          {selectedProperty && (
            <InfoWindow
              position={{
                lat: selectedProperty.address?.coordinates?.lat,
                lng: selectedProperty.address?.coordinates?.lng,
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
                <button
                  onClick={() => window.location.href = `/property/${selectedProperty._id}`}
                  className="mt-2 w-full bg-primary text-white py-1 rounded hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default MapView;