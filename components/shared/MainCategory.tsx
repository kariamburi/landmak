"use client";
import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
//import * as ScrollArea from "@radix-ui/react-scroll-area";
import { ICategory } from "@/lib/database/models/category.model";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import Image from "next/image";
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MessageIcon from "@mui/icons-material/Message";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DiamondIcon from "@mui/icons-material/Diamond";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  formUrlQuery,
  formUrlQuerymultiple,
  removeKeysFromQuery,
} from "@/lib/utils";
import ShareLocationOutlinedIcon from "@mui/icons-material/ShareLocationOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useMediaQuery } from "react-responsive"; // Detect mobile screens
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
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
import Menumake from "./menumake";
import MenumakeBus from "./MenumakeBus";
import MenumakeMotobikes from "./MenumakeMotobikes";
import MenuequipType from "./MenuequipType";
import MenuBoats from "./MenuBoats";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import Searchmain from "./Searchmain";
import MakeFilter from "./MakeFilter";
import SearchIcon from "@mui/icons-material/Search";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SortOutlinedIcon from "@mui/icons-material/SortOutlined";
import SubCategoryFilterSearch from "./SubCategoryFilterSearch";
import SidebarSearchmobile from "./SidebarSearchmobile";
import CloseIcon from "@mui/icons-material/Close";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import MenuType from "./MenuType";
import SearchNow from "./SearchNow";
import { AdminId, mode } from "@/constants";
import BottomNavigation from "./BottomNavigation";
import Footersub from "./Footersub";
import { Toaster } from "../ui/toaster";
import Navbar from "./navbar";
import LocationSelection from "./LocationSelection";
import SidebarSearchMain from "./SidebarSearchMain";
import CategoryFilterSearch from "./CategoryFilterSearch";
import HeaderMain from "./HeaderMain";
import Unreadmessages from "./Unreadmessages";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import MobileNav from "./MobileNav";
import CollectionSearch from "./CollectionSearch";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import FloatingChatIcon from "./FloatingChatIcon";
import ChatWindow from "./ChatWindow";
import PropertyMapSearch from "./PropertyMapSearch";
import StyledBrandName from "./StyledBrandName";
import { getAdsCount, getAdsCountPerRegion, getAdsCountPerVerifiedFalse, getAdsCountPerVerifiedTrue } from "@/lib/actions/dynamicAd.actions";
import PropertyListSkeleton from "./LocationListSkeleton";
import FilterSkeleton from "./FilterSkeleton";
import LocationListSkeleton from "./LocationListSkeleton";
import ProgressPopup from "./ProgressPopup";
import CircularProgress from "@mui/material/CircularProgress";
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
import PropertyMapSearchComponent from "./PropertyMapSearchComponent";
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
  //AdsCountPerVerifiedTrue: any;
  //AdsCountPerVerifiedFalse: any;
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
const MainCategory = ({
  userId,
  userName,
  userImage,
  categoryList,
  subcategoryList,
  emptyTitle,
  emptyStateSubtext,
  user,
  loans,
  //AdsCountPerVerifiedTrue,
  //AdsCountPerVerifiedFalse,
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

}: // user,

// Accept the onSortChange prop
CollectionProps) => {
 const [showSidebar, setShowSidebar] = useState(true);
 const [newqueryObject, setNewqueryObject] = useState<any>(queryObject);
  const [adsCount, setAdsCount] = useState<any>([]);
   const [AdsCountPerRegion, setAdsCountPerRegion] = useState<any>([]);
   const [AdsCountPerVerifiedTrue, setAdsCountPerVerifiedTrue] = useState<any>([]);
   const [AdsCountPerVerifiedFalse, setAdsCountPerVerifiedFalse] = useState<any>([]);
   const [loadingCount, setLoadingCount] = useState<boolean>(true);
 const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile screens
   const [view, setView] = useState<"map" | "list">("map");
   
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowSidebar(false); // Disable sidebar on mobile
      } else {
        setShowSidebar(true); // Enable sidebar on desktop
      }
    };

    // Initial check
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [showBottomNav, setShowBottomNav] = useState(false);

  const scrollRefB = useRef<HTMLDivElement>(null);
