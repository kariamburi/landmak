"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Select from '@mui/material/Select';
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import StyledBrandName from "./StyledBrandName";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MessageIcon from "@mui/icons-material/Message";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DiamondIcon from "@mui/icons-material/Diamond";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
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
import { ICategory } from "@/lib/database/models/category.model";
import Navbar from "./navbar";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Unreadmessages from "./Unreadmessages";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import MobileNav from "./MobileNav";
import { useRouter } from "next/navigation";
import SidebarSearchMain from "./SidebarSearchMain";
import { getAdsCount, getAdsCountPerRegion, getAdsCountPerVerifiedFalse, getAdsCountPerVerifiedTrue, getListingsNearLocation } from "@/lib/actions/dynamicAd.actions";
import { IdynamicAd } from "@/lib/database/models/dynamicAd.model";
import { Circle, GoogleMap, InfoWindow, Marker, useLoadScript } from "@react-google-maps/api";
import { formatKsh } from "@/lib/help";
import VerticalCard from "./VerticalCard";
import Masonry from "react-masonry-css";
import HorizontalCardPublic from "./HorizontalCardPublic";
import { MapIcon, ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import FilterComponent from "./FilterComponent";
import SidebarFilter from "./SidebarSearchmobile";
import FilterFields from "./FilterFields";

const options = [
  { value: 'both', label: 'Split View', icon: <Squares2X2Icon className="w-5 h-5" /> },
  { value: 'map', label: 'Map View', icon: <MapIcon className="w-5 h-5" /> },
  { value: 'list', label: 'List View', icon: <ListBulletIcon className="w-5 h-5" /> },
];

const defaultCenter = {
  lat: -1.286389, // Nairobi, Kenya
  lng: 36.817223,
};
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEAPIKEY as string;

type CollectionProps = {
  loading: boolean;
  userId: string;
  userName: string;
  userImage: string;
  categoryList?: ICategory;
  subcategoryList:any;
  limit: number;
  emptyTitle: string;
  emptyStateSubtext: string;
  loans: any;
  queryObject: any;
  user: any;
  onClose:()=> void;
  handleOpenSell: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleAdEdit: (ad:any) => void;
  handleAdView: (ad:any) => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handleOpenSearchByTitle: () => void;
  handleOpenShop: (shopId:string) => void;
  handleCategory: (value:string) => void;
  handleOpenSearchTab: (value:string) => void;
  handleOpenChatId: (value:any) => void;
}
export default function EnhancedPropertySearch({userId,
  userName,
  userImage,
  categoryList,
  subcategoryList,
  emptyTitle,
  emptyStateSubtext,
  user,
  loans,
  
  queryObject,
  //adsCount,
  onClose,
  handleOpenSell,
  handleOpenBook,
  handleAdView,
  handleAdEdit,
  handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety,
  handleOpenPlan,
  handleOpenChat,
  handleOpenPerfomance,
  handleOpenSettings,
  handleOpenShop,
  handleCategory,
  handleOpenSearchTab,
  handleOpenSearchByTitle,
  handleOpenChatId,

}:
CollectionProps) {
  const [selectedCategory, setSelectedCategory] = useState(queryObject.subcategory);
   const [newqueryObject, setnewqueryObject] = useState<any>(queryObject);
  const [distance, setDistance] = useState(200);
  const [showList, setShowList] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);
 const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState("");

const [selectedLandUse, setSelectedLandUse] = useState([]);
const [ownership, setOwnership] = useState("");
const [onlyVerified, setOnlyVerified] = useState(false);
const [postedWithin, setPostedWithin] = useState("");
const [clearQuery,setclearQuery] = useState(false);
const [isOpenP, setIsOpenP] = useState(false);
     const handleOpenP = () => {
       setIsOpenP(true);
     };
    
     const handleCloseP = () => {
       setIsOpenP(false);
     };
// Toggle property list
  useEffect(() => {
    const isMobile = window.innerWidth < 640; // Tailwind's sm breakpoint

    if (isMobile) {
      setShowCategories(false);
      setShowList(true);
      setShowMap(false); // Show only list on mobile
    } else {
      setShowCategories(true);
      setShowList(true);
      setShowMap(true); // Show both on desktop
    }
  }, []);
const toggleMap = () => {
  if (!showMap && !showList) setShowList(true); // always show at least one
  setShowMap(!showMap);
};

const toggleList = () => {
  if (!showMap && !showList) setShowMap(true);
  setShowList(!showList);
};


const toggleMapCommit = () => {
  setShowList(false);
   setShowMap(true);
};
const toggleListCommit = () => {
  setShowList(true);
  setShowMap(false);
};

//const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);
const handleUseMyLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        // Set location in state and optionally refocus map
       // setSelectedCoordinates({ lat, lng });
       // console.log("Using current location:", lat, lng);
         setMapCenter({ lat, lng })
            setnewqueryObject({
                       ...newqueryObject,
                       location: lat+"/"+lng,
                     });
            setAds([]);
        // Close modal or proceed as needed
        setShowLocationModal(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to access your location.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
};
const handleResetFilter = (value:any) => {
      setclearQuery(!clearQuery);
      
      setnewqueryObject({
        ...value, location:newqueryObject.location
      });
   
      
      };

const [allAds, setAllAds] = useState<any[]>([]); // All ads fetched from backend
const [mapCenter, setMapCenter] = useState(defaultCenter);
const [selectedAd, setSelectedAd] = useState<any | null>(null);
const [loading, setLoading] = useState(true);
const [zoom, setZoom] = useState<number>(12);
const [data, setAds] = useState<IdynamicAd[]>([]); // Initialize with an empty array
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
// Before mount
useEffect(() => {
  if (!newqueryObject.location) {
    setnewqueryObject({
      ...newqueryObject,
      location: "-1.286389/36.817223"
    });
  }
}, []);
const fetchAds = async () => {
  setLoading(true);
 
  try {
 
  const Ads:any = await getListingsNearLocation({
        queryObject: newqueryObject,
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
 
  // setTimeout(() => {
  setLoading(false);
//}, 8000);
   
  }
};

// Fetch ads on component mount or when newqueryObject changes
useEffect(() => {
  console.log(newqueryObject);
    fetchAds();
}, [newqueryObject]); // 🚫 remove radius from dependencies

// Filter ads locally when radius changes or new ads are fetched
useEffect(() => {
    
const filteredAds = allAds.filter((ad) => ad.calcDistance <= distance*1000);
  setAds(filteredAds);
}, [distance, allAds]);


   const { isLoaded } = useLoadScript({
     googleMapsApiKey: GOOGLE_MAPS_API_KEY,
     libraries: ["places", "geometry", "drawing"],
   });
 
const [breakpointColumns, setBreakpointColumns] = useState(1); // Default to 1
const listRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  const observer = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const width = entry.contentRect.width;
      if (width < 340) {
        setBreakpointColumns(1);
      } 
      else if (width < 640) {
        setBreakpointColumns(2);
      } else if (width < 1024) {
        setBreakpointColumns(4);
      } else if (width < 1280) {
        setBreakpointColumns(5);
      } else {
        setBreakpointColumns(6);
      }
    }
  });

  if (listRef.current) {
    observer.observe(listRef.current);
  }

  return () => {
    if (listRef.current) {
      observer.unobserve(listRef.current);
    }
  };
}, []);

