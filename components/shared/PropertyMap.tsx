import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { InfoWindow, OverlayView, useLoadScript } from "@react-google-maps/api";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { DrawerPublic } from "./DrawerPublic";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { AnyAaaaRecord } from "node:dns";
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';;
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import GpsFixedOutlinedIcon from '@mui/icons-material/GpsFixedOutlined';
import DirectionsOutlinedIcon from '@mui/icons-material/DirectionsOutlined';
import { Icon } from "@iconify/react";
import Barsscale from "@iconify-icons/svg-spinners/bars-scale"; 
import HorizontalCardPublic from "./HorizontalCardPublic";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getListingsNearLocation } from "@/lib/actions/dynamicAd.actions";
import { IdynamicAd } from "@/lib/database/models/dynamicAd.model";
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import { BrowserQRCodeReader } from '@zxing/browser';
const defaultcenter = {
  lat: -1.286389, // Default center (Nairobi, Kenya)
  lng: 36.817223,
};
interface Location {
  type: "Point";
  coordinates: [number, number];
}

interface Marker {
  position: google.maps.LatLngLiteral;
  label: string;
  icon: string;
}

interface Polyline {
  path: google.maps.LatLngLiteral[];
  color: string;
  width: number;
  label: string;
}

//type Shape = any;
type Shape = {
  label: string;
  path: google.maps.LatLng[]; // or any path type you are using
  type: string;  // The type of the shape (polygon, polyline, etc.)
  color: string;
  area:any;
  status:string;
 // overlay: google.maps.Polygon | google.maps.Polyline;
 // labelMarker: google.maps.Marker;
};
interface Props {
  queryObject: any;
  Parcels?: any;
  coordinates?:any;
  userName:string; 
  userImage:string;  
  onClose:() => void;
  handleAdEdit: (id:string) => void;
  handleAdView: (id:string) => void;
  handleCategory: (value:string) => void;
  handleOpenSell:() => void;
  handleOpenPlan:() => void;
  collectionType?: "Ads_Organized" | "My_Tickets" | "All_Ads";
}

const markerOptions = [
  { label: "House", icon: "/assets/map/home-2.png" },
  { label: "Apartment", icon: "/assets/map/apartment-3.png" },
  { label: "Farm Land", icon: "/assets/map/field.png" },
  { label: "Well", icon: "/assets/map/waterdrop.png" },
  { label: "Electricity", icon: "/assets/map/powerlinepole.png" },
  { label: "Fence", icon: "/assets/map/levelcrossing.png" },
  { label: "Gate", icon: "/assets/map/bock.png" },
  { label: "Tree", icon: "/assets/map/tree.png" },
  { label: "Forest", icon: "/assets/map/forest2.png" },
  { label: "Dam", icon: "/assets/map/dam.png" },
  { label: "Storage House", icon: "/assets/map/farm-2.png" },
  { label: "Tarmac Road", icon: "/assets/map/road.png" },
  { label: "Gravel Road", icon: "/assets/map/roadtype_gravel.png" },
  { label: "Police Station", icon: "/assets/map/police.png" },
];



const getParcelsFromURL = (searchParams: URLSearchParams) => {
  const parcels: any[] = [];

  searchParams.forEach((value: string, key: string) => {
    if (key.startsWith("parcel")) {
      try {
        const decoded = JSON.parse(decodeURIComponent(value));
        parcels.push(decoded);
      } catch (error) {
        console.error(`Failed to parse ${key}:`, error);
      }
    }
  });

  return parcels;
};

export default function MapDrawingTool({queryObject, Parcels, coordinates, userName, 
  userImage, handleCategory, handleOpenPlan, handleOpenSell, onClose, handleAdEdit, handleAdView}:Props) {
  const [center, setCenter] = useState<any>(defaultcenter);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const drawingManager = useRef<google.maps.drawing.DrawingManager | null>(null);
  const shapeOriginalColors = useRef<Map<any, string>>(new Map());
  const [selectedShapePosition, setSelectedShapePosition] = useState<google.maps.LatLng | null>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [shapeRefs, setShapeRefs] = useState<google.maps.Polygon[]>([]);
  const [polylines, setPolylines] = useState<Polyline[]>([]);
  const [polylineRefs, setPolylineRefs] = useState<google.maps.Polyline[]>([]);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [markerRefs, setMarkerRefs] = useState<google.maps.Marker[]>([]);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [selectedMarkerType, setSelectedMarkerType] = useState(markerOptions[0]);
  const selectedMarkerTypeRef = useRef(markerOptions[0]);
  const [selectedShape, setSelectedShape] = useState<google.maps.Polygon | google.maps.Polyline | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const shapesRef = useRef(shapes);
  const polylinesRef = useRef(polylines);
  const labelMarkersRef = useRef<any>([]);
  const [distance, setDistance] = useState<string | null>(null);
  const [showMappingInfo, setShowMappingInfo] = useState(false);
  const [uploadPopup, setUploadPopup] = useState(false);
  const allBoundsRef = useRef<google.maps.LatLngBounds | null>(null);
  const [showbuttons, setShowbuttons] = useState(false);
  const router = useRouter();
  const [isOpenP, setIsOpenP] = useState(false);
   const [selectedControlD, setSelectedControlD] = useState("none");
   const [showDistanceDialog, setShowDistanceDialog] = useState(false);
  const [openDirectionsDialog, setOpenDirectionsDialog] = useState(false);
  const [openDistanceDialog, setOpenDistanceDialog] = useState(false);
   const [loadedParcels, setLoadedParcels] = useState<any>(Parcels);
   const [selectedOption, setSelectedOption] = useState<"geojson" | "qrcode" | null>(null);
  // Sync refs when state updates
  useEffect(() => {
    shapesRef.current = shapes;
  }, [shapes]);
  
  useEffect(() => {
    polylinesRef.current = polylines;
  }, [polylines]);
  
   const { isLoaded } = useLoadScript({
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLEAPIKEY!,
      libraries: ["drawing", "geometry","places"],
    });
    
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom: 16,
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER, // Places zoom control at the bottom-right
        },
        // Move zoom and street view to LEFT_CENTER
  
        streetViewControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER,
        },
        mapTypeId: "satellite",
      });
      mapInstance.current = map;
      const sharInfoWindow = new google.maps.InfoWindow();
      const marker = new google.maps.Marker({
        position: center,
        map,
        draggable: true,
        title: "Property Location",
      });

      markerRef.current = marker;
      const manager = new google.maps.drawing.DrawingManager({
      //  drawingControl: true,
        drawingMode: null,
        drawingControl: false,    // No default mode
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.MARKER,
            google.maps.drawing.OverlayType.POLYLINE,
            google.maps.drawing.OverlayType.POLYGON,
          ],
        },
        markerOptions: {
          draggable: true,
        },
        polylineOptions: {
          strokeColor: "#FF0000",
          strokeWeight: 2,
          editable: true,
        },
        polygonOptions: {
          fillColor: "#00FF00",
          strokeColor: "#00FF00",
          fillOpacity: 0.1,
          strokeWeight: 2,
          editable: true,
        },
      });

      manager.setMap(map);
      drawingManager.current = manager;

      // Enlarge drawing control buttons
      const interval = setInterval(() => {
        const controls = document.querySelectorAll(
          '.gmnoprint[style*="margin"] button, .gm-control-active button'
        );
        if (controls.length > 0) {
          controls.forEach((btn) => {
            (btn as HTMLElement).style.fontSize = "16px";
            (btn as HTMLElement).style.padding = "8px 12px";
          });
          clearInterval(interval);
        }
      }, 500);

    
      class CustomLabel extends google.maps.OverlayView {
        div: HTMLDivElement | null = null;
      
        constructor(private position: google.maps.LatLngLiteral, private text: string) {
          super();
        }
      
        onAdd() {
          this.div = document.createElement("div");
          this.div.innerHTML = `<div style="background: black; color: white; padding: 4px 8px; border-radius: 4px;">${this.text}</div>`;
          this.getPanes()?.overlayLayer.appendChild(this.div);
        }
      
        draw() {
          if (!this.div) return;
          const projection = this.getProjection();
          const point = projection.fromLatLngToDivPixel(new google.maps.LatLng(this.position));
          if (point) {
            this.div.style.left = point.x + "px";
            this.div.style.top = point.y + "px";
            this.div.style.position = "absolute";
          }
        }
      
        onRemove() {
          this.div?.remove();
        }
      }
      google.maps.event.addListener(manager, "overlaycomplete", (event: any) => {
        if (event.type === "polygon") {
          const label = "Area";
          if (!label) {
            event.overlay.setMap(null); // Remove the shape from map if user cancels
            return;
          }
          const path = event.overlay.getPath().getArray().map((latlng: any) => ({ lat: latlng.lat(), lng: latlng.lng() }));
          const area = google.maps.geometry.spherical.computeArea(path);
          const status = "available";
          // Set both fill and stroke colors
          event.overlay.setOptions({
           fillColor: "#00FF00",
           strokeColor: "#00FF00",
          });
    // --- Add this block to calculate the polygon center and add a label badge ---
    const bounds = new google.maps.LatLngBounds();
    path.forEach((coord: any) => bounds.extend(coord));
    const center = bounds.getCenter();
  
  

          shapeOriginalColors.current.set(event.overlay, "#00FF00");
          const perimeter = google.maps.geometry.spherical.computeLength(path);
          const areaSqM = google.maps.geometry.spherical.computeArea(path);
          const areaHa = areaSqM / 10000;
          const areaAcres = areaSqM / 4046.85642;
        
          const readablePerimeter = perimeter > 1000
            ? `${(perimeter / 1000).toFixed(2)} km`
            : `${perimeter.toFixed(0)} m`;
        
        const labelOverlay = new CustomLabel( {
          lat: center.lat(),
          lng: center.lng()
        }, `
  <div style=" background-color: rgba(0, 0, 0, 0.3);
      padding: 6px 10px;
      color: white;
      font-size: 10px;
      border-radius: 4px;
     
      position: absolute;
      transform: translate(-50%, -50%);
      white-space: nowrap;">
                  <div><strong>Perimeter:</strong> ${readablePerimeter}</div>
                      <div style="display: flex; gap: 4px; align-items: center;">
  <strong>Area:</strong>
  <div>${areaSqM.toFixed(0)} m²</div>
  
  <div>${areaHa.toFixed(2)} ha</div>
  
  <div>${areaAcres.toFixed(2)} acres</div>
</div>
  </div>
`);
labelOverlay.setMap(mapInstance.current!);
labelMarkersRef.current.push(labelOverlay);

          let infoWindowTimeout: NodeJS.Timeout;
          
          event.overlay.addListener("click", (e: google.maps.MapMouseEvent) => {
            sharInfoWindow.close(); // <-- Close existing one
            const path = event.overlay.getPath();
            const matchedShape = shapesRef.current.find((s) =>
              s.path.length === path.getLength() &&
              s.path.every((pt: any, idx: number) => {
                const shapePt = path.getAt(idx);
                return pt.lat === shapePt.lat() && pt.lng === shapePt.lng();
              })
            );
          
            const currentLabel = matchedShape?.label || 'Field';
            const perimeter = google.maps.geometry.spherical.computeLength(path);
            const areaSqM = google.maps.geometry.spherical.computeArea(path);
            const areaHa = areaSqM / 10000;
            const areaAcres = areaSqM / 4046.85642;
          
            const readablePerimeter = perimeter > 1000
              ? `${(perimeter / 1000).toFixed(2)} km`
              : `${perimeter.toFixed(0)} m`;
          
              sharInfoWindow.setContent(`
                <div style="font-size: 13px;">
                  <div><strong>Label:</strong> ${currentLabel}</div>
                  <div><strong>Perimeter:</strong> ${readablePerimeter}</div>
                  <div><strong>Area:</strong>
                    <div>${areaSqM.toFixed(0)} m²</div>
                    <div>${areaHa.toFixed(2)} ha</div>
                    <div>${areaAcres.toFixed(2)} acres</div>
                  </div>
                </div>
              `
            );
            sharInfoWindow.setPosition(e.latLng!);
            sharInfoWindow.open(mapInstance.current!);
            //sharedInfoWindow.open(mapInstance.current!);
          });
             
      
       
         // setShapes((prev) => [...prev, { label, path, type: event.type, color: "#00FF00", area, status, overlay: event.overlay, labelMarker }]);
          setShapes((prev) => [...prev, { label, path, type: event.type, color: "#00FF00", area, status }]);
          setShapeRefs((prev) => [...prev, event.overlay]);
        }
      });
    //});

  }, [isLoaded]);
