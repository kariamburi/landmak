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
import { Copy, Share2 } from "lucide-react";
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useToast } from '../ui/use-toast';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
type Beacon = {
  name: string;
  lat: number;
  lng: number;
};
type Feature = {
  type: "Feature";
  properties: { [key: string]: any };
  geometry: {
    type: string;
    coordinates: any[];
  };
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
  const { toast } = useToast();
  const [openShowInfo, setOpenShowInfo] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [mode, setMode] = useState<'single' | 'subdivided'>('single');
  const [parcels, setParcels] = useState<Feature[]>([]);

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
    setOpenShowInfo(false)
    // Only set openShowInfo the first time

  };

  const addBeacon = (beacon: Beacon) => {
    const marker = new google.maps.Marker({
      position: { lat: beacon.lat, lng: beacon.lng },
      map: mapInstance.current,
      title: beacon.name,
      draggable: true,
    });

    marker.addListener('dragend', (e: any) => {
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
    setOpenShowInfo(false)
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

  const handleShare = async () => {
    if (navigator.share) {
      try {

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
        await navigator.share({
          title: "Digital beacons",
          text: "Explore this property location on mapa!",
          url: url,
        });
        console.log("Share was successful.");
      } catch (error) {
        console.error("Sharing failed:", error);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      console.log("Share not supported on this browser.");
      // You can also show a modal or a tooltip with the URL or instructions here.
    }
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
          properties: { name: "Land" },
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
    setParcels([]);
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


  const handleDraw = () => {
    if (beacons.length < 3) {
      toast({
        variant: "destructive",
        title: "Failed!",
        description: "At least 3 points are needed to create a polygon.",
        duration: 5000,
      });
      return;
    }

    const coordinates = beacons.map((b) => [b.lng, b.lat]);

    // Close the polygon if not already
    const [startLng, startLat] = coordinates[0];
    const [endLng, endLat] = coordinates[coordinates.length - 1];
    if (startLng !== endLng || startLat !== endLat) {
      coordinates.push([startLng, startLat]);
    }

    const plotName = `Parcel ${parcels.length + 1}`;

    const featureWithType: Feature = {
      type: "Feature",
      properties: {
        name: plotName,
      },
      geometry: {
        type: "Polygon",
        coordinates: [coordinates],
      },
    };


    setParcels((prev) => [...prev, featureWithType]);
    setBeacons([]);
    polygonRef.current?.setMap(null);
    polygonRef.current = undefined;
    beaconMarkers.current.forEach(marker => marker.setMap(null));
    beaconMarkers.current = [];

  };


  const exportToGeoJSON = () => {

    if (parcels.length === 0) {

      toast({
        variant: "destructive",
        title: "Failed!",
        description: "No parcels to export.",
        duration: 5000,
      });
      return;
    }
    const geoJson = {
      type: "FeatureCollection",
      features: parcels,
    };

    const blob = new Blob([JSON.stringify(geoJson, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "digital_beacons.geojson";
    link.click();
    URL.revokeObjectURL(url);
    setParcels([]);
  };
  const generateMultipleParcelQRCode = async () => {
    if (parcels.length === 0) return;

    // Build URL with encoded coordinates
    const params = parcels
      .map((parcel, index) => {
        const encoded = encodeURIComponent(JSON.stringify(parcel.geometry.coordinates));
        return `parcel${index + 1}=${encoded}`;
      })
      .join("&");

    const url = `https://mapa.co.ke/?${params}`;

    try {
      // Generate QR code data URL
      const qrDataURL = await QRCode.toDataURL(url);

      // Create and trigger download link
      const link = document.createElement("a");
      link.href = qrDataURL;
      link.download = "mapa-qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Optional cleanup logic
      setParcels([]);
      polygonRef.current?.setMap(null);
      polygonRef.current = undefined;
      beaconMarkers.current.forEach((marker) => marker.setMap(null));
      beaconMarkers.current = [];

    } catch (err) {
      console.error("Failed to generate QR code", err);
    }

    console.log("URL with multiple parcels:", url);
    return url;
  };


  const generateMultipleParcelLink = async () => {
    if (parcels.length === 0) return;

    // Build URL with encoded coordinates
    const params = parcels
      .map((parcel, index) => {
        const encoded = encodeURIComponent(JSON.stringify(parcel.geometry.coordinates));
        return `parcel${index + 1}=${encoded}`;
      })
      .join("&");

    const url = `https://mapa.co.ke/?${params}`;

    try {
      // Generate QR code data URL
      await navigator.share({
        title: "Digital beacons",
        text: "Explore this property location on mapa!",
        url: url,
      });
      console.log("Share was successful.");

      // Optional cleanup logic
      setParcels([]);
      polygonRef.current?.setMap(null);
      polygonRef.current = undefined;
      beaconMarkers.current.forEach((marker) => marker.setMap(null));
      beaconMarkers.current = [];

    } catch (err) {
      console.error("Failed to generate QR code", err);
    }

    console.log("URL with multiple parcels:", url);
    return url;
  };

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
              <Button onClick={() => { captureBeacon(); }} className="w-14 text-gray-600" variant="outline">
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


      {/* Beacon List */}
      {beacons.length > 0 && (
        <div className="absolute items-center top-20 left-2 p-2 text-white bg-green-600 z-10 rounded-md shadow-lg max-h-[200px] overflow-auto text-sm">
          <ul>
            {beacons.map((b, i) => (
              <li key={i}>
                {b.name}: {b.lat.toFixed(6)}, {b.lng.toFixed(6)}
              </li>
            ))}
          </ul>
          <Button
            onClick={() => handleDraw()}
            variant={"outline"}
            className="shadow-lg mt-2 text-gray-900 text-sm"
          >
            <AddOutlinedIcon sx={{ fontSize: 14 }} />Add
          </Button>
        </div>
      )}


      {/* Beacon List */}
      {parcels.length > 0 && (
        <div className="absolute flex gap-5 bottom-2 left-2 p-2 text-white bg-green-600 z-10 rounded-md shadow-lg text-sm">
          Parcels drawn: {parcels.length}
          <TooltipProvider>
            <Tooltip>
              <DropdownMenu>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button className="text-gray-600 text-sm" variant="outline">
                      <SaveAltOutlinedIcon sx={{ fontSize: 14 }} />Save
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent><p>Save</p></TooltipContent>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={exportToGeoJSON}>
                    <FileDownloadOutlinedIcon />Save as GeoJSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={generateMultipleParcelQRCode}>
                    <QrCode2OutlinedIcon /> Save as QR Code
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={generateMultipleParcelLink}>
                    <Share2 /> Share link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
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

      {openShowInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-[#e4ebeb] p-6 rounded-md shadow-lg w-[320px] relative">
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
              After capturing all beacons, click the <strong>Save</strong> button to export the boundary as a <strong>QR code</strong>, <strong>Share link</strong> or download it as a <strong>GeoJSON</strong> file.
            </p>

            <div className="mt-4 flex gap-4 flex-col">
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={() => {
                  setOpenShowInfo(false);
                  window.location.href = "intent://maps.google.com/#Intent;scheme=https;package=com.google.android.apps.maps;end";
                }}
              >
                Open Google Maps for Better GPS Accuracy
              </button>  <Button variant="default" className="w-full" onClick={() => setOpenShowInfo(false)}>
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-50"
      >
        Help
      </button>
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-[320px] relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setShowHelp(false)}
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-2"><MyLocationOutlinedIcon /> Having trouble with GPS?</h2>
            <p className="text-sm mb-4">
              If it&apos;s taking too long to get your precise GPS position, try opening the Google Maps app to help improve location accuracy. After that, return to the Digital Beacon app.
            </p>

            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              onClick={() => {
                setShowHelp(false);
                window.location.href = "intent://maps.google.com/#Intent;scheme=https;package=com.google.android.apps.maps;end";
              }}
            >
              Open Google Maps
            </button>
          </div>
        </div>
      )}


    </div>
  );
}