const mapRef = useRef<google.maps.Map | null>(null);
const circleRef = useRef<google.maps.Circle | null>(null);

// Handle circle creation and bounds fit
useEffect(() => {
  if (!mapRef.current || !mapCenter) return;

  // Remove old circle
  if (circleRef.current) {
    circleRef.current.setMap(null);
  }

  // Create new circle
  const newCircle = new google.maps.Circle({
    center: mapCenter,
    radius: distance * 1000, // km to meters
    map: mapRef.current,
    fillColor: "#4285F4",
    fillOpacity: 0.2,
    strokeColor: "#4285F4",
    strokeOpacity: 1,
    strokeWeight: 1,
  });

  circleRef.current = newCircle;

  // Fit bounds logic
  const bounds = new google.maps.LatLngBounds();

  if (data.length > 0) {
    // Extend bounds to each marker
    data.forEach((property: any) => {
      bounds.extend(
        new google.maps.LatLng(
          property.data.propertyarea.location.coordinates[0],
          property.data.propertyarea.location.coordinates[1]
        )
      );
    });

    // Also extend to center in case ads are offset
    bounds.extend(new google.maps.LatLng(mapCenter.lat, mapCenter.lng));

    mapRef.current.fitBounds(bounds);
  } else {
    // If no data, fit to the circle's bounds
    const circleBounds = newCircle.getBounds();
    if (circleBounds) {
      mapRef.current.fitBounds(circleBounds);
    }
  }
}, [mapCenter, distance, data]);
const [selectedAddress, setSelectedAddress] = useState("");

useEffect(() => {
  if (!mapRef.current || !mapCenter) return;

  const geocoder = new google.maps.Geocoder();
 geocoder.geocode({ location: mapCenter }, (results, status) => {
  if (status === "OK" && results && results.length > 0) {
    const components = results[0].address_components;

    let town = "";
    let country = "";

    components.forEach((comp) => {
      if (comp.types.includes("locality")) {
        town = comp.long_name;
      }
      if (comp.types.includes("country")) {
        country = comp.long_name;
      }
    });

    if (town && country) {
      setSelectedAddress(`${town}, ${country}`);
    } else {
      // fallback to formatted_address
      setSelectedAddress(results[0].formatted_address);
    }
  } else {
    setSelectedAddress("Unknown location");
  }
});

}, [mapCenter, mapRef.current]);

  const handleSelect = (e: any) => {
        geocodeByAddress(e.value.description)
          .then((results) => getLatLng(results[0]))
          .then(({ lat, lng }) => {
            setMapCenter({ lat, lng })
            setnewqueryObject({
                       ...newqueryObject,
                       location: lat+"/"+lng,
                     });
            setAds([]);
          });
      };

 const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  const handleSelectOpt = (opt: typeof options[number]) => {
    setSelected(opt);
    setOpen(false);
    setShowMap(opt.value === 'map' || opt.value === 'both');
    setShowList(opt.value === 'list' || opt.value === 'both');
  };
