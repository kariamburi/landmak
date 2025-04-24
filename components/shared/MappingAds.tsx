import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { InfoWindow, OverlayView } from "@react-google-maps/api";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import CircularProgress from "@mui/material/CircularProgress";
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
  data: {
    location: Location;
    polylines: Polyline[];
    markers: Marker[];
    shapes: Shape[];
  };
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

export default function MapDrawingTool({ data }: Props) {
   const [center, setCenter] = useState<any>(data.location?.coordinates ? {lat:data.location.coordinates[0], lng:data.location.coordinates[1]}:defaultcenter);
  
   const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const drawingManager = useRef<google.maps.drawing.DrawingManager | null>(null);
  const shapeOriginalColors = useRef<Map<any, string>>(new Map());
  const [selectedShapePosition, setSelectedShapePosition] = useState<google.maps.LatLng | null>(null);
  const [shapes, setShapes] = useState<Shape[]>(data.shapes ? data.shapes: []);
  const [shapeRefs, setShapeRefs] = useState<google.maps.Polygon[]>([]);
  const [polylines, setPolylines] = useState<Polyline[]>(data.polylines ? data.polylines: []);
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
  //const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const shapesRef = useRef(shapes);
  const polylinesRef = useRef(polylines);
  const labelMarkersRef = useRef<google.maps.Marker[]>([]);
  const [distance, setDistance] = useState<string | null>(null);
  const [showMappingInfo, setShowMappingInfo] = useState(false);
  const [uploadPopup, setUploadPopup] = useState(false);
  const allBoundsRef = useRef<google.maps.LatLngBounds | null>(null);
  const [showbuttons, setShowbuttons] = useState(false);
  
  // Sync refs when state updates
  useEffect(() => {
    shapesRef.current = shapes;
  }, [shapes]);
  
  useEffect(() => {
    polylinesRef.current = polylines;
  }, [polylines]);
  
  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLEAPIKEY!,
      version: "weekly",
      libraries: ["drawing", "geometry","places"],
    });

    loader.load().then(() => {
      if (!mapRef.current) return;
      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom: 16,
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM, // Places zoom control at the bottom-right
        },
        // Move zoom and street view to LEFT_CENTER
  
        streetViewControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER,
        },
        mapTypeId: "satellite",
      });
      mapInstance.current = map;

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

      google.maps.event.addListener(manager, "markercomplete", (marker: google.maps.Marker) => {
        const iconType = selectedMarkerTypeRef.current;
        const position = marker.getPosition();
        if (!position) return;

        const label = prompt("Enter label for this marker:", iconType.label) || iconType.label;
        if (!label) {
          marker.setMap(null); // Remove the shape from map if user cancels
          return;
        }
        marker.setOptions({
          icon: iconType.icon,
          optimized: true,
          zIndex: google.maps.Marker.MAX_ZINDEX + 1,
        });
      

        const infoWindow = new google.maps.InfoWindow({ content: label });
        marker.addListener("click", () => infoWindow.open({ anchor: marker, map }));

        const newMarker: Marker = {
          position: { lat: position.lat(), lng: position.lng() },
          label,
          icon: iconType.icon,
        };

        setMarkers((prev) => [...prev, newMarker]);
        setMarkerRefs((prev) => [...prev, marker]);
      });

      google.maps.event.addListener(manager, "polylinecomplete", (polyline: google.maps.Polyline) => {
        const label = prompt("Enter label for this polyline:") || "";
        if (!label) {
          polyline.setMap(null); // Remove the shape from map if user cancels
          return;
        }
        const path = polyline.getPath().getArray().map((latlng) => ({ lat: latlng.lat(), lng: latlng.lng() }));
        const defaultColor = "#FF0000";
        const hoverColor = "#00AAFF";
      
        // Set initial styles
        polyline.setOptions({
          strokeColor: defaultColor,
          strokeWeight: 2,
        });
        shapeOriginalColors.current.set(polyline, "#FF0000");
 
  // Create an InfoWindow for showing the label
  let infoWindowTimeout: NodeJS.Timeout;
  const sharedInfoWindow = new google.maps.InfoWindow();
polyline.addListener("mouseover", (e:any) => {
   // Get latest label from ref
   const currentPolyline = polylinesRef.current.find((p) =>
    p.path.length === polyline.getPath().getLength() &&
    p.path.every((pt, i) => {
      const shapePt = polyline.getPath().getAt(i);
      return pt.lat === shapePt.lat() && pt.lng === shapePt.lng();
    })
  );

  const currentLabel = currentPolyline?.label || label;
  const lengthInMeters = google.maps.geometry.spherical.computeLength(polyline.getPath());
  const distanceLabel = lengthInMeters > 1000
    ? `${(lengthInMeters / 1000).toFixed(2)} km`
    : `${lengthInMeters.toFixed(0)} m`;

  sharedInfoWindow.setContent(`
    <div style="font-size: 13px;">
      <div><strong>Label:</strong> ${currentLabel}</div>
      <div><strong>Distance:</strong> ${distanceLabel}</div>
    </div>
  `);

  sharedInfoWindow.setPosition(e.latLng);
  sharedInfoWindow.open(map);

  if (infoWindowTimeout) clearTimeout(infoWindowTimeout);
});

polyline.addListener("mouseout", () => {
  // Delay closing to avoid flickering if user hovers quickly back
  infoWindowTimeout = setTimeout(() => {
    sharedInfoWindow.close();
  }, 300);
});
 
        // 🔁 Updated to get the latest label from stored polyline data
  polyline.addListener("click", () => {
    const shapePath = polyline.getPath();
    const matchedPolyline = polylinesRef.current.find((p) =>
      p.path.length === shapePath.getLength() &&
      p.path.every((pt, idx) => {
        const shapePt = shapePath.getAt(idx);
        return pt.lat === shapePt.lat() && pt.lng === shapePt.lng();
      })
    );

    const currentLabel = matchedPolyline?.label || label;
    handleShapeClick(polyline, currentLabel);
  });
       // polyline.addListener("click", () => handleShapeClick(polyline, label));

        setPolylines((prev) => [...prev, { path, label, color: "#FF0000", width: 2 }]);
        setPolylineRefs((prev) => [...prev, polyline]);
      });

      google.maps.event.addListener(manager, "overlaycomplete", (event: any) => {
        if (event.type === "polygon") {
          const label = prompt("Enter label for this shape:") || "";
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
  
    const labelMarker = new google.maps.Marker({
      position: center,
      map: mapInstance.current!,
      label: {
        text: label,
        color: "#fff",
        fontSize: "14px",
        fontWeight: "bold",
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 0, // invisible icon to just show label
      },
      clickable: false,
      zIndex: google.maps.Marker.MAX_ZINDEX + 1,
    });
      //✅ Save to ref
          labelMarkersRef.current.push(labelMarker);
          shapeOriginalColors.current.set(event.overlay, "#00FF00");

          const sharedInfoWindow = new google.maps.InfoWindow();
          let infoWindowTimeout: NodeJS.Timeout;
          
          event.overlay.addListener("mouseover", (e: google.maps.MapMouseEvent) => {
            const path = event.overlay.getPath();
            const matchedShape = shapesRef.current.find((s) =>
              s.path.length === path.getLength() &&
              s.path.every((pt: any, idx: number) => {
                const shapePt = path.getAt(idx);
                return pt.lat === shapePt.lat() && pt.lng === shapePt.lng();
              })
            );
          
            const currentLabel = matchedShape?.label || label;
            const perimeter = google.maps.geometry.spherical.computeLength(path);
            const readablePerimeter = perimeter > 1000
              ? `${(perimeter / 1000).toFixed(2)} km`
              : `${perimeter.toFixed(0)} m`;
          
              const areaSqM = google.maps.geometry.spherical.computeArea(path);
              const areaHa = areaSqM / 10000; // hectares
              const areaAcres = areaSqM / 4046.85642; // acres
              
              const readableArea = `
                <div>${areaSqM.toFixed(0)} m²</div>
                <div>${areaHa.toFixed(2)} ha</div>
                <div>${areaAcres.toFixed(2)} acres</div>
              `;
          
            sharedInfoWindow.setContent(`
              <div style="font-size: 13px;">
                <div><strong>Label:</strong> ${currentLabel}</div>
                <div><strong>Perimeter:</strong> ${readablePerimeter}</div>
                <div><strong>Area:</strong> ${readableArea}</div>
              </div>
            `);
            sharedInfoWindow.setPosition(e.latLng!);
            sharedInfoWindow.open(mapInstance.current!);
          
            if (infoWindowTimeout) clearTimeout(infoWindowTimeout);
          });
          
          event.overlay.addListener("mouseout", () => {
            infoWindowTimeout = setTimeout(() => {
              sharedInfoWindow.close();
            }, 300);
          });
          

         event.overlay.addListener("click", () => {
          const path = event.overlay.getPath();
          let currentLabel = "";
        
          if (event.type === "polygon") {
            const matchedShape = shapesRef.current.find((s) =>
              s.path.length === path.getLength() &&
              s.path.every((pt:any, idx:any) => {
                const shapePt = path.getAt(idx);
                return pt.lat === shapePt.lat() && pt.lng === shapePt.lng();
              })
            );
            currentLabel = matchedShape?.label || label;
          } else if (event.type === "polyline") {
            const matchedPolyline = polylinesRef.current.find((p) =>
              p.path.length === path.getLength() &&
              p.path.every((pt, idx) => {
                const shapePt = path.getAt(idx);
                return pt.lat === shapePt.lat() && pt.lng === shapePt.lng();
              })
            );
            currentLabel = matchedPolyline?.label || label;
          }
       
          handleShapeClick(event.overlay, currentLabel);
        });        
        
         // setShapes((prev) => [...prev, { label, path, type: event.type, color: "#00FF00", area, status, overlay: event.overlay, labelMarker }]);
          setShapes((prev) => [...prev, { label, path, type: event.type, color: "#00FF00", area, status }]);
          setShapeRefs((prev) => [...prev, event.overlay]);
        }
      });
    });

  }, []);

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

  
 //const [selected, setSelected] = useState(markerOptions[0]);

  useEffect(() => {
    if (!data.markers || data.markers.length === 0) return;
  
    const interval = setInterval(() => {
      if (mapInstance.current) {
        setShowbuttons(true);
        clearInterval(interval);
        setMarkers(data.markers);
        data.markers.forEach((markerData) => {
    
      const marker = new google.maps.Marker({
        position: markerData.position,
        map: mapInstance.current!,
        icon: markerData.icon,
       // label: markerData.label,
        optimized: true,
      });
  
      const infoWindow = new google.maps.InfoWindow({
        content: markerData.label,
      });
  
      marker.addListener("click", () =>
        infoWindow.open({ anchor: marker, map: mapInstance.current! })
      );
   
      setMarkerRefs((prev) => [...prev, marker]);
    });
      }
    }, 200); // check every 200ms
  
    return () => clearInterval(interval);
  }, [data.markers]);
  

  useEffect(() => {
    if (!data.polylines || data.polylines.length === 0) return;
  
    const interval = setInterval(() => {
      if (mapInstance.current) {
        setShowbuttons(true);
        clearInterval(interval);
        setPolylines(data.polylines);
  
        const sharedInfoWindow = new google.maps.InfoWindow();
  
        data.polylines.forEach((poly) => {
          const polyline = new google.maps.Polyline({
            path: poly.path,
            map: mapInstance.current!,
            strokeColor: poly.color,
            strokeWeight: poly.width || 2,
            editable: false,
          });
  
          shapeOriginalColors.current.set(polyline, poly.color);
  
          // Store reference to the polyline
          setPolylineRefs((prev) => [...prev, polyline]);
  
          polyline.addListener("click", (e: any) => {
            const shapePath = polyline.getPath();
  
            const matchedPolyline = polylinesRef.current.find((p) =>
              p.path.length === shapePath.getLength() &&
              p.path.every((pt, idx) => {
                const shapePt = shapePath.getAt(idx);
                return pt.lat === shapePt.lat() && pt.lng === shapePt.lng();
              })
            );
  
            const currentLabel = matchedPolyline?.label || poly.label;
  
            const lengthInMeters = google.maps.geometry.spherical.computeLength(shapePath);
            const distanceLabel = lengthInMeters > 1000
              ? `${(lengthInMeters / 1000).toFixed(2)} km`
              : `${lengthInMeters.toFixed(0)} m`;
  
            sharedInfoWindow.setContent(`
              <div style="font-size: 13px;">
                <div><strong>Label:</strong> ${currentLabel}</div>
                <div><strong>Distance:</strong> ${distanceLabel}</div>
              </div>
            `);
  
            sharedInfoWindow.setPosition(e.latLng);
            sharedInfoWindow.open(mapInstance.current);
  
            handleShapeClick(polyline, currentLabel);
          });
        });
      }
    }, 200);
  
    return () => clearInterval(interval);
  }, [data.polylines]);
  

  useEffect(() => {
    if (!data.shapes || data.shapes.length === 0) return;
  
    const interval = setInterval(() => {
      if (mapInstance.current) {
        setShowbuttons(true);
        clearInterval(interval);
        setShapes(data.shapes);
  
        const sharedInfoWindow = new google.maps.InfoWindow();
        allBoundsRef.current = new google.maps.LatLngBounds();
  
        data.shapes.forEach((shape) => {
          if (shape.type !== "polygon") return;
  
          const polygon = new google.maps.Polygon({
            paths: shape.path,
            map: mapInstance.current!,
            fillColor: shape.color,
            strokeColor: shape.color,
            fillOpacity: 0.1,
            strokeWeight: 2,
            editable: false,
          });
  
          shapeOriginalColors.current.set(polygon, shape.color);
  
          // Compute and extend bounds
          const shapeBounds = new google.maps.LatLngBounds();
          shape.path.forEach((coord) => {
            shapeBounds.extend(coord);
            if (allBoundsRef.current) {
              allBoundsRef.current.extend(coord);
            }
          });
  
          const center = shapeBounds.getCenter();
  
          const labelMarker = new google.maps.Marker({
            position: center,
            map: mapInstance.current!,
            label: {
              text: shape.label,
              color: shape.color,
              fontSize: "14px",
              fontWeight: "bold",
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 0,
            },
            clickable: false,
            zIndex: google.maps.Marker.MAX_ZINDEX + 1,
          });
  
          labelMarkersRef.current.push(labelMarker);
  
          polygon.addListener("click", (e: google.maps.MapMouseEvent) => {
            const path = polygon.getPath();
            const matchedShape = shapesRef.current.find((s) =>
              s.path.length === path.getLength() &&
              s.path.every((pt: any, idx: number) => {
                const shapePt = path.getAt(idx);
                return pt.lat === shapePt.lat() && pt.lng === shapePt.lng();
              })
            );
  
            const currentLabel = matchedShape?.label || shape.label;
            const perimeter = google.maps.geometry.spherical.computeLength(path);
            const readablePerimeter = perimeter > 1000
              ? `${(perimeter / 1000).toFixed(2)} km`
              : `${perimeter.toFixed(0)} m`;
  
            const areaSqM = google.maps.geometry.spherical.computeArea(path);
            const areaHa = areaSqM / 10000;
            const areaAcres = areaSqM / 4046.85642;
  
            const readableArea = `
              <div>${areaSqM.toFixed(0)} m²</div>
              <div>${areaHa.toFixed(2)} ha</div>
              <div>${areaAcres.toFixed(2)} acres</div>
            `;
  
            sharedInfoWindow.setContent(`
              <div style="font-size: 13px;">
                <div><strong>Label:</strong> ${currentLabel}</div>
                <div><strong>Perimeter:</strong> ${readablePerimeter}</div>
                <div><strong>Area:</strong> ${readableArea}</div>
              </div>
            `);
            sharedInfoWindow.setPosition(e.latLng!);
            sharedInfoWindow.open(mapInstance.current!);
  
            handleShapeClick(polygon, currentLabel);
          });
  
          setShapeRefs((prev) => [...prev, polygon]);
        });
  
        // ✅ Fit map to all shape bounds
       // if (!allBounds.isEmpty()) {
       //   mapInstance.current.fitBounds(allBounds);
      //  }
        if (mapInstance.current && allBoundsRef.current && !allBoundsRef.current.isEmpty()) {
          mapInstance.current.fitBounds(allBoundsRef.current);
        }
      }
    }, 200);
  
    return () => clearInterval(interval);
  }, [data.shapes]);
  
  
 
  

  type AmenityType = "school" | "hospital" | "shopping_mall" | "restaurant" | "bank" | "transit_station"; // Add more as needed
 
 
 
  const [amenityMarkers, setAmenityMarkers] = useState<google.maps.Marker[]>([]);
  const [loadingAmenity, setLoadingAmenity] = useState<AmenityType | null>(null);
  const [activeAmenity, setActiveAmenity] = useState<AmenityType | null>(null);

