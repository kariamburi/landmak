'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from '@/components/ui/button';
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Menu, MenuItem } from "@mui/material";
import EditRoadOutlinedIcon from '@mui/icons-material/EditRoadOutlined';
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarPurple500OutlinedIcon from '@mui/icons-material/StarPurple500Outlined';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import LocalDrinkOutlinedIcon from '@mui/icons-material/LocalDrinkOutlined';
import AgricultureOutlinedIcon from '@mui/icons-material/AgricultureOutlined';
import FenceOutlinedIcon from '@mui/icons-material/FenceOutlined';
import SquareOutlinedIcon from '@mui/icons-material/SquareOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import { MapOutlined, DonutLargeOutlined, SquareOutlined, CircleOutlined } from "@mui/icons-material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import CropLandscapeOutlinedIcon from '@mui/icons-material/CropLandscapeOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
type Shape = {
  type: string;
  coordinates: { lat: number; lng: number }[];
  label: string;
  area: number;
  strokeColor: string;
  fillColor: string;
  status: "available" | "sold";
};
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Checkbox } from '../ui/checkbox';
import { DrawerDemo } from './DrawerDemo';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Input } from '../ui/input';
import { DrawerPublic } from './DrawerPublic';
import { ScrollArea } from '../ui/scroll-area';
import PropertyShapesGrid from './PropertyShapesGrid';
import { X } from 'lucide-react';
import { SoldStatus } from '@/lib/actions/dynamicAd.actions';

const polylineStyles = { 
  Road: { 
    strokeColor: "#E63946", 
    strokeWeight: 4, 
    strokeOpacity: 1 
  }, // Solid red line

  Trail: { 
    strokeColor: "#2A9D8F", 
    strokeWeight: 3, 
    strokeOpacity: 0.8, 
    icons: [{
      icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 3 }, // Dashed effect
      offset: "0",
      repeat: "10px", // Adjust spacing between dashes
    }],
  }, // Green dashed line

  Fence: { 
    strokeColor: "#264653", 
    strokeWeight: 2, 
    strokeOpacity: 1, 
    icons: [{
      icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 3 }, // Dotted effect
      offset: "0",
      repeat: "15px", // Adjust spacing
    }],
  }, // Blue dotted line

  Custom: { 
    strokeColor: "#F4A261", 
    strokeWeight: 3, 
    strokeOpacity: 0.9 
  }, // Solid orange line
};

const AddLineIcons = [
  { label: "Road"},
  { label: "Trail"},
  { label: "Fence"},
  { label: "Custom"},
];
// Define icons for each marker type

const defaultcenter = {
  lat: -1.286389, // Default center (Nairobi, Kenya)
  lng: 36.817223,
};
const GoogleMapping = ({
  selected,
  userId,
  _id,
  name,
  onChange,
  onSave,
}: {
  selected: any;
  name: string;
  userId:string;
  _id:string;
  onChange: (field: string, value: any) => void;
  onSave: () => void;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
 const [open, setOpen] = useState(false);
 const [customLabel, setCustomLabel] = useState("");
 const [showMappingInfo, setShowMappingInfo] = useState(false);
 const [uploadPopup, setUploadPopup] = useState(false);
 const [center, setCenter] = useState<any>(selected.location?.coordinates ? {lat:selected.location.coordinates[0], lng:selected.location.coordinates[1]}:defaultcenter);
 const [showSidebar, setShowSidebar] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [selectedShape, setSelectedShape] = useState<google.maps.OverlayView | null>(null);
  const [markerIcons, setMarkerIcons] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Add Line");
  const [selectedPolygon, setSelectedPolygon] = useState<google.maps.Polygon | null>(null);
  //const [selectedShape, setSelectedShape] = useState<any>(null);
  const [strokeColor, setStrokeColor] = useState("#FF0000");
  const [strokeWeight, setStrokeWeight] = useState(3);
  const [strokePattern, setStrokePattern] = useState<number[]>([]);

  const [latitude, setLatitude] = useState(selected.location?.coordinates ? selected.location.coordinates[0]:"");
  const [longitude, setLongitude] = useState(selected.location?.coordinates ? selected.location.coordinates[1]:"");
  const [mapLink, setMapLink] = useState("");
  const [inputMode, setInputMode] = useState< 'coordinates' | 'maplink' | 'address' | 'mylocation'>('mylocation');
  const { suggestions, setValue, value, clearSuggestions } = usePlacesAutocomplete();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<{ icon: string; color: string; label: string }>({
    icon: "",
    color: "",
    label: "",
  });
  const [markers, setMarkers] = useState<{ lat: number; lng: number; icon: string; color: string; label: string }[]>([]);
  //const [markers, setMarkers] = useState<{ lat: number; lng: number; icon: string; color: string; label: string }[]>(selected.markers?.lenght > 0 ? selected.markers:[]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  
  const handleOpenUploadPopup = () => {
    setUploadPopup(true);
  };
  const [polylines, setPolylines] = useState<
  { path: { lat: number; lng: number }[]; color: string; width: number; label: string }[]
>([]);
const [shapes, setShapes] = useState<any[]>([]);

  const handleSelection = (label: keyof typeof polylineStyles) => {
    setSelectedOption(label);
    drawingManager?.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);

    drawingManager?.setOptions({
      polylineOptions: {
        ...polylineStyles[label],
      },
    });
  };
  useEffect(() => {
   const loadBase64Icons = async () => {
      try {
        const response = await fetch("/assets/map/icons.txt"); // Adjust path as needed
        const data = await response.json(); // Parse JSON data
        setMarkerIcons(data);
      } catch (error) {
        console.error("Error loading Base64 icons:", error);
      }
    };

    loadBase64Icons();
  }, []);

  const selectedIconRef = useRef(selectedIcon); // Keep latest selectedIcon reference
  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLEAPIKEY!,
      version: "weekly",
      libraries: ["places","geometry", "drawing"],
    });
  
    loader.load().then(() => {
      if (!mapRef.current) return;
  
      // Initialize map
      const newMap = new google.maps.Map(mapRef.current, {
        center: center,
        zoom: 18,
        mapTypeId: "satellite",
        zoomControl: true,
        zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM },
      });
  
      setMap(newMap);
  
       // ✅ Add Click Event Listener to Map
    
    //newMap.addListener("click", (event: google.maps.MapMouseEvent) => handleClick(event));
      // Initialize Drawing Manager
      const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode:null,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.MARKER,
            google.maps.drawing.OverlayType.POLYGON,
            google.maps.drawing.OverlayType.POLYLINE,
            google.maps.drawing.OverlayType.RECTANGLE,
            google.maps.drawing.OverlayType.CIRCLE,
          ],
        },
        polygonOptions: {
          fillColor: "#FF0000",
          fillOpacity: 0.5,
          strokeColor: strokeColor,
          strokeWeight: strokeWeight,
        },
      });
  
      drawingManager.setMap(newMap);
      setDrawingManager(drawingManager);
  
     // Add marker at user's location
  const marker = new google.maps.Marker({
    position: center,
    map: newMap,
    draggable: true,
    title: "Property Location!",
  });
  marker.addListener("dragend", (event: google.maps.MapMouseEvent) => handleMarkerDragEnd(event));

    });
  }, []); // ✅ Map and drawing manager load only once!