const lastScrollTop = useRef(0);
const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
const SCROLL_THRESHOLD = 150; // pixels
  useEffect(() => {
    const timer = setTimeout(() => {
      const el = scrollRefB.current;
      if (el) {
       
      const handleScroll = () => {
      const currentScrollTop = el.scrollTop;
      const scrollDiff = currentScrollTop - lastScrollTop.current;
  
      // Ignore small scrolls
      if (Math.abs(scrollDiff) < SCROLL_THRESHOLD) return;
  
      if (scrollDiff > 0) {
        // Scrolling down
        setShowBottomNav(false);
      } else {
        // Scrolling up
        if(view === "list"){
        setShowBottomNav(true);
        }
      }
  
      lastScrollTop.current = currentScrollTop;
    };
        el.addEventListener('scroll', handleScroll);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

   // Close sidebar when clicking outside
   useEffect(() => {
     const handleClickOutside = (e: MouseEvent) => {
       if (showSidebar && window.innerWidth < 768) {
         setShowSidebar(false);
       }
     };
     window.addEventListener("click", handleClickOutside);
     return () => window.removeEventListener("click", handleClickOutside);
   }, [showSidebar]);
 
   const handleSidebarToggle = (e: React.MouseEvent) => {
     e.stopPropagation();
     setShowSidebar(!showSidebar);
   };
   const [activeButton, setActiveButton] = useState(0);
   const [activerange, setactiverange] = useState(20);
   const handleButtonClick = (index: number) => {
     setActiveButton(index);
   };
   const [region, setRegion] = useState("All Kenya");
   const [clearQuery,setclearQuery] = useState(false);
   const [loading, setLoading] = useState(false);
   const router = useRouter();
   const [formData, setFormData] = useState<Record<string, any>>([]);
   const [selectedVerified, setSelectedVerified] = useState("all");
    const [minPrice, setminPrice] = useState("");
     const [maxPrice, setmaxPrice] = useState("");
      const applyFilters = () => {
         // Filter out empty values from formData
         const filteredData = Object.entries(formData).reduce(
           (acc, [key, value]) => {
             if (value !== null && value !== undefined && value !== "") {
               acc[key] = value;
             }
             return acc;
           },
           {} as Record<string, any>
         );
         handleFilter(filteredData);
         setShowPopup(false);
        
       };
      
       const handleInputChange = (field: string, value: any) => {
         setFormData({ ...formData, [field]: value });
       };
       const handleCheckboxChange = (field: string, value: any) => {
         const currentSelection = formData[field] || []; // Get current selections for the field
         const isSelected = currentSelection.includes(value);
     
         const updatedSelection = isSelected
           ? currentSelection.filter((selected: any) => selected !== value) // Remove if already selected
           : [...currentSelection, value]; // Add new selection
     
         setFormData({ ...formData, [field]: updatedSelection }); // Update formData for the specific field
       };
       const handleInputAutoCompleteChange = (field: string, value: any) => {
         if (field === "make") {
           setFormData({ ...formData, [field]: value, model: "" });
         } else {
           setFormData({ ...formData, [field]: value });
         }
       };
       const handleInputYearChange = (field: string, value: any) => {
         setFormData({ ...formData, [field]: value });
       };
       const handleClearForm = () => {
        setminPrice('');
        setmaxPrice('')
        setSelectedVerified("all");
         setFormData([]);
       
        const updatedQueryObject = {
          ...queryObject,
          category: newqueryObject.category.toString(),
          subcategory: newqueryObject.subcategory.toString(),
        };
      
        // Remove location if it exists
        if (updatedQueryObject.location) {
          delete updatedQueryObject.location;
        }
      
        setNewqueryObject(updatedQueryObject);
         setShowPopup(false);
       };
     
     const handleminPriceChange = (value: string) => {
      setminPrice(value);
      if(value && maxPrice){
        setFormData({ ...formData, price:value+"-"+maxPrice });
      }
     }
     const handlemaxPriceChange = (value:string) => {
      setmaxPrice(value);
      if(minPrice && value){
        setFormData({ ...formData, price:minPrice+"-"+value });
      }
     }
   const handleVerifiedChange = (selectedOption: string) => {
    setSelectedVerified(selectedOption);
    setFormData({ ...formData, membership:selectedOption });
   }
    const [isChatOpen, setChatOpen] = useState(false);
     const toggleChat = () => {
       setChatOpen(!isChatOpen);
     };
     const [isPicking, setisPicking] = useState(false);
     const handleNearByProperties = () => {
       setisPicking(true)
       if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(
           (position) => {
             setNewqueryObject({
               ...newqueryObject,
               location: position.coords.latitude+"/"+position.coords.longitude,
             });
          //console.log({
          //  ...newqueryObject,
          //  location: position.coords.latitude+"/"+position.coords.longitude,
         // });
           },
           (error) => {
             console.error("Error getting location:", error);
             alert("Unable to retrieve your location. Please enable location services.");
           }
         );
         setisPicking(false)
       } else {
         setisPicking(false)
         alert("Geolocation is not supported by this browser.");
       }
     };

   const handleSortChange = (selectedOption: string) => {
     //let newUrl = "";
     if (selectedOption) {

     if(selectedOption === 'nearby'){

      handleNearByProperties();
      setActiveButton(1);
     }else{
      const updatedQueryObject = {
        ...newqueryObject,
        sortby:selectedOption,
      };
      // Remove location if it exists
      if (updatedQueryObject.location) {
        delete updatedQueryObject.location;
      }
    
      setNewqueryObject(updatedQueryObject);
      setActiveButton(1);
    }
     }
    
   };
 
   const handlePrice = (index: number, min: string, max: string) => {
     setactiverange(index);
   
     if (min && max) {
  
      const updatedQueryObject = {
        ...queryObject,
        category: newqueryObject.category.toString(),
        subcategory: newqueryObject.subcategory.toString(),
        price:min + "-" + max,
      };
    
      // Remove location if it exists
      if (updatedQueryObject.location) {
        delete updatedQueryObject.location;
      }
    
      setNewqueryObject(updatedQueryObject);

    };
   };
  
   const handleClear = () => {
     setclearQuery(!clearQuery);
    setNewqueryObject({
            category: newqueryObject.category.toString(),
            subcategory: newqueryObject.subcategory.toString(),
          });
         
     setShowPopup(false);
     setactiverange(20);
  
   };
   const [showPopupMapSearch, setShowPopupMapSearch] = useState(false);

   const handleOpenPopupMapSearch = () => {
    setShowPopupMapSearch(true);
  };
  
  const handleClosePopupMapSearch = () => {
    setShowPopupMapSearch(false);
  };
   const [isOpen, setIsOpen] = useState(false);
 
   const openDialog = () => {
     setIsOpen(true);
   };
 
   const closeDialog = () => {
     setIsOpen(false);
   };
   const [isOpenP, setIsOpenP] = useState(false);
     const handleOpenP = () => {
       setIsOpenP(true);
     };
    
     const handleCloseP = () => {
       setIsOpenP(false);
     };
   const [showPopup, setShowPopup] = useState(false);
   // Handler to toggle the popup
   const togglePopup = () => {
    
    setShowPopup(!showPopup);
   
   };
 
   const onLoading = () => {
     setLoading(true);
     setShowPopup(false);
   };
   const closeLoading = () => {
     setLoading(false);
   };
   const openLoading = () => {
     setLoading(true);
   };
   const handleRegion = (value:string) => {
     setRegion(value);
   };
   const [showPopupLocation, setShowPopupLocation] = useState(false);
 
   const handleOpenPopupLocation = () => {
     setShowPopupLocation(true);
   };
   const handleClosePopupLocation = () => {
     setShowPopupLocation(false);
   };
   
   const handleFilter = (value: any) => {
    const updatedQueryObject = {
      ...queryObject,
      category: newqueryObject.category.toString(),
      subcategory: newqueryObject.subcategory.toString(),
      ...value,
    };
  
    // Remove location if it exists
    if (updatedQueryObject.location) {
      delete updatedQueryObject.location;
    }
  
    setNewqueryObject(updatedQueryObject);
  };

    const handleResetFilter = (value:any) => {
      setclearQuery(!clearQuery);
      setNewqueryObject({
        ...value,
      });

      
      };


  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
   
       useEffect(() => {
          const savedTheme = localStorage.getItem("theme") || mode; // Default to "dark"
          const isDark = savedTheme === mode;
          
          setIsDarkMode(isDark);
          document.documentElement.classList.toggle(mode, isDark);
        }, []);
      
        useEffect(() => {
          if (isDarkMode === null) return; // Prevent running on initial mount
      
          document.documentElement.classList.toggle(mode, isDarkMode);
          localStorage.setItem("theme", isDarkMode ? "dark" : "light");
        }, [isDarkMode]);
      
        if (isDarkMode === null) return null; // Avoid flickering before state is set
      
  return (
    <div className="relative flex w-full h-screen">
    {/* Sidebar */}
    <div
      onClick={(e) => e.stopPropagation()} // Prevent sidebar from closing on itself click
      className={`bg-white shadow-lg transition-transform rounded-0 duration-300 ease-in-out fixed md:relative z-10 ${
        showSidebar
          ? "w-full md:w-[280px] p-1 transform translate-x-0"
          : "-translate-x-full md:w-0 md:translate-x-0"
      }`}
    >
      <Button onClick={handleSidebarToggle} className="mb-4 md:hidden">
        {showSidebar ? "Hide" : "Show"} Sidebar
      </Button>
  
      {showSidebar && (
        <div className="flex flex-col space-y-4 h-full">
           <div className="w-full p-0 mt-4">
            <CategoryFilterSearch categoryList={categoryList} handleFilter={handleResetFilter}/>
            </div>
          
          {/* Categories Section 
          <ScrollArea.Root className="flex-1 overflow-hidden">
        <ScrollArea.Viewport  className="h-full overflow-y-auto text-sm lg:text-base w-full dark:bg-[#2D3236] bg-white rounded-0 border p-3">
      
                */}  
                      <SidebarSearchMain
                          categoryList={subcategoryList}
                          category={newqueryObject.category}
                          subcategory={newqueryObject.subcategory}
                          handleFilter={handleResetFilter}
                          loans={loans}
                         
                        />
                        
                   {/*    </ScrollArea.Viewport>
                         <ScrollArea.Scrollbar orientation="vertical" />
                           <ScrollArea.Corner />
                         </ScrollArea.Root>  */}  
        </div>
      )}
    </div>
  
    {/* Overlay */}
    {showSidebar && window.innerWidth < 768 && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={() => setShowSidebar(false)}
      ></div>
    )}
  
    {/* Ads Section */}
    <div
      className={`flex-1 flex-col bg-[#e4ebeb] lg:bg-white transition-all duration-300 h-screen ${
        showSidebar ? "hidden md:block" : "block"
      }`}
    >
     
  
      <div className="relative h-screen flex flex-col">
      <Button
        onClick={handleSidebarToggle}
        className="hidden lg:inline absolute bottom-5 left-4 z-10 md:block bg-green-600 text-white shadow-lg hover:bg-green-700"
      >
        {showSidebar ? (
          <>
            <KeyboardArrowLeftOutlinedIcon /> Hide Categories
          </>
        ) : (
          <>
            <KeyboardArrowRightOutlinedIcon /> Show Categories
          </>
        )}
      </Button>
        {/* Header Section */}
        <div className="mb-0 flex flex-col gap-0 top-0 left-0 w-full bg-gradient-to-b from-[#e4ebeb] to-[#e4ebeb] lg:from-white lg:to-white p-0 z-10 md:relative md:w-auto md:shadow-none">
        <div
  className={`bg-gradient-to-b from-green-600 to-green-600 lg:from-white h-[60px] lg:to-white transition-all duration-300 overflow-hidden p-2 w-full flex flex-col items-center ${
    showBottomNav ? "max-h-[60px] opacity-100" : "max-h-0 opacity-0"
  }`}
>
    <div className="w-full h-full justify-between flex items-center">
      <div className="flex items-center">
        <div
          className="mr-2 w-5 h-8 text-white lg:text-gray-500 flex items-center justify-center rounded-sm tooltip tooltip-bottom hover:cursor-pointer lg:hover:text-green-600"
          data-tip="Back"
          onClick={() => {
            console.log(newqueryObject);
            onClose();
          }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ArrowBackOutlinedIcon />
              </TooltipTrigger>
              <TooltipContent>
                <p>Back</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-2">
      
        <img src="/logo_white.png" alt="Logo" className="w-8 h-8 lg:hidden rounded-full" />
        <img src="/logo.png" alt="Logo" className="w-8 h-8 hidden lg:inline rounded-full"/>
                
        <StyledBrandName/>
        </div>
      </div>

      <div className="hidden lg:inline dark:text-gray-400 text-emerald-950 text-center sm:text-left p-0">
        {newqueryObject.subcategory ? (
          <div className="flex gap-1 items-center"> <div className="font-bold"> {newqueryObject.subcategory}{"(s)"}</div> in Kenya</div>
        ) : (
         
             <div className="flex gap-1 items-center">All <div className="font-bold"> {newqueryObject.category}</div> in Kenya</div>
            
         
        )}
      </div>

      <div className="flex gap-2 items-center">
        <div className="hidden lg:inline">
          <div className="flex items-center gap-2">
            <SignedIn>
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-[#e4ebeb] hover:bg-gray-300 tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Messages"
              onClick={() => {
                handleOpenBook();
              }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <BookmarkIcon sx={{ fontSize: 16 }} className="" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bookmark</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            </SignedIn>
             <SignedOut>
                                 <div
                                    className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-[#e4ebeb] hover:bg-gray-300 tooltip tooltip-bottom hover:cursor-pointer"
                                    data-tip="Messages"
                                    onClick={() => {
                                      setIsOpenP(true);
                                       router.push("/sign-in");
                                     }} 
                                  >
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <BookmarkIcon sx={{ fontSize: 16 }} />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Bookmark</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                        </SignedOut>
<SignedIn>
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-[#e4ebeb] hover:bg-gray-300 tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Messages"
              onClick={() => {
                handleOpenChat();
              }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative flex items-center justify-center">
                      <MessageIcon sx={{ fontSize: 16 }} className="absolute " />
                      <div className="absolute z-10">
                        <Unreadmessages userId={userId} popup={"category"}/>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div
                      onClick={() => {
                        handleOpenChat();
                      }}
                      className="flex gap-1"
                    >
                      Chats
                      <Unreadmessages userId={userId} popup={"category"} />
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
  </SignedIn>
 <SignedOut>
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Messages"
              onClick={() => {
                setIsOpenP(true);
                 router.push("/sign-in");
               }} 
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <MessageIcon sx={{ fontSize: 16 }} className="absolute" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Message</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            </SignedOut>
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-[#e4ebeb] hover:bg-gray-300 tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Messages"
              onClick={() => {
                handleOpenPlan();
              }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DiamondIcon sx={{ fontSize: 16 }} className="" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Premium Services</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div>
              <SignedIn>
                <Button
                  onClick={() => {
                    handleOpenSell();
                    // onClose();
                  }}
                  variant="default"
                  className="flex bg-green-600 hover:bg-green-700 items-center gap-2"
                >
                  <AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL
                </Button>
              </SignedIn>
            </div>

            <div>
              <SignedOut>
                <Button
                  onClick={() => {
                    // setIsOpenP(true);
                    router.push("/sign-in");
                  }}
                  variant="default"
                  className="flex bg-green-600 hover:bg-green-700 items-center gap-2"
                >
                  <AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL
                </Button>
              </SignedOut>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <SignedIn>
            <div className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white tooltip tooltip-bottom hover:cursor-pointer">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <MobileNav
            userstatus={"User"}
            userId={userId}
            popup={"category"}
            user={user}
            handleOpenSell={handleOpenSell}
            handleOpenBook={handleOpenBook}
            handleOpenPlan={handleOpenPlan}
            handleOpenChat={handleOpenChat}
            handleOpenShop={handleOpenShop}
            handleOpenPerfomance={handleOpenPerfomance}
            handleOpenSettings={handleOpenSettings}
            handleOpenAbout={handleOpenAbout}
            handleOpenTerms={handleOpenTerms}
            handleOpenPrivacy={handleOpenPrivacy}
            handleOpenSafety={handleOpenSafety}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
    </div>
    <div className="lg:hidden dark:text-gray-400 text-emerald-950 sm:text-left p-0">
    {newqueryObject.subcategory ? (
          <div className="m-2 flex gap-1 items-center"> <div className="font-bold"> {newqueryObject.subcategory}{"(s)"}</div> in Kenya</div>
        ) : (
         
             <div className="m-2 flex gap-1 items-center">All <div className="font-bold"> {newqueryObject.category}</div> in Kenya</div>
            
         
        )}
      </div>
    <div className="w-full lg:hidden">
      <div className="flex w-full gap-1 pl-1 pr-1 items-center">
      
        {/*   <div className="flex-1">
           <TooltipProvider>
             <Tooltip>
               <TooltipTrigger asChild>
                 <button
                   onClick={handleNearByProperties}
                   className="flex text-xs gap-2 bg-white text-gray-700 items-center justify-center w-full py-3 px-2 border-gray-300 border rounded-sm hover:bg-gray-100"
                 >
                   <div className="flex gap-2 items-center">
                   <MyLocationOutlinedIcon/>
                      {isPicking ? (<>
                        Nearby {newqueryObject.category ==='Property Services' ? (<>Service Provider</>):(<>Property</>)} <CircularProgress sx={{ color: "gray" }} size={30} />
                                               </> ):(<>
                                                Nearby {newqueryObject.category ==='Property Services' ? (<>Service Provider</>):(<>Property</>)}
                                             </>)}
                   </div>
                
                 </button>
               </TooltipTrigger>
               <TooltipContent>
                 <p>Search Near By</p>
               </TooltipContent>
             </Tooltip>
           </TooltipProvider>
         </div>

          <div className="flex-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleOpenPopupMapSearch}
                    className="flex text-xs gap-2 bg-white text-gray-700 items-center justify-center w-full py-4 px-2 border-gray-300 border rounded-sm hover:bg-gray-100"
                  >

                    
                    <div className="flex gap-2 items-center">
                    
                    <div className="hidden lg:inline">
           <TravelExploreOutlinedIcon/>
           </div>
           <div className="lg:hidden">
           <TravelExploreOutlinedIcon sx={{ fontSize: 20 }}/>
           </div> 
                    
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
        

        <div className="flex-1 gap-1 items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={togglePopup}
                  className="flex text-xs bg-white py-4 px-3 cursor-pointer border-gray-300 border rounded-sm text-gray-700 text-sm hover:bg-gray-100 p-1 justify-center items-center"
                >
                
                  <div className="hidden lg:inline">
           <SortOutlinedIcon/>
           </div>
           <div className="hidden">
           <SortOutlinedIcon sx={{ fontSize: 20 }}/>
           </div> 
                  <div className="flex gap-1 items-center">Filter</div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Advanced Filter</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>*/}
      </div>
    </div>

    <div className="flex w-full p-1 gap-1  justify-center items-center mb-0">
   
 <div
          className={`flex py-4 px-2 cursor-pointer border-gray-300 border rounded-sm text-gray-700 hover:bg-[#e4ebeb] p-1 gap-1 items-center dark:bg-[#2D3236] bg-white rounded-sm p-1 cursor-pointer ${
            view === 'map' ? "text-[#30AF5B]" : "text-gray-500"
          }`}
          onClick={() => {setView('map'); setShowBottomNav(false);}}
        >
          <div className="text-sm lg:text-base">
            <p>🗺 View on Map</p>
          </div>
        </div>

        <div
          className={`flex py-4 px-2 cursor-pointer border-gray-300 border rounded-sm text-gray-700 hover:bg-[#e4ebeb] gap-1 items-center dark:bg-[#2D3236] bg-white rounded-sm p-1 cursor-pointer ${
            view === 'list' ? "text-[#30AF5B]" : "text-gray-500"
          }`}
          onClick={() => {setView('list'); setShowBottomNav(true);}}
        >
          <div className="text-sm lg:text-base">
            <p>📋 View as List</p>
          </div>
        </div>
      <div className="flex-1">
        <SearchNow handleFilter={handleFilter} handleOpenSearchByTitle={handleOpenSearchByTitle}/>
      </div>

  
       {/*  <div className="flex hidden lg:inline">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleOpenPopupMapSearch}
                  className="flex gap-2 text-gray-700 items-center justify-center w-full py-4 px-2 border-gray-300 border rounded-sm hover:bg-gray-100"
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
      */}

      <div className="flex gap-1 items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={togglePopup}
                className="flex py-4 px-2 bg-white cursor-pointer border-gray-300 border rounded-sm text-gray-700 text-sm hover:bg-[#e4ebeb] justify-between items-center"
              >
                <SortOutlinedIcon />
                <div className="flex gap-1 items-center">Filter</div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Advanced Filter</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {showPopupMapSearch && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <PropertyMapSearch
                queryObject={newqueryObject}
                onClose={handleClosePopupMapSearch}
                handleOpenPlan={handleOpenPlan}
                handleAdEdit={handleAdEdit}
                handleAdView={handleAdView}
                handleOpenSell={handleOpenSell}
                 userName={userName}
                 userImage={userImage}
              />
           
        </div>
      )}

      {showPopupLocation && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90 z-50">
          <div className="h-[90vh] dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 bg-gray-100 p-0 w-full lg:max-w-3xl rounded-md shadow-md relative">
          
          {loadingCount ? (<>{isMobile ? (<>
                          <div className="fixed inset-0 z-50 bg-[#e4ebeb] dark:bg-[#222528] dark:text-gray-100 p-1 flex flex-col">
                                            <div className="flex justify-between items-center border-b pb-2">
                                            <div className="font-bold text-lg  dark:text-gray-300 text-emerald-950 text-center sm:text-left p-2">
                                                  Location Filter
                                                   </div>
                                              <Button variant="outline" onClick={handleClosePopupLocation}>
                                              <CloseOutlinedIcon />
                                              </Button>
                                  </div>
                          <LocationListSkeleton/>
                          </div></>):(<>
                          
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90 z-50">
                      <div className="h-[90vh] dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 bg-[#e4ebeb] p-0 w-full  lg:max-w-3xl rounded-md shadow-md relative">
                    <div className="flex justify-between items-center border-b pb-2">
                                            <div className="font-bold text-lg  dark:text-gray-300 text-emerald-950 text-center sm:text-left p-2">
                                                   Location Filter
                                                   </div>
                                              <Button variant="outline" onClick={handleClosePopupLocation}>
                                              <CloseOutlinedIcon />
                                              </Button>
                                  </div>
                          <LocationListSkeleton/>
                          </div></div>
                          
                          </>)}
                         
                                    </>):(<>
            <LocationSelection
              onSelected={handleRegion}
              AdsCountPerRegion={AdsCountPerRegion}
              onClose={handleClosePopupLocation}
              handleFilter={handleFilter}
            />
            </>)}
          </div>
        </div>
      )}
        {showPopup && (<>
                        
                      
                            <SidebarSearchmobile
                              categoryList={subcategoryList}
                              category={newqueryObject.category}
                              subcategory={newqueryObject.subcategory}
                             // AdsCountPerRegion={AdsCountPerRegion}
                              AdsCountPerVerifiedTrue={AdsCountPerVerifiedTrue}
                              AdsCountPerVerifiedFalse={AdsCountPerVerifiedFalse}
                              adsCount={adsCount}
                              onLoading={onLoading}
                              handleFilter={handleFilter}
                              selectedVerified={selectedVerified}
                              handleVerifiedChange={handleVerifiedChange}
                              handleminPriceChange={handleminPriceChange}
                              handlemaxPriceChange={handlemaxPriceChange}
                              maxPrice={maxPrice}
                              minPrice={minPrice}
                              formData={formData}
                              applyFilters={applyFilters}
                              handleInputChange={handleInputChange}
                              handleCheckboxChange={handleCheckboxChange}
                              handleInputAutoCompleteChange={handleInputAutoCompleteChange}
                              handleInputYearChange={handleInputYearChange}
                              handleClearForm={handleClearForm}
                              HandletogglePopup={togglePopup}
                            />
                         
                         </> )}
                         </div>              
   

</div>

        {/* List Ads Section */}
     
   
      <div ref={scrollRefB} className="h-full overflow-y-auto bg-[#e4ebeb] border">
      <style jsx>{`
    @media (max-width: 1024px) {
      div::-webkit-scrollbar {
        display: none;
      }
    }
  `}</style>
  <section className="p-1 mb-20">
    <div className="flex items-center p-1 w-full justify-between">
      <div className="flex items-center gap-1 flex-wrap justify-start items-center mb-0">
     
     {view === "list" &&
        (<div className="flex items-center gap-1">
          <div
          className={`flex gap-1 items-center text-xs dark:bg-[#2D3236] bg-white rounded-sm p-1 cursor-pointer ${
            activeButton === 0 ? "text-[#30AF5B]" : "text-gray-500"
          }`}
          onClick={() => handleButtonClick(0)}
        >
          <ViewModuleIcon />
          <div className="hidden lg:inline">
            <p>Grid layout</p>
          </div>
        </div>
        <div
          className={`flex gap-1 items-center text-xs dark:bg-[#2D3236] bg-white rounded-sm p-1 cursor-pointer ${
            activeButton === 1 ? "text-[#30AF5B]" : "text-gray-500"
          }`}
          onClick={() => handleButtonClick(1)}
        >
          <ViewListIcon />
          <div className="hidden lg:inline">
            <p>List layout</p>
          </div>
        </div>
        </div>)
      }
       
      
      </div>
    
        {view === "list" &&
        (  <div className="flex gap-1 items-center">
         <div className="rounded-sm dark:bg-[#2D3236] bg-white border py-1 px-2 z-5 flex items-center">
          
          <div className="text-[#30AF5B]">
          {isPicking && (<>
                      <CircularProgress sx={{ color: "gray" }} size={30} />
                                               </> )} <SwapVertIcon />
          </div>
          <Select onValueChange={handleSortChange}>
            <SelectTrigger className="lg:w-[200px] dark:text-gray-300 text-gray-700 dark:bg-[#2D3236] border-0 rounded-full">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#222528]">
              <SelectGroup>
                <SelectItem value="recommeded">Recommended first</SelectItem>
                <SelectItem value="nearby">Nearby {newqueryObject.category ==='Property Services' ? (<>Service Provider</>):(<>Properties</>)}</SelectItem>
                <SelectItem value="new">Newest first</SelectItem>
                <SelectItem value="lowest">Lowest price first</SelectItem>
                <SelectItem value="highest">Highest price first</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <button
          onClick={handleClear}
          className="py-4 px-2 text-xs bg-white border border-gray-300 text-gray-700 text-sm hover:bg-gray-300 rounded-sm flex items-center gap-1 hover:cursor-pointer"
        >
          <SearchOffOutlinedIcon sx={{ fontSize: 16 }} />Clear
        </button>
    
   
        </div>)}
       
 
    <div>
  </div>

      {view === "list" && newqueryObject.subcategory && (
        <div className="w-full dark:bg-[#2D3236] dark:text-gray-300 flex flex-col rounded-lg mb-1">
          <MenuType
            categoryList={subcategoryList}
            category={newqueryObject.category}
            subcategory={newqueryObject.subcategory}
            clearQuery={clearQuery}
            handleFilter={handleFilter}
          />
        </div>
      )} 
    </div>
{view === "list" ? (<>
 <CollectionSearch
                  emptyTitle="No ads have been created yet"
                  emptyStateSubtext="Go create some now"
                  limit={20}
                  userId={userId}
                  activeButton={activeButton}
                  queryObject={newqueryObject}
                  loadPopup={loading}
                  handleAdEdit={handleAdEdit}
                  handleOpenSell={handleOpenSell}
                  handleAdView={handleAdView}
                  handleOpenPlan={handleOpenPlan}
                  handleOpenChatId={handleOpenChatId} 
                  userName={userName} 
                  userImage={userImage}/></>):(<>
                  <PropertyMapSearchComponent
                queryObject={newqueryObject}
                onClose={handleClosePopupMapSearch}
                handleOpenPlan={handleOpenPlan}
                handleAdEdit={handleAdEdit}
                handleAdView={handleAdView}
                handleOpenSell={handleOpenSell}
                 handleOpenChatId={handleOpenChatId} 
                 userName={userName}
                 userImage={userImage}
              /></>)}
   
  </section>

  {userId && (
    <>
      <FloatingChatIcon onClick={toggleChat} isOpen={isChatOpen} />
      <ChatWindow
        isOpen={isChatOpen}
        onClose={toggleChat}
        senderId={userId}
        senderName={userName}
        senderImage={userImage}
        recipientUid={AdminId}
        handleAdEdit={handleAdEdit}
        handleAdView={handleAdView}
        handleCategory={handleCategory}
        handleOpenSell={handleOpenSell}
        handleOpenPlan={handleOpenPlan}
      />
    </>
  )}

  {/* Footer Section */}
  <div className="hidden lg:inline">
    <Footersub
      handleOpenAbout={handleOpenAbout}
      handleOpenTerms={handleOpenTerms}
      handleOpenPrivacy={handleOpenPrivacy}
      handleOpenSafety={handleOpenSafety}
    />
  </div>
   <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
 </div>
  


        <footer>
          <div
                 className={`lg:hidden fixed bottom-0 left-0 right-0 transition-transform duration-300 ${
                   showBottomNav ? "translate-y-0" : "translate-y-full"
                 }`}
               >
                <BottomNavigation 
                userId={userId}
                popup={"category"}
                onClose={onClose}
                handleOpenSell={handleOpenSell}
                handleOpenChat={handleOpenChat}
                handleOpenSettings={handleOpenSettings}
                handleOpenSearchTab={handleOpenSearchTab} 
                handleOpenP={handleOpenP}                                              />
               </div>
        </footer>
      </div>
    </div>
  </div>
  
  );
};

export default MainCategory;