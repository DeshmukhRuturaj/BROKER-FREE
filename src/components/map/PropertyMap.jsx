import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const PropertyMap = ({ properties, selectedProperty, onPropertySelect, height = '400px' }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  // Default center (e.g., New York City)
  const defaultCenter = { lat: 40.7128, lng: -74.0060 };

  // Calculate center based on properties
  const center = properties && properties.length > 0 && properties[0].location && typeof properties[0].location.lat === 'number' && typeof properties[0].location.lng === 'number'
    ? {
        lat: properties[0].location.lat,
        lng: properties[0].location.lng
      }
    : defaultCenter;

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <GoogleMap
        mapContainerStyle={{ ...containerStyle, height }}
        center={center}
        zoom={12}
      >
        {properties && properties.filter(property =>
          property &&
          property.location &&
          typeof property.location.lat === 'number' &&
          typeof property.location.lng === 'number' &&
          !isNaN(property.location.lat) &&
          !isNaN(property.location.lng)
        ).map(property => (
          <Marker
            key={property._id}
            position={{
              lat: property.location.lat,
              lng: property.location.lng
            }}
            onClick={() => onPropertySelect && onPropertySelect(property)}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default PropertyMap;