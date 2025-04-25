'use client';

import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

type LatLng = google.maps.LatLngLiteral;

const containerStyle = {
  width: '100%',
  height: '100vh',
};

// Example target point (can come from DB or props)
const TARGET_POINT: LatLng = {
  lat: 0.03813000,
  lng: 36.36339000,
};

// Calculate distance using Google Maps geometry
const getDistance = (a: LatLng, b: LatLng): number => {
  const google = window.google;
  return google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(a),
    new google.maps.LatLng(b)
  );
};

// Calculate bearing (direction to turn)
const calculateBearing = (from: LatLng, to: LatLng): number => {
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const deltaLng = ((to.lng - from.lng) * Math.PI) / 180;

  const y = Math.sin(deltaLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;

  return (bearing + 360) % 360;
};

const LandTargetNavigator = ({
  handleClosePopupLocateBeacon,
}: {
  handleClosePopupLocateBeacon: () => void;
}) => {
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [bearing, setBearing] = useState<number | null>(null);

  useEffect(() => {
    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const current = { lat: latitude, lng: longitude };
        setCurrentLocation(current);
        setDistance(getDistance(current, TARGET_POINT));
        setBearing(calculateBearing(current, TARGET_POINT));
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
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentLocation}
          zoom={18}
        >
          {/* User's current location */}
          <Marker position={currentLocation} label="You" />

          {/* Target location */}
          <Marker position={TARGET_POINT} label="Target" />

          {/* Line to target */}
          <Polyline
            path={[currentLocation, TARGET_POINT]}
            options={{ strokeColor: '#FF0000', strokeOpacity: 0.8, strokeWeight: 2 }}
          />

          {/* Info box */}
          <div className="absolute top-4 left-4 bg-white p-3 shadow rounded z-10 w-72">
            <p className="text-sm">Distance to target:</p>
            <p className="text-lg font-semibold">
              {distance ? `${distance.toFixed(1)} meters` : 'Calculating...'}
            </p>
            <button
              onClick={handleClosePopupLocateBeacon}
              className="mt-2 w-full bg-gray-600 text-white py-2 rounded"
            >
              ✕ Close
            </button>
          </div>

          {/* Compass */}
          {bearing !== null && (
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-full shadow z-10 flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">Direction</div>
              <div
                className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center"
                style={{ transform: `rotate(${bearing}deg)` }}
              >
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-red-600"></div>
              </div>
            </div>
          )}
        </GoogleMap>
      )}
    </LoadScript>
  );
};

export default LandTargetNavigator;
