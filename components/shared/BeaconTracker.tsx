'use client';

import { useLoadScript } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEAPIKEY!; // Replace with your API key
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from '../ui/button';
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
        zoom: 16,
        mapTypeId: "satellite",
        fullscreenControl: false,
      });
  
      userMarker.current = new window.google.maps.Marker({
        position,
        map: mapInstance.current,
        title: 'Me',
        animation: google.maps.Animation.BOUNCE, // ✅ This goes here
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
  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <div id="map-container" className="h-[100vh] relative">
<div className="absolute top-2 right-2 z-5 flex flex-col space-y-2">
    {/* Default Button */}
                  <TooltipProvider>
                   <Tooltip>
                     <TooltipTrigger asChild>
                     <Button onClick={handleFullscreen} 
                     className="w-14 text-gray-600" 
                     variant={"outline"}><FullscreenOutlinedIcon/></Button>
                     </TooltipTrigger>
                     <TooltipContent>
                       <p>Toggle Fullscreen</p>
                     </TooltipContent>
                   </Tooltip>
                 </TooltipProvider>
                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                      <Button
                  onClick={captureBeacon}
                   className={`w-14 text-gray-600`}
                   variant={"outline"}
                 >
                  📍 Capture Beacon
                 </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>📍 Capture Beacon</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                 

                 </div>
      <div className="w-full h-full rounded-b-xl shadow-md border" ref={mapRef} />
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
