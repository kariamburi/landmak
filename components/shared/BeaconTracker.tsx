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
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import QRCode from 'qrcode';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
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
   
    setOpenShowInfo(true);
 
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const position = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCurrentPos(position);
          updateMap(position);
        },
        (err) => console.error("Initial Geolocation Error:", err),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const position = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCurrentPos(position);
          updateMap(position);
        },
        (err) => console.error("Geolocation Watch Error:", err),
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
const refreshLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const position = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      setCurrentPos(position);
      updateMap(position);
    },
    (err) => {
      console.error("Error getting current position:", err);
      alert("Unable to retrieve your location.");
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
};
//const hasShownInfoRef = useRef(false);
  const captureBeacon = () => {
    if (!currentPos) return;
    const newBeacon = {
      name: `Beacon ${beacons.length + 1}`,
      lat: currentPos.lat,
      lng: currentPos.lng
    };
    addBeacon(newBeacon);
    // Only set openShowInfo the first time
  
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
  const saveQRcode = async () => {
    if (beacons.length < 3) {
      alert("At least 3 points are needed to create a polygon.");
      return;
    }
    const coordinates = beacons.map((b) => [b.lng, b.lat]);
    if (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
        coordinates[0][1] !== coordinates[coordinates.length - 1][1]) {
      coordinates.push(coordinates[0]);
    }
    //const encoded = encodeURIComponent(JSON.stringify(coordinates));
    const url = `https://mapa.co.ke/?coordinates=${coordinates}`;
  
    try {
      const qrDataURL = await QRCode.toDataURL(url);
  
      // Create download link
      const link = document.createElement('a');
      link.href = qrDataURL;
      link.download = 'mapa-qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setBeacons([]);
      polygonRef.current?.setMap(null);
      polygonRef.current = undefined;
      beaconMarkers.current.forEach(marker => marker.setMap(null));
      beaconMarkers.current = [];
    } catch (err) {
      console.error('Failed to generate QR code', err);
    }

  }
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
  const deleteAll = () => {
    setBeacons([]);
    polygonRef.current?.setMap(null);
    polygonRef.current = undefined;
    beaconMarkers.current.forEach(marker => marker.setMap(null));
    beaconMarkers.current = [];
  }
  const handleFullscreen = () => {
    const container = document.getElementById("map-container");
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };
 const [openShowInfo, setOpenShowInfo] = useState(false);
  //if (!isLoaded) return (
   // <div className="flex justify-center items-center h-full">
  //    <Icon icon={Barsscale} className="w-10 h-10 text-gray-500" />
   // </div>
 // );

  return (
    <div id="map-container" className="h-[100vh] w-full relative">
       {!isLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-800" />
            <span className="ml-2 text-gray-700 font-medium">Loading map...</span>
          </div>
        )}  
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
    <Button onClick={refreshLocation} className="w-14 text-gray-600" variant="outline">
      <MyLocationOutlinedIcon />
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    Refresh Location
  </TooltipContent>
</Tooltip>
</TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={()=> { captureBeacon();}} className="w-14 text-gray-600" variant="outline">
                <AddLocationAltOutlinedIcon />
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
              <EditLocationOutlinedIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Add manual beacon</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
  <Tooltip>
    <DropdownMenu>
      <TooltipTrigger asChild>
        <DropdownMenuTrigger asChild>
          <Button className="w-14 text-gray-600" variant="outline">
            💾
          </Button>
        </DropdownMenuTrigger>
      </TooltipTrigger>
      <TooltipContent><p>Save</p></TooltipContent>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={saveBeaconsToGeoJSON}>
        <FileDownloadOutlinedIcon/>Save as GeoJSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={saveQRcode}>
       <QrCode2OutlinedIcon/> Save as QR Code
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </Tooltip>
</TooltipProvider>
<TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={deleteAll} variant="outline" className="w-14 text-gray-600">
                <DeleteOutlineOutlinedIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Delete Beacons</p></TooltipContent>
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
        <div className="absolute bottom-10 left-10 z-10 p-4 bg-white shadow-md rounded-md">
         
         <div className='flex justify-between items-center'> <h3 className="text-lg font-semibold">Add Manual Beacon</h3>
         <button
         onClick={() => setManualInputVisible(false)}  // Close the form
        className="absolute top-2 right-2 text-gray-500 hover:text-black text-sm"
        title="Close"
      >
        ✕
      </button>
              </div>
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
                type="submit"
                className="px-4 py-2 w-full bg-green-600 text-white rounded"
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
   {openShowInfo && (
  <div
    className="absolute top-2 lg:top-20 left-2 lg:left-[60px] p-4 w-[320px] bg-[#e4ebeb] z-50 rounded-md shadow-lg text-sm text-gray-800
      animate-slide-in"
  >
    {/* Close Button */}
    <button
      onClick={() => setOpenShowInfo(false)}
      className="absolute top-2 right-2 text-gray-500 hover:text-black text-sm"
      title="Close"
    >
      ✕
    </button>

    <p className="font-bold text-base mb-2">📌 How to Capture Beacons</p>

    <ul className="list-disc list-inside space-y-1">
      <li>Walk or move around the land boundary on the map.</li>
      <li>Click <strong>Capture Beacon</strong> at each turn or corner.</li>
      <li>Capture points in a <strong>clockwise</strong> or <strong>anticlockwise</strong> order.</li>
      <li>You can <strong>drag markers</strong> to the exact location if needed.</li>
    </ul>

   <p className="mt-3">
  After capturing all beacons, click the <strong>Save</strong> button to export the boundary as a <strong>QR code</strong> or download it as a <strong>GeoJSON</strong> file.
</p>

    <div className="mt-4">
      <Button variant="default" className="w-full" onClick={() => setOpenShowInfo(false)}>
        Got it
      </Button>
    </div>
  </div>
)}



    </div>
  );
}
