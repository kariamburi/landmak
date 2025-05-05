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
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { DrawerPublic } from "./DrawerPublic";
import { ScrollArea } from "../ui/scroll-area";
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { AnyAaaaRecord } from "node:dns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
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
  name: string;
  selectedCategory:string;
  data: {
    location: Location;
    polylines: Polyline[];
    markers: Marker[];
    shapes: Shape[];
  };
  onSave:() => void;
  onClose:() => void;
  onChange: (
    name: string,
    value: {
      location: Location;
      polylines: Polyline[];
      markers: Marker[];
      shapes: Shape[];
    }
  ) => void;
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

export default function MapDrawingTool({ name, selectedCategory, data, onChange, onSave, onClose }: Props) {
   const [center, setCenter] = useState<any>(data.location?.coordinates ? {lat:data.location.coordinates[0], lng:data.location.coordinates[1]}:defaultcenter);
   const [latitude, setLatitude] = useState(data.location?.coordinates ? data.location.coordinates[0]: '');
   const [longitude, setLongitude] = useState(data.location?.coordinates ? data.location.coordinates[1]: '');
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
  //const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const shapesRef = useRef(shapes);
  const polylinesRef = useRef(polylines);
  const labelMarkersRef = useRef<google.maps.Marker[]>([]);
  const [showMappingInfo, setShowMappingInfo] = useState(false);
  const [uploadPopup, setUploadPopup] = useState(false);
  const [selectedControl, setSelectedControl] = useState("none");
  
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
        zoom: 18,
        zoomControl: true,
        fullscreenControl: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM, // Places zoom control at the bottom-right
        },
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
        title: "Location",
      });

      marker.addListener("dragend", () => {
        const pos = marker.getPosition();
        if (!pos) return;
        onChange(name, {
          location: { type: "Point", coordinates: [pos.lat(), pos.lng()] },
          polylines,
          markers,
          shapes,
        });
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
       // marker.setIcon(iconType.icon);
       // marker.setLabel(label);

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
   // });

  }, [isLoaded]);

  useEffect(() => {
    if (!drawingManager.current) return;
    const modeMap:any = {
      none: null,
      marker: google.maps.drawing.OverlayType.MARKER,
      polyline: google.maps.drawing.OverlayType.POLYLINE,
      polygon: google.maps.drawing.OverlayType.POLYGON,
    };
    drawingManager.current.setDrawingMode(modeMap[selectedControl]);
  }, [selectedControl]);

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

  const deleteAllMarkers = () => {
    markerRefs.forEach((m) => m.setMap(null));
    setMarkerRefs([]);
    setMarkers([]);
    const pos = mapInstance.current?.getCenter();
    if (pos) {
      onChange(name, {
        location: { type: "Point", coordinates: [pos.lat(), pos.lng()] },
        polylines,
        markers: [],
        shapes,
      });
    }
  };
  

  const deleteAll = () => {
    deleteAllMarkers();
    polylineRefs.forEach((pl) => {
      pl.setMap(null);
      shapeOriginalColors.current.delete(pl);
    });
    shapeRefs.forEach((sh) => {
      sh.setMap(null);
      shapeOriginalColors.current.delete(sh);
    });
     // Remove label markers
  labelMarkersRef.current.forEach((marker) => {
    marker.setMap(null);
  });
  labelMarkersRef.current = [];
    setPolylines([]);
    setPolylineRefs([]);
    setShapes([]);
    setShapeRefs([]);
    setSelectedShape(null);
  };

  const deleteSelectedShape = () => {
    if (!selectedShape) return;
  
    selectedShape.setMap(null);
    shapeOriginalColors.current.delete(selectedShape);
  
    if (selectedShape instanceof google.maps.Polygon) {
      // Remove from shapeRefs
      setShapeRefs((prev) => prev.filter((ref) => ref !== selectedShape));
  // Get the path of the selected shape
  const selectedPath = selectedShape.getPath().getArray().map((p) => `${p.lat()},${p.lng()}`).join("|");

       // Remove from shapes state
  setShapes((prevShapes) => {
    return prevShapes.filter((shape, index) => {
      const shapePath = shape.path.map((p:any) => `${p.lat},${p.lng}`).join("|");

      const isSame = shapePath === selectedPath;

      if (isSame) {
        // 🧠 Remove label marker manually from ref
        const labelMarker = labelMarkersRef.current[index];
        labelMarker?.setMap(null);
        labelMarkersRef.current.splice(index, 1);
      }

      return !isSame;
    });
  });
}
    // Handle polyline if needed (as in your original code)
    if (selectedShape instanceof google.maps.Polyline) {
      setPolylineRefs((prev) => prev.filter((ref) => ref !== selectedShape));
      setPolylines((prev) =>
        prev.filter(
          (poly) =>
            poly.path.map((p) => `${p.lat},${p.lng}`).join("|") !==
            selectedShape.getPath().getArray().map((p) => `${p.lat()},${p.lng()}`).join("|")
        )
      );
    }
  
    setSelectedShape(null);
  };
  

  useEffect(() => {
    const pos = mapInstance.current?.getCenter();
    if (!pos) return;
    onChange(name, {
      location: { type: "Point", coordinates: [pos.lat(), pos.lng()] },
      polylines,
      markers,
      shapes,
    });
  }, [polylines, markers, shapes]);
  const [selected, setSelected] = useState(markerOptions[0]);

  useEffect(() => {
    if (!data.markers || data.markers.length === 0) return;
  
    const interval = setInterval(() => {
      if (mapInstance.current) {
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
        clearInterval(interval);
        setPolylines(data.polylines);
       data.polylines.forEach((poly) => {
      const polyline = new google.maps.Polyline({
        path: poly.path,
        map: mapInstance.current!,
        strokeColor: poly.color,
        strokeWeight: poly.width || 2,
        editable: false,
      });
  
      shapeOriginalColors.current.set(polyline, poly.color);
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

const currentLabel = currentPolyline?.label || poly.label;
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
sharedInfoWindow.open(mapInstance.current);

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

  const currentLabel = matchedPolyline?.label || poly.label;
  handleShapeClick(polyline, currentLabel);
});
    //  polyline.addListener("click", () => handleShapeClick(polyline, poly.label));
      setPolylineRefs((prev) => [...prev, polyline]);
    });
      }
    }, 200); // check every 200ms
  
    return () => clearInterval(interval);
  }, [data.polylines]);

  useEffect(() => {
    if (!data.shapes || data.shapes.length === 0) return;
  
    const interval = setInterval(() => {
      if (mapInstance.current) {
        clearInterval(interval);
        setShapes(data.shapes);
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
      
          // Add label marker
          const bounds = new google.maps.LatLngBounds();
          shape.path.forEach((coord) => bounds.extend(coord));
          const center = bounds.getCenter();
      
          const labelMarker = new google.maps.Marker({
            position: center,
            map: mapInstance.current!,
            label: {
              text: shape.label,
              color: "#fff",
              fontSize: "14px",
              fontWeight: "bold",
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 0, // Invisible, used for label only
            },
            clickable: false,
            zIndex: google.maps.Marker.MAX_ZINDEX + 1,
          });
      
          labelMarkersRef.current.push(labelMarker);


          const sharedInfoWindow = new google.maps.InfoWindow();
          let infoWindowTimeout: NodeJS.Timeout;
          
          polygon.addListener("mouseover", (e: google.maps.MapMouseEvent) => {
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
          
          polygon.addListener("mouseout", () => {
            infoWindowTimeout = setTimeout(() => {
              sharedInfoWindow.close();
            }, 300);
          });
          

          polygon.addListener("click", () => {
          const path = polygon.getPath();
          let currentLabel = "";
        
          if (shape.type === "polygon") {
            const matchedShape = shapesRef.current.find((s) =>
              s.path.length === path.getLength() &&
              s.path.every((pt:any, idx:any) => {
                const shapePt = path.getAt(idx);
                return pt.lat === shapePt.lat() && pt.lng === shapePt.lng();
              })
            );
            currentLabel = matchedShape?.label || shape.label;
          } else if (shape.type === "polyline") {
            const matchedPolyline = polylinesRef.current.find((p) =>
              p.path.length === path.getLength() &&
              p.path.every((pt, idx) => {
                const shapePt = path.getAt(idx);
                return pt.lat === shapePt.lat() && pt.lng === shapePt.lng();
              })
            );
            currentLabel = matchedPolyline?.label || shape.label;
          }
       
          handleShapeClick(polygon, currentLabel);
        });        
        

      
         // polygon.addListener("click", () => handleShapeClick(polygon, shape.label));
      
          setShapeRefs((prev) => [...prev, polygon]);
        });
      }
    }, 200); // check every 200ms
  
    return () => clearInterval(interval);
  }, [data.shapes]);

  const handlePropertyLocation = (lat: string | number, lng: string | number) => {
    if (!mapRef.current || !lat || !lng) return;
  
    const latitude = Number(lat);
    const longitude = Number(lng);
  
    onChange(name, {
      location: { type: "Point", coordinates: [latitude, longitude] },
      polylines,
      markers,
      shapes,
    });
  
    setCenter({ lat: latitude, lng: longitude });
    setLatitude(latitude);
    setLongitude(longitude);
  
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
      
          const labelMarker = new google.maps.Marker({
            position: center,
            map: mapInstance.current!,
            label: {
              text: shapeData.label,
              color: "#fff",
              fontSize: "14px",
              fontWeight: "bold",
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 0, // Invisible, used for label only
            },
            clickable: false,
            zIndex: google.maps.Marker.MAX_ZINDEX + 1,
          });
      
          labelMarkersRef.current.push(labelMarker);
          const sharedInfoWindow = new google.maps.InfoWindow();
          let infoWindowTimeout: NodeJS.Timeout;
          
          polyshape.addListener("mouseover", (e: google.maps.MapMouseEvent) => {
            const path = polyshape.getPath();
            const matchedShape = shapesRef.current.find((s:any) =>
              s.coordinates.length === path.getLength() &&
              s.coordinates.every((pt: any, idx: number) => {
                const shapePt = path.getAt(idx);
                return pt.lat === shapePt.lat() && pt.lng === shapePt.lng();
              })
            );
          
            const currentLabel = matchedShape?.label || shapeData.label;
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
          
          polyshape.addListener("mouseout", () => {
            infoWindowTimeout = setTimeout(() => {
              sharedInfoWindow.close();
            }, 300);
          });
          

          polyshape.addListener("click", () => {
          const path = polyshape.getPath();
          let currentLabel = "";
        
          if (shapeData.type === "polygon") {
            const matchedShape = shapesRef.current.find((s:any) =>
              s.coordinates.length === path.getLength() &&
              s.coordinates.every((pt:any, idx:any) => {
                const shapePt = path.getAt(idx);
                return pt.lat === shapePt.lat() && pt.lng === shapePt.lng();
              })
            );
            
            currentLabel = matchedShape?.label || shapeData.label;
          } else if (shapeData.type === "polyline") {
            const matchedPolyline = polylinesRef.current.find((p:any) =>
              p.coordinates.length === path.getLength() &&
              p.coordinates.every((pt:any, idx:any) => {
                const shapePt = path.getAt(idx);
                return pt.lat === shapePt.lat() && pt.lng === shapePt.lng();
              })
            );
            currentLabel = matchedPolyline?.label || shapeData.label;
          }
       
          handleShapeClick(polyshape, currentLabel);
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
                onChange(name, {
                  location: { type: "Point", coordinates: [coord.lat, coord.lng] },
                  polylines,
                  markers,
                  shapes,
                });
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
          
            mapInstance.current.setZoom(18);
              
            }
          });
        }
        
  
      } catch (error) {
        console.error("GeoJSON parse error:", error);
      }
    };
  
    reader.readAsText(file);
  };
  const handleOpenUploadPopup = () => {
    setUploadPopup(true);
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
  <div id="map-container" className="w-full relative h-[100vh]">
       {!isLoaded && (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-800" />
      <span className="ml-2 text-gray-700 font-medium">Loading map...</span>
    </div>
  )}  
        {uploadPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-2 z-50">
    <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-[#e4ebeb] rounded-xl p-4 w-full max-w-xl shadow-lg space-y-4">
      
      {/* Close Button */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => setUploadPopup(false)}>
          <CloseOutlinedIcon fontSize="small" />
        </Button>
      </div>

      {/* Upload Section */}
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

      {/* Sample File Section */}
      <div className="bg-white dark:bg-[#1E2528] rounded-md p-3 text-sm shadow-inner border border-gray-300 dark:border-gray-600">
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
    </div>
  </div>
)}

  {selectedShape && selectedShapePosition && (
  
  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-[#e4ebeb] p-4 rounded shadow-md min-w-[240px]">
      {/* Close Button */}
      <button
        onClick={() => {
          setSelectedShape(null);
          setSelectedColor(null);
          setSelectedLabel("");
          setSelectedShapePosition(null);
        }}
        className="absolute top-2 right-2 text-gray-500 hover:text-black text-sm"
        title="Close"
      >
        ✕
      </button>

      {/* Title */}
      <h4 className="font-semibold text-gray-700 text-sm mb-3">Edit Shape</h4>

      {/* Color Input */}
      <div className="flex flex-col gap-1 mb-3">
        <label className="text-xs text-gray-500">Color</label>
        <input
          type="color"
          className="w-full h-8 cursor-pointer border rounded"
          value={selectedColor || "#000000"}
          onChange={(e) => {
            const newColor = e.target.value;
            setSelectedColor(newColor);
            if (selectedShape instanceof google.maps.Polygon) {
              selectedShape.setOptions({ fillColor: newColor, strokeColor: newColor });
            } else if (selectedShape instanceof google.maps.Polyline) {
              selectedShape.setOptions({ strokeColor: newColor });
            }
            shapeOriginalColors.current.set(selectedShape, newColor);
            if (selectedShape instanceof google.maps.Polygon) {
              setShapes((prev) =>
                prev.map((s) =>
                  s.label === selectedLabel ? { ...s, color: newColor } : s
                )
              );
            } else if (selectedShape instanceof google.maps.Polyline) {
              setPolylines((prev) =>
                prev.map((p) =>
                  p.label === selectedLabel ? { ...p, color: newColor } : p
                )
              );
            }
          }}
        />
      </div>

      {/* Label Input */}
      <div className="flex flex-col gap-1 mb-4">
  <label className="text-xs text-gray-500">Label</label>
  <input
    type="text"
    className="w-full px-2 py-1 border rounded text-sm"
    value={selectedLabel}
    onChange={(e: any) => {
      const newLabel = e.target.value;
      setSelectedLabel(newLabel);

      if (!selectedShape) return;

      const path = selectedShape.getPath().getArray().map((pt) => ({
        lat: pt.lat(),
        lng: pt.lng(),
      }));

      if (selectedShape instanceof google.maps.Polygon) {
        setShapes((prev) =>
          prev.map((s, index) => {
            const isSame = JSON.stringify(s.path) === JSON.stringify(path);

            if (isSame) {
              // Update label marker via ref
              const labelMarker = labelMarkersRef.current[index];
              if (labelMarker) {
                labelMarker.setLabel({
                  text: newLabel,
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "bold",
                });
              }
              return { ...s, label: newLabel };
            }

            return s;
          })
        );
      } else if (selectedShape instanceof google.maps.Polyline) {
        setPolylines((prev) =>
          prev.map((p) =>
            JSON.stringify(p.path) === JSON.stringify(path)
              ? { ...p, label: newLabel }
              : p
          )
        );
      }
    }}
  />
</div>
{/* Width Input - Only for Polylines */}
{selectedShape instanceof google.maps.Polyline && (
  <div className="flex flex-col gap-1 mb-4">
    <label className="text-xs text-gray-500">Stroke Width</label>
    <input
      type="number"
      className="w-full px-2 py-1 border rounded text-sm"
      min={1}
      value={
        polylines.find((p) =>
          JSON.stringify(p.path) ===
          JSON.stringify(
            selectedShape.getPath().getArray().map((pt) => ({
              lat: pt.lat(),
              lng: pt.lng(),
            }))
          )
        )?.width || 2
      }
      onChange={(e) => {
        const newWidth = parseInt(e.target.value, 10);
        if (!isNaN(newWidth)) {
          selectedShape.setOptions({ strokeWeight: newWidth });

          const path = selectedShape.getPath().getArray().map((pt) => ({
            lat: pt.lat(),
            lng: pt.lng(),
          }));

          setPolylines((prev) =>
            prev.map((p) =>
              JSON.stringify(p.path) === JSON.stringify(path)
                ? { ...p, width: newWidth }
                : p
            )
          );
        }
      }}
    />
  </div>
)}


      {/* Delete Button */}
      <div className="grid grid-cols-2 gap-2">
      <button
        onClick={deleteSelectedShape}
        className="w-full bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 transition"
      >
        <DeleteOutlineOutlinedIcon/> Delete
      </button>
      <button
        onClick={() => {
          setSelectedShape(null);
          setSelectedColor(null);
          setSelectedLabel("");
          setSelectedShapePosition(null);
        }}
        className="w-full bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600 transition"
      >
      <DoneOutlinedIcon/> Save
      </button>
      </div>
    
    </div>

)}

     
  <div className="h-[100vh] relative">
  <div ref={mapRef} className="w-full h-full rounded-xl shadow-md border" />

    {markers.length > 0 && 
      (<Button variant="destructive" className="absolute left-2 bottom-[140px] lg:bottom-[190px]" onClick={deleteAllMarkers}>
          <DeleteOutlineOutlinedIcon/> Delete Markers
      </Button>
      )} 

       <Button
          onClick={onSave}
          variant="default"
          className="absolute bottom-[90px] lg:bottom-[140px] left-2 z-5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          <AddOutlinedIcon/> {(selectedCategory && selectedCategory ==='Property Services')? (<>Save Location</>):(<>Save Property Map</>)}
        </Button>

        <Button variant="destructive" className="absolute left-2 bottom-10 lg:bottom-[90px]" onClick={deleteAll}>
        <DeleteOutlineOutlinedIcon/> Delete All
        </Button>
        

        <DrawerPublic onChange={handlePropertyLocation} selectedCategory={selectedCategory} latitude={latitude.toString()} longitude={longitude.toString()} />



       
    

        <div className="absolute top-2 right-1 z-50 flex flex-col space-y-2 p-2 rounded shadow-md max-h-[90vh] overflow-y-auto">

{/* Fullscreen Button */}
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button onClick={handleFullscreen} className="w-14 lg:w-full text-gray-600" variant="outline">
        <FullscreenOutlinedIcon />
        <div className="hidden lg:inline">Toggle Fullscreen</div>
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Toggle Fullscreen</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

{/* Marker Button */}
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        className={`w-14 lg:w-full ${
          selectedControl === "marker" ? "bg-green-600 hover:bg-green-700 text-white" : "text-gray-600"
        }`}
        onClick={() => setSelectedControl("marker")}
        variant={selectedControl === "marker" ? "default" : "outline"}
      >
        <RoomOutlinedIcon />
        <div className="hidden lg:inline">Marker</div>
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Add Marker</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

{/* Marker Options - LEFT SIDE */}
{selectedControl === "marker" && (
  <div className="fixed top-1 left-2 z-40 flex flex-col p-2 border bg-[#e4ebeb] border-white rounded-lg gap-2 mb-2 min-w-[250px] max-h-[90vh] overflow-y-auto">
    <h3 className="text-sm font-medium text-gray-700">Select Marker Type</h3>
    <div className="flex items-center gap-4 flex-wrap">
      <div className="min-w-[200px]">
        <Select
          value={selected.label}
          onValueChange={(value) => {
            const match = markerOptions.find((opt) => opt.label === value);
            if (match) {
              setSelected(match);
              setSelectedMarkerType(match);
              selectedMarkerTypeRef.current = match;
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select marker type" />
          </SelectTrigger>
          <SelectContent>
            {markerOptions.map((opt) => (
              <SelectItem key={opt.label} value={opt.label}>
                <div className="flex items-center gap-2">
                  <img src={opt.icon} alt={opt.label} className="w-4 h-4" />
                  {opt.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
)}


{/* Polyline Button */}
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        onClick={() => setSelectedControl("polyline")}
        className={`w-14 lg:w-full ${
          selectedControl === "polyline" ? "bg-green-600 hover:bg-green-700 text-white" : "text-gray-600"
        }`}
        variant={selectedControl === "polyline" ? "default" : "outline"}
      >
        <ShowChartOutlinedIcon />
        <div className="hidden lg:inline">Polyline</div>
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Add Polyline</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

{/* Polygon Button */}
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        onClick={() => setSelectedControl("polygon")}
        className={`w-14 lg:w-full ${
          selectedControl === "polygon" ? "bg-green-600 hover:bg-green-700 text-white" : "text-gray-600"
        }`}
        variant={selectedControl === "polygon" ? "default" : "outline"}
      >
        <RectangleOutlinedIcon />
        <div className="hidden lg:inline">Polygon</div>
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Add Polygon</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

{/* Control Off Button */}
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        onClick={() => setSelectedControl("none")}
        className={`w-14 lg:w-full ${
          selectedControl === "none" ? "bg-green-600 hover:bg-green-700 text-white" : "text-gray-600"
        }`}
        variant={selectedControl === "none" ? "default" : "outline"}
      >
        <BlockOutlinedIcon />
        <div className="hidden lg:inline">Control Off</div>
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Control Off</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

{/* Import Button */}
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button onClick={handleOpenUploadPopup} className="w-14 lg:w-full" variant="outline">
        <UploadFileOutlinedIcon />
        <div className="hidden lg:inline">Import</div>
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Import land subdivisions</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

{/* Exit Button */}
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button onClick={onClose} className="w-14 lg:w-full" variant="outline">
        <CloseOutlinedIcon />
        <div className="hidden lg:inline">Exit</div>
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Exit</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
</div>
</div>




{!latitude && !longitude && (
  <div className="fixed inset-0 p-1 flex items-center justify-center bg-black h-screen bg-opacity-80 z-50">
    <div className="flex flex-col justify-center items-center dark:text-gray-300 rounded-lg p-1 lg:p-6 w-full md:max-w-3xl lg:max-w-4xl h-screen relative">
      
      {/* Close Button */}
      <button
        title="Close"
        onClick={() => onSave()}
        className="absolute right-5 top-3 p-1 flex gap-1 items-center hover:bg-green-600 text-[#e4ebeb] rounded-sm"
      >
        <CloseOutlinedIcon />
      </button>

      {/* Drawer Component */}
      <div className="flex flex-col gap-2 text-[#30D32C] items-center">
        <DrawerPublic
          onChange={handlePropertyLocation}
          latitude={latitude.toString()}
          longitude={longitude.toString()}
          selectedCategory={selectedCategory}
        />

        {/* Toggle Mapping Info */}
   {selectedCategory !== "Property Services" && (<>
   <button
          onClick={() => setShowMappingInfo(!showMappingInfo)}
          className="text-green-600 underline mt-2 text-xs px-4 py-2 rounded-md hover:text-green-700 transition"
        >
          Benefits of using the Advanced Property Mapping Tool?
        </button></>)}
      </div>

      {/* Mapping Info Modal */}
      {showMappingInfo && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-2 z-50">
          <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white rounded-xl p-2 w-full md:max-w-3xl lg:max-w-4xl shadow-lg">

            {/* Close Mapping Info */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowMappingInfo(false)}>
                <CloseOutlinedIcon fontSize="small" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="h-[70dvh] bg-gray-50 dark:bg-[#131B1E] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-[#e4ebeb] text-center border-b pb-2">
                Benefits of the Advanced Property Mapping Tool
              </h3>

              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2 mt-3">
                <li>📍 <span className="font-medium">Draw and Highlight Property Boundaries</span> - Clearly outline property limits for buyers.</li>
                <li>📏 <span className="font-medium">Automatic Area Calculation</span> - Get instant property area in m², acres, or hectares.</li>
                <li>📌 <span className="font-medium">Place Markers for Key Facilities</span> - Identify water wells, electricity poles, boreholes, and more.</li>
                <li>🛣️ <span className="font-medium">Add Lines for Accessibility & Boundaries</span> - Display footpaths, fences, and access roads.</li>
                <li>📐 <span className="font-medium">Distance Measurement Tool</span> - Measure distances to roads, schools, shopping centers, and more.</li>
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
)}

    </div>
  );
}