const [priceRange, setPriceRange] = useState<[number, number]>([500000, 20000000]);

const minPrice = 0;
const maxPrice = 100_000_000;
const getRangeGradient = (min: number, max: number) => {
  const startPercent = ((min - minPrice) / (maxPrice - minPrice)) * 100;
  const endPercent = ((max - minPrice) / (maxPrice - minPrice)) * 100;

  return `linear-gradient(to right, #d1d5db ${startPercent}%, #16a34a ${startPercent}%, #16a34a ${endPercent}%, #d1d5db ${endPercent}%)`;
};




  

    const [adsCount, setAdsCount] = useState<any>([]);
      const [AdsCountPerRegion, setAdsCountPerRegion] = useState<any>([]);
      const [AdsCountPerVerifiedTrue, setAdsCountPerVerifiedTrue] = useState<any>([]);
      const [AdsCountPerVerifiedFalse, setAdsCountPerVerifiedFalse] = useState<any>([]);
      const [loadingCount, setLoadingCount] = useState<boolean>(true);
 //   const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile screens
     // const [view, setView] = useState<"map" | "list">("map");
      
    useEffect(() => {
       const fetchData = async () => {
         try {
           setLoadingCount(true);
       
           const { category, subcategory } = newqueryObject;
   
           if (subcategory) {
             const getFieldsByCategoryAndSubcategory = (
               categoryName: string,
               subcategory: string,
               data: any
             ) => {
               return data
                 .filter(
                   (item: any) =>
                     item.category.name === categoryName &&
                     item.subcategory === subcategory
                 )
                 .map((item: any) => item.fields);
             };
   
             let adsCount: any = [];
             const dataString = getFieldsByCategoryAndSubcategory(
               category,
               subcategory,
               subcategoryList
             );
             const newfields = dataString[0]
               .filter((item: any) =>
                 [
                   "autocomplete",
                   "radio",
                   "multi-select",
                   "select",
                   "related-autocompletes",
                   "year",
                   "checkbox",
                 ].includes(item.type)
               )
               .map((item: any) => item.name);
   
             let fields = newfields.flatMap((field: any) =>
               field === "make-model" ? ["make", "model"] : field
             );
   
             adsCount = await getAdsCount(category, subcategory, fields);
         
             setAdsCount(adsCount);
           }
   
           const [region, verifiedTrue, verifiedFalse] = await Promise.all([
             getAdsCountPerRegion(category, subcategory),
             getAdsCountPerVerifiedTrue(category, subcategory),
             getAdsCountPerVerifiedFalse(category, subcategory),
           ]);
   
           setAdsCountPerRegion(region);
           setAdsCountPerVerifiedTrue(verifiedTrue);
           setAdsCountPerVerifiedFalse(verifiedFalse);
         } catch (error) {
           console.error("Failed to fetch data", error);
         } finally {
           setLoadingCount(false); // Mark loading as complete
         }
       };
   
     
         fetchData();
       
     }, [newqueryObject.category, newqueryObject.subcategory]);
     const [totalVerifiedAll, settotalVerifiedAll] = useState(0);
    const getTotalAdCount = (dataArray: any) => {
       return dataArray.reduce((total: any, item: any) => total + item.adCount, 0);
     };
     useEffect(() => {
       try {
       
         const totalAdCountVerified = AdsCountPerVerifiedTrue.reduce(
           (total: any, current: any) => {
             // Parse the adCount value to a number, ignore if it's not a valid number
             const totalAds = parseInt(current.totalAds);
             return !isNaN(totalAds) ? total + totalAds : total;
           },
           0
         );
   
         const totalAdCountVerifiedFalse = AdsCountPerVerifiedFalse.reduce(
           (total: any, current: any) => {
             // Parse the adCount value to a number, ignore if it's not a valid number
             const totalAds = parseInt(current.totalAds);
             return !isNaN(totalAds) ? total + totalAds : total;
           },
           0
         );
   
         settotalVerifiedAll(totalAdCountVerifiedFalse + totalAdCountVerified); // Output: 0
       } catch (error) {
         console.error("Error fetching data:", error);
         // setHasError(true);
       } finally {
         // setIsLoading(false);
       }
     }, [AdsCountPerVerifiedTrue, AdsCountPerVerifiedFalse]);
  
 
const [landSize, setLandSize] = useState([0, 10000]);
const now = new Date();
const [filteredProperties, setFilteredProperties] = useState<IdynamicAd[]>([]);
const [averagePricePerAcre, setAveragePricePerAcre] = useState(0);