useEffect(() => {
    if (!drawingManager.current) return;
    const modeMap:any = {
      none: null,
      marker: google.maps.drawing.OverlayType.MARKER,
      polyline: google.maps.drawing.OverlayType.POLYLINE,
      polygon: google.maps.drawing.OverlayType.POLYGON,
    };
    drawingManager.current.setDrawingMode(modeMap[selectedControlD]);
  }, [selectedControlD]);

  const handleShapeClick = (shape: google.maps.Polygon | google.maps.Polyline, label: string = "") => {
    if (selectedShape === shape) {
      const originalColor = shapeOriginalColors.current.get(shape);
      if (shape instanceof google.maps.Polygon) shape.setOptions({ fillColor: originalColor });
      if (shape instanceof google.maps.Polyline) shape.setOptions({ strokeColor: originalColor });
      setSelectedShape(null);
      setSelectedColor(null);
      setSelectedLabel("");
      setSelectedShapePosition(null); // clear popup position on deselect

    } else {
      if (selectedShape) {
        const originalColor = shapeOriginalColors.current.get(selectedShape);
        if (selectedShape instanceof google.maps.Polygon) selectedShape.setOptions({ fillColor: originalColor });
        if (selectedShape instanceof google.maps.Polyline) selectedShape.setOptions({ strokeColor: originalColor });
      }
      const currentColor = shape instanceof google.maps.Polygon
        ? shape.get("fillColor")
        : shape.get("strokeColor");

      setSelectedShape(shape);
      setSelectedColor(currentColor);
      setSelectedLabel(label);
      let latLng;

      if (shape instanceof google.maps.Polygon || shape instanceof google.maps.Polyline) {
        const path = shape.getPath().getArray();
        const bounds = new google.maps.LatLngBounds();
        path.forEach((p) => bounds.extend(p));
        latLng = bounds.getCenter();
      }
 
    if (latLng) {
      setSelectedShapePosition(latLng);
    } else {
      setSelectedShapePosition(null);
    }
    }
 
  };

 
  

  type AmenityType = "school" | "hospital" | "shopping_mall" | "restaurant" | "bank" | "transit_station"; // Add more as needed
 
 
 
  const [amenityMarkers, setAmenityMarkers] = useState<google.maps.Marker[]>([]);
  const [loadingAmenity, setLoadingAmenity] = useState<AmenityType | null>(null);
  const [activeAmenity, setActiveAmenity] = useState<AmenityType | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
