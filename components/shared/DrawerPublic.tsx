"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
//import { Bar, BarChart, ResponsiveContainer } from "recharts"
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useState } from "react"
import { Checkbox } from "../ui/checkbox"
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete"
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CircularProgress from "@mui/material/CircularProgress";

export function DrawerPublic({
    onChange,
    latitude,
    longitude,
  }: {
    latitude:string,
    longitude:string,
    onChange: (lat: string, lng: string) => void;
  }) {
    const [mapLink, setMapLink] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isPicking, setisPicking] = useState(false);
    
    const { suggestions, setValue, value, clearSuggestions } = usePlacesAutocomplete();
const [lat_, setlat] = useState("");
const [lng_, setlng] = useState("");
  const [inputMode, setInputMode] = useState< 'coordinates' | 'maplink' | 'address' | 'mylocation'>('mylocation');
  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const handleMyLocation = () => {
    setisPicking(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        
          setlat(userLocation.lat.toFixed(6));
          setlng(userLocation.lng.toFixed(6));
          onChange(userLocation.lat.toFixed(6),userLocation.lng.toFixed(6))
          setIsOpen(false)
  
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
  
  const handleCoordinateSearch = () => {
    const lat = parseFloat(lat_);
    const lng = parseFloat(lng_);
    if (!isNaN(lat) && !isNaN(lng)) {
      setlat(lat.toFixed(6))
      setlng(lng.toFixed(6))
      onChange(lat.toFixed(6),lng.toFixed(6))
      setIsOpen(false)
     
    }
  };
  const extractCoordinates = (url: string) => {
    const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    return match ? { lat: parseFloat(match[1]), lng: parseFloat(match[2]) } : null;
  };
  // Extract coordinates when the final URL is pasted
const handleFinalUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const finalUrl = e.target.value;
  setMapLink(finalUrl); // Update input field
  const coords = extractCoordinates(finalUrl);
  if (coords) {
    setlat(coords.lat.toFixed(6))
    setlng(coords.lng.toFixed(6))
    onChange(coords.lat.toFixed(6),coords.lng.toFixed(6))
    setIsOpen(false)
   
  } else {
    console.warn("Could not extract coordinates.");
  }
};
// Handle Address Selection
  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
     // setCenter({ lat, lng });
      setlat(lat.toFixed(6))
      setlng(lng.toFixed(6))
      onChange(lat.toFixed(6),lng.toFixed(6))
      setIsOpen(false)
     
    } catch (error) {
      console.error("Error getting geocode:", error);
    }
  };
  
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
      {longitude && latitude ? (<Button onClick={() => setIsOpen(true)} variant="default" className="absolute hidden lg:inline bottom-10 left-4 z-20">📍 Property: ({latitude},{longitude})</Button>):(<Button onClick={() => setIsOpen(true)} variant="default" className="text-white bg-green-600 hover:bg-green-700"><AddOutlinedIcon/> Add Property coordinates </Button>)} 
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>📍 Property Location</DrawerTitle>
            <DrawerDescription>Set your property location in order to draw land boundaries and feature markers.</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
       
     
      <div className='flex justify-between items-center w-full'>
      {(!latitude || !longitude) ? (<div className="text-gray-500 p-1">
      Set Property location </div>):(<> <div className='grid grid-cols-2 items-center'>

<div className="flex gap-1 mb-3 items-center">
  <label className="block text-sm font-medium">Latitude:</label>
  <div className="text-2xl font-bold tracking-tighter">
  {latitude}
          </div>
  
</div>

<div className="flex gap-1 items-center mb-3">
  <label className="block text-sm font-medium">Longitude:</label>
  <div className="text-2xl font-bold tracking-tighter">
  {longitude}
          </div>

</div>
</div></>)}
     
    </div>
           {/* Tab Buttons */}
           <div className="flex gap-1 mb-4">
          {["mylocation", "coordinates", "maplink", "address"].map((mode:any) => (
            <button
              key={mode}
              onClick={() => setInputMode(mode)}
              className={`border p-2 text-sm rounded-md ${
                inputMode === mode ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {capitalizeFirstLetter(mode)}
            </button>
          ))}
        </div> 

        <div className="bg-white rounded-b-xl rounded-tr-xl dark:bg-[#131B1E] p-2 flex flex-col">
        {inputMode === 'mylocation' && (
          <div className="mb-2 ">
           <div className="flex items-center space-x-2">
      <Checkbox id="location" onCheckedChange={handleMyLocation} />
      <label
        htmlFor="location"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Pick my current location
      </label>
      {isPicking && (
                    <CircularProgress sx={{ color: "gray" }} size={30} />
                  )}
    </div>
           
           
          </div>
        )}
        {/* Address Search Input */}
        {inputMode === 'address' && (
          <div className="mb-2">
            <input
              type="text"
              placeholder="Search by address..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full text-sm dark:bg-[#2D3236] dark:text-gray-300 dark:border-gray-600  p-2 border border-gray-300 rounded-md"
            />
            {suggestions.status === "OK" && (
              <ul className="text-sm dark:bg-[#2D3236] dark:text-gray-300 dark:border-gray-600  bg-white border border-gray-300 rounded-md mt-2 max-h-40 overflow-auto">
                {suggestions.data.map((suggestion: any) => (
                  <li
                    key={suggestion.place_id}
                    className="p-2 hover:bg-green-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleSelect(suggestion.description)}
                  >
                    {suggestion.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Coordinate Input Fields */}
        {inputMode === 'coordinates' && (<div>
          <div className="mb-2 flex w-full flex-col lg:flex-row gap-2 ">
            <input
              type="text"
              placeholder="Latitude"
              //value={latitude}
              onChange={(e) => setlat(e.target.value)}
              className="p-2 w-full text-sm border dark:bg-[#2D3236] dark:text-gray-300 dark:border-gray-600 border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Longitude"
              //value={longitude}
              onChange={(e) => setlng(e.target.value)}
              className="p-2 w-full border text-sm dark:bg-[#2D3236] dark:text-gray-300 dark:border-gray-600 border-gray-300 rounded-md"
            />
            <Button onClick={handleCoordinateSearch} variant="default" className="bg-blue-500 text-white rounded">Go</Button>
          </div>
          </div>)}
          {inputMode === 'maplink' && (
          <div className="mb-2 flex flex-col gap-2">
<input
  type="text"
  placeholder="Paste Google Map URL..."
  onChange={handleFinalUrlChange}
  className="p-2 border dark:bg-[#2D3236] dark:text-gray-300 rounded w-full mb-4"
/>
          </div>
        )}
</div>
    
</div>
        
          <DrawerFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline">Cancel</Button>
           {/* <DrawerClose asChild>
             
            </DrawerClose> */}
          </DrawerFooter>
        </div>
      </DrawerContent>
      
    </Drawer>
  )
}