const [selectedControl, setSelectedControl] = useState<"amenity" | "route" | "userRoute" | null>(null);
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
  const lat = data.location.coordinates[0];
  const lng = data.location.coordinates[1];
  const center = { lat, lng };

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
  const lat = data.location.coordinates[0];
  const lng = data.location.coordinates[1];
  const position = { lat, lng };
  
    if (map) {
      // Move the center and zoom
      map.setCenter(position);
      map.setZoom(18);
      // Move the existing marker if it exists
      if (markerRef.current) {
        markerRef.current.setPosition(position);
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
  
  return ( 
  <div id="map-container" className="h-[100vh] relative">
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
  {showbuttons && (<>
  
    <TooltipProvider>
                   <Tooltip>
                     <TooltipTrigger asChild>
                     <Button
          onClick={() => setShowGuide(!showGuide)}
          variant="outline"
          className="w-10 text-gray-600 absolute top-20 left-2 rounded-full shadow-lg"
        >
         <QuestionMarkOutlinedIcon/>
        </Button>
                     </TooltipTrigger>
                     <TooltipContent>
                       <p> Hint?</p>
                     </TooltipContent>
                   </Tooltip>
                 </TooltipProvider>
  

        </>)}
  {distance && (
  <div className="absolute top-20 left-2 p-2 text-white bg-green-600 z-5 rounded-md shadow-lg">
    <div className="text-sm">
      <strong>Distance:</strong>
      <div>{distance} km</div>
    </div>
  </div>
)}
{activeAmenity && amenityCount !== null && (<>
  <div className="absolute top-20 left-2 p-2 text-white bg-green-600 z-5 rounded-md shadow-lg">
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
 
{showbuttons && (<>  <div className="absolute top-2 right-2 z-5 flex flex-col space-y-2">
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
      onClick={() => {handleShowAmenity(type as AmenityType); setDistance(''); setSelectedControl("amenity");}}
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
    
  </div> ))}
   <TooltipProvider>
                   <Tooltip>
                     <TooltipTrigger asChild>
                     <Button
  onClick={() => {
    setSelectedControl("route");
    handleRoute();
    setActiveAmenity(null); // unselect other controls
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
                       <p>Get Route to Property</p>
                     </TooltipContent>
                   </Tooltip>
                 </TooltipProvider>
   

                 <TooltipProvider>
                   <Tooltip>
                     <TooltipTrigger asChild>
                     <Button
  onClick={() => {
    setSelectedControl("userRoute");
    setActiveAmenity(null); // unselect other controls
    handleRouteFromUser();
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
                       <p>Route From My Location</p>
                     </TooltipContent>
                   </Tooltip>
                 </TooltipProvider>

                 <TooltipProvider>
                   <Tooltip>
                     <TooltipTrigger asChild>
                     <a
  href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
  target="_blank"
  rel="noopener noreferrer"
>
  <Button variant="outline" className="w-14 text-gray-600">
    <DirectionsOutlinedIcon/>
  </Button>

</a>
                     </TooltipTrigger>
                     <TooltipContent>
                       <p> 📍 Get Directions (Google Maps)</p>
                     </TooltipContent>
                   </Tooltip>
                 </TooltipProvider>

</div>
</>)}
  </div>
);
}
