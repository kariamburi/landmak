"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Card, CardContent } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
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
import { DrawerDemo } from "./DrawerDemo";
import { DrawerPublic } from "./DrawerPublic";
import { getAlldynamicAd, getListingsNearLocation } from "@/lib/actions/dynamicAd.actions";
import { IdynamicAd } from "@/lib/database/models/dynamicAd.model";
import HorizontalCard from "./HorizontalCard";
import VerticalCard from "./VerticalCard";
import ProgressPopup from "./ProgressPopup";
//import { ScrollArea } from "@radix-ui/react-scroll-area";
import HorizontalCardPublic from "./HorizontalCardPublic";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ScrollArea } from "../ui/scroll-area";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEAPIKEY as string;

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: -1.286389, // Nairobi, Kenya
  lng: 36.817223,
};
type CollectionProps = {
  queryObject: any;
  lat?: string;
  lng?: string;
  onClose:() => void;
  handleAdEdit: (id:string) => void;
  handleAdView: (id:string) => void;
  handleCategory: (value:string) => void;
  handleOpenSell:() => void;
  handleOpenPlan:() => void;
  collectionType?: "Ads_Organized" | "My_Tickets" | "All_Ads";
};

export default function PropertyMap({queryObject, lat, lng, handleCategory, handleOpenPlan, handleOpenSell, onClose, handleAdEdit, handleAdView}:CollectionProps) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [center, setCenter] = useState(defaultCenter);
   const [MapType, setMapType] = useState("satellite");
   const [latitude, setLatitude] = useState("");
   const [longitude, setLongitude] = useState("");
   const [polygonPath, setPolygonPath] = useState<any[]>([]);
   const [selectedPoints, setSelectedPoints] = useState<{ lat: number; lng: number }[]>([]);
   const [area, setArea] = useState<number | null>(null);
   const [zoom, setZoom] = useState<number>(16);
   const [distance, setDistance] = useState<string | null>(null);
   const [showAmenities, setShowAmenities] = useState(false);
   const [amenityType, setAmenityType] = useState<string | null>(null);
   const [amenities, setAmenities] = useState<any[]>([]);
   const [streetViewVisible, setStreetViewVisible] = useState(false);
   const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
   const mapRef = useRef<google.maps.Map | null>(null);
   const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
   const polygonsRef = useRef<google.maps.Polygon[]>([]);
   const markersRef = useRef<google.maps.Marker[]>([]);
   const [errorMessage, setErrorMessage] = useState("");
   const [error, setError] = useState(false);
  

 const [newpage, setnewpage] = useState(false);
  const [data, setAds] = useState<IdynamicAd[]>([]); // Initialize with an empty array
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
 const [isOpenP, setIsOpenP] = useState(false);
 const [showMappingInfo, setShowMappingInfo] = useState(false);

 const router = useRouter();
 const searchParams = useSearchParams();
  const handleOpenP = () => {
    //openLoading();
  }

  const handleCloseP = () => {
    setIsOpenP(false);
  };
  // const observer = useRef();
  const observer = useRef<IntersectionObserver | null>(null);
  const [NewqueryObject, setNewqueryObject] = useState<any>(queryObject);
  
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
      //alert(queryObject.location)
      const Ads = await getListingsNearLocation({
        //const Ads = await getAlldynamicAd({
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
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    if (!mapRef.current || !lat || !lng) return;
   
    const latitude = Number(lat);
    const longitude = Number(lng);
 
  setCenter({ lat: latitude, lng: longitude });
  setLatitude(latitude.toFixed(6)); // ✅ Update latitude
  setLongitude(longitude.toFixed(6)); // ✅ Update longitude
  handlePostLocation(lat.toString(),lng.toString());
  // ✅ Ensure the Google Map instance updates its center
  if (mapRef.current) {
    mapRef.current.setCenter({ lat: latitude, lng: longitude });
  }
    
     }, [mapRef.current]);

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
         fillOpacity: 0.1,
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
       `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`,
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
           setSelectedPoints([userLocation, center]);
   
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
     polygonsRef.current.forEach((polygon) => {
       polygon.setMap(null);
     });
     polygonsRef.current = [];
 
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
       setErrorMessage("Select a location on the map to calculate the route distance to the property, such as from the nearest shopping center.");
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
   const [inputMode, setInputMode] = useState<'area' | 'routeFromSelect' | 'routeFromMyLocation' | 'schools' | 'hospitals' | 'malls' | 'trunsits'>('routeFromSelect');
  
   const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
     if (!event.latLng) return; // ✅ Prevents errors if latLng is null
   
     const newLat = event.latLng.lat();
     const newLng = event.latLng.lng();
     
     setLatitude(newLat.toFixed(6)); // ✅ Update latitude
     setLongitude(newLng.toFixed(6)); // ✅ Update longitude
     setCenter({ lat: newLat, lng: newLng }); // ✅ Keep map centered on marker
     handlePostLocation(newLat.toString(),newLng.toString());
     // ✅ Ensure the Google Map instance updates its center
     if (mapRef.current) {
       mapRef.current.setCenter({ lat: newLat, lng: newLng });
     }
   };
   
 
   const handlePropertyLocation = (lat: string | number, lng: string | number) => {
     if (!mapRef.current || !lat || !lng) return;
   
     const latitude = Number(lat);
     const longitude = Number(lng);
  
   setCenter({ lat: latitude, lng: longitude });
   setLatitude(latitude.toFixed(6)); // ✅ Update latitude
   setLongitude(longitude.toFixed(6)); // ✅ Update longitude
   handlePostLocation(lat.toString(),lng.toString());
   // ✅ Ensure the Google Map instance updates its center
   if (mapRef.current) {
     mapRef.current.setCenter({ lat: latitude, lng: longitude });
   }
    // marker.addListener("dragend", (event: google.maps.MapMouseEvent) => handleMarkerDragEnd(event));
   
  
   };
  
  const isVertical=false;
  const isAdCreator=false;
  const userId="";
  
  const [showGuide, setShowGuide] = useState(false);
   return isLoaded ? (  <>
    <div className="flex w-full h-[100dvh]">
    
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
      {/* Sidebar with Toggle Button */}
      <div
        className={`bg-white h-[100dvh] shadow-lg transition-transform duration-300 ease-in-out fixed md:relative ${
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
          <div className="flex flex-col space-y-4">
             <div className="flex justify-between items-center w-full">
            <p className="p-1">Properties Nearby</p>



            <SignedIn>

<Button onClick={() => {
    
    handleOpenSell();
   // router.push("/ads/create");
  
}} variant="outline" className="flex items-center gap-2">
<AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL PROPERTY
</Button>

</SignedIn>

<SignedOut>
<Button  onClick={() => {
      setIsOpenP(true);
      router.push("/sign-in");
    }} variant="outline" className="flex items-center gap-2">
<AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL PROPERTY
</Button>

  
</SignedOut>
</div>
          {data.length > 0 ? (
      
      <ScrollArea className="h-[90dvh] lg:h-[90dvh] overflow-y-auto flex p-0 bg-white rounded-lg">
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
              />
            </div>
          );
        })}
      </ul>
    </ScrollArea>
    
        
      ) : (
        loading === false && (
          <>
            <div className="flex items-center wrapper min-h-[200px] w-full flex-col gap-1 rounded-[14px] bg-grey-50 py-28 text-center">
              <h3 className="font-bold text-[16px] lg:text-[25px]">
                Not Found
              </h3>
              <p className="text-sm lg:p-regular-14">No nearby properties found.</p>
            
            <SignedIn>

            <Button onClick={() => {
                
                handleOpenSell();
               // router.push("/ads/create");
              
            }} variant="default" className="flex items-center gap-2">
        <AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL PROPERTY
      </Button>

            </SignedIn>

            <SignedOut>
            <Button  onClick={() => {
                  setIsOpenP(true);
                  router.push("/sign-in");
                }} variant="default" className="flex items-center gap-2">
        <AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL PROPERTY
      </Button>

              
            </SignedOut>
        
            </div>
          </>
        )
      )}
      {loading && (
        <div>
          <div className="w-full mt-10 h-full flex flex-col items-center justify-center">
            <Image
              src="/assets/icons/loading2.gif"
              alt="loading"
              width={40}
              height={40}
              unoptimized
            />
          </div>
        </div>
      )}
      </div>
        )}
      </div>

      {/* Map Section with Toggle Button */}
      <div className={`w-full mt-0 lg:mt-0 relative transition-all duration-300 h-[100dvh] ${
        showSidebar ? "hidden md:block" : "block"
      }`}>
      
      
        <Button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute bottom-10 lg:bottom-[90px] left-4 z-20 md:block bg-white text-gray-700 shadow-lg hover:text-white"
        >
         {showSidebar ? (<><KeyboardArrowLeftOutlinedIcon/> <div className="hidden lg:inline">Hide Nearby Properties</div></>) : (<><KeyboardArrowRightOutlinedIcon/> <div className="hidden lg:inline">Show Nearby Properties</div></>)} 
        </Button>
        
        <div className="absolute top-[60px] lg:top-2 left-3 right-3 lg:left-[250px] lg:right-[150px] z-10  grid grid-cols-7 mb-0 flex gap-1">

<button  title="Calculate the best route from selected points" onClick={()=> {setInputMode('routeFromSelect'); setZoom(16); handleClear();}} 
  className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px]  rounded-l-lg ${inputMode === 'routeFromSelect' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
  //</div>className="p-1 flex flex-col items-center text-[10px] bg-green-100 border border-green-500 text-green-500 rounded"
  >
<PushPinOutlinedIcon sx={{ fontSize: 16 }}/> Select route
</button>


<button   title="Calculate the route from your current location" onClick={()=> {setInputMode('routeFromMyLocation');  handleClear(); setZoom(17);}}  
 className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px] ${inputMode === 'routeFromMyLocation' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
//className="p-1 flex flex-col items-center text-[10px] bg-gray-100 border border-gray-900 text-gray-900 rounded"
>
   <GpsFixedOutlinedIcon sx={{ fontSize: 16 }}/> My route
</button>
<button  title="Draw a polygon to measure land area"  onClick={()=> {setInputMode('area');  handleClear(); setZoom(18); handleDrawPolygon();}} 
//  className="p-1 flex flex-col items-center text-[10px] bg-blue-100 border border-blue-500 text-blue-500 rounded"
  className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px] ${inputMode === 'area' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
  >
    <MapOutlinedIcon sx={{ fontSize: 16 }}/> Area
  </button>

  <button   title="Show nearby schools on the map" onClick={() => {setInputMode('schools');  handleClear(); setZoom(14); fetchNearbyPlaces("school", "yellow");}} 
     className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px] ${inputMode === 'schools' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
 // className="p-1 flex flex-col items-center text-[10px]  bg-yellow-100 border border-yellow-500 text-yellow-500 rounded"
  >
   <EscalatorWarningOutlinedIcon sx={{ fontSize: 16 }}/> Schools
  </button>
  <button  title="Show nearby hospitals on the map" onClick={() => {setInputMode('hospitals');  handleClear(); setZoom(14); fetchNearbyPlaces("hospital", "red");}} 
    className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px] ${inputMode === 'hospitals' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
  //className="p-1 flex flex-col items-center text-[10px] bg-red-100 border border-red-500 text-red-500 rounded"
  >
   <LocalHospitalOutlinedIcon sx={{ fontSize: 16 }}/> Hospitals
  </button>
  <button   title="Show nearby shopping malls on the map" onClick={() => {setInputMode('malls');  handleClear(); setZoom(14); fetchNearbyPlaces("shopping_mall", "purple");}} 
    className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px] ${inputMode === 'malls' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
  //className="p-1 flex flex-col items-center text-[10px]  bg-purple-100 border border-purple-500 text-purple-500 rounded"
  >
   <LocalMallOutlinedIcon  sx={{ fontSize: 16 }}/> Malls
  </button>
  <button  title="Show nearby transit stations on the map" onClick={() =>  {setInputMode('trunsits');  handleClear(); setZoom(14); fetchNearbyPlaces("transit_station", "indigo");}} 
  className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px] rounded-r-lg ${inputMode === 'trunsits' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
  //className="p-1 flex flex-col items-center text-[10px]  bg-indigo-100 border border-indigo-500 text-indigo-500 rounded"
  >
  <AirportShuttleOutlinedIcon sx={{ fontSize: 16 }}/>
    Bus Stations
  </button>
 {/*  <button  title="Clear all markers, routes, and polygons from the map" onClick={handleClear} className="p-1 flex flex-col items-center text-[10px] border border-gray-500 bg-gray-100 text-gray-500 rounded">
   <ClearOutlinedIcon sx={{ fontSize: 16 }}/> Clear
  </button>*/}
</div>

       

        <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onClick={(e) => {
            if (e.latLng) {
               const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };
               if(inputMode === 'routeFromSelect'){
                setSelectedPoints([center,newPoint]);
               }
              
              }
          }}
          options={{
            zoomControl: true, // Enable zoom controls
            mapTypeControl: true, // Enable map type switch
            streetViewControl: true, // Enable Street View control
            fullscreenControl: true, // Enable Fullscreen button
            mapTypeId: MapType, // Set default to Satellite mode
          }}
        onLoad={(map) => {
            mapRef.current = map;
             // Listen for map type changes
    map.addListener("maptypeid_changed", () => {
      const newMapType = map.getMapTypeId();
      console.log("Map Type Changed to:", newMapType);
      setMapType(newMapType ?? "satellite");
      // Handle the event (e.g., update state, show a message, etc.)
   //   if (newMapType === "roadmap") {
//console.log("Switched to Map View");
       
     // } else if (newMapType === "satellite") {
    //    console.log("Switched to Satellite View");
    //  }
    });
          }}
      >
        {/* Draggable Marker */}
       {latitude && longitude && <Marker
          position={center}
          title={"Property Location"} // Set the title here
          draggable
          onDragEnd={handleMarkerDragEnd} 
         
          onClick={() => {setStreetViewVisible(!streetViewVisible)}}
        />} 

        {/* Drawn Polygon */}
        {polygonPath.length > 0 && (
          <Polygon paths={polygonPath} options={{ fillColor: "#FF0000", fillOpacity: 0.1,  strokeColor: "#0000FF", strokeWeight: 2 }} />
        )}

       {directions && <DirectionsRenderer directions={directions} />}

        {/* Distance Measurement Points */}
     
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
              position: center,
              pov: { heading: 100, pitch: 0 },
              zoom: 1,
            }}
          />
        )}
        {area !== null && (
  <div className="absolute top-[150px] lg:top-20 left-5 p-2 text-white bg-black z-5 rounded-md shadow-md">
    <div className="text-sm">
      <strong>Land Area:</strong>
      <div>{area.toFixed(2)} m²</div>
      <div>{(area / 10000).toFixed(2)} ha</div>
      <div>{(area / 4046.86).toFixed(2)} acres</div>
    </div>
  </div>
)}
 
  
{distance && (
  <div className="absolute top-[150px] lg:top-20 right-5 p-2 text-white bg-black z-5 rounded-md shadow-md">
    <div className="text-sm">
      <strong>Distance:</strong>
      <div>{distance}</div>
    </div>
  </div>
)}
{(inputMode === 'routeFromSelect') && (<>
<Button
onClick={()=> handleBestRouteCalculation()}
variant="default"
className="absolute bottom-[90px] lg:bottom-[140px] left-4 z-20 bg-green-600 shadow-lg hover:bg-green-700"
>
<TurnSharpLeftOutlinedIcon/> <div className="hidden lg:inline">Get route distance</div>
</Button>

</>)}
{(inputMode === 'area') && (<>


<Button
onClick={()=> handleClear()}
variant="default"
className="absolute bottom-[90px] lg:bottom-[140px] left-4 z-20 bg-red-600 shadow-lg hover:bg-red-700"
>
<CloseOutlinedIcon /> <div className="hidden lg:inline">Clear Drawing</div>
</Button>

</>)}
{(inputMode === 'routeFromMyLocation') && (<>
  <Button
  onClick={()=> handleDirectionClick()}
  className="absolute bottom-[90px] lg:bottom-[140px] left-4 z-20 bg-green-600 shadow-lg hover:bg-green-700"
  >
  <TurnSharpLeftOutlinedIcon/><div className="hidden lg:inline">Get route distance</div>
  </Button>
 {/*  <div className="absolute top-[55px] w-[170px] left-[10px] z-10 shadow-md">
  <button  title="Calculate the route from your current location" onClick={()=> handleDirectionClick()} 
   className="p-2 flex gap-1 items-center text-xs bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
      >
<GpsFixedOutlinedIcon sx={{ fontSize: 16 }}/>  Get route distance from my current location to the property location?
</button>
</div>*/}
</>)}
{latitude && longitude && (  <DrawerPublic onChange={handlePropertyLocation} latitude={latitude} longitude={longitude}/>)}

<div className="absolute top-[10px] right-20 z-5">
    <button  title="Close" onClick={()=> onClose()} 
     className="p-1 flex gap-1 h-10 w-10 justify-center items-center text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-sm"
        >
   <CloseOutlinedIcon />
</button></div>
      </GoogleMap>
      </div>
    
     
    </div>

    {!latitude && !longitude && (<div className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="justify-center items-center dark:text-gray-300 rounded-lg p-1 lg:p-6 w-full md:max-w-3xl lg:max-w-4xl h-screen flex flex-col">
        {/* Header */}
        <Button  variant="outline" title="Close" onClick={()=> onClose()} 
     className="absolute right-6 top-8 p-1 flex gap-1 items-center"
        >
   <CloseOutlinedIcon />
</Button>
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

 
          
   
          {showMappingInfo && (
  <div className="fixed inset-0 p-2 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white rounded-xl p-2 w-full md:max-w-3xl lg:max-w-4xl shadow-lg">
      
      {/* Close Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowMappingInfo(false)}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <CloseOutlinedIcon fontSize="small" />
        </button>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="h-[60vh] bg-gray-50 dark:bg-[#131B1E] rounded-lg p-4">
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 text-center border-b pb-2">
          Benefits of a Virtual Property Location Tour
        </h3>
        
        {/* Benefits List */}
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

        {/* Advanced Mapping Info */}
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-4 text-center border-b pb-2">
          We have an <span className="text-green-600 hover:underline cursor-pointer" onClick={() => handleCategory('Property')}>Advanced Property Mapping Tool</span> when creating property ads in the Property Category.
        </p>
  {/* Desktop Screenshot */}
  <div className="flex justify-center">
        <Image
          src={"/assets/icons/property-map.png"}
          alt={"Mapping Tool"}
          className="w-full lg:w-[600px] max-h-[350px] mb-4 rounded-lg border border-gray-200 dark:border-gray-700"
          width={800}
          height={500}
        />
      </div>
        {/* Fraud Prevention */}
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 text-center border-b pb-2 mt-5">
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
   )} </>
  ) : (
    <p>Loading Map...</p>
  );
}
