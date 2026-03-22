import React from 'react';
import { Marker } from '@react-google-maps/api';
import { FaHome, FaBuilding } from 'react-icons/fa';

const PropertyMarker = ({ property, onClick }) => {
  if (!property.address?.coordinates?.lat || !property.address?.coordinates?.lng) {
    return null;
  }

  const getMarkerColor = () => {
    switch (property.propertyType) {
      case 'house':
        return '#2563eb';
      case 'apartment':
        return '#10b981';
      case 'condo':
        return '#f59e0b';
      case 'commercial':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <Marker
      position={{
        lat: property.address.coordinates.lat,
        lng: property.address.coordinates.lng,
      }}
      onClick={() => onClick(property)}
      icon={{
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
        fillColor: getMarkerColor(),
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 1.5,
      }}
    />
  );
};

export default PropertyMarker;