'use client';

import { useLoadScript } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEAPIKEY!; // Replace with your API key

type Beacon = {
  name: string;
  lat: number;
  lng: number;
};

const libraries: ("places" | "geometry" | "drawing")[] = ["places", "geometry", "drawing"];

export default function BeaconTracker() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number } | null>(null);
  const [beacons, setBeacons] = useState<Beacon[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map>();
  const userMarker = useRef<google.maps.Marker>();
  const beaconMarkers = useRef<google.maps.Marker[]>([]);
  const polygonRef = useRef<google.maps.Polygon>();

  // Start watching user movement
  useEffect(() => {
    if (!isLoaded || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const position = { lat, lng };
        setCurrentPos(position);
        updateMap(position);
      },
      (err) => {
        alert("Error: " + err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isLoaded]);

  const updateMap = (position: { lat: number; lng: number }) => {
    if (!window.google || !mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: position,
        zoom: 18,
      });

      userMarker.current = new window.google.maps.Marker({
        position,
        map: mapInstance.current,
        title: 'Me',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      });
    } else {
      mapInstance.current.setCenter(position);
      userMarker.current?.setPosition(position);
    }
  };

  const captureBeacon = () => {
    if (!currentPos) return;
    const name = `Beacon ${beacons.length + 1}`;
    const newBeacon = { name, lat: currentPos.lat, lng: currentPos.lng };
    setBeacons((prev) => [...prev, newBeacon]);

    const marker = new window.google.maps.Marker({
      position: { lat: newBeacon.lat, lng: newBeacon.lng },
      map: mapInstance.current,
      title: name,
    });

    beaconMarkers.current.push(marker);

    updatePolygon([...beacons, newBeacon]);
  };

  const updatePolygon = (updatedBeacons: Beacon[]) => {
    if (!mapInstance.current) return;

    const path = updatedBeacons.map((b) => ({ lat: b.lat, lng: b.lng }));

    if (polygonRef.current) {
      polygonRef.current.setPath(path);
    } else {
      polygonRef.current = new window.google.maps.Polygon({
        paths: path,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: mapInstance.current,
      });
    }
  };

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <div className="space-y-4">
      <button onClick={captureBeacon} className="btn btn-primary">📍 Capture Beacon</button>

      <div className="h-[400px] rounded border" ref={mapRef} />

      <ul className="text-sm">
        {beacons.map((b, i) => (
          <li key={i}>
            {b.name}: {b.lat.toFixed(6)}, {b.lng.toFixed(6)}
          </li>
        ))}
      </ul>
    </div>
  );
}
