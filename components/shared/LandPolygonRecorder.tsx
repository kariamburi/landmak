'use client';

import {
  GoogleMap,
  LoadScript,
  Marker,
  Polygon,
} from '@react-google-maps/api';
import { useEffect, useState } from 'react';

type LatLng = google.maps.LatLngLiteral;

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const calculateArea = (paths: LatLng[]): number => {
  const google = window.google;
  const polygon = new google.maps.Polygon({ paths });
  const areaSqMeters = google.maps.geometry.spherical.computeArea(polygon.getPath());
  return areaSqMeters / 10000; // hectares
};

const calculateLength = (paths: LatLng[]): number => {
  const google = window.google;
  const path = new google.maps.MVCArray(paths);
  return google.maps.geometry.spherical.computeLength(path);
};

const LandPolygonRecorder = ({
    handleClosePopupBeacon,
  }: {
    handleClosePopupBeacon: () => void;
  }) => {
  const [points, setPoints] = useState<LatLng[]>([]);
  const [center, setCenter] = useState<LatLng | null>(null);
  const [area, setArea] = useState<number | null>(null);
  const [perimeter, setPerimeter] = useState<number | null>(null);

  useEffect(() => {
    if (points.length >= 3 && typeof window !== 'undefined' && window.google) {
      setArea(calculateArea(points));
      setPerimeter(calculateLength(points));
    } else {
      setArea(null);
      setPerimeter(null);
    }
  }, [points]);

  useEffect(() => {
    // Get initial GPS location for map center
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCenter({ lat: latitude, lng: longitude });
      },
      (err) => console.error('GPS error:', err),
      { enableHighAccuracy: true }
    );
  }, []);

  const capturePoint = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const point = { lat: latitude, lng: longitude };
        setPoints((prev) => [...prev, point]);
      },
      (err) => console.error('GPS error:', err),
      { enableHighAccuracy: true }
    );
  };

  const exportGeoJSON = () => {
    if (points.length < 3) return;

    const geojson = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [...points.map((p) => [p.lng, p.lat]), [points[0].lng, points[0].lat]],
        ],
      },
      properties: {
        area_ha: area,
        perimeter_m: perimeter,
      },
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'polygon.geojson';
    a.click();
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLEAPIKEY!}
      libraries={['geometry']}
    >
      {center && (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={18}>
          {points.map((point, index) => (
            <Marker key={index} position={point} />
          ))}
          {points.length >= 3 && (
            <Polygon
              paths={points}
              options={{
                fillColor: '#00f',
                fillOpacity: 0.3,
                strokeColor: '#00f',
                strokeWeight: 2,
              }}
            />
          )}

          {/* Floating controls */}
          <div className="absolute top-4 left-4 bg-white p-4 rounded shadow z-10 w-72">
            <button
              onClick={capturePoint}
              className="w-full mb-2 bg-green-600 text-white py-2 rounded"
            >
              ➕ Capture Point
            </button>
            <button
              onClick={handleClosePopupBeacon}
              className="w-full mb-2 bg-gray-600 text-white py-2 rounded"
            >
            X 
            </button>
            <div className="text-sm text-gray-800">
              <p>Points: {points.length}</p>
              {area && <p>Area: {area.toFixed(2)} ha</p>}
              {perimeter && <p>Perimeter: {perimeter.toFixed(2)} m</p>}
            </div>
            {points.length >= 3 && (
              <button
                onClick={exportGeoJSON}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded"
              >
                ⬇ Export as GeoJSON
              </button>
            )}
          </div>
        </GoogleMap>
      )}
    </LoadScript>
  );
};

export default LandPolygonRecorder;