useEffect(() => {
  const now = new Date();

  const filtered = data.filter((property: any) => {
    const price = property.data.price;

    // Calculate total area from shapes array
    const shapes = property.data?.propertyarea?.shapes ?? [];
    const totalArea = Array.isArray(shapes)
      ? shapes.reduce((sum: number, shape: any) => sum + parseFloat(shape.area || 0), 0)
      : 0;

    const isVerified = property.organizer?.verified?.status === true;
    const createdAt = new Date(property.data.createdAt);

    let isWithinDateRange = true;

    if (postedWithin === 'today') {
      isWithinDateRange = createdAt.toDateString() === now.toDateString();
    } else if (postedWithin === 'this_week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      isWithinDateRange = createdAt >= startOfWeek;
    } else if (postedWithin === 'this_month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      isWithinDateRange = createdAt >= startOfMonth;
    }

    return (
      price >= priceRange[0] &&
      price <= priceRange[1] &&
      (!landSize || (totalArea >= landSize[0] && totalArea <= landSize[1])) &&
      (!onlyVerified || isVerified) &&
      isWithinDateRange
    );
  });

  setFilteredProperties(filtered);
if( newqueryObject.category === 'Land & Plots for Sale'){
  // 👇 Calculate average price per acre
  const totalPricePerAcre = filtered.reduce((sum, property) => {
    const shapes = property.data?.propertyarea?.shapes ?? [];
    const area = Array.isArray(shapes)
      ? shapes.reduce((sum: number, shape: any) => sum + parseFloat(shape.area || 0), 0)
      : 0;
    const price = property?.data?.price || 0;
    if (area > 0) {
      const acres = area / 4046.86;
      return sum + price / acres;
    }
    return sum;
  }, 0);

  const validCount = filtered.filter(property => {
    const shapes = property.data?.propertyarea?.shapes ?? [];
    const area = Array.isArray(shapes)
      ? shapes.reduce((sum: number, shape: any) => sum + parseFloat(shape.area || 0), 0)
      : 0;
    return area > 0;
  }).length;

  const avgPricePerAcre = validCount > 0 ? totalPricePerAcre / validCount : 0;

  setAveragePricePerAcre(avgPricePerAcre); // 👈 Store in state
}
}, [data, priceRange, landSize, onlyVerified, postedWithin]);

 
const [formData, setFormData] = useState<Record<string, any>>([]);
const handleInputChange = (field: string, value: any) => {
  // Update the form data
  setFormData({ ...formData, [field]: value });

  // Filter the properties based on the input field and value
  const filtered = filteredProperties.filter((property: any) => {
    const fieldValue = property.data[field];
    return fieldValue === value;
  });

  setFilteredProperties(filtered);
};
       const handleCheckboxChange = (field: string, value: any) => {
         const currentSelection = formData[field] || []; // Get current selections for the field
         const isSelected = currentSelection.includes(value);
     
         const updatedSelection = isSelected
           ? currentSelection.filter((selected: any) => selected !== value) // Remove if already selected
           : [...currentSelection, value]; // Add new selection
     
          // Update the form data
  setFormData({ ...formData, [field]: updatedSelection });

const filtered = data.filter((item: any) => {
  const amenities = item.data.amenities || [];
  // Check if all required amenities are present in the item's amenities
  return updatedSelection.every((amenity:any) => amenities.includes(amenity));
});

setFilteredProperties(filtered);


        };
       const handleInputAutoCompleteChange = (field: string, value: any) => {
        // Update the form data
  setFormData({ ...formData, [field]: value });

  // Filter the properties based on the input field and value
  const filtered = data.filter((property: any) => {
    const fieldValue = property.data[field];
    return fieldValue === value;
  });

  setFilteredProperties(filtered);
       };
       const handleInputYearChange = (field: string, value: any) => {
       // Update the form data
  setFormData({ ...formData, [field]: value });

  // Filter the properties based on the input field and value
  const filtered = filteredProperties.filter((property: any) => {
    const fieldValue = property.data[field];
    return fieldValue === value;
  });

  setFilteredProperties(filtered);
     
       };
      const handleClearForm = () => {
         setLandSize([0, 10000]);
         setPriceRange([100000, 20000000]);
         setOnlyVerified(false);
         setFormData([]);
         setFilteredProperties(allAds);
    
       };
     
   
  return (
   <div className="flex flex-col lg:flex-row w-full h-screen overflow-hidden">


    {/* Mobile Top Bar */}
<div className="fixed top-0 left-0 right-0 z-50 bg-white p-0 border-b flex items-center justify-between">
  {showCategories && (<div className="w-[360px] hidden lg:inline"></div>)} <Navbar user={user?? []} userstatus={user?.status ?? "User"} userId={userId} onClose={onClose} popup={"sell"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                     handleOpenPerfomance={handleOpenPerfomance}
                     handleOpenSettings={handleOpenSettings}
                     handleOpenAbout={handleOpenAbout}
                     handleOpenTerms={handleOpenTerms}
                     handleOpenPrivacy={handleOpenPrivacy}
                     handleOpenSafety={handleOpenSafety} 
                     handleOpenShop={handleOpenShop}/>
  

</div>

      {/* Sidebar */}
      {showCategories && (
   <aside className="fixed lg:static top-14 left-0 z-50 bg-white w-[300px] lg:w-[280px] h-[calc(100vh-1rem)] overflow-y-auto p-0 border-r shadow-md lg:shadow-none transform transition-transform duration-300 lg:translate-x-0 translate-x-0 lg:flex flex-col">

    <div className="flex justify-between items-center mb-4 lg:hidden">
      <h2 className="ml-1 text-lg font-semibold">Filters</h2>
    
       <button
    onClick={() => setShowCategories(false)}
    className="flex items-center gap-1 px-3 py-1.5 text-sm text-white rounded-l-full bg-green-600 hover:bg-green-700 shadow-sm transition"
  >
    <ChevronLeft size={20} />
    Hide Filters
  </button>
    </div>

    {/* Always visible on desktop */}
   <div className="hidden lg:flex flex-col items-center mb-4">
 
   <div className="w-full flex justify-end items-center">
  <button
    onClick={() => setShowCategories(false)}
    className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-l-full bg-green-600 text-white hover:bg-green-700 transition"
  >
    <ChevronLeft size={20} />
    Hide Filters
  </button>
  </div>
 <h2 className="text-lg font-semibold">
    {newqueryObject.category}
  </h2>
 

</div>


    {/* Category list */}
    <div className="flex-1 p-1 overflow-y-auto">
      <div>
       <SidebarSearchMain
                          categoryList={subcategoryList}
                          category={newqueryObject.category}
                          subcategory={newqueryObject.subcategory}
                          handleFilter={handleResetFilter}
                          loans={loans}
                         
                        />
      </div>
   

    {/* Price Filter */}
    <div className="mt-6 pt-4 border-t">
      <h3 className="text-sm font-medium mb-2">Filter by Price (Ksh)</h3>
     
        
<div className="flex items-center gap-2 w-full">
 <div className="flex flex-col gap-2 w-full">
 <label className="text-sm mb-1">
        Min:<br />Ksh {priceRange[0].toLocaleString()}
      </label>
<input
  type="range"
  min={minPrice}
    max={maxPrice}
    step={100000}
  value={priceRange[0]}
  onChange={(e) =>
    setPriceRange([Number(e.target.value), Math.max(Number(e.target.value), priceRange[1])])
  }
  className="w-full cursor-pointer appearance-none accent-green-600 h-2 rounded-lg outline-none"
  style={{
    background: `linear-gradient(to right, #16a34a 0%, #16a34a ${(priceRange[0] / maxPrice) * 100}%, #e5e7eb ${(priceRange[0] / maxPrice) * 100}%, #e5e7eb 100%)`,
  }}
/>
</div>

<div className="flex gap-2 flex-col w-full">
      <label className="text-sm mb-1">
        Max:    <br /> Ksh {priceRange[1].toLocaleString()}
      </label>
     <input
  type="range"
   min={minPrice}
    max={maxPrice}
    step={100000}
  value={priceRange[1]}
  onChange={(e) =>
    setPriceRange([Math.min(Number(e.target.value), priceRange[0]), Number(e.target.value)])
  }
  className="w-full cursor-pointer appearance-none accent-green-600 h-2 rounded-lg outline-none"
  style={{
    background: `linear-gradient(to right, #16a34a 0%, #16a34a ${(priceRange[1] / maxPrice) * 100}%, #e5e7eb ${(priceRange[1] / maxPrice) * 100}%, #e5e7eb 100%)`,
  }}
/>
</div>

       
      </div>
    </div>
  
<div className="mt-6 pt-4 border-t">
  <label className="block font-medium mb-2">Land Size</label>

  <div className="flex items-center gap-4">
    {/* Min Range */}
    <div className="flex flex-col w-full">
      <label className="text-sm mb-1">
        Min: {landSize[0]} m²
        <br />
        ≈ {(landSize[0] / 4046.86).toFixed(2)} acres
        <br />
        ≈ {(landSize[0] / 10000).toFixed(2)} hectares
      </label>
      <input
  type="range"
  min="0"
  max="10000"
  step="50"
  value={landSize[0]}
  onChange={(e) =>
    setLandSize([Number(e.target.value), Math.max(Number(e.target.value), landSize[1])])
  }
  className="w-full cursor-pointer appearance-none accent-green-600 h-2 rounded-lg outline-none"
  style={{
    background: `linear-gradient(to right, #16a34a 0%, #16a34a ${(landSize[0] / 10000) * 100}%, #e5e7eb ${(landSize[0] / 10000) * 100}%, #e5e7eb 100%)`,
  }}
/>

    </div>

    {/* Max Range */}
    <div className="flex flex-col w-full">
      <label className="text-sm mb-1">
        Max: {landSize[1]} m²
        <br />
        ≈ {(landSize[1] / 4046.86).toFixed(2)} acres
        <br />
        ≈ {(landSize[1] / 10000).toFixed(2)} hectares
      </label>
     <input
  type="range"
  min="0"
  max="10000"
  step="50"
  value={landSize[1]}
  onChange={(e) =>
    setLandSize([Math.min(Number(e.target.value), landSize[0]), Number(e.target.value)])
  }
  className="w-full cursor-pointer appearance-none accent-green-600 h-2 rounded-lg outline-none"
  style={{
    background: `linear-gradient(to right, #16a34a 0%, #16a34a ${(landSize[1] / 10000) * 100}%, #e5e7eb ${(landSize[1] / 10000) * 100}%, #e5e7eb 100%)`,
  }}
/>

    </div>
  </div>


 
</div>
{/*<div className="mt-6 pt-4 border-t">
  <h3 className="text-sm font-medium mb-2">Ownership Type</h3>
  <div className="flex flex-col gap-1 text-sm">
    {["Freehold", "Leasehold", "Title Deed"].map((type) => (
      <label key={type} className="flex items-center gap-2">
        <input
          type="radio"
          name="ownership"
          value={type}
          checked={ownership === type}
          onChange={(e) => setOwnership(e.target.value)}
        />
        {type}
      </label>
    ))}
  </div>
</div>*/}
<div className="mt-6 pt-4 border-t">
  <label className="flex items-center gap-2 text-sm font-medium">
    <input
      type="checkbox"
      checked={onlyVerified}
      onChange={(e) => setOnlyVerified(e.target.checked)}
    />
    Verified Listings Only
  </label>
</div>
<div className="mt-6 pt-4 border-t">
  <h3 className="text-sm font-medium mb-2">Posted</h3>
  <select
    className="w-full border rounded p-2 text-sm"
    value={postedWithin}
    onChange={(e) => setPostedWithin(e.target.value)}
  >
    <option value="">Any Time</option>
    <option value="today">Today</option>
    <option value="this_week">This Week</option>
    <option value="this_month">This Month</option>
  </select>
</div>

<div>
 <div className="mt-6 pt-4 border-t">
  <h3 className="text-sm font-medium mb-2">Other filters</h3>
 <FilterFields
                              allsubcategory={subcategoryList}
                              category={newqueryObject.category}
                              subcategory={newqueryObject.subcategory}
                              adsCount={adsCount}
                              formData={formData}
                              handleInputChange={handleInputChange}
                              handleCheckboxChange={handleCheckboxChange}
                              handleInputAutoCompleteChange={handleInputAutoCompleteChange}
                              handleInputYearChange={handleInputYearChange}
                            />
                             <div className="flex w-full">
                                   
                                    <div
                                      onClick={() => handleClearForm()}
                                    
                                      className="bg-white text-green-600 cursor-pointer border border-green-600 py-2 px-2 rounded-full hover:bg-green-100 mt-3 w-full"
                                    >
                                      <div className="flex gap-1 justify-center items-center w-full">
                                        <CloseOutlinedIcon />
                                        Reset Search
                                      </div>
                                    </div>
                                  </div></div>
</div>
 </div>


  </aside>
      )}

    
      {/* Main Content */}
   <main className="flex-1 bg-[#e4ebeb] flex flex-col p-2 h-full overflow-hidden pt-[60px]">
     {/* Header */}
<div className="flex flex-wrap justify-between items-center gap-2 mb-2">
  <div className="flex gap-2 items-center">
      {!showCategories && ( <button
  onClick={() => setShowCategories(true)}
  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-white border border-green-600 rounded-full shadow-sm hover:bg-green-50 active:bg-green-100 transition lg:text-base"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z"
    />
  </svg>
  Filters
</button>)}
   <div className="flex flex-col">
    <div className="flex flex-col lg:flex-row items-center">
   <div className="text-lg font-semibold">{newqueryObject.subcategory}</div> <div className="text-sm">({data.length} ads within {distance} km)</div>
   </div>  
  {averagePricePerAcre > 0 && (
  <div className="text-[10px] text-gray-600 dark:text-gray-300 mt-0">
    Avg. Price: Ksh {averagePricePerAcre.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })} per acre
  </div>
)}
</div>
  </div>
  
  {/* Address (for smaller screens, wrap below header if needed) */}
 

  <div className="flex items-center gap-3 flex-wrap">
   <div className="flex border rounded px-2 bg-white shadow-sm items-center gap-3 flex-wrap">
    <div className="flex flex-col">
  
  {selectedAddress && (
    <p className="text-sm text-gray-600 w-full lg:w-auto">
      📍 {selectedAddress}
    </p>
  )}

 
 
 <div className="flex gap-1 items-center">
  <label className="text-sm">Radius ({distance} km):</label>
   <input
      type="range"
      min="10"
      max="200"
      step="10"
      value={distance}
      onChange={(e) => setDistance(Number(e.target.value))}
       className="w-40 cursor-pointer appearance-none h-2 accent-green-600 rounded-lg outline-none"
  style={{
    background: `linear-gradient(to right, #16a34a 0%, #16a34a ${(distance - 10) / 1.9}%, #ffffff ${(distance - 10) / 1.9}%, #ffffff 100%)`,
  }}
  />
