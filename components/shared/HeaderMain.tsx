"use client";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Searchmain from "./Searchmain";
import SearchNow from "./SearchNow";
import LocationSelection from "./LocationSelection";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PropertyMap from "./PropertyMap";
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined';
import ShareLocationOutlinedIcon from '@mui/icons-material/ShareLocationOutlined';
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import MapSearch from "./MapSearch";
import PropertyMapSearch from "./PropertyMapSearch";
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
export default function HeaderMain({ handleFilter ,handleOpenSearchByTitle, handleCategory, handleOpenPlan, handleOpenSell, handleAdView, handleAdEdit, AdsCountPerRegion,queryObject }: { handleOpenSearchByTitle:() => void, handleOpenPlan:() => void, handleOpenSell:() => void, handleFilter: (value:any) => void, AdsCountPerRegion:any,queryObject:any , handleAdEdit: (id:string) => void, handleCategory: (value:string) => void,
  handleAdView: (id:string) => void}) {
  const router = useRouter();
  const [search, setSearch] = useState<string>();
  const [region, setRegion] = useState("All Kenya");
  // Function to handle changes in the search input
  const handleSearchChange = (event: { target: { value: any } }) => {
    const { value } = event.target;
    setSearch(value);
  };
 const [showPopup, setShowPopup] = useState(false);
 const [showPopupMap, setShowPopupMap] = useState(false);
 

 const handleOpenPopupMap = () => {
   setShowPopupMap(true);
 };

 const handleClosePopupMap = () => {
   setShowPopupMap(false);
 };
  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const handleRegion = (value:string) => {
    setRegion(value);
  };
  return (
    <div
      className="relative flex flex-col w-full p-1 mb-1"
     
    >
        <div className="flex gap-1 items-center w-full">
        <div className="flex gap-1 items-center w-full">
        <div className="flex">
        <button
        onClick={handleOpenPopup}
        className="flex text-xs lg:text-base gap-1 items-center justify-center w-full py-4 px-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2D3236] dark:text-gray-100 rounded-sm hover:bg-gray-100"
        >
           <div className="hidden lg:inline">
           <LocationOnIcon/>
           </div>
           <div className="lg:hidden">
           <LocationOnIcon sx={{ fontSize: 24 }}/>
           </div>
        {region}
        </button>
        </div>
        <div className="hidden lg:inline flex-1">
        <SearchNow handleFilter={handleFilter} handleOpenSearchByTitle={handleOpenSearchByTitle}/>
        </div>

 


                <div className="flex-1 lg:hidden">
                <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <button
                    onClick={handleOpenPopupMap}
                    className="flex gap-2  bg-white justify-between items-center justify-center w-full py-4 px-2 border-gray-300 border rounded-sm hover:bg-gray-100"
                  >
                   {/*  🗺️ */}
                   <div className="flex gap-3 items-center">
                    
                    <DirectionsWalkOutlinedIcon sx={{ fontSize: 24 }}/>
                    <div className="text-xs lg:text-base flex gap-1 items-center">Virtual Site Visit </div></div><ArrowForwardIosIcon sx={{ fontSize: 14 }}/>
                  </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Explore the property&apos;s location through a virtual interactive tour.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
                  
                </div>


                <div className="flex hidden lg:inline">
                <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <button
                    onClick={handleOpenPopupMap}
                    className="flex gap-2 items-center justify-center w-full py-4 px-2 border-gray-300 border rounded-sm hover:bg-gray-100"
                  >
                   {/*  🗺️ */}
                   
                    <DirectionsWalkOutlinedIcon/>
                    <div className="flex gap-1 items-center">Virtual Property Site Visit <ArrowForwardIosIcon sx={{ fontSize: 14 }}/></div>
                  </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Explore the property&apos;s location through a virtual interactive tour.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
                  
                </div>


        </div>


      


        {showPopupMap && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 z-50">
                      <PropertyMap queryObject={queryObject} handleOpenSell={handleOpenSell} handleOpenPlan={handleOpenPlan} onClose={handleClosePopupMap} handleAdView={handleAdView} handleAdEdit={handleAdEdit} handleCategory={handleCategory}/>
                    </div>
                     
                  )}
      {/* Left Side */}
      {showPopup && (
                     
                          <LocationSelection
                           onSelected={handleRegion}
                           AdsCountPerRegion={AdsCountPerRegion}
                           onClose={handleClosePopup}
                           handleFilter={handleFilter}
                          />
                       
                    )}
                    </div>
                      <div className="mt-1 lg:hidden">
        <SearchNow handleFilter={handleFilter} handleOpenSearchByTitle={handleOpenSearchByTitle}/>
        </div>

    </div>
  );
}
