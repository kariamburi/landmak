'use client';

import { useLoadScript } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Icon } from "@iconify/react";
import Barsscale from "@iconify-icons/svg-spinners/bars-scale";
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
type Beacon = {
  name: string;
  lat: number;
  lng: number;
};

interface Props {
  onClose: () => void;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEAPIKEY!;
const libraries: ("places" | "geometry" | "drawing")[] = ["places", "geometry", "drawing"];

export default function BeaconTracker({ onClose }: Props) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number } | null>(null);
  const [beacons, setBeacons] = useState<Beacon[]>([]);
  const [manualInput, setManualInput] = useState({ name: '', lat: '', lng: '' });
  const [manualInputVisible, setManualInputVisible] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map>();
  const userMarker = useRef<google.maps.Marker>();
  const beaconMarkers = useRef<google.maps.Marker[]>([]);
  const polygonRef = useRef<google.maps.Polygon>();

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
      (err) => console.error("Error: " + err.message),
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isLoaded]);

  const updateMap = (position: { lat: number; lng: number }) => {
    if (!window.google || !mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: position,
        zoom: 16,
        mapTypeId: "satellite",
        fullscreenControl: false,
      });

      userMarker.current = new google.maps.Marker({
        position,
        map: mapInstance.current,
        title: 'Me',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff',
        },
      });
    } else {
      userMarker.current?.setPosition(position);
    }
  };

  const captureBeacon = () => {
    if (!currentPos) return;
    const newBeacon = {
      name: `Beacon ${beacons.length + 1}`,
      lat: currentPos.lat,
      lng: currentPos.lng
    };
    addBeacon(newBeacon);
  };

  const addBeacon = (beacon: Beacon) => {
    const marker = new google.maps.Marker({
      position: { lat: beacon.lat, lng: beacon.lng },
      map: mapInstance.current,
      title: beacon.name,
      draggable: true,
    });

    marker.addListener('dragend', (e:any) => {
      const updatedBeacons = [...beacons];
      updatedBeacons[beacons.length] = {
        ...beacon,
        lat: e.latLng?.lat() ?? beacon.lat,
        lng: e.latLng?.lng() ?? beacon.lng,
      };
      setBeacons(updatedBeacons);
      updatePolygon(updatedBeacons);
    });

    beaconMarkers.current.push(marker);
    const updatedList = [...beacons, beacon];
    setBeacons(updatedList);
    updatePolygon(updatedList);
  };

  const updatePolygon = (updatedBeacons: Beacon[]) => {
    if (!mapInstance.current) return;
    const path = updatedBeacons.map((b) => ({ lat: b.lat, lng: b.lng }));
    if (polygonRef.current) {
      polygonRef.current.setPath(path);
    } else {
      polygonRef.current = new google.maps.Polygon({
        paths: path,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.1,
        map: mapInstance.current,
      });
    }
  };

  const handleManualInput = () => {
    const lat = parseFloat(manualInput.lat);
    const lng = parseFloat(manualInput.lng);
    if (isNaN(lat) || isNaN(lng) || !manualInput.name.trim()) {
      alert("Enter valid name, latitude and longitude");
      return;
    }
    addBeacon({ name: manualInput.name, lat, lng });
    setManualInput({ name: '', lat: '', lng: '' });
    // Ensure the polygon is updated with the new beacon
    updatePolygon([...beacons, { name: manualInput.name, lat, lng }]);
  };

  const saveBeaconsToGeoJSON = () => {
    if (beacons.length < 3) {
      alert("At least 3 points are needed to create a polygon.");
      return;
    }
    const coordinates = beacons.map((b) => [b.lng, b.lat]);
    if (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
        coordinates[0][1] !== coordinates[coordinates.length - 1][1]) {
      coordinates.push(coordinates[0]);
    }
    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Beacon Polygon" },
          geometry: {
            type: "Polygon",
            coordinates: [coordinates],
          },
        },
      ],
    };
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'digital_beacons.geojson';
    a.click();
    URL.revokeObjectURL(url);
    setBeacons([]);
    polygonRef.current?.setMap(null);
    polygonRef.current = undefined;
    beaconMarkers.current.forEach(marker => marker.setMap(null));
    beaconMarkers.current = [];
  };

  const handleFullscreen = () => {
    const container = document.getElementById("map-container");
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  if (!isLoaded) return (
    <div className="flex justify-center items-center h-full">
      <Icon icon={Barsscale} className="w-10 h-10 text-gray-500" />
    </div>
  );

  return (
    <div id="map-container" className="h-[100vh] w-full relative">
      <div className="w-full h-full rounded-b-xl shadow-md border" ref={mapRef}></div>

      {/* Buttons */}
      <div className="absolute top-2 right-2 z-20 flex flex-col space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleFullscreen} className="w-14 text-gray-600" variant="outline">
                <FullscreenOutlinedIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Toggle Fullscreen</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={captureBeacon} className="w-14 text-gray-600" variant="outline">
                <MyLocationOutlinedIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Capture Gps Beacon</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Add Manual Beacon Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => setManualInputVisible(true)} className="w-14 text-gray-600" variant="outline">
              <AddLocationAltOutlinedIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Add manual beacon</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={saveBeaconsToGeoJSON} className="w-14 text-gray-600" variant="outline">
                💾
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Save to GeoJSON</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onClose} variant="outline" className="w-14 text-gray-600">
                <CloseOutlinedIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Exit</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

       {/* Manual Input Form */}
       {manualInputVisible && (
        <div className="absolute top-10 left-10 z-10 p-4 bg-white shadow-md rounded-md">
          <h3 className="text-lg font-semibold">Add Manual Beacon</h3>
          <p className='text-sm text-gray-400'>Survey documents or paper maps</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleManualInput();
            }}
            className="space-y-2"
          >
            <div>
              <label className="block">Beacon Name</label>
              <input
                type="text"
                value={manualInput.name}
                onChange={(e) => setManualInput({ ...manualInput, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block">Latitude</label>
              <input
                type="text"
                value={manualInput.lat}
                onChange={(e) => setManualInput({ ...manualInput, lat: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block">Longitude</label>
              <input
                type="text"
                value={manualInput.lng}
                onChange={(e) => setManualInput({ ...manualInput, lng: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-2">
              <button
                type="button"
                onClick={() => setManualInputVisible(false)}  // Close the form
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add Beacon
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Beacon List */}
      {beacons.length > 0 && (
        <div className="absolute top-20 left-2 p-2 text-white bg-green-600 z-10 rounded-md shadow-lg max-h-[200px] overflow-auto text-sm">
          <ul>
            {beacons.map((b, i) => (
              <li key={i}>
                {b.name}: {b.lat.toFixed(6)}, {b.lng.toFixed(6)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
