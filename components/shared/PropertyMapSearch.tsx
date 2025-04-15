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
  handleOpenSell:() => void;
  handleOpenPlan:() => void;
  handleAdEdit: (id:string) => void;
  handleAdView: (id:string) => void;
  collectionType?: "Ads_Organized" | "My_Tickets" | "All_Ads";
};
interface Property {
  id: string;
  name: string;
  location: { lat: number; lng: number };
}

export default function PropertyMapSearch({queryObject, lat, lng, onClose, handleOpenPlan, handleOpenSell, handleAdEdit, handleAdView}:CollectionProps) {
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(true);
   const [newpage, setnewpage] = useState(false);
   const [data, setAds] = useState<IdynamicAd[]>([]); // Initialize with an empty array
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [mapCenter, setMapCenter] = useState(defaultCenter);
   const [radius, setRadius] = useState(5000); // Default radius: 5km
    const [selectedAd, setSelectedAd] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [zoom, setZoom] = useState<number>(12);
   const [NewqueryObject, setNewqueryObject] = useState<any>(queryObject);
   // Function to calculate distance between two points (Haversine formula)
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
 const fetchAds = async () => {
    setLoading(true);
    try {
    
      const Ads:any = await getListingsNearLocation({
        queryObject: NewqueryObject,
        page,
        limit: 100,
      });
    //  console.log(Ads);
// Ensure Ads?.data exists before filtering
   const Adsfiltered = Ads?.data?.filter((ad: any) => ad.calcDistance <= radius) || [];
   setAds(Adsfiltered);
      setTotalPages(Ads?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching ads", error);
    } finally {
      setLoading(false);
    }
  };

  

  // Debounce Effect for fetching ads
useEffect(() => {
  const delayFetch = setTimeout(() => {
    fetchAds();
  }, 500); // Delay by 500ms

  return () => clearTimeout(delayFetch); // Cleanup if dependencies change quickly
}, [NewqueryObject, radius]);

   const { isLoaded } = useLoadScript({
     googleMapsApiKey: GOOGLE_MAPS_API_KEY,
     libraries: ["places", "geometry", "drawing"],
   });
 
  const isAdCreator=false;
  const userId="";
  
   return isLoaded ? (  <>
    <div className="flex w-full h-screen bg-gray-200 p-0">
    
      {/* Sidebar with Toggle Button */}
      <div
        className={`bg-white h-[100vh] shadow-lg transition-transform duration-300 ease-in-out fixed md:relative ${
          showSidebar ? "w-full md:w-1/3 p-1" : "-translate-x-full md:w-0 md:translate-x-0"
        }`}
      >
          <div className="flex p-2 justify-end items-center w-full">
        <Button
          onClick={() => setShowSidebar(!showSidebar)}
          className="mb-1 md:hidden"
        >
          <KeyboardArrowLeftOutlinedIcon/> {showSidebar ? "Hide" : "Show"} Sidebar
        </Button>
        </div>

       
        {showSidebar && (
          <div className="flex flex-col space-y-1">
             <div className="flex justify-between items-center w-full">
             <h2 className="p-1 text-lg border-b w-full">Nearby Properties</h2></div>

      {data?.length > 0 ? (<>
      <h3 className="font-semibold mb-2">Properties within {radius / 1000} km</h3>
          <ScrollArea className="h-[90vh] overflow-y-auto flex p-0 bg-white rounded-lg">
            <ul className="w-full h-full">
            {data.map((ad: any) => (
  <div key={ad._id} className="flex justify-center">
    <HorizontalCardPublic
      ad={ad}
      userId={userId}
      isAdCreator={isAdCreator}
      handleAdView={handleAdView}
      handleAdEdit={handleAdEdit}
      handleOpenPlan={handleOpenPlan}
    />
  </div>
))}


            </ul>
          </ScrollArea>
        
          </>) : (
        loading === false && (
          <>
            <div className="flex items-center wrapper  w-full flex-col gap-1 rounded-[14px] bg-grey-50 py-28 text-center">
            <h3 className="font-semibold mb-2">Properties within {radius / 1000} km</h3>
              <p className="text-sm text-gray-500">No properties found in this range.</p>
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
          <h3 className="font-semibold mb-2">Properties within {radius / 1000} km</h3>
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
      
      
        <Button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute text-xs lg:text-base bottom-[180px] lg:bottom-[90px] left-3 z-10 md:block bg-green-600 text-white shadow-lg hover:bg-green-700"
        >
         {showSidebar ? (<><KeyboardArrowLeftOutlinedIcon/> Hide Nearby Properties</>) : (<><KeyboardArrowRightOutlinedIcon/> Show Nearby Properties</>)} 
        </Button>
        
      

     <div className="flex flex-col items-center w-full p-2 h-screen">
     <div className="h-[50px] flex bg-white justify-between items-center p-1 w-full">
           <p className="text-sm text-gray-600">Click on the map to set a location.</p>
           <div className="">
                             <Button variant="outline" title="Close" onClick={()=> onClose()} 
                              >
                            <CloseOutlinedIcon sx={{ fontSize: 14 }}/>
                         </Button>
                         </div>
                         </div>
     
          
             <div className="w-full flex-1 overflow-hidden border border-gray-300">
               <GoogleMap
                 mapContainerStyle={{ width: "100%", height: "100%" }}
                 center={mapCenter}
                 zoom={zoom}
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
                 <Circle center={mapCenter} radius={radius} options={{ fillColor: "#4285F4", fillOpacity: 0.2, strokeColor: "#4285F4" }} />
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
             </div>
           
             <div className="h-70px] p-2 bg-white w-full">
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
     
        {/*    {mapCenter && (
             <div className="mt-4 w-full">
               <h3 className="text-lg font-semibold mb-2">Properties within {radius / 1000} km</h3>
               {filteredProperties.length > 0 ? (
                 <ul className="list-disc pl-5">
                   {filteredProperties.map((property) => (
                     <li key={property.id} className="text-gray-700">{property.name}</li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-gray-500">No properties found in this range.</p>
               )}
             </div>
           )}*/}
         </div>  

       
      </div>
    
     
    </div>

  </>
  ) : (
    <Icon icon={Barsscale} className="w-6 h-6 text-gray-500" />
  );
}
