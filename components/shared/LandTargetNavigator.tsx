'use client';

import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

type LatLng = google.maps.LatLngLiteral;

const containerStyle = {
  width: '100%',
  height: '100vh',
};

// Set this as your target GPS point (could come from a DB or GeoJSON)
const TARGET_POINT: LatLng = {
  lat: -1.215695, // Example: Nairobi
  lng: 36.812329,
};

const getDistance = (a: LatLng, b: LatLng): number => {
  const google = window.google;
  return google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(a),
    new google.maps.LatLng(b)
  );
};

const LandTargetNavigator = ({
    handleClosePopupLocateBeacon,
  }: {
    handleClosePopupLocateBeacon: () => void;
  }) => {
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const current = { lat: latitude, lng: longitude };
        setCurrentLocation(current);
        setDistance(getDistance(current, TARGET_POINT));
      },
      (err) => console.error('GPS Error:', err),
      { enableHighAccuracy: true, maximumAge: 1000 }
    );

    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLEAPIKEY!}
      libraries={['geometry']}
    >
      {currentLocation && (
        <GoogleMap mapContainerStyle={containerStyle} center={currentLocation} zoom={18}>
          {/* User current location */}
          <Marker position={currentLocation} label="You" />

          {/* Target location */}
          <Marker position={TARGET_POINT} label="Target" />

          {/* Line from user to target */}
          <Polyline
            path={[currentLocation, TARGET_POINT]}
            options={{ strokeColor: '#FF0000', strokeOpacity: 0.8, strokeWeight: 2 }}
          />

          {/* Floating box with distance info */}
          <div className="absolute top-4 left-4 bg-white p-3 shadow rounded z-10">
            <p className="text-sm">Distance to target:</p>
            <p className="text-lg font-semibold">
              {distance ? `${distance.toFixed(1)} meters` : 'Calculating...'}
            </p>
            <button
              onClick={handleClosePopupLocateBeacon}
              className="w-full mb-2 bg-gray-600 text-white py-2 rounded"
            >
            X 
            </button>
          </div>
        </GoogleMap>
      )}
    </LoadScript>
  );
};

export default LandTargetNavigator;