useEffect(() => {
  selectedIconRef.current = selectedIcon; // Update ref when selectedIcon changes
}, [selectedIcon]);

const addMarker = useCallback((marker: any) => {
  const icon = selectedIconRef.current; // Always get the latest selectedIcon
  if (!icon.icon) return;
  marker.setIcon({
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
  <!-- Outer Pin Shape -->
  <path d="M100 0 C50 0, 0 50, 0 100 C0 150, 40 200, 100 250 C160 200, 200 150, 200 100 C200 50, 150 0, 100 0 Z" 
    fill="${icon.color}"/>

  <!-- Inner Circle -->
  <circle cx="100" cy="100" r="60" fill="#000000"/>

  <!-- Centered Lightning Bolt Icon -->
  <image href="${icon.icon}" x="70" y="70" width="60" height="60"/>
</svg>`)}`,
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 40),
         });

  setMarkers((prevMarkers) => [
    ...prevMarkers,
    {
      lat: marker.getPosition().lat(),
      lng: marker.getPosition().lng(),
      icon: icon.icon,
      color: icon.color,
      label: icon.label,
    },
  ]);

  const label = new google.maps.InfoWindow({
    content: `<div style="font-size: 14px; font-weight: bold; text-align: center;">${icon.label}</div>`,
  });
 // label.open(map, marker);
  marker.addListener("click", () => {
    label.open(map, marker);
  });
}, []); // ✅ Does NOT depend on selectedIcon, so map does not reload

useEffect(() => {
 
  if (!map || !selected.markers || selected.markers?.length === 0) return;
  // ✅ Add Markers from State
  selected.markers.forEach((markerData:any) => {
    const marker = new google.maps.Marker({
      position: { lat: markerData.lat, lng: markerData.lng },
      map: map,
      title: markerData.label,
    });
    marker.setIcon({
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
<!-- Outer Pin Shape -->
<path d="M100 0 C50 0, 0 50, 0 100 C0 150, 40 200, 100 250 C160 200, 200 150, 200 100 C200 50, 150 0, 100 0 Z" 
fill="${markerData.color}"/>

<!-- Inner Circle -->
<circle cx="100" cy="100" r="60" fill="#000000"/>

<!-- Centered Lightning Bolt Icon -->
<image href="${markerData.icon}" x="70" y="70" width="60" height="60"/>
</svg>`)}`,
    scaledSize: new google.maps.Size(40, 40),
    anchor: new google.maps.Point(20, 40),
   });
   setMarkers((prevMarkers) => [
    ...prevMarkers,
    {
      lat:markerData.lat,
      lng: markerData.lng,
      icon: markerData.icon,
      color: markerData.color,
      label: markerData.label,
    },
  ]);

  const label = new google.maps.InfoWindow({
    content: `<div style="font-size: 14px; font-weight: bold; text-align: center;">${markerData.label}</div>`,
  });

  marker.addListener("click", () => {
    label.open(map, marker);
  });

  });

}, [map,selected.markers]); // ✅ Runs when `selectedMarkers` changes

