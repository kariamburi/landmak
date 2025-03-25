"use client";

import { useState, useRef, useEffect } from "react";
import {
  DirectionsRenderer,
  GoogleMap,
  LoadScript,
  Marker,
  Polygon,
  StreetViewPanorama,
  useLoadScript,
} from "@react-google-maps/api";
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import EscalatorWarningOutlinedIcon from '@mui/icons-material/EscalatorWarningOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';;
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import OpenWithOutlinedIcon from '@mui/icons-material/OpenWithOutlined';
import GpsFixedOutlinedIcon from '@mui/icons-material/GpsFixedOutlined';
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Button } from "@/components/ui/button";
import TurnSharpLeftOutlinedIcon from '@mui/icons-material/TurnSharpLeftOutlined';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import MappingAdsPopup from "./MappingAdsPopup";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEAPIKEY as string;

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: -1.286389, // Nairobi, Kenya
  lng: 36.817223,
};

type CardProps = {
  id: string;
  propertyarea: any;
  title: string;
  price: number;
  imageUrls: string[];
 
};
const MappingAds = ({ id, title, price, imageUrls, propertyarea }: CardProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
 const [center, setCenter] = useState<any>(propertyarea.location?.coordinates ? {lat:propertyarea.location.coordinates[0], lng:propertyarea.location.coordinates[1]}:defaultCenter);
 const [markerPosition, setMarkerPosition] = useState(propertyarea.location?.coordinates ? {lat:propertyarea.location.coordinates[0], lng:propertyarea.location.coordinates[1]}:defaultCenter);
 const [markers, setMarkers] = useState<{ lat: number; lng: number; icon: string; color: string; label: string }[]>([]);
 const [polylines, setPolylines] = useState<
 { path: { lat: number; lng: number }[]; color: string; width: number; label: string }[]
>([]);
const [shapes, setShapes] = useState<any[]>([]);
 const [polygonPath, setPolygonPath] = useState<any[]>(propertyarea.polygonPath || []);
  const [area, setArea] = useState<number | null>(propertyarea.area || null);
  const [selectedPoints, setSelectedPoints] = useState<{ lat: number; lng: number }[]>([]);
  const [distance, setDistance] = useState<string | null>(null);
  const [showAmenities, setShowAmenities] = useState(false);
  const [MapType, setMapType] = useState("satellite");
  const [amenities, setAmenities] = useState<any[]>([]);
  const [streetViewVisible, setStreetViewVisible] = useState(false);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const polygonsRef = useRef<google.maps.Polygon[]>([]);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [zoom, setZoom] = useState<number>(18);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);

   const [showPopup, setShowPopup] = useState(false);
  
    const handleOpenPopup = () => {
      setShowPopup(true);
    };
  
    const handleClosePopup = () => {
      setShowPopup(false);
    };
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places", "geometry", "drawing"],
  });

  // Handle Polygon Drawing
  const handleDrawPolygon = () => {
    if (!mapRef.current) return;

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        fillColor: "red",
        fillOpacity: 0.4,
        strokeColor: "red",
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1,
      },
    });

    drawingManager.setMap(mapRef.current);
    drawingManagerRef.current = drawingManager;

    google.maps.event.addListener(drawingManager, "overlaycomplete", (event: any) => {
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        const polygon = event.overlay as google.maps.Polygon;
        polygonsRef.current.push(polygon);
        handlePolygonComplete(polygon);
        drawingManager.setDrawingMode(null);
      }
    });
  };

  // Handle Polygon Completion
  const handlePolygonComplete = (polygon: google.maps.Polygon) => {
    const path = polygon.getPath().getArray().map((latLng) => ({
      lat: latLng.lat(),
      lng: latLng.lng(),
    }));
    setPolygonPath(path);
    calculateArea(polygon);
  };

  // Calculate Polygon Area
  const calculateArea = (polygon: google.maps.Polygon) => {
    if (window.google && window.google.maps) {
      const calculatedArea = window.google.maps.geometry.spherical.computeArea(polygon.getPath());
      setArea(calculatedArea);
    }
  };
  const handleDirectionClick = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${markerPosition.lat},${markerPosition.lng}`,
      "_blank"
    );
  };
  const handleRouteFromMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
  
          // Set the user location as the starting point
          setSelectedPoints([userLocation, markerPosition]);
  
          // Call function to get route
          const directionsService = new google.maps.DirectionsService();
          const [origin, destination] = selectedPoints;
         
          directionsService.route(
            {
              origin,
              destination,
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK && result) {
                setDirections(result);
                
                const distanceValue = result.routes?.[0]?.legs?.[0]?.distance?.text;
                setDistance(distanceValue || null);
              } else {
                alert("Unable to find a route.");
              }
              
            }
          );
         // calculateRoute(userLocation, markerPosition);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
 

  // Handle Distance Calculation
  const handleDistanceCalculation = () => {
    if (selectedPoints.length < 2) {
      alert("Please select point on the map to measure route from to the destination marked point.");
      return;
    }

    const [point1, point2] = selectedPoints;
    const calculatedDistance = window.google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(point1.lat, point1.lng),
      new google.maps.LatLng(point2.lat, point2.lng)
    );

    setDistance(`${(calculatedDistance / 1000).toFixed(2)} km`);
  };

  // Fetch Nearby Places
  const fetchNearbyPlaces = (type: string, color: string) => {
    if (!mapRef.current) return;

    const service = new google.maps.places.PlacesService(mapRef.current);
    const request = {
      location: center,
      radius: 2000,
      type,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        setAmenities(
          (results || []).map((place) => ({
            ...place,
            color, // Assign color to each place type
          }))
        );
        setShowAmenities(true);
      }
    });
  };

  // Clear all markers and polygons
  const handleClear = () => {
    // Remove all polygons
  //  polygonsRef.current.forEach((polygon) => {
   //   polygon.setMap(null);
   // });
  //  polygonsRef.current = [];

    // Remove all markers
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];
// Clear the route (polyline)
// Clear directions
setDirections(null); // Assuming you store directions in state
    // Clear selected points
    setSelectedPoints([]);
    setPolygonPath([]);
    setArea(null);
    setDistance(null);
    setShowAmenities(false);
    setAmenities([]);
  };
  const handleBestRouteCalculation = () => {
    if (selectedPoints.length < 2) {
      //alert("Please select from which point on the map.");
      setErrorMessage("Please select a location on the map to measure the route distance to the property. For example, from the nearest shopping center to the property location.");
      setError(true);
      return;
    }
  
    const directionsService = new google.maps.DirectionsService();
    const [origin, destination] = selectedPoints;
   
    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          
          const distanceValue = result.routes?.[0]?.legs?.[0]?.distance?.text;
          setDistance(distanceValue || null);
        } else {
          alert("Unable to find a route.");
        }
        
      }
    );
  };

  const [distancePosition, setDistancePosition] = useState({ top: 0, left: 0 });

useEffect(() => {
  if (!directions || !mapRef.current) return;

  const map = mapRef.current;
  const bounds = new google.maps.LatLngBounds();

  // Get start and end locations
  const startLocation = directions.routes[0].legs[0].start_location;
  const endLocation = directions.routes[0].legs[0].end_location;

  bounds.extend(startLocation);
  bounds.extend(endLocation);

  // Get midpoint of the route
  const midLat = (startLocation.lat() + endLocation.lat()) / 2;
  const midLng = (startLocation.lng() + endLocation.lng()) / 2;
  const midPoint = new google.maps.LatLng(midLat, midLng);

  // Convert LatLng to pixel position
  const overlayProjection = map.getProjection();
  if (overlayProjection) {
    const point = overlayProjection.fromLatLngToPoint(midPoint);
    if (point) {
      setDistancePosition({ top: point.y, left: point.x });
    }
  }
}, [directions]);
  const [inputMode, setInputMode] = useState<'area' | 'routeFromSelect' | 'routeFromMyLocation' | 'schools' | 'hospitals' | 'malls' | 'trunsits'>('area');
 // useEffect(() => {
 //   if (isLoaded) {
  //    const timeout = setTimeout(() => {
  //      setInputMode("area");
 //       handleClear();
   //     setZoom(18);
   //   }, 1000); // 5 seconds delay
  
   //   return () => clearTimeout(timeout); // Cleanup in case component unmounts
   // }
  //}, [isLoaded]);
  
  return isLoaded ? (
    <div className="w-full border dark:bg-[#2D3236] bg-gray-200 rounded-lg">
       {/* Alert Dialog */}
       {error && (
        <AlertDialog open={error} onOpenChange={setError}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Error</AlertDialogTitle>
              <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
             {/* <AlertDialogCancel onClick={() => setError(false)}>Cancel</AlertDialogCancel>*/} 
              <AlertDialogAction onClick={() => setError(false)}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {/* Action Buttons */}
      <div className="grid grid-cols-7 mb-0 flex gap-1">
      <button  title="Draw a polygon to measure land area"  onClick={()=> {setInputMode('area'); handleClear(); setZoom(18);
        
      }} 
      className={`p-1 flex gap-1 flex-col lg:flex-raw items-center  text-[10px]  rounded-tl-xl ${inputMode === 'area' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
        >
          <MapOutlinedIcon sx={{ fontSize: 16 }}/> Land Area
        </button>
      
      <button  title="Calculate the best route from selected points" onClick={()=> {setInputMode('routeFromSelect'); setZoom(16); handleClear();}} 
        className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px]  ${inputMode === 'routeFromSelect' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
        >
  <PushPinOutlinedIcon sx={{ fontSize: 16 }}/> Select route
</button>
  
  
     <button   title="Calculate the route from your current location" onClick={()=> {setInputMode('routeFromMyLocation');  handleClear(); setZoom(17);}}  
       className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px]  ${inputMode === 'routeFromMyLocation' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
     //className="p-1 flex flex-col items-center text-[10px] bg-gray-100 border border-gray-900 text-gray-900 rounded"
     >
         <GpsFixedOutlinedIcon sx={{ fontSize: 16 }}/> My route
      </button>

        <button   title="Show nearby schools on the map" onClick={() => {setInputMode('schools');  handleClear(); setZoom(14); fetchNearbyPlaces("school", "yellow");}} 
           className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px]  ${inputMode === 'schools' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
       // className="p-1 flex flex-col items-center text-[10px]  bg-yellow-100 border border-yellow-500 text-yellow-500 rounded"
        >
         <EscalatorWarningOutlinedIcon sx={{ fontSize: 16 }}/> Schools
        </button>
        <button  title="Show nearby hospitals on the map" onClick={() => {setInputMode('hospitals');  handleClear(); setZoom(14); fetchNearbyPlaces("hospital", "red");}} 
          className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px]  ${inputMode === 'hospitals' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
        //className="p-1 flex flex-col items-center text-[10px] bg-red-100 border border-red-500 text-red-500 rounded"
        >
         <LocalHospitalOutlinedIcon sx={{ fontSize: 16 }}/> Hospitals
        </button>
        <button   title="Show nearby shopping malls on the map" onClick={() => {setInputMode('malls');  handleClear(); setZoom(14); fetchNearbyPlaces("shopping_mall", "purple");}} 
          className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px]  ${inputMode === 'malls' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
        //className="p-1 flex flex-col items-center text-[10px]  bg-purple-100 border border-purple-500 text-purple-500 rounded"
        >
         <LocalMallOutlinedIcon  sx={{ fontSize: 16 }}/> Malls
        </button>
        <button  title="Show nearby transit stations on the map" onClick={() =>  {setInputMode('trunsits');  handleClear(); setZoom(14); fetchNearbyPlaces("transit_station", "indigo");}} 
        className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px]  rounded-tr-xl ${inputMode === 'trunsits' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
        //className="p-1 flex flex-col items-center text-[10px]  bg-indigo-100 border border-indigo-500 text-indigo-500 rounded"
        >
        <AirportShuttleOutlinedIcon sx={{ fontSize: 16 }}/>
          Bus Stations
        </button>
       {/*  <button  title="Clear all markers, routes, and polygons from the map" onClick={handleClear} className="p-1 flex flex-col items-center text-[10px] border border-gray-500 bg-gray-100 text-gray-500 rounded">
         <ClearOutlinedIcon sx={{ fontSize: 16 }}/> Clear
        </button>*/}
      </div>

      {/* Display Calculated Area and Distance */}
     
      {/* Google Map */}
      <div className="bg-white rounded-b-xl dark:bg-[#131B1E] p-2 flex flex-col">
  <GoogleMap
  mapContainerStyle={containerStyle}
  center={center}
  zoom={zoom}
  onClick={(e) => {
    if (e.latLng) {
      const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      if(inputMode === 'routeFromSelect'){
        setSelectedPoints([markerPosition,newPoint]);
       }
      
    }
  }}
  onLoad={(map) => {
    mapRef.current = map;
    map.addListener("maptypeid_changed", () => {
      const newMapType = map.getMapTypeId();
      console.log("Map Type Changed to:", newMapType);
      setMapType(newMapType ?? "satellite");
     
    });
  }}
  options={{
    zoomControl: true, // Enable zoom controls
    mapTypeControl: true, // Enable map type switch
    streetViewControl: true, // Enable Street View control
    fullscreenControl: true, // Enable Fullscreen button
    mapTypeId: MapType, // Set default to Satellite mode
  }}
>
{propertyarea.shapes.length === 0 && <Marker
position={center}
title={"Property Location"}
/>}

  {/* Render Markers */}
  {propertyarea.markers.map((markerData: any, index: number) => {
    const marker = new google.maps.Marker({
      position: { lat: markerData.lat, lng: markerData.lng },
      map: mapRef.current, // ✅ Fix: Add marker to the map
      title: markerData.label,
    });

    marker.setIcon({
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 0 C50 0, 0 50, 0 100 C0 150, 40 200, 100 250 C160 200, 200 150, 200 100 C200 50, 150 0, 100 0 Z"
        fill="${markerData.color}"/>
        <circle cx="100" cy="100" r="60" fill="#000000"/>
        <image href="${markerData.icon}" x="70" y="70" width="60" height="60"/>
        </svg>`)}`,
      scaledSize: new google.maps.Size(40, 40),
      anchor: new google.maps.Point(20, 40),
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="color: black; padding: 10px; font-size: 14px; font-weight: bold; text-align: center; border-radius: 5px;">
                  ${markerData.label}
                </div>`,
    });
    
    marker.addListener("click", () => {
      infoWindow.open(mapRef.current, marker);
    });

   // return null; // ✅ Fix: Prevent rendering issues in JSX
  })}

  {/* Render Polylines */}
  {propertyarea.polylines.map((polylineData: any, index: number) => {
    const polyline = new google.maps.Polyline({
      path: polylineData.path,
      strokeColor: polylineData.color,
      strokeWeight: polylineData.width,
      map: mapRef.current, // ✅ Fix: Add polyline to the map
    });

    const midPoint = polylineData.path[Math.floor(polylineData.path.length / 2)];

    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="font-size: 14px; color: black; font-weight: bold; text-align: center;">${polylineData.label}</div>`,
      position: midPoint,
    });

    polyline.addListener("click", () => {
      infoWindow.open(mapRef.current);
    });

   // return null;
  })}

  {/* Render Shapes */}
  {propertyarea.shapes.map((shapeData: any, index: number) => {
    let shape: google.maps.MVCObject | null = null;

    if (shapeData.type === "circle") {
      shape = new google.maps.Circle({
        center: shapeData.center,
        radius: shapeData.radius,
        strokeColor: shapeData.strokeColor,
        strokeWeight: shapeData.width,
        fillColor: shapeData.fillColor,
        fillOpacity: 0,
        map: mapRef.current, // ✅ Fix: Add shape to the map
      });
    } else if (shapeData.type === "rectangle") {
      shape = new google.maps.Rectangle({
        bounds: shapeData.bounds,
        strokeColor: shapeData.strokeColor,
        strokeWeight: shapeData.width,
        fillColor: shapeData.fillColor,
        fillOpacity: 0,
        map: mapRef.current, // ✅ Fix: Add shape to the map
      });
    } else if (shapeData.type === "polygon") {
      shape = new google.maps.Polygon({
        paths: shapeData.coordinates,
        strokeColor: shapeData.strokeColor,
        strokeWeight: shapeData.width,
        fillColor: shapeData.fillColor,
        fillOpacity: 0,
        map: mapRef.current, // ✅ Fix: Add shape to the map
      });
    }

    if (shape) {
      let position: google.maps.LatLng | null = null;
      if (shape instanceof google.maps.Circle) {
        position = shape.getCenter();
      } else if (shape instanceof google.maps.Rectangle) {
        position = shape.getBounds()?.getCenter() || null;
      } else if (shape instanceof google.maps.Polygon) {
        const path = shape.getPath().getArray();
        position = path.length > 0 ? path[Math.floor(path.length / 2)] : null;
      }

      if (position) {
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="font-size: 14px; color: black; font-weight: bold; text-align: center;">${shapeData.label || "Shape"}</div>
            <div style="font-size: 12px; color: gray; text-align: center; margin-top: 5px;">
              <strong>Land Area:</strong>
              <div>${shapeData.area ? shapeData.area.toFixed(2) + " m²" : "N/A"}</div>
              <div>${shapeData.area ? (shapeData.area / 10000).toFixed(2) + " ha" : "N/A"}</div>
              <div>${shapeData.area ? (shapeData.area / 4046.86).toFixed(2) + " acres" : "N/A"}</div>
            </div>
          `,
          position: position,
        });

        google.maps.event.addListener(shape, "click", () => {
          infoWindow.open(mapRef.current);
        });
      }
    }

    //return null;
  })}
  
 
  {selectedPoints.map((point, index) => (
            <Marker
              key={index}
              position={point}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: 'green',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 1,
                scale: 10,
              }}
            />
        ))}

        {/* Nearby Amenities Markers with Colors */}
        {showAmenities &&
          amenities.map((place, index) => (
            <Marker
              key={index}
              position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }}
              title={place.name} // Set the title here
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: place.color,
                fillOpacity: 1,
                strokeWeight: 2,
              }}
            />
          ))}

        {/* Street View */}
        {streetViewVisible && (
          <StreetViewPanorama
            options={{
              position: markerPosition,
              pov: { heading: 100, pitch: 0 },
              zoom: 1,
            }}
          />
        )}
     {directions && <DirectionsRenderer directions={directions} />}   
     {distance && (
  <div className="absolute top-20 right-5 p-2 text-white bg-black z-5 rounded-md shadow-md">
    <div className="text-sm">
      <strong>Distance:</strong>
      <div>{distance}</div>
    </div>
  </div>
)}



{(inputMode === 'routeFromMyLocation') && (<>
  <Button
  onClick={()=> handleDirectionClick()}
  title="Calculate the route from your current location"
  className="absolute top-[60px] left-2 z-5 bg-green-600 shadow-lg hover:bg-green-700"
  >
  <TurnSharpLeftOutlinedIcon/>Get route distance
  </Button>
 
</>)}
{(inputMode === 'routeFromSelect') && (<>

<Button
onClick={()=> handleBestRouteCalculation()}
variant="default"
title="flex-block Calculate the best route from selected points to propery location"
className="absolute top-[60px] left-2  z-5 bg-green-600 shadow-lg hover:bg-green-700"
>
<TurnSharpLeftOutlinedIcon/> Get route distance
</Button>

</>)}

<div className="absolute top-3 right-20 z-5">
    <button  title="Wide View" onClick={()=> handleOpenPopup()} 
     className="p-1 flex gap-1 items-center text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-sm"
        >
  <OpenWithOutlinedIcon/>
</button></div>
      </GoogleMap>
    </div>
    
    {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 z-50">
                      <div className="dark:bg-[#2D3236] dark:text-gray-100 bg-gray-200 p-2 w-full relative">
                       
                         <MappingAdsPopup
                                         id={id}
                                         title={title}
                                         price={price}
                                         imageUrls={imageUrls}
                                         propertyarea={propertyarea}
                                         onClose={handleClosePopup}
                                        
                                      
                                       />
                      </div>
                    </div>
                  )}
    
    </div>
  ) : (
    <p>Loading Map...</p>
  );
};

export default MappingAds;