const [selectedControl, setSelectedControl] = useState<"amenity" | "route" | "userRoute" | "polygon" | null>(null);
const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
const [amenityCount, setAmenityCount] = useState<number | null>(null);
const radiusCircleRef = useRef<google.maps.Circle | null>(null);
const [radius, setRadius] = useState(2000); // default 2km
const amenityMarkersRef = useRef<google.maps.Marker[]>([]);
const amenityCirclesRef = useRef<google.maps.Circle[]>([]);
const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
const radiusRef = useRef<NodeJS.Timeout | null>(null);
const handleShowAmenity = (amenityType: AmenityType) => {
  if (!mapInstance.current) return;

  setLoadingAmenity(amenityType);
  setActiveAmenity(amenityType);
 setShowDistanceDialog(false);
    setOpenDistanceDialog(false);
    setOpenDirectionsDialog(false);
  // Clear previous markers and circle
  amenityMarkers.forEach(marker => marker.setMap(null));
  setAmenityMarkers([]);
  if (radiusCircleRef.current) {
    radiusCircleRef.current.setMap(null);
  }
  // Clear previous direction if any
  if (directionsRendererRef.current) {
    directionsRendererRef.current.setMap(null);
  }
  
  // Draw radius circle
  const circle = new google.maps.Circle({
    map: mapInstance.current,
    center,
    radius,
    fillColor: "#00AAFF",
    fillOpacity: 0.2,
    strokeColor: "#007BFF",
    strokeOpacity: 0.7,
    strokeWeight: 1,
  });

  radiusCircleRef.current = circle;
  amenityCirclesRef.current.push(circle);
  // Fit map to bounds of the circle
  const bounds = circle.getBounds();
  if (bounds) {
    mapInstance.current.fitBounds(bounds);
  }
  const service = new google.maps.places.PlacesService(mapInstance.current);

  const request: google.maps.places.PlaceSearchRequest = {
    location: center,
    radius,
    type: amenityType,
  };

  const getAmenityIcon = (type: AmenityType): string => {
    switch (type) {
      case "school": return "/assets/map/school.png";
      case "hospital": return "/assets/map/hospital-building.png";
      case "shopping_mall": return "/assets/map/mall.png";
      case "restaurant": return "/assets/map/restaurant.png";
      case "bank": return "/assets/map/bank_euro.png";
      case "transit_station": return "/assets/map/busstop.png";
      default: return "/assets/map/default.png";
    }
  };

  service.nearbySearch(request, (results, status) => {
    setLoadingAmenity(null);

    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      const newMarkers = results.map(place => {
        if (!place.geometry?.location) return null;

        const marker = new google.maps.Marker({
          map: mapInstance.current!,
          position: place.geometry.location,
          title: place.name,
          icon: {
            url: getAmenityIcon(amenityType),
            scaledSize: new google.maps.Size(30, 30),
          },
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<strong>${place.name}</strong><br>${place.vicinity || ""}`,
        });

        marker.addListener("click", () => {
          infoWindow.open({
            anchor: marker,
            map: mapInstance.current!,
          });
        });
        amenityMarkersRef.current.push(marker);
        return marker;
      }).filter(Boolean) as google.maps.Marker[];

      setAmenityMarkers(newMarkers);

      // Show number of amenities found
      setAmenityCount(results.length);
    } else {
      console.warn("Places request failed:", status);
      setAmenityCount(0);
    }
  });
};


useEffect(() => {
  if (!activeAmenity) return;

  // Clear any ongoing timeout
  if (radiusRef.current) {
    clearTimeout(radiusRef.current);
  }

  // Debounce radius change
  radiusRef.current = setTimeout(() => {
    handleShowAmenity(activeAmenity);

  }, 500); // Adjust delay as needed
}, [radius]);

const handleRoute = () => {
  if (!mapInstance.current) return;
  const map = mapInstance.current;
 
    if (map) {
      // Move the center and zoom
      map.setCenter(center);
      map.setZoom(18);
      // Move the existing marker if it exists
      if (markerRef.current) {
        markerRef.current.setPosition(center);
      } 
    }
    if (mapInstance.current && allBoundsRef.current && !allBoundsRef.current.isEmpty()) {
      mapInstance.current.fitBounds(allBoundsRef.current);
    }
  // Clear any existing route before creating a new one
  if (directionsRendererRef.current) {
    directionsRendererRef.current.setMap(null);
  }
// ✅ Clear previous amenity markers and circles
amenityMarkersRef.current.forEach(marker => marker.setMap(null));
amenityMarkersRef.current = [];

amenityCirclesRef.current.forEach(circle => circle.setMap(null));
amenityCirclesRef.current = [];
}

useEffect(() => {
  if (!mapInstance.current) return;

  const listener = mapInstance.current.addListener("click", (e: google.maps.MapMouseEvent) => {
    if (selectedControl !== "route" || !e.latLng) return;

    const directionsService = new google.maps.DirectionsService();
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
    }
    // Clear any existing route before creating a new one
    const newRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: false,
      map: mapInstance.current,
    });

    directionsRendererRef.current = newRenderer;

    directionsService.route(
      {
        origin: e.latLng,
        destination: center,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          newRenderer.setDirections(result);

          const route = result.routes[0];
          const distanceInMeters = route.legs[0].distance?.value || 0;
          const distanceInKm = (distanceInMeters / 1000).toFixed(2);

          setDistance(distanceInKm);
          console.log(`Distance: ${distanceInKm} km`);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  });

  return () => {
    google.maps.event.removeListener(listener);
  };
}, [selectedControl, center]);

const handleRouteFromUser = () => {
  if (!navigator.geolocation || !mapInstance.current) {
    alert("Geolocation is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // Clear previous direction if any
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
      }
 // ✅ Clear previous amenity markers and circles
 amenityMarkersRef.current.forEach(marker => marker.setMap(null));
 amenityMarkersRef.current = [];

 amenityCirclesRef.current.forEach(circle => circle.setMap(null));
 amenityCirclesRef.current = [];
      const directionsService = new google.maps.DirectionsService();
      const newRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        map: mapInstance.current,
      });

      directionsRendererRef.current = newRenderer;

      directionsService.route(
        {
          origin: userLocation,
          destination: center,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            newRenderer.setDirections(result);

            const route = result.routes[0];
            const distanceInMeters = route.legs[0].distance?.value || 0;
            const distanceInKm = (distanceInMeters / 1000).toFixed(2);
            setDistance(distanceInKm);
            console.log(`Distance from user: ${distanceInKm} km`);
          } else {
            console.error("Directions request failed:", status);
          }
        }
      );
    },
    (error) => {
      console.error("Geolocation error:", error);
      alert("Failed to get current location.");
    },
    { enableHighAccuracy: true }
  );
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


 const observer = useRef<IntersectionObserver | null>(null);
 const [NewqueryObject, setNewqueryObject] = useState<any>(queryObject);
  const [newpage, setnewpage] = useState(false);
    const [data, setAds] = useState<IdynamicAd[]>([]); // Initialize with an empty array
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const isAdCreator=false;
    const userId="";
const handlePostLocation = (lat: string,lng:string) => {
  setNewqueryObject({
    ...queryObject, // Preserve existing properties
    location: lat+"/"+lng,
  });
  setAds([]);
  };
 const fetchAds = async () => {
    setLoading(true);
    try {
      const Ads = await getListingsNearLocation({
        queryObject: NewqueryObject,
        page,
        limit: 20,
      });

      if (newpage) {
        setnewpage(false);
        setAds((prevAds: IdynamicAd[]) => {
          const existingAdIds = new Set(prevAds.map((ad) => ad._id));

          // Filter out ads that are already in prevAds
          const newAds = Ads?.data.filter(
            (ad: IdynamicAd) => !existingAdIds.has(ad._id)
          );

          return [...prevAds, ...newAds]; // Return updated ads
        });
      } else {
        setnewpage(false);
        setAds(Ads?.data);
      }

      setTotalPages(Ads?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching ads", error);
    } finally {
      setLoading(false);
    //  setIsOpenP(false);
     // setIsInitialLoading(false);
    }
  };
useEffect(() => {
    if (!newpage) {
      setPage(1);
    }
    fetchAds();
  }, [page, NewqueryObject]);
  const lastAdRef = (node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page < totalPages) {
        setnewpage(true);
        setPage((prevPage: any) => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  };


  const handlePropertyLocation = (lat: string | number, lng: string | number) => {
    if (!mapRef.current || !lat || !lng) return;
  
    const latitude = Number(lat);
    const longitude = Number(lng);
    setCenter({ lat: latitude, lng: longitude });
    setLatitude(latitude.toString());
    setLongitude(longitude.toString());
    handlePostLocation(latitude.toString(),longitude.toString());
    const map = mapInstance.current;
    const position = { lat: latitude, lng: longitude };
  
    if (map) {
      // Move the center and zoom
      map.setCenter(position);
      map.setZoom(18);
      // Move the existing marker if it exists
      if (markerRef.current) {
        markerRef.current.setPosition(position);
      } 
    }
  };
  

  const deleteAll = () => {
    shapeRefs.forEach((sh) => {
      sh.setMap(null);
      shapeOriginalColors.current.delete(sh);
    });
  
    // Remove all label overlays
    labelMarkersRef.current.forEach((label:any) => {
      label.setMap(null);
    });
  
    labelMarkersRef.current = [];
  
    setShapeRefs([]);
    setShapes([]);
  };
  const handleOpenUploadPopup = () => {
    setLatitude(defaultcenter.lat.toString());
    setLongitude(defaultcenter.lng.toString());
    setUploadPopup(true);
  };

 useEffect(() => {
 
  if (!mapInstance.current || loadedParcels.length === 0) return;
 
  const interval = setInterval(() => {
    if (mapInstance.current && window.google) {
      clearInterval(interval);

      let centerSet = false;

      loadedParcels.forEach((parcel: any, index: number) => {
        const latLngPairs: { lat: number; lng: number }[] = [];
        const bounds = new google.maps.LatLngBounds();

        parcel[0].forEach(([lng, lat]: [number, number], i: number) => {
          const coord = { lat, lng };
          latLngPairs.push(coord);
          bounds.extend(new google.maps.LatLng(lat, lng));

          // Set center for the first point of the first parcel only
          if (!centerSet && index === 0 && i === 0) {
            setCenter(coord);
            setLatitude(lat.toString());
            setLongitude(lng.toString());
            handlePostLocation(lat.toString(), lng.toString());

            const map = mapInstance.current;
            if (map) {
              map.setCenter(coord);
              map.setZoom(18);
              if (markerRef.current) {
                markerRef.current.setPosition(coord);
              }
            }

            centerSet = true;
          }
        });

        if (latLngPairs.length > 2) {
          const map = mapInstance.current;

          class CustomLabel extends google.maps.OverlayView {
            div: HTMLDivElement | null = null;

            constructor(private position: google.maps.LatLngLiteral, private text: string) {
              super();
            }

            onAdd() {
              this.div = document.createElement("div");
              this.div.innerHTML = `<div style="background: black; color: white; padding: 4px 8px; border-radius: 4px;">${this.text}</div>`;
              this.getPanes()?.overlayLayer.appendChild(this.div);
            }

            draw() {
              if (!this.div) return;
              const projection = this.getProjection();
              const point = projection.fromLatLngToDivPixel(new google.maps.LatLng(this.position));
              if (point) {
                this.div.style.left = `${point.x}px`;
                this.div.style.top = `${point.y}px`;
                this.div.style.position = "absolute";
              }
            }

            onRemove() {
              this.div?.remove();
            }
          }

          const polygon = new google.maps.Polygon({
            paths: latLngPairs,
            strokeColor: "#00FF00",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#00FF00",
            fillOpacity: 0.1,
          });

          polygon.setMap(map);

          // Add label
          const center = bounds.getCenter();

          shapeOriginalColors.current.set(polygon, "#00FF00");

          const path = polygon.getPath().getArray().map((latlng: any) => ({
            lat: latlng.lat(),
            lng: latlng.lng(),
          }));
          const perimeter = google.maps.geometry.spherical.computeLength(path);
          const areaSqM = google.maps.geometry.spherical.computeArea(path);
          const areaHa = areaSqM / 10000;
          const areaAcres = areaSqM / 4046.85642;

          const readablePerimeter =
            perimeter > 1000
              ? `${(perimeter / 1000).toFixed(2)} km`
              : `${perimeter.toFixed(0)} m`;
const centerLatLngLiteral = {
  lat: center.lat(),
  lng: center.lng(),
};
          const labelOverlay = new CustomLabel(centerLatLngLiteral, `
            <div style="background-color: rgba(0, 0, 0, 0.3);
                        padding: 6px 10px;
                        color: white;
                        font-size: 10px;
                        border-radius: 4px;
                        position: absolute;
                        transform: translate(-50%, -50%);
                        white-space: nowrap;">
              <div><strong>Perimeter:</strong> ${readablePerimeter}</div>
              <div style="display:flex; gap:6px;">
                <strong>Area:</strong>
                <div>${areaSqM.toFixed(0)} m²</div>
                <div>${areaHa.toFixed(2)} ha</div>
                <div>${areaAcres.toFixed(2)} acres</div>
              </div>
            </div>
          `);

          labelOverlay.setMap(map);
          labelMarkersRef.current.push(labelOverlay);
          setShapeRefs((prev) => [...prev, polygon]);

          if (map) {
            map.fitBounds(bounds);
            google.maps.event.addListenerOnce(map, "bounds_changed", () => {
              map.setZoom(18);
            });
          }
        }
      });
    }
  }, 200);

  return () => clearInterval(interval);
}, [loadedParcels, mapInstance.current]);

  
    
const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!mapInstance.current) return;
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
        
          const label = feature.properties?.name || "Land";
          const status = "available";
          const color = "#00FF00";
      
          return {
            type,
            coordinates,
            label,
            area,
            color,
            status,
          };
        }).filter(Boolean); // Remove nulls
  
        // Update state
        setShapes((prev) => [...prev, ...newShapes]);
        setShapeRefs((prev) => [...prev, newShapes]);
        const sharInfoWindow = new google.maps.InfoWindow();
          
      class CustomLabel extends google.maps.OverlayView {
        div: HTMLDivElement | null = null;
      
        constructor(private position: google.maps.LatLngLiteral, private text: string) {
          super();
        }
      
        onAdd() {
          this.div = document.createElement("div");
          this.div.innerHTML = `<div style="background: black; color: white; padding: 4px 8px; border-radius: 4px;">${this.text}</div>`;
          this.getPanes()?.overlayLayer.appendChild(this.div);
        }
      
        draw() {
          if (!this.div) return;
          const projection = this.getProjection();
          const point = projection.fromLatLngToDivPixel(new google.maps.LatLng(this.position));
          if (point) {
            this.div.style.left = point.x + "px";
            this.div.style.top = point.y + "px";
            this.div.style.position = "absolute";
          }
        }
      
        onRemove() {
          this.div?.remove();
        }
      }
        // Draw on map
        newShapes.forEach((shapeData: any) => {
      
          if (shapeData.type === "polygon") {
            const polyshape = new google.maps.Polygon({
              paths: shapeData.coordinates,
              strokeColor: shapeData.color,
              strokeWeight: 2,
              fillColor: shapeData.color,
              fillOpacity: 0.1,
              map: mapInstance.current,
            });
            shapeOriginalColors.current.set(polyshape, shapeData.color);
      
          // Add label marker
          const bounds = new google.maps.LatLngBounds();
          shapeData.coordinates.forEach((coord:any) => bounds.extend(coord));
          const center = bounds.getCenter();
      
          
          shapeOriginalColors.current.set(polyshape, "#00FF00");
          const path = polyshape.getPath().getArray().map((latlng: any) => ({ lat: latlng.lat(), lng: latlng.lng() }));
          const perimeter = google.maps.geometry.spherical.computeLength(path);
          const areaSqM = google.maps.geometry.spherical.computeArea(path);
          const areaHa = areaSqM / 10000;
          const areaAcres = areaSqM / 4046.85642;
        
          const readablePerimeter = perimeter > 1000
            ? `${(perimeter / 1000).toFixed(2)} km`
            : `${perimeter.toFixed(0)} m`;
        
        const labelOverlay = new CustomLabel( {
          lat: center.lat(),
          lng: center.lng()
        }, `
  <div style=" background-color: rgba(0, 0, 0, 0.3);
      padding: 6px 10px;
      color: white;
      font-size: 10px;
      border-radius: 4px;
     
      position: absolute;
      transform: translate(-50%, -50%);
      white-space: nowrap;">
                  <div><strong>Perimeter:</strong> ${readablePerimeter}</div>
                  <div className="flex w-full items-center gap-x-2">
  <strong>Area:</strong>
  <div>${areaSqM.toFixed(0)} m²</div>
 
  <div>${areaHa.toFixed(2)} ha</div>

  <div>${areaAcres.toFixed(2)} acres</div>
</div>
</div>
  </div>
`);
labelOverlay.setMap(mapInstance.current!);
labelMarkersRef.current.push(labelOverlay);

          let infoWindowTimeout: NodeJS.Timeout;
          
          polyshape.addListener("click", (e: google.maps.MapMouseEvent) => {
            sharInfoWindow.close(); // <-- Close existing one
            const path = polyshape.getPath();
            const matchedShape = shapesRef.current.find((s) =>
              s.path.length === path.getLength() &&
              s.path.every((pt: any, idx: number) => {
                const shapePt = path.getAt(idx);
                return pt.lat === shapePt.lat() && pt.lng === shapePt.lng();
              })
            );
          
            const currentLabel = matchedShape?.label || 'Field';
            const perimeter = google.maps.geometry.spherical.computeLength(path);
            const areaSqM = google.maps.geometry.spherical.computeArea(path);
            const areaHa = areaSqM / 10000;
            const areaAcres = areaSqM / 4046.85642;
          
            const readablePerimeter = perimeter > 1000
              ? `${(perimeter / 1000).toFixed(2)} km`
              : `${perimeter.toFixed(0)} m`;
          
              sharInfoWindow.setContent(`
                <div style="font-size: 10px;">
                  <div><strong>Label:</strong> ${currentLabel}</div>
                  <div><strong>Perimeter:</strong> ${readablePerimeter}</div>
                       <div style="display: flex; gap: 4px; align-items: center;">
  <strong>Area:</strong>
  <div>${areaSqM.toFixed(0)} m²</div>
  <span>|</span>
  <div>${areaHa.toFixed(2)} ha</div>
  <span>|</span>
  <div>${areaAcres.toFixed(2)} acres</div>
</div>
                  </div>
                </div>
              `
            );
            sharInfoWindow.setPosition(e.latLng!);
            sharInfoWindow.open(mapInstance.current!);
            //sharedInfoWindow.open(mapInstance.current!);
          });
             
        

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
                handlePostLocation(coord.lat.toString(),coord.lng.toString());
                const map = mapInstance.current;
                const position = { lat: coord.lat, lng: coord.lng };
              
                if (map) {
                  // Move the center and zoom
                  map.setCenter(position);
                  map.setZoom(18);
                  // Move the existing marker if it exists
                  if (markerRef.current) {
                    markerRef.current.setPosition(position);
                  } 
                }
                centerSet = true;
              }
              bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
            });
          }
        });
        setUploadPopup(false);
        if (mapInstance.current) {
          mapInstance.current.fitBounds(bounds);
        
          google.maps.event.addListenerOnce(mapInstance.current, "bounds_changed", () => {
            if (mapInstance.current) {
          
           // mapInstance.current.setZoom(18);
              
            }
          });
        }
        
  
      } catch (error) {
        console.error("GeoJSON parse error:", error);
      }
    };
  
    reader.readAsText(file);
  };
const handleDistance = (lat:number, lng:number) => {
 if (selectedControl !== "route" || !lat || !lng) return;

    const directionsService = new google.maps.DirectionsService();
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
    }
    // Clear any existing route before creating a new one
    const newRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: false,
      map: mapInstance.current,
    });

    directionsRendererRef.current = newRenderer;

    directionsService.route(
      {
        origin: {lat, lng},
        destination: center,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          newRenderer.setDirections(result);

          const route = result.routes[0];
          const distanceInMeters = route.legs[0].distance?.value || 0;
          const distanceInKm = (distanceInMeters / 1000).toFixed(2);

          setDistance(distanceInKm);
          console.log(`Distance: ${distanceInKm} km`);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  
  }



const [step, setStep] = useState<"options" | "addressInput">("options");

   const [destination, setDestination] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
   const [error, setError] = useState("");
  const [centerSource, setCenterSource] = useState<{lat:number, lng:number}>({lat:0, lng:0});
  const handleSelectOption = (option: "map" | "address") => {
    if (option === "map") {
      setShowDistanceDialog(false);
      // Trigger map tap mode here
    } else if (option === "address") {
      setStep("addressInput");
    }
  };

  const handleSearch = () => {
    // Trigger search logic here with `searchQuery`
     setError("")
    if(centerSource.lat && centerSource.lng){
    handleDistance(centerSource.lat, centerSource.lng);
    setStep("options");
    setShowDistanceDialog(false);
    }else{
     setError("Select location")
    }
  };
const handleSelect = (e: any) => {
    geocodeByAddress(e.value.description)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setCenterSource({ lat, lng })
      });
  };
   const handleRedirect = () => {
    const googleMapsUrl = destination;
    window.open(googleMapsUrl, "_blank");
   setOpenDirectionsDialog(false);
  };
 const [openTooltip, setopenTooltip] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

const handleUploadQRCode = async (file: File) => {
    if (!mapInstance.current) return;
  try {
    const reader = new FileReader();
    reader.onload = async () => {
      const imageDataUrl = reader.result as string;

      // Decode QR code from image
      const codeReader = new BrowserQRCodeReader();
      const result:any = await codeReader.decodeFromImageUrl(imageDataUrl);

      if (result?.text) {
        const url = new URL(result.text);
        const searchParams = url.searchParams;
        const parcels = getParcelsFromURL(searchParams);

        console.log('Decoded parcels:', parcels);
        setLoadedParcels(parcels); // Or however you display/map them
        setUploadPopup(false); // Close popup if needed
      } else {
        alert('No QR code found.');
      }
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error('Error reading QR code:', error);
    alert('Failed to read QR code.');
  }
};
useEffect(() => {
    if (!coordinates) return;
    const interval = setInterval(() => {
      if (mapInstance.current && window.google) {
        clearInterval(interval);
  
        const coordsArray = coordinates.split(',').map(Number);
        const latLngPairs = [];
        let centerSet = false;
        const bounds = new google.maps.LatLngBounds();
        for (let i = 0; i < coordsArray.length - 1; i += 2) {
          const lng = coordsArray[i];
          const lat = coordsArray[i + 1];
  
          if (!centerSet) {
            setCenter({ lat, lng });
            setLatitude(lat.toString());
            setLongitude(lng.toString());
            handlePostLocation(lat.toString(), lng.toString());
  
            const map = mapInstance.current;
            const position = { lat, lng };
            if (map) {
              map.setCenter(position);
              map.setZoom(18);
              if (markerRef.current) {
                markerRef.current.setPosition(position);
              }
            }
            centerSet = true;
          }
  
          latLngPairs.push({ lat, lng });
          bounds.extend(new google.maps.LatLng(lat, lng));
        }
  
        if (latLngPairs.length > 2) {
          const map = mapInstance.current;
  
          // Optional: clear existing polygon if needed
          class CustomLabel extends google.maps.OverlayView {
            div: HTMLDivElement | null = null;
          
            constructor(private position: google.maps.LatLngLiteral, private text: string) {
              super();
            }
          
            onAdd() {
              this.div = document.createElement("div");
              this.div.innerHTML = `<div style="background: black; color: white; padding: 4px 8px; border-radius: 4px;">${this.text}</div>`;
              this.getPanes()?.overlayLayer.appendChild(this.div);
            }
          
            draw() {
              if (!this.div) return;
              const projection = this.getProjection();
              const point = projection.fromLatLngToDivPixel(new google.maps.LatLng(this.position));
              if (point) {
                this.div.style.left = point.x + "px";
                this.div.style.top = point.y + "px";
                this.div.style.position = "absolute";
              }
            }
          
            onRemove() {
              this.div?.remove();
            }
          }
  
          const polygon = new window.google.maps.Polygon({
            paths: latLngPairs,
            strokeColor: "#00FF00",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#00FF00",
            fillOpacity: 0.1,
          });
  
          polygon.setMap(map);
         
          // Add label marker
          const bounds = new google.maps.LatLngBounds();
          latLngPairs.forEach((coord:any) => bounds.extend(coord));
          const center = bounds.getCenter();
      
          
          shapeOriginalColors.current.set(polygon, "#00FF00");
          const path = polygon.getPath().getArray().map((latlng: any) => ({ lat: latlng.lat(), lng: latlng.lng() }));
          const perimeter = google.maps.geometry.spherical.computeLength(path);
          const areaSqM = google.maps.geometry.spherical.computeArea(path);
          const areaHa = areaSqM / 10000;
          const areaAcres = areaSqM / 4046.85642;
        
          const readablePerimeter = perimeter > 1000
            ? `${(perimeter / 1000).toFixed(2)} km`
            : `${perimeter.toFixed(0)} m`;
        
        const labelOverlay = new CustomLabel( {
          lat: center.lat(),
          lng: center.lng()
        }, `
  <div style=" background-color: rgba(0, 0, 0, 0.3);
      padding: 6px 10px;
      color: white;
      font-size: 10px;
      border-radius: 4px;
     
      position: absolute;
      transform: translate(-50%, -50%);
      white-space: nowrap;">
                  <div><strong>Perimeter:</strong> ${readablePerimeter}</div>
                  <div className="flex w-full items-center gap-x-2">
  <strong>Area:</strong>
  <div>${areaSqM.toFixed(0)} m²</div>
 
  <div>${areaHa.toFixed(2)} ha</div>

  <div>${areaAcres.toFixed(2)} acres</div>
</div>
</div>
  </div>
`);
labelOverlay.setMap(mapInstance.current!);
labelMarkersRef.current.push(labelOverlay);
if (mapInstance.current) {
   mapInstance.current.fitBounds(bounds);
 
   google.maps.event.addListenerOnce(mapInstance.current, "bounds_changed", () => {
     if (mapInstance.current) {
   
     mapInstance.current.setZoom(18);
       
     }
   });
 }
          // Store reference globally to clear later if needed
         // setShapes((prev) => [...prev, ...polygon]);
          setShapeRefs((prev) => [...prev, polygon]);
        }
  
      }
    }, 200);
  
    return () => clearInterval(interval);
  }, [coordinates, mapInstance.current]);


  return ( 
<div className="flex w-full h-[100vh] relative">
{!isLoaded && (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-800" />
      <span className="ml-2 text-gray-700 font-medium">Loading map...</span>
    </div>
  )}
    {/* Sidebar with Toggle Button */}
  
<div
  className={`bg-white h-[100dvh] shadow-lg transition-transform duration-300 ease-in-out fixed md:relative ${
    showSidebar ? "w-full md:w-1/3 p-1" : "-translate-x-full md:w-0 md:translate-x-0"
  }`}
>
  <Button onClick={() => setShowSidebar(!showSidebar)} className="mb-4 md:hidden">
    {showSidebar ? "Hide" : "Show"} Sidebar
  </Button>

  {showSidebar && (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center w-full">
        <p className="p-1">Properties Nearby</p>

        <SignedIn>
          <Button
            onClick={handleOpenSell}
            variant="outline"
            className="flex items-center gap-2"
          >
            <AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL PROPERTY
          </Button>
        </SignedIn>

        <SignedOut>
          <Button
            onClick={() => {
              setIsOpenP(true);
              router.push("/sign-in");
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL PROPERTY
          </Button>
        </SignedOut>
      </div>

      {data.length > 0 ? (
        <ScrollArea className="h-[90vh] overflow-y-auto flex p-0 bg-white rounded-lg">
          <ul className="w-full h-full">
            {data.map((ad: any, index: number) => {
              const isLastAd = index === data.length - 1;

              return (
                <div
                  key={ad._id}
                  ref={isLastAd ? lastAdRef : null}
                  className="flex justify-center"
                >
                  <HorizontalCardPublic
                    ad={ad}
                    userId={userId}
                    isAdCreator={isAdCreator}
                    handleAdView={handleAdView}
                    handleAdEdit={handleAdEdit}
                    handleOpenPlan={handleOpenPlan} 
                    userName={userName} 
                    userImage={userImage}                  />
                </div>
              );
            })}
          </ul>
        </ScrollArea>
      ) : loading === false ? (
        <div className="flex items-center wrapper min-h-[200px] w-full flex-col gap-1 rounded-[14px] bg-grey-50 py-28 text-center">
          <h3 className="font-bold text-[16px] lg:text-[25px]">Not Found</h3>
          <p className="text-sm lg:p-regular-14">No nearby properties found.</p>

          <SignedIn>
            <Button
              onClick={handleOpenSell}
              variant="default"
              className="flex items-center gap-2"
            >
              <AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL PROPERTY
            </Button>
          </SignedIn>

          <SignedOut>
            <Button
              onClick={() => {
                setIsOpenP(true);
                router.push("/sign-in");
              }}
              variant="default"
              className="flex items-center gap-2"
            >
              <AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL PROPERTY
            </Button>
          </SignedOut>
        </div>
      ) : null}

      {loading && (
        <div className="w-full mt-10 h-full flex flex-col items-center justify-center">
          <Image
            src="/assets/icons/loading2.gif"
            alt="loading"
            width={40}
            height={40}
            unoptimized
          />
        </div>
      )}
    </div>
  )}
</div>
 {/* Map Section with Toggle Button */}
 <div id="map-container" className={`w-full mt-0 lg:mt-0 relative transition-all duration-300 h-[100vh] ${
  showSidebar ? "hidden md:block" : "block"
}`}>


    <Button
            onClick={() => setShowSidebar(!showSidebar)}
            className="absolute bottom-10 lg:bottom-[90px] left-2 z-20 md:block bg-white text-gray-700 shadow-lg hover:text-white"
          >
           {showSidebar ? (<><KeyboardArrowLeftOutlinedIcon/> <div className="hidden lg:inline">Hide Nearby Properties</div></>) : (<><KeyboardArrowRightOutlinedIcon/> <div className="hidden lg:inline">Show Nearby Properties</div></>)} 
          </Button>
    {showGuide && (
        <div className="absolute z-50 top-10 left-2  mt-2 w-80 bg-gray-100 rounded-lg shadow-md text-gray-700 p-3">
         <div className="flex justify-end p-1 items-center w-full">
          <Button
            onClick={() => setShowGuide(false)}
             variant="outline"
            className="p-2 text-gray-600 hover:text-green-600"
          >
            <CloseOutlinedIcon />
          </Button>
          </div>
          <ul className="list-disc text-xs list-inside space-y-1">
          
           <li>📏 <span className="font-medium">Property Land Size</span> - Click the drawn area to view estimate area in square meters (m²), acres, or hectares.</li>
                 <li>📍 <span className="font-medium">Calculate Distance</span> - Find distance from key places like your workplace or shopping centers.</li>
                 <li>🛣️ <span className="font-medium">Find the Nearest Route</span> - Get directions from your location to the property.</li>
                 <li>👥 <span className="font-medium">Analyze Population</span> - View demographic insights of the property&apos;s surroundings.</li>
                 <li>🚗 <span className="font-medium">Check Road Accessibility</span> - See the distance to the nearest tarmac road.</li>
                 <li>🚏 <span className="font-medium">Locate Public Transport</span> -  Find the closest bus station and distance.</li>
                 <li>🏫 <span className="font-medium">Nearby Schools</span> - View the number of schools around.</li>
                 <li>🏥 <span className="font-medium">Healthcare Facilities</span> -  Check hospitals and clinics in the area.</li>
                 <li>🛍️ <span className="font-medium">Shopping Options</span> - See available shopping malls nearby.</li>
                 <li>⏳ <span className="font-medium">Saves Time for Both Buyers & Sellers</span> - Only visit the site after you&apos;re satisfied with the property&apos;s location.</li>
           
           
          </ul>
         
      
        </div>
      )}
  <div ref={mapRef} className="w-full h-full rounded-b-xl shadow-md border" />
 
  {shapes.length > 0 && (<>  <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="destructive" className="absolute left-2 bottom-[140px]" onClick={deleteAll}>
          <DeleteOutlineOutlinedIcon/> <div className="hidden lg:inline">Delete Drawn</div>
    </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Draw Area</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider></>)}
  <div className="absolute top-[120px] lg:top-2 left-2 lg:left-[250px] flex flex-col space-y-2">
      {/* Default Button */}
      <div className="flex flex-col lg:flex-row gap-1 p-0">
     
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                    <Button onClick={() => {
                    setSelectedControlD("polygon"); 
                    setSelectedControl("polygon");
                    setopenTooltip(true);
           setTitle('Draw Boundaries');
         setDescription('Mark the boundaries of the property');
                    handleRoute();}} 
                    variant={selectedControlD === "polygon" ? "default" : "outline"}><RectangleOutlinedIcon/><div className="hidden lg:inline">Draw Area</div></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Draw Boundaries</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
  
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                    <Button onClick={() => {setSelectedControlD("none");
                        setopenTooltip(true);
           setTitle('Control Off');
           setDescription('Disable bounderies draw mode');}
                    } variant={selectedControlD === "none" ? "default" : "outline"}><BlockOutlinedIcon/><div className="hidden lg:inline">Control Off</div></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Control Off</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
  
               {/* Import Button */}

         
        
         
          
            
      
    </div>
  </div>
  
  {latitude && longitude && (  <DrawerPublic onChange={handlePropertyLocation} latitude={latitude} longitude={longitude}/>)}
  
  
    <TooltipProvider>
                   <Tooltip>
                     <TooltipTrigger asChild>
                     <Button
          onClick={() => setShowGuide(!showGuide)}
          variant="outline"
          className="w-10 text-gray-600 absolute top-[60px] left-2 rounded-full shadow-lg"
        >
         <QuestionMarkOutlinedIcon/>
        </Button>
                     </TooltipTrigger>
                     <TooltipContent>
                       <p> Hint?</p>
                     </TooltipContent>
                   </Tooltip>
                 </TooltipProvider>
  
  {distance && (
  <div className="absolute top-[60px] left-2 p-2 text-white bg-green-600 z-5 rounded-md shadow-lg">
    <div className="text-sm">
      <strong>Distance:</strong>
      <div>{distance} km</div>
    </div>
  </div>
)}




{activeAmenity && amenityCount !== null && (<>
  <div className="absolute top-[60px] left-2 p-2 text-white bg-green-600 z-5 rounded-md shadow-lg">
 <div className="mt-2 text-sm text-white dark:text-gray-300">
    Found <strong>{amenityCount}</strong> {activeAmenity.replace("_", " ").toLowerCase()}(s) within {radius/1000} km
  </div>
</div>
  

<div className="absolute rounded-lg p-2 bg-gray-100 bottom-10 left-1/2 mt-4 flex flex-col gap-2 text-sm">
<label className="block text-gray-700 font-medium mb-0">
Radius: {radius / 1000} km
             </label>
             <input
               type="range"
               min="1000"
               max="5000"
               step="1000"
               value={radius}
               onChange={(e) => setRadius(Number(e.target.value))}
               className="w-full"
             />
             
 
</div>
</>)}
 
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
   
  {[
    { label: "Schools Nearby", type: "school" },
    { label: "Hospitals Nearby", type: "hospital" },
    { label: "Malls Nearby", type: "shopping_mall" },
    { label: "Restaurants Nearby", type: "restaurant" },
    { label: "Banks Nearby", type: "bank" },
    { label: "Bus Stations Nearby", type: "transit_station" },
  ].map(({ label, type }) => (<div key={type}>
   
    <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>

      <Button
      key={type}
      onClick={() => {handleShowAmenity(type as AmenityType); setDistance(''); setSelectedControlD("none"); setSelectedControl("amenity");}}
      variant={activeAmenity === type ? "default" : "outline"}
      className={`w-14 ${
        activeAmenity === type ? "bg-green-600 hover:bg-green-700 text-white" : "text-gray-600"
      }`}
      disabled={loadingAmenity !== null}
    >
      {loadingAmenity === type ? (<><CircularProgress
                                sx={{ color: "white" }}
                                size={30}
                              /></>) : 
      (<>
      {type ==='school' &&(<div><SchoolOutlinedIcon/> </div>)}
      {type ==='hospital' &&(<div><LocalHospitalOutlinedIcon/> </div>)}
      {type ==='shopping_mall' &&(<div><LocalMallOutlinedIcon/> </div>)}
      {type ==='restaurant' &&(<div><RestaurantOutlinedIcon/> </div>)}
      {type ==='bank' &&(<div><AccountBalanceOutlinedIcon/> </div>)}
      {type ==='transit_station' &&(<div><AirportShuttleOutlinedIcon/> </div>)}
      </>)}
    </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
    
  </div>))}
   <TooltipProvider>
                   <Tooltip>
                     <TooltipTrigger asChild>
                     <Button
  onClick={() => {
    setSelectedControl("route");
    setSelectedControlD("none");
    //handleRoute();
    setActiveAmenity(null); // unselect other controls
    setShowDistanceDialog(true);
    setOpenDistanceDialog(false);
    setOpenDirectionsDialog(false);
  }}
  variant={selectedControl === "route" ? "default" : "outline"}
  className={`w-14 text-gray-600 ${
    selectedControl === "route" ? "bg-green-600 hover:bg-green-700 text-white" : ""
  }`}
>
<RouteOutlinedIcon/> 
</Button>
                     </TooltipTrigger>
                     <TooltipContent>
                       <p>Distance</p>
                     </TooltipContent>
                   </Tooltip>
                 </TooltipProvider>
   

                 <TooltipProvider>
                   <Tooltip>
                     <TooltipTrigger asChild>
                     <Button
  onClick={() => {
    setSelectedControl("userRoute");
    setSelectedControlD("none");
    setActiveAmenity(null); // unselect other controls
    setOpenDistanceDialog(true)
    setShowDistanceDialog(false);
    setOpenDirectionsDialog(false);
    //handleRouteFromUser();
  }}
  className={`w-14 text-gray-600 ${
    selectedControl === "userRoute" ? "bg-green-600 text-white hover:bg-green-700 text-white" : ""
  }`}
  variant={selectedControl === "userRoute" ? "default" : "outline"}
>
  <GpsFixedOutlinedIcon/>
</Button>
                     </TooltipTrigger>
                     <TooltipContent>
                       <p>Distance to Property</p>
                     </TooltipContent>
                   </Tooltip>
                 </TooltipProvider>

                 <TooltipProvider>
                   <Tooltip>
                     <TooltipTrigger asChild>
                     <div
  onClick={() => {
    setDestination(`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`);
    setOpenDirectionsDialog(true);
     setOpenDistanceDialog(false)
    setShowDistanceDialog(false);
  }}
>
  <Button variant="outline" className="w-14 text-gray-600">
    <DirectionsOutlinedIcon/>
  </Button>

</div>
                     </TooltipTrigger>
                     <TooltipContent>
                       <p> 📍 Get Directions (Google Maps)</p>
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

  </div>

{openDirectionsDialog && (<>
<div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    <div className="bg-[#e4ebeb] p-3 rounded-md shadow-lg w-[320px] relative">
      <button
        onClick={() => {
          setOpenDirectionsDialog(false);
        }}
        className="absolute top-2 right-2 text-gray-500 hover:text-black text-sm"
        title="Close"
      >
        ✕
      </button>
   <p className="font-bold">📍 Redirect to Google Maps</p>
    <p>
      This will open Google Maps to navigate to the property location. Do you want to proceed?
    </p>
    <div className="p-2 w-full">
    <Button variant="default" className="w-full" onClick={()=>{handleRedirect();}}> Got it</Button>
    </div>
<div>

</div>
</div>
</div>
</>)}



{openDistanceDialog && (<>
<div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    <div className="bg-[#e4ebeb] p-3 rounded-md shadow-lg w-[320px] relative">
      <button
        onClick={() => {
           setStep("options"); setOpenDistanceDialog(false);
        }}
        className="absolute top-2 right-2 text-gray-500 hover:text-black text-sm"
        title="Close"
      >
        ✕
      </button>
   <p className="font-bold">Distance to Property</p>
    <p>
      Show approximately distance from your current location to the property.
    </p>
    <div className="p-2 w-full">
    <Button variant="default" className="w-full" onClick={()=>{setOpenDistanceDialog(false); handleRouteFromUser();}}> Got it</Button>
    </div>
<div>

</div>
</div>
</div>
</>)}

 {showDistanceDialog && (<>
 <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    <div className="bg-[#e4ebeb] p-3 rounded-md shadow-lg w-[320px] relative">
      <button
        onClick={() => {
           setStep("options"); setShowDistanceDialog(false);
        }}
        className="absolute top-2 right-2 text-gray-500 hover:text-black text-sm"
        title="Close"
      >
        ✕
      </button>
   <p className="font-bold">Distance Options</p>
<div>
     {step === "options" ? (
                <>
                  <div
                    onClick={() => handleSelectOption("map")}
                    className="cursor-pointer p-2 border rounded mb-2 hover:bg-gray-100"
                  >
                    1. Tap on the map
                  </div>
                  <div
                    onClick={() => handleSelectOption("address")}
                    className="cursor-pointer p-2 border rounded hover:bg-gray-100"
                  >
                    2. Select location from address
                  </div>
                </>
              ) : (
                <>
                  <label className="block mb-2">Enter address to calculate distance:</label>
                    <GooglePlacesAutocomplete
                                        apiKey={process.env.NEXT_PUBLIC_GOOGLEAPIKEY!}
                                        selectProps={{
                    placeholder: "Search location",
                    onChange: handleSelect,
                    styles: {
                      control: (provided) => ({
                        ...provided,
                        padding: '6px',
                        borderRadius: '4px',
                        borderColor: '#ccc',
                        boxShadow: 'none',
                        minHeight: '55px',
                      }),
                      placeholder: (provided) => ({
                        ...provided,
                        color: '#888',
                      }),
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999, // ensure it appears on top
                      }),
                    },
                  }}
                                        autocompletionRequest={{
                                          componentRestrictions: {
                                            country: ["KE"], // Limits results to Kenya
                                          },
                                        }}
                                      />
                                      {error && (<><p className="text-red-400 p-1">{error} </p></>)}
                                   
                                   <div className="p-2 w-full flex justify-between">
                                                {step === "addressInput" ? (
                                                  <Button variant="default" className="w-full" onClick={handleSearch}>Search</Button>
                                                ) : null}
                                                </div>
                </>
              )}
</div>

</div>

</div>
</>)}

{uploadPopup && (
  <div className="fixed inset-0 p-2 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    <div className="bg-[#e4ebeb] p-3 rounded-md shadow-lg w-full max-w-xl relative">
      
      {/* Close Button */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => setUploadPopup(false)}>
          <CloseOutlinedIcon fontSize="small" />
        </Button>
      </div>

      {/* Expandable Upload Options */}
      <div className="flex flex-col gap-4 mt-4">
        {/* Toggle Options */}
        <div className="flex gap-2">
          <Button
            variant={selectedOption === "geojson" ? "default" : "outline"}
            onClick={() => setSelectedOption("geojson")}
          >
            GeoJSON
          </Button>
          <Button
            variant={selectedOption === "qrcode" ? "default" : "outline"}
            onClick={() => setSelectedOption("qrcode")}
          >
            QR Code
          </Button>
        </div>

        {/* GeoJSON Upload Expanded */}
        {selectedOption === "geojson" && (
          <div className="flex flex-col gap-2 items-center w-full">
            <div className="flex gap-2 items-center">
              <UploadFileOutlinedIcon />
              <p className="text-lg font-medium">Import Digital Beacons GeoJSON</p>
            </div>
            <input 
              type="file" 
              accept=".geojson" 
              onChange={handleFileUpload} 
              className="p-2 border bg-white dark:bg-[#2D3236] dark:text-gray-100 rounded-lg w-full" 
            />
          </div>
        )}

        {/* QR Code Upload Expanded */}
        {selectedOption === "qrcode" && (
          <div className="flex flex-col gap-2 items-center w-full">
            <div className="flex gap-2 items-center">
              <QrCode2OutlinedIcon />
              <p className="text-lg font-medium">Import from QR Code</p>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadQRCode(file);
              }} 
              className="p-2 border bg-white dark:bg-[#2D3236] dark:text-gray-100 rounded-lg w-full" 
            />
          </div>
        )}
      </div>

      {/* Sample File Section */}
      {selectedOption === "geojson" && (
        <div className="bg-white dark:bg-[#1E2528] rounded-md p-3 text-sm shadow-inner border border-gray-300 dark:border-gray-600 mt-4">
          <p className="font-semibold mb-1">📄 Sample file:</p>
          <a 
            href="/digital_beacons.json" 
            download 
            className="text-blue-600 dark:text-blue-400 underline text-sm"
          >
            Download digital_beacons.json
          </a>
          <pre className="mt-2 overflow-x-auto text-xs max-h-48 bg-gray-100 dark:bg-[#2D3236] p-2 rounded">
{`{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "Plot A" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[36.8219, -1.2921], [36.8225, -1.2921], ...]]
      }
    }
  ]
}`}
          </pre>
        </div>
      )}
    </div>
  </div>
)}


    {openTooltip && (<>
   <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    <div className="bg-[#e4ebeb] p-3 rounded-md shadow-lg w-[320px] relative">
          <button
            onClick={() => {
              setopenTooltip(false);
            }}
            className="absolute top-2 right-2 text-gray-500 hover:text-black text-sm"
            title="Close"
          >
            ✕
          </button>
       <p className="font-bold">{title}</p>
        <p>
          {description}
        </p>
        <div className="p-2 w-full">
        <Button variant="default" className="w-full" onClick={()=>{setopenTooltip(false)}}>Okay</Button>
        </div>
    <div>
    
    </div>
    </div>
    </div>
    </>)}
    
  {!latitude && !longitude && (
  <div className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-80 z-50">
    <div className="justify-center items-center dark:text-gray-300 rounded-lg p-1 lg:p-6 w-full md:max-w-3xl lg:max-w-4xl h-screen flex flex-col">
      
      {/* Close Button */}
      <Button
        variant="outline"
        title="Close"
        onClick={() => onClose()}
        className="absolute right-6 top-8 p-1 flex gap-1 items-center"
      >
        <CloseOutlinedIcon />
      </Button>
     
      <Button onClick={handleOpenUploadPopup} className="" variant="outline">
        <UploadFileOutlinedIcon />
        <div>Import beacons</div>
      </Button>
   
      {/* Drawer & Info */}
      <div className="flex p-4 flex-col gap-2 text-[#30D32C] items-center">
        <DrawerPublic onChange={handlePropertyLocation} latitude={latitude} longitude={longitude} />

        <p className="text-xs text-gray-400 italic">
          Missing property (e.g., Land, House) coordinates? <span className="font-semibold">Ask the seller to share them.</span>
        </p>

        <button
          onClick={() => setShowMappingInfo(!showMappingInfo)}
          className="text-green-600 underline mt-2 text-xs px-4 py-2 rounded-md hover:text-green-700 transition"
        >
          Benefits of a Virtual Property Location Tour?
        </button>

        {/* Mapping Info Modal */}
        {showMappingInfo && (
          <div className="fixed inset-0 p-2 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white rounded-xl p-2 w-full md:max-w-3xl lg:max-w-4xl shadow-lg">

              {/* Close Modal */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowMappingInfo(false)}
                  className="p-2 rounded-full text-white bg-green-600 hover:bg-green-700 dark:hover:bg-gray-700 transition"
                >
                  <CloseOutlinedIcon fontSize="small" />
                </button>
              </div>

              {/* Scroll Content */}
              <ScrollArea className="h-[60vh] bg-gray-50 dark:bg-[#131B1E] rounded-lg p-4">
                
                <h3 className="text-lg font-semibold text-gray-700 dark:text-[#e4ebeb] text-center border-b pb-2">
                  Benefits of a Virtual Property Location Tour
                </h3>

                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2 mt-3">
                  <li>📏 <strong>Measure Property Size</strong> - Estimate area in square meters (m²), acres, or hectares.</li>
                  <li>📍 <strong>Calculate Distance</strong> - Find distance from key places like your workplace or shopping centers.</li>
                  <li>🛣️ <strong>Find the Nearest Route</strong> - Get directions from your location to the property.</li>
                  <li>👥 <strong>Analyze Population</strong> - View demographic insights of the property&apos;s surroundings.</li>
                  <li>🚗 <strong>Check Road Accessibility</strong> - See the distance to the nearest tarmac road.</li>
                  <li>🚏 <strong>Locate Public Transport</strong> - Find the closest bus station and distance.</li>
                  <li>🏫 <strong>Nearby Schools</strong> - View the number of schools around.</li>
                  <li>🏥 <strong>Healthcare Facilities</strong> - Check hospitals and clinics in the area.</li>
                  <li>🛍️ <strong>Shopping Options</strong> - See available shopping malls nearby.</li>
                  <li>🏡 <strong>View Nearby Property Offers</strong> - Discover other properties available in the same area.</li>
                  <li>⏳ <strong>Saves Time for Both Buyers & Sellers</strong> - Only visit the site after you&apos;re satisfied with the property&apos;s location.</li>
                </ul>

                <p className="text-sm font-semibold text-gray-700 dark:text-[#e4ebeb] mt-4 text-center border-b pb-2">
                  We have an <span className="text-green-600 hover:underline cursor-pointer" onClick={() => handleCategory('Property')}>Advanced Property Mapping Tool</span> when creating property ads in the Property Category.
                </p>

                <div className="flex justify-center">
                  <Image
                    src="/assets/icons/property-map.png"
                    alt="Mapping Tool"
                    className="w-full lg:w-[600px] max-h-[350px] mb-4 rounded-lg border border-[#e4ebeb] dark:border-gray-700"
                    width={800}
                    height={500}
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-700 dark:text-[#e4ebeb] text-center border-b pb-2 mt-5">
                  How Property Mapping Prevents Fraud
                </h3>

                <ul className="list-disc text-sm text-gray-700 dark:text-gray-300 space-y-2 mt-3 pl-6">
                  <li><strong>Prevents Fake Listings:</strong> Fraudsters cannot fake property location or size since buyers can verify it on the map.</li>
                  <li><strong>Buyers Can Independently Visit the Site:</strong> The exact location is available, allowing buyers to verify details with neighbors.</li>
                  <li><strong>Proof of Ownership & Boundaries:</strong> Clearly drawn boundaries prevent fraudsters from misrepresenting land size or ownership.</li>
                  <li><strong>Comparison with Official Records:</strong> Buyers can cross-check mapped property details with government land records.</li>
                  <li><strong>Detects Overlapping Claims:</strong> If two sellers list the same property, discrepancies in mapping will expose fraud.</li>
                  <li><strong>Publicly Visible Infrastructure:</strong> Buyers can see actual roads, power lines, and water sources instead of relying on verbal claims.</li>
                  <li><strong>Encourages Due Diligence:</strong> Buyers can check with local authorities and community members before purchasing.</li>
                  <li><strong>Reduces Middlemen Scams:</strong> Publicly available property coordinates allow buyers to verify details directly with real owners.</li>
                </ul>
              </ScrollArea>

            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}

  
  </div>
);
}