useEffect(() => {
  if (!map || !selected.polylines || selected.polylines.length === 0) return;

  // Store references to created polylines
  const newPolylines: google.maps.Polyline[] = [];
  setPolylines(selected.polylines)
  selected.polylines.forEach((polylineData: any) => {
    const polyline = new google.maps.Polyline({
      path: polylineData.path, // Array of {lat, lng}
      strokeColor: polylineData.color,
      strokeWeight: polylineData.width,
      map: map,
    });

    newPolylines.push(polyline);
    // Calculate the middle point of the polyline
    const path = polyline.getPath().getArray().map((latLng: any) => ({
      lat: latLng.lat(),
      lng: latLng.lng(),
    }));
    const midPoint = path[Math.floor(path.length / 2)]; // Get the center point

    // Create InfoWindow
    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="font-size: 14px; font-weight: bold; text-align: center;">${polylineData.label}</div>`,
      position: midPoint,
    });

    // Attach Click Event to Polyline
    polyline.addListener("click", () => {
      infoWindow.open(map);
    });
  });

  // Cleanup function to remove polylines
  return () => {
    newPolylines.forEach((polyline) => polyline.setMap(null));
  };
}, [map, selected.polylines]); // ✅ Runs when `map` or `selected.polylines` change


useEffect(() => {
  if (!map || !selected.shapes || selected.shapes.length === 0) return;

  // Store references to created shapes
  const newShapes: google.maps.MVCObject[] = [];
  setShapes(selected.shapes);
  selected.shapes.forEach((shapeData: any) => {
    let shape: google.maps.MVCObject | null = null;

    if (shapeData.type === "circle") {
      shape = new google.maps.Circle({
        center: shapeData.center, // {lat, lng}
        radius: shapeData.radius, // In meters
        strokeColor: shapeData.strokeColor,
        strokeWeight: shapeData.width,
        fillColor: shapeData.fillColor,
        fillOpacity: 0.5,
        map: map,
      });
    } else if (shapeData.type === "rectangle") {
      shape = new google.maps.Rectangle({
        bounds: shapeData.bounds, // {north, south, east, west}
        strokeColor: shapeData.strokeColor,
        strokeWeight: shapeData.width,
        fillColor: shapeData.fillColor,
        fillOpacity: 0.5,
        map: map,
      });
    } else if (shapeData.type === "polygon") {
      shape = new google.maps.Polygon({
        paths: shapeData.coordinates, // Array of {lat, lng}
        strokeColor: shapeData.strokeColor,
        strokeWeight: shapeData.width,
        fillColor: shapeData.fillColor,
        fillOpacity: 0.5,
        map: map,
      });
    }
   
    if (shape) {
      newShapes.push(shape);

      // Calculate center position for InfoWindow
      let position: google.maps.LatLng | null = null;
      if (shape instanceof google.maps.Circle) {
        position = shape.getCenter();
      } else if (shape instanceof google.maps.Rectangle) {
        const bounds = shape.getBounds();
        if (bounds) {
          position = bounds.getCenter();
        }
      } else if (shape instanceof google.maps.Polygon) {
        const path = shape.getPath().getArray();
        if (path.length > 0) {
          position = path[Math.floor(path.length / 2)];
        }
      }

      if (position) {
        const infoWindow = new google.maps.InfoWindow({
          content: `<div style="font-size: 14px; font-weight: bold; text-align: center;">
      ${shapeData.label || "Shape"}
    </div>
    <div style="font-size: 12px; color: gray; text-align: center; margin-top: 5px;">
      <strong>Land Area:</strong>
      <div>${shapeData.area ? shapeData.area.toFixed(2) + " m²" : "N/A"}</div>
      <div>${shapeData.area ? (shapeData.area / 10000).toFixed(2) + " ha" : "N/A"}</div>
      <div>${shapeData.area ? (shapeData.area / 4046.86).toFixed(2) + " acres" : "N/A"}</div>
    </div>`,
          position: position,
        });

        // Attach Click Event to Shape
        google.maps.event.addListener(shape, "click", () => {
          infoWindow.open(map);
        });
      }
    }
  });

  // Cleanup function to remove shapes
  return () => {
    newShapes.forEach((shape) => {
      if (shape instanceof google.maps.Circle || shape instanceof google.maps.Rectangle || shape instanceof google.maps.Polygon) {
        shape.setMap(null);
      }
    });
  };
}, [map, selected.shapes]); // ✅ Runs when `map` or `selected.shapes` change


useEffect(() => {
  if (!drawingManager) return;

  const handleMarkerComplete = (marker: any) => {
    addMarker(marker);
  };

  const handleOverlayComplete = (event: any) => {
    if (event.type === "marker" || event.type === "polyline") return;

    let newShape: any;

    const shapeColors = {
      polygon: { strokeColor: "#33FF57", fillColor: "#C1FFBD" },
      rectangle: { strokeColor: "#33FF57", fillColor: "#C1FFBD" },
      circle: { strokeColor: "#33A1FF", fillColor: "#C1FFBD" },
      polyline: { strokeColor: "#FFC300", fillColor: "" },
    };

    const type = event.type as keyof typeof shapeColors;
    const colorConfig = shapeColors[type];

    event.overlay.setOptions({
      strokeColor: colorConfig.strokeColor,
      fillColor: colorConfig.fillColor,
      fillOpacity: type !== "polyline" ? 0.4 : undefined,
      strokeWeight: 2,
    });
    event.overlay.addListener("click", () => {
      setSelectedShape((prev:any) => {
        if (prev) prev.setOptions({ strokeOpacity: 1 });
        event.overlay.setOptions({ strokeOpacity: 0.8 });
        return event.overlay;
      });
    });
    const label = prompt("Enter Label for boundery:");
    if (!label) {
      event.overlay.setMap(null); // Remove the shape from map if user cancels
      return;
    }

    const status = "Available";
    let area = 0;

    if (type === "polygon") {
      const path = event.overlay.getPath().getArray();
      area = google.maps.geometry.spherical.computeArea(path);

      newShape = {
        type,
        coordinates: path.map((latLng: google.maps.LatLng) => ({
          lat: latLng.lat(),
          lng: latLng.lng(),
        })),
        label,
        area,
        strokeColor: colorConfig.strokeColor,
        fillColor: colorConfig.fillColor,
        status,
      };
    } else if (type === "rectangle") {
      const bounds = event.overlay.getBounds();
      if (bounds) {
        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();

        const corners = [
          southWest,
          new google.maps.LatLng(southWest.lat(), northEast.lng()),
          northEast,
          new google.maps.LatLng(northEast.lat(), southWest.lng()),
        ];
        area = google.maps.geometry.spherical.computeArea(corners);

        newShape = {
          type,
          bounds: {
            north: northEast.lat(),
            east: northEast.lng(),
            south: southWest.lat(),
            west: southWest.lng(),
          },
          label,
          area,
          strokeColor: colorConfig.strokeColor,
          fillColor: colorConfig.fillColor,
          status,
        };
      }
    } else if (type === "circle") {
      const radius = event.overlay.getRadius();
      area = Math.PI * Math.pow(radius, 2);

      newShape = {
        type,
        center: {
          lat: event.overlay.getCenter().lat(),
          lng: event.overlay.getCenter().lng(),
        },
        radius,
        label,
        area,
        strokeColor: colorConfig.strokeColor,
        fillColor: colorConfig.fillColor,
        status,
      };
    }
   // event.overlay.addListener("click", () => {
    //  setSelectedShape(event.overlay);
    //});
    setShapes((prev) => [...prev, newShape]);
  };
  //const deleteSelectedShape = () => {
    //if (selectedShape) {
    //  selectedShape.setMap(null);
   //   setShapes((prev) => prev.filter((shape) => shape.overlay !== selectedShape));
  //    setSelectedShape(null);
  //  }
  //};
  const handlePolylinecomplete = (polyline: any) => {
    const label = prompt("Enter a label for this line:");
    if (!label) {
      polyline.setMap(null); // Remove the line if user cancels
      return;
    }

    const path = polyline.getPath().getArray().map((latLng: any) => ({
      lat: latLng.lat(),
      lng: latLng.lng(),
    }));

    const color = polyline.get("strokeColor");
    const width = polyline.get("strokeWeight");

    setPolylines((prevPolylines) => [
      ...prevPolylines,
      { path, color, width, label },
    ]);
  };

  drawingManager.addListener("markercomplete", handleMarkerComplete);
  drawingManager.addListener("overlaycomplete", handleOverlayComplete);
  drawingManager.addListener("polylinecomplete", handlePolylinecomplete);

  return () => {
    google.maps.event.clearListeners(drawingManager, "markercomplete");
    google.maps.event.clearListeners(drawingManager, "overlaycomplete");
    google.maps.event.clearListeners(drawingManager, "polylinecomplete");
  };
}, [drawingManager]);





  const updatePolygonStyle = () => {
    if (!selectedPolygon) return;

    selectedPolygon.setOptions({
      strokeColor,
      strokeWeight,
      strokeOpacity: 1,
    });

    if (strokePattern.length > 0) {
      const path = selectedPolygon.getPath();
      new google.maps.Polyline({
        path: path,
        strokeColor,
        strokeWeight,
        strokeOpacity: 1,
        //strokePattern,
        map: map!,
      });
    }
  };
 
 
 
 
  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return; // ✅ Prevents errors if latLng is null
  
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    
    setLatitude(newLat.toFixed(6)); // ✅ Update latitude
    setLongitude(newLng.toFixed(6)); // ✅ Update longitude
    setCenter({ lat: newLat, lng: newLng }); // ✅ Keep map centered on marker
  
    // ✅ Ensure the Google Map instance updates its center
    if (map) {
      map.setCenter({ lat: newLat, lng: newLng });
    }
  };
 
  
 
  const handleMapProperty = () => {
    if (!latitude || !longitude) {
      setErrorMessage("Please Add Property Location!");
      setError(true);
      return;
    }
    //console.log({location: {type: "Point", coordinates:[Number(latitude), Number(longitude)]}, polylines:polylines, markers:markers, shapes:shapes});
    onChange(name, {location: {type: "Point", coordinates:[Number(latitude), Number(longitude)]}, polylines:polylines, markers:markers, shapes:shapes}); // Remove extra []
    onSave();
    // Add Google Maps logic here
  };

 
const resetMap = () => {
  
  if (!mapRef.current) return;

  const newMap = new google.maps.Map(mapRef.current, {
    center: {lat:Number(latitude),lng:Number(longitude)},
    zoom: 18,
    mapTypeId: "satellite",
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM, // Places zoom control at the bottom-right
    },
  });
  
 const drawingManager = new google.maps.drawing.DrawingManager({
  drawingMode:null,
  drawingControl: true,
  drawingControlOptions: {
    position: google.maps.ControlPosition.TOP_CENTER,
    drawingModes: [
      google.maps.drawing.OverlayType.MARKER,
      google.maps.drawing.OverlayType.POLYGON,
      google.maps.drawing.OverlayType.POLYLINE,
      google.maps.drawing.OverlayType.RECTANGLE,
      google.maps.drawing.OverlayType.CIRCLE,
    ],
  },
  polygonOptions: {
    fillColor: "#FF0000",
    fillOpacity: 0.5,
    strokeColor: strokeColor,
    strokeWeight: strokeWeight,
  },
});

drawingManager.setMap(newMap);
setDrawingManager(drawingManager);
  setMap(newMap);
  // Clear state after removing elements from the map
  setSelectedIcon({ icon: "", color: "", label: "" });
  setMarkers([]);
  setPolylines([]);
  setShapes([]);
  const marker = new google.maps.Marker({
      position: {lat:Number(latitude),lng:Number(longitude)},
      map: newMap,
      draggable: true,
      title: "Property Location!",
    });

};
const handlePropertyLocation = (lat: string | number, lng: string | number) => {
  if (!mapRef.current || !lat || !lng) return;

  const latitude = Number(lat);
  const longitude = Number(lng);

setCenter({ lat: latitude, lng: longitude });
setLatitude(latitude)
setLongitude(longitude)
  const newMap = new google.maps.Map(mapRef.current, {
    center: { lat: latitude, lng: longitude },
    zoom: 19,
    mapTypeId: "satellite",
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM, // Places zoom control at the bottom-right
    },
  });

  // Initialize Drawing Manager
  const drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: null,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.MARKER,
        google.maps.drawing.OverlayType.POLYGON,
        google.maps.drawing.OverlayType.POLYLINE,
        google.maps.drawing.OverlayType.RECTANGLE,
        google.maps.drawing.OverlayType.CIRCLE,
      ],
    },
    polygonOptions: {
      fillColor: "#FF0000",
      fillOpacity: 0.5,
      strokeColor: strokeColor || "#000000", // Ensure strokeColor is defined
      strokeWeight: strokeWeight || 2, // Ensure strokeWeight is defined
    },
  });

  drawingManager.setMap(newMap);
  setDrawingManager(drawingManager);
  
  // Add marker at user's location
  const marker = new google.maps.Marker({
    position: { lat: latitude, lng: longitude },
    map: newMap,
    draggable: true,
    title: "Property Location!",
  });

  marker.addListener("dragend", (event: google.maps.MapMouseEvent) => handleMarkerDragEnd(event));

  setMap(newMap);
};

const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target?.result as string);
      if (!json.features) return;

      const newShapes = json.features.map((feature: any) => {
        const type = "polygon";
        const coords = feature.geometry.coordinates?.[0];
        if (!coords || !Array.isArray(coords)) return null;

        const coordinates = coords.map((coord: number[]) => ({
          lat: coord[1],
          lng: coord[0],
        }));

        const polygonPath = coordinates.map(
          (coord) => new google.maps.LatLng(coord.lat, coord.lng)
        );
        const area = google.maps.geometry.spherical.computeArea(polygonPath);

        const label = feature.properties?.name || "Uploaded Polygon";
        const status = "available";
        const strokeColor = "#00FF00";
        const fillColor = "#C1FFBD";

        return {
          type,
          coordinates,
          label,
          area,
          strokeColor,
          fillColor,
          status,
        };
      }).filter(Boolean); // Remove nulls

      // Update state
      setShapes((prev) => [...prev, ...newShapes]);

      // Draw on map
      newShapes.forEach((shapeData: any) => {
        let shape: google.maps.MVCObject | null = null;

        if (shapeData.type === "polygon") {
          shape = new google.maps.Polygon({
            paths: shapeData.coordinates,
            strokeColor: shapeData.strokeColor,
            strokeWeight: 2,
            fillColor: shapeData.fillColor,
            fillOpacity: 0.5,
            map: map,
          });
        }

        if (shape) {
          // Calculate InfoWindow center
          let position: google.maps.LatLng | null = null;
          if (shape instanceof google.maps.Polygon) {
            const path = shape.getPath().getArray();
            if (path.length > 0) {
              position = path[Math.floor(path.length / 2)];
            }
          }

          if (position) {
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div style="font-size: 14px; font-weight: bold; text-align: center;">
                  ${shapeData.label}
                </div>
                <div style="font-size: 12px; color: gray; text-align: center; margin-top: 5px;">
                  <strong>Land Area:</strong>
                  <div>${shapeData.area.toFixed(2)} m²</div>
                  <div>${(shapeData.area / 10000).toFixed(2)} ha</div>
                  <div>${(shapeData.area / 4046.86).toFixed(2)} acres</div>
                </div>
              `,
              position,
            });

            shape.addListener("click", () => {
              infoWindow.open(map);
            });
          }
        }
      });

      // ✅ Zoom and center map to all new shapes
      let centerSet = false;
      const bounds = new google.maps.LatLngBounds();
      newShapes.forEach((shapeData: any) => {
        if (shapeData.coordinates && Array.isArray(shapeData.coordinates)) {
          shapeData.coordinates.forEach((coord: any) => {
            if (!centerSet) {
              setCenter({ lat: coord.lat, lng: coord.lng });
              setLatitude(coord.lat);
              setLongitude(coord.lng);
              centerSet = true;
            }
            bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
          });
        }
      });
      setUploadPopup(false);
      if (map) {
        map.fitBounds(bounds);
      
        google.maps.event.addListenerOnce(map, "bounds_changed", () => {
         
         // if (map.getZoom() > 18) {
            map.setZoom(18);
         // }
        });
      }

    } catch (error) {
      console.error("GeoJSON parse error:", error);
    }
  };

  reader.readAsText(file);
};


  const toggleStatus = async (index: number) => {
    const updatedShape = shapes[index];
    const newStatus: "available" | "sold" =
      updatedShape.status === "available" ? "sold" : "available";
    const newFillColor = newStatus === "sold" ? "#FF6B6B" : "#C1FFBD";
    const newStrokeColor = newFillColor;

    const updatedShapeList: Shape[] = shapes.map((shape, i) =>
      i === index
        ? {
            ...shape,
            status: newStatus,
            fillColor: newFillColor,
            strokeColor: newStrokeColor,
          }
        : shape
    );

    setShapes(updatedShapeList);
   
    try {
      if (!shapes || shapes.length === 0) {
        console.warn("Initial shapes are invalid or empty");
        return;
      }
     // const response = await SoldStatus(_id, updatedShapeList);
    //  if (!response) throw new Error("Failed to update status in MongoDB");
      
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const confirmDelete = async (Index:any) => {
    if (Index === null) return;
    alert("deletes")
    const updatedShapeList = shapes.filter((_, i) => i !== Index);
    setShapes(updatedShapeList);
 
   
    try {
     // const response = await SoldStatus(_id, updatedShapeList);
     // if (!response) throw new Error("Failed to update shapes in MongoDB after deletion");
    } catch (error) {
      console.error("Error deleting shape:", error);
    }
  };
  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  return (<>
    <div className="flex w-full h-[100vh]">
       {error && (
        <AlertDialog open={error} onOpenChange={setError}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Error</AlertDialogTitle>
              <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setError(false)}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    SHAPES: {shapes.length}
      {uploadPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-2 z-50">
    <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-gray-200 rounded-xl p-2 w-full max-w-3xl shadow-lg">
      
      {/* Close Button */}
      <div className="flex justify-end">
        <Button
        variant="outline"
          onClick={() => setUploadPopup(false)}
          >
          <CloseOutlinedIcon fontSize="small" />
        </Button>
      </div>
      <div className="flex flex-col gap-2 items-center w-full">
        <p className='p-2 text-lg'>Upload custom map data</p>
          <div className="p-2 flex gap-2"><input type="file" accept=".json" onChange={handleFileUpload} className="p-2 border bg-white dark:bg-[#2D3236] dark:text-gray-100 rounded-lg"/></div>
      </div>
     
    </div>
  </div>
)}
    {/* Sidebar with Toggle Button */}
    <div
        className={`bg-gray-200 h-[100dvh] shadow-lg transition-transform duration-300 ease-in-out fixed md:relative ${
          showSidebar ? "w-full md:w-1/3 p-1" : "-translate-x-full md:w-0 md:translate-x-0"
        }`}
      >
      <Button
              onClick={() => setShowSidebar(!showSidebar)}
              className="mb-4 md:hidden"
            >
              {showSidebar ? "Hide" : "Show"} Sidebar
            </Button>
            {showSidebar && (
          <div className="flex flex-col space-y-2 w-full">
             <div className="flex justify-between items-center w-full">
         
             <div className="p-2 border mt-2 rounded-lg bg-white w-full">
      <p className="font-font px-3 py-1 rounded-md inline-block mb-2">
        Property Layouts
      </p>
      <ScrollArea className="h-[90vh] overflow-y-auto flex p-0 bg-white rounded-lg">
    
       {shapes.length > 0 ? (  <div className="grid grid-cols-2 md:grid-cols-2 gap-2 w-full"> {shapes.map((shape:any, index:number) => (
          <div
            key={index}
            onClick={() => toggleStatus(index)}
            className="relative h-16 rounded-lg cursor-pointer border border-gray-300 shadow-md"
            style={{
              backgroundColor: shape.fillColor,
              borderColor: shape.strokeColor,
            }}
          >
            <div className="absolute top-2 left-1 text-xs font-semibold text-black bg-white/70 px-2 py-0.5 rounded">
              {shape.label}
            </div>
            <div className="absolute bottom-2 left-1 text-xs text-white bg-black/40 px-2 py-0.5 rounded">
              {capitalizeFirstLetter(shape.status)}
            </div>
            <button
                    // onClick={confirmDelete(index)}
                     onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(index);
                    }}
                    className="absolute bottom-2 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                    title="Delete"
                  >
                    <X className="w-4 h-4" />
                  </button>
           
          
             {/* <AlertDialog.Root>
                <AlertDialog.Trigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteIndex(index);
                    }}
                    className="absolute bottom-2 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                    title="Delete"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                  <AlertDialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
                  <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 max-w-md w-[90%] -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6">
                    <AlertDialog.Title className="text-lg font-semibold text-gray-900">
                      Confirm Deletion
                    </AlertDialog.Title>
                    <AlertDialog.Description className="mt-2 text-sm text-gray-700">
                      Are you sure you want to delete this shape? This action cannot be undone.
                    </AlertDialog.Description>

                    <div className="mt-4 flex justify-end gap-3">
                      <AlertDialog.Cancel asChild>
                        <button className="px-4 py-1.5 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-100">
                          Cancel
                        </button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action asChild>
                        <button
                          onClick={confirmDelete}
                          className="px-4 py-1.5 rounded-md text-sm bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </AlertDialog.Action>
                    </div>
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>*/} 
            
          </div>
        ))}</div>):(<>
         <div className="flex items-center w-full flex-col gap-1 rounded-[14px] bg-grey-50 py-28 text-center">
            <h3 className="font-semibold mb-2">No Layout</h3>
              <p className="text-sm text-gray-500">No property layout drawn.</p>
              </div>
        
        </>)}
      
      </ScrollArea>
    </div>
            </div>
            </div>)}

      </div>
       {/* Map Section with Toggle Button */}
       <div className={`w-full mt-0 lg:mt-0 relative transition-all duration-300 h-[100dvh] ${
        showSidebar ? "hidden md:block" : "block"
      }`}>
     
         <Button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute top-1/2 left-4 z-20 md:block bg-white text-gray-700 shadow-lg hover:text-white"
        >
         {showSidebar ? (<div className='flex gap-1 items-center'><KeyboardArrowLeftOutlinedIcon/> <div className="text-xs hidden lg:inline">Hide Layout</div></div>) : (<div className='flex gap-1 items-center'><KeyboardArrowRightOutlinedIcon/> <div className="text-xs hidden lg:inline">Show Layout</div></div>)} 
        </Button>
        <div ref={mapRef} className="w-full h-[100dvh] border lg:rounded-xl lg:shadow-md" />
        
        {selectedShape && (
  <div className="absolute top-1/2 right-1/2 p-2 text-white bg-gray-100 z-5 rounded-md shadow-md">
    <div className="text-sm">
    <button
    onClick={() => {
      selectedShape.setMap(null); // 🧼 Remove from map
      setSelectedShape(null);
      // Optionally remove from shapes array if needed
    }}
    className="mt-4 p-2 bg-red-500 text-white rounded"
  >
    Delete Selected Shape
  </button>
    </div>
  </div>
)}
        
        <div className="absolute top-[100px] lg:top-3 left-3 lg:left-[200px] z-10 grid grid-cols-4 flex gap-1">
          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <div className="flex rounded-sm shadow-sm p-1 lg:py-2 lg:px-1 bg-gray-100 hover:bg-gray-200 text-gray-700 gap-1 lg:gap-2 text-xs lg:text-base items-center cursor-pointer"><RoomOutlinedIcon/>Select Marker</div>
             
             
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {markerIcons.map((item: any, index: number) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => {
                    drawingManager?.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
                    if (item.label === "Custom") {
                      const label = prompt("Enter a label for this marker:") || "Unnamed";
                      setSelectedIcon({ icon: item.icon, color: item.color, label: label });
                    } else {
                      setSelectedIcon({ icon: item.icon, color: item.color, label: item.label });
                    }
                  }}
                  className="flex items-center space-x-2"
                >
                  <span className="p-1 rounded-full bg-black">
                    <img src={item.icon} alt={item.label} className="w-4 h-4" />
                  </span>
                  <span>{item.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            
              <div className="flex rounded-sm shadow-sm p-1 lg:py-2 lg:px-1 bg-gray-100 hover:bg-gray-200 text-gray-700 gap-1 lg:gap-2 text-xs lg:text-base items-center cursor-pointer"><ShowChartOutlinedIcon/>Add Line</div>
            
            
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {AddLineIcons.map((item: any) => (
                <DropdownMenuItem key={item.label} onClick={() => handleSelection(item.label as keyof typeof polylineStyles)}>
                  {item.label === "Road" && <EditRoadOutlinedIcon className="mr-2" />}
                  {item.label === "Trail" && <DirectionsWalkOutlinedIcon className="mr-2" />}
                  {item.label === "Fence" && <FenceOutlinedIcon className="mr-2" />}
                  {item.label === "Custom" && <StarPurple500OutlinedIcon className="mr-2" />}
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <div className="flex rounded-sm shadow-sm p-1 lg:py-2 lg:px-1 bg-gray-100 hover:bg-gray-200 text-gray-700 gap-1 lg:gap-2 text-xs lg:text-base items-center cursor-pointer"><CropLandscapeOutlinedIcon/>Add Shape</div>
          
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => drawingManager?.setDrawingMode(google.maps.drawing.OverlayType.POLYGON)}>
                <div className="flex gap-2 items-center">
                  <MapOutlined /> Parcel
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => drawingManager?.setDrawingMode(google.maps.drawing.OverlayType.POLYGON)}>
                <div className="flex gap-2 items-center">
                  <DonutLargeOutlined /> Pond
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => drawingManager?.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE)}>
                <div className="flex gap-2 items-center">
                  <SquareOutlined /> Rectangle
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => drawingManager?.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE)}>
                <div className="flex gap-2 items-center">
                  <CircleOutlined /> Circle
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        
            <div onClick={() => handleOpenUploadPopup()} className="flex rounded-sm shadow-sm p-1 lg:py-2 lg:px-1 bg-gray-100 hover:bg-gray-200 text-gray-700 gap-1 lg:gap-2 text-xs lg:text-base items-center cursor-pointer"><UploadFileOutlinedIcon/>Import Map</div>
          
         
        </div>

        <DrawerPublic onChange={handlePropertyLocation} latitude={latitude} longitude={longitude} />

        <div className="absolute top-[100px] lg:top-[65px] right-[10px] z-5">
          <button title="Close" onClick={() => onSave()} className="p-1 flex gap-1 h-10 w-10 justify-center items-center text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-sm">
            <CloseOutlinedIcon />
          </button>
        </div>

        <Button
          onClick={handleMapProperty}
          variant="default"
          className="absolute bottom-[90px] lg:bottom-[140px] left-4 z-5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          <AddOutlinedIcon/>Map Property
        </Button>
      
        <Button
          onClick={resetMap}
          variant="default"
          className="absolute bottom-10 lg:bottom-[90px] left-4 z-5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          <CloseOutlinedIcon/>Reset Map
        </Button>

      

      </div>
    </div>

    {!latitude && !longitude && (
      <div className="fixed inset-0 p-1 flex items-center justify-center bg-black h-screen bg-opacity-80 z-50">
        <div className="justify-center items-center dark:text-gray-300 rounded-lg p-1 lg:p-6 w-full md:max-w-3xl lg:max-w-4xl h-screen flex flex-col">
          <button title="Close" onClick={() => onSave()} className="absolute right-5 top-3 p-1 flex gap-1 items-center hover:bg-green-600 text-gray-200 rounded-sm">
            <CloseOutlinedIcon />
          </button>
          <div className="flex flex-col gap-2 text-[#30D32C] items-center">
  <DrawerPublic onChange={handlePropertyLocation} latitude={latitude} longitude={longitude} />

 <button
            onClick={() => setShowMappingInfo(!showMappingInfo)}
            className="text-green-600 underline mt-2 text-xs px-4 py-2 rounded-md hover:text-green-700 transition"
          >
           Benefits of using the Advanced Property Mapping Tool?
          </button>
   
          {showMappingInfo && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-2 z-50">
    <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white rounded-xl p-2 w-full md:max-w-3xl lg:max-w-4xl shadow-lg">
      
      {/* Close Button */}
      <div className="flex justify-end">
        <Button
        variant="outline"
          onClick={() => setShowMappingInfo(false)}
          >
          <CloseOutlinedIcon fontSize="small" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="h-[70dvh] bg-gray-50 dark:bg-[#131B1E] rounded-lg p-4">
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 text-center border-b pb-2">
        Benefits of the Advanced Property Mapping Tool
        </h3>
        
        {/* Benefits List */}
        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2 mt-3">
        <li>📍 <span className="font-medium">Draw and Highlight Property Boundaries</span> - Clearly outline property limits for buyers.</li>
      <li>📏 <span className="font-medium">Automatic Area Calculation</span> - Get instant property area in m², acres, or hectares.</li>
      <li>📌 <span className="font-medium">Place Markers for Key Facilities</span> - Identify water wells, electricity poles, boreholes, and more.</li>
      <li>🛣️ <span className="font-medium">Add Lines for Accessibility & Boundaries</span> - Display footpaths, fences, and access roads.</li>
      <li>📐 <span className="font-medium">Distance Measurement Tool</span> - Measure distances to roads, schools, shopping centers, and more.</li>
     {/* <li>🎨 <span className="font-medium">Customizable Map Features</span> - Use different colors and styles for lines, markers, and boundaries.</li>*/} 
      <li>🕵️ <span className="font-medium">Interactive Virtual Tour</span> - Buyers can explore the property layout and key facilities instantly.</li>
      <li>✅ <span className="font-medium">Improved Transparency & Trust</span> - Provides detailed property insights to build buyer confidence.</li>
      <li>🔍 <span className="font-medium">Better Property Visualization</span> - A well-mapped property attracts more potential buyers.</li>
      <li>⏳ <span className="font-medium">Time-Saving for Both Buyers & Sellers</span> - Reduces the need for repeated inquiries and site visits.</li>
      <li>🚀 <span className="font-medium">Competitive Edge Over Standard Listings</span> - Stand out with an interactive and detailed property map.</li>
      <li>🌍 <span className="font-medium">Your property, if mapped, will be included in Nearby Property Offers for customers to discover easily.</span></li>
      </ul>
    
      </ScrollArea>
    </div>
  </div>
)}





</div>
</div>
</div>
     
    )}
     
</>
);
};

export default GoogleMapping;