</div>
</div>
   </div>
   
    <div className="relative hidden lg:inline w-48 text-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2 border rounded bg-white shadow-sm"
      >
        <span className="flex items-center gap-2">
          {selected.icon}
          {selected.label}
        </span>
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="absolute mt-1 w-full bg-white border rounded shadow z-50">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => handleSelectOpt(opt)}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
            >
              {opt.icon}
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>

   <button
  onClick={() => setShowLocationModal(true)}
  className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-white shadow-sm text-sm font-medium text-green-600 hover:text-green-800 hover:bg-green-50 transition"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 12.414M13.414 12.414l4.243-4.243M13.414 12.414H3"
    />
  </svg>
  Choose Location
</button>

  </div>
</div>


      <div className="relative flex-1 overflow-hidden">
  {/* Toggle Button */}
 
  {/* Dynamic Layout */}
 <div
  className="grid gap-4 h-full transition-all duration-300 relative"
  style={{
    gridTemplateColumns:
      showList && showMap
        ? '1fr 1fr'
        : showList || showMap
        ? '1fr'
        : '0fr',
  }}
>
  {/* Property List */}
  <div
    ref={listRef}
    className={`relative transition-all b-white rounded-sm lg:p-1 duration-300 overflow-y-auto ${
      showList ? 'block' : 'hidden'
    }`}
  >
