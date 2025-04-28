'use client';

import { useLoadScript } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from '../ui/button';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
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

export default function BeaconTracker({onClose}:Props) {
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
        zoom: 16,
        mapTypeId: "satellite",
        fullscreenControl: false,
      });

      userMarker.current = new window.google.maps.Marker({
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
          strokeOpacity: 1,
        },
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

  const handleFullscreen = () => {
    const container = document.getElementById("map-container");
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const saveBeaconsToGeoJSON = () => {
    if (beacons.length < 3) {
      alert("At least 3 points are needed to create a polygon.");
      return;
    }
  
    const coordinates = beacons.map((b) => [b.lng, b.lat]);
  
    // Close the polygon by repeating the first point at the end
    if (coordinates.length > 0 && (coordinates[0][0] !== coordinates[coordinates.length-1][0] || coordinates[0][1] !== coordinates[coordinates.length-1][1])) {
      coordinates.push(coordinates[0]);
    }
  
    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            name: "Beacon Polygon",
          },
          geometry: {
            type: "Polygon",
            coordinates: [coordinates], // Notice double brackets! (array of linear rings)
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
  };
  

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <div id="map-container" className="h-[100vh] w-full relative">
      <div className="w-full h-full rounded-b-xl shadow-md border" ref={mapRef}></div>

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 z-20 flex flex-col space-y-2">
        
        {/* Fullscreen Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleFullscreen} className="w-14 text-gray-600" variant="outline">
                <FullscreenOutlinedIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Fullscreen</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Capture Beacon Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={captureBeacon} className="w-14 text-gray-600" variant="outline">
                <AddLocationAltOutlinedIcon/>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p><AddLocationAltOutlinedIcon/> Capture Beacon</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Save to GeoJSON Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={saveBeaconsToGeoJSON} className="w-14 text-gray-600" variant="outline">
                💾
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>💾 Save to GeoJSON</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

          <TooltipProvider>
                           <Tooltip>
                             <TooltipTrigger asChild>
                        
          <Button onClick={()=> onClose()}  variant="outline" className="w-14 text-gray-600">
              <CloseOutlinedIcon />
          </Button>
        
        
                             </TooltipTrigger>
                             <TooltipContent>
                               <p> Exit</p>
                             </TooltipContent>
                           </Tooltip>
                         </TooltipProvider>
        

      </div>

      {/* Displaying Beacons */}
      {beacons.length > 0 && (
        <div className="absolute top-20 left-2 p-2 text-white bg-green-600 z-5 rounded-md shadow-lg">
          <ul className="text-sm">
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
