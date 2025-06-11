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
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import {
  Circle,
  DirectionsRenderer,
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
  OverlayView,
  Polygon,
  StreetViewPanorama,
  useLoadScript,
} from "@react-google-maps/api";
import { Icon } from "@iconify/react";
import Barsscale from "@iconify-icons/svg-spinners/bars-scale"; 
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
import { ScrollArea } from "@radix-ui/react-scroll-area";
import HorizontalCardPublic from "./HorizontalCardPublic";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { formatKsh } from "@/lib/help";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  userName:string; 
  userImage:string;
  onClose:() => void;
  handleOpenSell:() => void;
  handleOpenPlan:() => void;
  handleAdEdit: (id:string) => void;
  handleAdView: (id:string) => void;
  handleOpenChatId: (value:any) => void;
  collectionType?: "Ads_Organized" | "My_Tickets" | "All_Ads";
};
interface Property {
  id: string;
  name: string;
  location: { lat: number; lng: number };
}

export default function PropertyMapSearchComponent({queryObject, lat, lng, userName, 
  userImage, onClose,handleOpenChatId, handleOpenPlan, handleOpenSell, handleAdEdit, handleAdView}:CollectionProps) {
  const router = useRouter();
  const [openShowInfo, setOpenShowInfo] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
   const [newpage, setnewpage] = useState(false);
    const [filter, setfilter] = useState(false);
   const [data, setAds] = useState<IdynamicAd[]>([]); // Initialize with an empty array
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [mapCenter, setMapCenter] = useState(defaultCenter);
   const [radius, setRadius] = useState(5000); // Default radius: 5km
    const [selectedAd, setSelectedAd] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [zoom, setZoom] = useState<number>(12);
   const [NewqueryObject, setNewqueryObject] = useState<any>(queryObject);
   const handleOpenPopupMapSearch = () => {
       setOpenShowInfo(true);
     };
     
  useEffect(() => {
    const handleResize = () => {
      if(window.innerWidth <= 768){
        setShowSidebar(false);
        setZoom(11)
      }
      
      // Hide sidebar if width is ≤ 768px (mobile)
    };
  
    handleResize(); // Run once on mount
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  const [allAds, setAllAds] = useState<any[]>([]); // All ads fetched from backend

const fetchAds = async () => {
  setLoading(true);
  const newq ={
    ...queryObject,
    location: "-1.286389/36.817223"
  };
  try {
 
  const Ads:any = await getListingsNearLocation({
        queryObject: newq,
        page,
        limit: 100,
      });
    const fetchedAds = Ads?.data || [];
    setAllAds(fetchedAds); // store raw data
    setAds(fetchedAds); // store raw data
    setTotalPages(Ads?.totalPages || 1);
  } catch (error) {
    console.error("Error fetching ads", error);
  } finally {
    setLoading(false);
   
  }
};

// Fetch ads on component mount or when NewqueryObject changes
useEffect(() => {
 // const delayFetch = setTimeout(() => {
    fetchAds();
 /// }, 500);

 // return () => clearTimeout(delayFetch);
}, [queryObject]); // 🚫 remove radius from dependencies

// Filter ads locally when radius changes or new ads are fetched
useEffect(() => {
    
const filteredAds = allAds.filter((ad) => ad.calcDistance <= radius);
  setAds(filteredAds);
   setfilter(true)
}, [radius]);


   const { isLoaded } = useLoadScript({
     googleMapsApiKey: GOOGLE_MAPS_API_KEY,
     libraries: ["places", "geometry", "drawing"],
   });
 
  const isAdCreator=false;
  const userId="";
   const [step, setStep] = useState<"options" | "addressInput">("options");
    const [error, setError] = useState("");
    // const [centerSource, setCenterSource] = useState<{lat:number, lng:number}>({lat:0, lng:0});
    const handleSelectOption = (option: "map" | "address") => {
      if (option === "map") {
        setOpenShowInfo(false);
        // Trigger map tap mode here
      } else if (option === "address") {
        setStep("addressInput");
      }
    };
  
    const handleSearch = () => {
      // Trigger search logic here with `searchQuery`
       setError("")
      if(mapCenter.lat && mapCenter.lng){
         setNewqueryObject({
                    ...queryObject,
                    location: mapCenter.lat+"/"+mapCenter.lng,
                  });
                  setAds([]);
      setStep("options");
      setOpenShowInfo(false);
      }else{
       setError("Select location")
      }
    };

    const handleSelect = (e: any) => {
        geocodeByAddress(e.value.description)
          .then((results) => getLatLng(results[0]))
          .then(({ lat, lng }) => {
            setMapCenter({ lat, lng })
          });
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
 const mapRef = useRef<google.maps.Map | null>(null);
const onLoad = (map: google.maps.Map) => {
  mapRef.current = map;

  const bounds = new google.maps.LatLngBounds();

  data.forEach((property) => {
    const lng = property.data.propertyarea.location.coordinates[0];
    const lat = property.data.propertyarea.location.coordinates[1];

    if (lat && lng) {
      bounds.extend(new google.maps.LatLng(lat, lng));
    }
  });

  if (!bounds.isEmpty()) {
    map.fitBounds(bounds);
  }
};
   return isLoaded ? (  <>
    <div id="map-container" className="flex w-full h-screen bg-white rounded-sm p-1">
    
      {/* Sidebar with Toggle Button */}
      <div
        className={`bg-white rounded-sm h-[100vh] shadow-lg transition-transform duration-300 ease-in-out fixed md:relative ${
          showSidebar ? "w-full md:w-1/3 p-1" : "-translate-x-full md:w-0 md:translate-x-0"
        }`}
      >
        
{/* Toggle Button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
         className="absolute top-1/2 -translate-y-1/2 left-0 z-50 bg-white border-r rounded-r-full shadow px-2 py-2 hover:bg-gray-100 transition"
        style={{
          transform: 'translateY(-50%) translateX(-50%)',
          left: showSidebar ? '16rem' : '0rem', // adjust based on sidebar width
        }}
      >
        {showSidebar ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
       
        {showSidebar && (
          <div className="flex flex-col space-y-1">
             <div className="flex gap-2 items-center w-full">

             <div className="flex border-b p-2 text-gray-400 dark:text-[#e4ebeb] dark:hover:bg-gray-700 hover:text-green-600 justify-start items-center" onClick={() => setShowSidebar(!showSidebar)}>
            <ArrowBackOutlinedIcon/></div>
          <p className="w-full">{queryObject.subcategory ? queryObject.subcategory:queryObject.category} {"("}{data?.length}{")"}</p>
          </div>

      {data?.length > 0 ? (<>
      <h3 className="font-semibold mb-2">{NewqueryObject.category==='Property services' ? (<>Service Providers</>):(<>Properties</>)} within {radius / 1000} km</h3>
          <ScrollArea className="h-[90vh] overflow-y-auto flex p-0 bg-white rounded-lg">
            <ul className="w-full h-full">
            {data.map((ad: any) => (
  <div key={ad._id} className="flex justify-center">
    <VerticalCard
                  ad={ad}
                  userId={userId}
                  isAdCreator={isAdCreator}
                  handleAdView={handleAdView}
                  handleAdEdit={handleAdEdit}
                  handleOpenPlan={handleOpenPlan}
                  userName={userName}
                  userImage={userImage} 
                  handleOpenChatId={handleOpenChatId}    />
  </div>
))}


            </ul>
          </ScrollArea>
        
          </>) : (
        loading === false && (
          <>
            <div className="flex items-center wrapper  w-full flex-col gap-1 rounded-[14px] bg-grey-50 py-28 text-center">
            <h3 className="font-semibold mb-2">{NewqueryObject.category==='Property services' ? (<>Service Providers</>):(<>Properties</>)} within {radius / 1000} km</h3>
              <p className="text-sm text-gray-500">No {NewqueryObject.category==='Property services' ? (<>Service Providers</>):(<>Properties</>)} found in this range.</p>
               <SignedIn>
              
              <Button onClick={() => {
                  
                  handleOpenSell();
                  //router.push("/ads/create");
                
              }} variant="default">
              <AddOutlinedIcon sx={{ fontSize: 16 }} /> Create Ad
              </Button>
              
              </SignedIn>
              
              <SignedOut>
              <Button  onClick={() => {
                   // setIsOpenP(true);
                    router.push("/sign-in");
                  }} variant="outline">
              <AddOutlinedIcon sx={{ fontSize: 16 }} /> Create Ad
              </Button>
              
                
              </SignedOut>
            </div>
          </>
        )
      )}


      {loading && (
        <div>
          <div className="w-full mt-10 h-full flex flex-col items-center justify-center">
          <h3 className="font-semibold mb-2">{NewqueryObject.category==='Property services' ? (<>Service Providers</>):(<>Properties</>)} within {radius / 1000} km</h3>
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
      <div className={`w-full relative transition-all duration-300 h-screen ${
        showSidebar ? "hidden md:block" : "block"
      }`}>
      
      
       
        
     <div className="flex flex-col items-center w-full p-0 h-screen">
             <div className="w-full relative flex-1 overflow-hidden border border-gray-300">
               <GoogleMap
                 mapContainerStyle={{ width: "100%", height: "100%" }}
                 center={mapCenter}
                 zoom={zoom}
                 onLoad={onLoad}
                 options={{
                  zoomControl: true, // Enable zoom controls
                  mapTypeControl: true, // Enable map type switch
                  streetViewControl: true, // Enable Street View control
                  fullscreenControl: true, // Enable Fullscreen button
                 
                }}
                 onClick={(e) =>
                  { setMapCenter({ lat: e.latLng?.lat() || 0, lng: e.latLng?.lng() || 0 });
                  setNewqueryObject({
                    ...queryObject,
                    location: e.latLng?.lat()+"/"+e.latLng?.lng(),
                  });
                  setAds([]);}
                 }
               >
                 <Marker position={mapCenter} />
                {filter && (<Circle center={mapCenter} radius={radius} options={{ fillColor: "#4285F4", fillOpacity: 0.2, strokeColor: "#4285F4" }} />)}
                 {data.map((property: any) => (
                  <Marker
                  key={property.id}
                  onClick={() => setSelectedAd(property)}
                  position={{
                    lat: property.data.propertyarea.location.coordinates[0], // Latitude should be at index 1
                    lng: property.data.propertyarea.location.coordinates[1], // Longitude should be at index 0
                  }}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png", // Green marker
                  }}
                />
  
))}

        {/* InfoWindow for selected ad */}
              {selectedAd && (
                <InfoWindow
                position={{
                  lat: selectedAd.data.propertyarea.location.coordinates[0], // Latitude should be at index 1
                  lng: selectedAd.data.propertyarea.location.coordinates[1], // Longitude should be at index 0
                }}
                  onCloseClick={() => setSelectedAd(null)}
                >
                  <div
                    className="relative flex cursor-pointer items-center justify-center p-0 w-[150px] h-[100px] rounded-lg bg-cover bg-center text-white"
                    style={{ backgroundImage: `url(${selectedAd.data.imageUrls[0]})` }}
                  >
                    <div
                      onClick={() => {
                      
                        handleAdView(selectedAd._id);
                      }}
                      className="absolute cursor-pointer inset-0 bg-black/50 rounded-lg"
                    ></div>
                    <div className="relative cursor-pointer z-10 flex flex-col items-start p-2">
                      <div
                        onClick={() => {
                      
                          handleAdView(selectedAd._id);
                        }}
                        className=" text-xs text-white">
                        {selectedAd.data.title}
                      </div>
                      <b className="text-xs font-semibold text-white">
                        {formatKsh(selectedAd.data.price)}
                      </b>
                    </div>
                  </div>
                </InfoWindow>
              )}
                  
                         
               </GoogleMap>
               <div className="absolute top-2 right-2 z-5 flex flex-col space-y-2">
                   {/* Default Button */}
                  <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                    <Button onClick={handleFullscreen} 
                                    className="w-14 bg-white text-gray-600" 
                                    variant={"outline"}><FullscreenOutlinedIcon/></Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Toggle Fullscreen</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider></div>
  <div className="absolute top-20 left-2 z-5 h-70px] p-2 bg-white w-full">
             <label className="block text-gray-700 font-medium mb-0">
               Select Distance: {radius / 1000} km
             </label>
             <input
               type="range"
               min="1000"
               max="20000"
               step="1000"
               value={radius}
               onChange={(e) => setRadius(Number(e.target.value))}
               className="w-full"
             />
           </div>
   <div className="absolute top-2 left-[200px] z-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleOpenPopupMapSearch}
                  className="flex text-sm gap-2 shadow-sm bg-white text-gray-700 items-center justify-center w-full p-2 rounded hover:bg-gray-100"
                >
                  <div className="flex gap-2 items-center">
                
                    <TravelExploreOutlinedIcon/>
                    Search by Distance
                  </div>
                 
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search by Distance</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
     



                {openShowInfo && (<>
                 <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    <div className="bg-[#e4ebeb] p-3 rounded-md shadow-lg w-[320px] relative">
      <button
        onClick={() => {
           setStep("options"); setOpenShowInfo(false);
        }}
        className="absolute top-2 right-2 text-gray-500 hover:text-black text-sm"
        title="Close"
      >
        ✕
      </button>
   <p className="font-bold">Select Search Location</p>
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

             </div>
           
           
     
       
         </div>  

       
      </div>
    
     
    </div>

  </>
  ) : (
    <Icon icon={Barsscale} className="w-6 h-6 text-gray-500" />
  );
}