<style jsx>{`
    @media (max-width: 1024px) {
      div::-webkit-scrollbar {
        display: none;
      }
    }
  `}</style>   

  {filteredProperties?.length > 0 ? (<>
    
           <Masonry
                          breakpointCols={breakpointColumns}
                          className="flex mt-2 lg:mt-0 gap-1 lg:gap-4 min-h-screen"
                          columnClassName="bg-clip-padding"
                        >
                          {filteredProperties.map((ad: any, index: number) => {
                               let isAdCreator;
                            if(ad.loanterm){
                                 isAdCreator = userId === ad.userId._id.toString();
                            }else{
                                  isAdCreator = userId === ad.organizer._id.toString();
                            }
                         
                            if (data.length === index + 1) {
                              return (
                                <div
                                 
                                  key={ad._id}
                                  className="flex justify-center"
                                >
                                  {/* Render Ad */}
                               {breakpointColumns === 1 ? (<HorizontalCardPublic
                                    ad={ad}
                                    userId={userId}
                                    isAdCreator={isAdCreator}
                                    handleAdEdit={handleAdEdit}    
                                    handleAdView={handleAdView}
                                    handleOpenPlan={handleOpenPlan}
                                    //handleOpenChatId={handleOpenChatId}
                                    userName={userName} 
                                  userImage={userImage}
                                  />):(<VerticalCard
                                    ad={ad}
                                    userId={userId}
                                    isAdCreator={isAdCreator}
                                    handleAdEdit={handleAdEdit}    
                                    handleAdView={handleAdView}
                                    handleOpenPlan={handleOpenPlan}
                                    handleOpenChatId={handleOpenChatId}
                                    userName={userName} 
                                  userImage={userImage}
                                  />)}   
                                </div>
                              );
                            } else {
                              return (
                                <div key={ad._id} className="flex justify-center">
                                  {/* Render Ad */}
                                   {breakpointColumns ===1 ? (<HorizontalCardPublic
                                    ad={ad}
                                    userId={userId}
                                    isAdCreator={isAdCreator}
                                    handleAdEdit={handleAdEdit}    
                                    handleAdView={handleAdView}
                                    handleOpenPlan={handleOpenPlan}
                                   // handleOpenChatId={handleOpenChatId}
                                    userName={userName} 
                                  userImage={userImage}
                                  />):(<VerticalCard
                                    ad={ad}
                                    userId={userId}
                                    isAdCreator={isAdCreator}
                                    handleAdEdit={handleAdEdit}    
                                    handleAdView={handleAdView}
                                    handleOpenPlan={handleOpenPlan}
                                    handleOpenChatId={handleOpenChatId}
                                    userName={userName} 
                                  userImage={userImage}
                                  />)} 
                                </div>
                              );
                            }
                          })}
                        </Masonry>
        
          </>) : (
        loading === false && (
          <>
            <div className="flex items-center h-full w-full flex-col gap-1 rounded-sm bg-white py-28 text-center">
            <h3 className="font-semibold mb-2">{newqueryObject.category==='Property services' ? (<>Service Providers</>):(<>Properties</>)} within {distance} km</h3>
              <p className="text-sm text-gray-500">No {newqueryObject.category==='Property services' ? (<>Service Providers</>):(<>Properties</>)} found in this range.</p>
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
        
          <div className="w-full rounded-sm bg-white h-full flex flex-col items-center justify-center">
          <h3 className="font-semibold mb-2">{newqueryObject.category==='Property services' ? (<>Service Providers</>):(<>Properties</>)} within {distance} km</h3>
            <Image
              src="/assets/icons/loading2.gif"
              alt="loading"
              width={40}
              height={40}
              unoptimized
            />
          </div>
       
      )}

    {/* Floating Map Button - Only on mobile */}
    {showList && !showMap && (
      <button
        className="fixed flex gap-1 bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg sm:hidden"
        onClick={() => toggleMapCommit()}
      >
        <MapIcon className="w-5 h-5" /> View Map
      </button>
    )}
  </div>

  {/* Map View */}
  <div
    className={`relative transition-all lg:rounded-xl shadow-md border duration-300 overflow-hidden ${
      showMap ? 'block' : 'hidden'
    }`}
  >
   {isLoaded ? (<><GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={mapCenter}
                    zoom={zoom}
                 onLoad={(map) => {
    mapRef.current = map;
  }}
                    options={{
                     zoomControl: true, // Enable zoom controls
                     mapTypeControl: true, // Enable map type switch
                     streetViewControl: true, // Enable Street View control
                     fullscreenControl: true, // Enable Fullscreen button
                    
                   }}
                    onClick={(e) =>
                     { 
                   
                     setMapCenter({ lat: e.latLng?.lat() || 0, lng: e.latLng?.lng() || 0 });
                     setnewqueryObject({
                       ...newqueryObject,
                       location: e.latLng?.lat()+"/"+e.latLng?.lng(),
                     });
                     setAds([]);}
                    }
                  >
                    <Marker position={mapCenter} />
              
                    {filteredProperties.map((property: any) => (
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
                       className="relative bg-green-600 flex cursor-pointer items-center justify-center p-0 w-[150px] h-[100px] rounded-lg bg-cover bg-center text-white"
                      // style={{ backgroundImage: `url(${selectedAd.data.imageUrls[0]})` }}
                     >
                       <div
                         onClick={() => {
                         
                           handleAdView(selectedAd);
                         }}
                         className="absolute cursor-pointer inset-0 bg-black/50 rounded-lg"
                       ></div>
                       <div className="relative cursor-pointer z-10 flex flex-col items-start p-2">
                         <div
                           onClick={() => {
                         
                             handleAdView(selectedAd);
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
                     
                            
                  </GoogleMap></>):(<> <div className="absolute inset-0 z-5 flex items-center justify-center bg-white/70">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-800" />
      <span className="ml-2 text-gray-700 font-medium">Loading map...</span>
    </div></>)}  

    {/* Back to List Button */}
    {showMap && !showList && (
      <button
        className="flex gap-1 absolute bottom-4 left-4 bg-white text-black px-3 py-1 rounded shadow"
        onClick={() => toggleListCommit()}
      >
        ← Back to List <ListBulletIcon className="w-5 h-5" />
      </button>
    )}
  </div>
</div>
</div>
{showLocationModal && (
  <div
    className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
    role="dialog"
    aria-modal="true"
    aria-labelledby="locationModalTitle"
  >
    <div className="bg-white p-6 rounded shadow-md max-w-md w-full relative">
      <button
        onClick={() => setShowLocationModal(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
        aria-label="Close"
      >
        ×
      </button>

      <h3 id="locationModalTitle" className="text-lg font-semibold mb-4">
        Choose Location
      </h3>

      <div className="space-y-4">
        {/* Option 1 */}
        <div>
          <p className="text-sm font-medium">Option 1: Tap on map to drop pin</p>
          <p className="text-xs text-gray-500">
            After closing this modal, click on the map to choose a location.
          </p>
        </div>

        {/* Option 2 */}
        <div>
          <p className="text-sm font-medium mb-1">Option 2: Search for a place</p>
        
        <GooglePlacesAutocomplete
      apiKey={process.env.NEXT_PUBLIC_GOOGLEAPIKEY!}
      selectProps={{
        placeholder: "Enter a place or address",
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
            zIndex: 9999, // Ensure dropdown appears on top
          }),
        },
      }}
      autocompletionRequest={{
        componentRestrictions: {
          country: ["KE"], // Restrict to Kenya
        },
      }}
    />
        </div>

        {/* Use My Location */}
        <div>
          <button
            onClick={handleUseMyLocation}
            className="text-sm text-green-600 underline"
          >
            Use My Location
          </button>
        </div>

        {/* Radius Control */}
        <div>
          <label className="text-sm">Radius ({distance} km):</label>
          <input
            type="range"
            min="10"
            max="200"
            step="10"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
             className="w-full cursor-pointer appearance-none h-2 accent-green-600 rounded-lg outline-none"
  style={{
    background: `linear-gradient(to right, #16a34a 0%, #16a34a ${(distance - 10) / 1.9}%, #E5E7EB ${(distance - 10) / 1.9}%, #E5E7EB 100%)`,
  }}
          
          />
        </div>

        {/* Apply Button */}
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          onClick={() => {
            setShowLocationModal(false);
            // Trigger map update logic here
          }}
        >
          Apply Location
        </button>
      </div>
    </div>
  </div>
)}


      </main>
    </div>
  );
}

























































































































































