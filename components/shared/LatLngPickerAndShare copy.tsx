"use client";

import { useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import { useMediaQuery } from "react-responsive"; // Detect mobile screens
import { Icon } from "@iconify/react";
import Barsscale from "@iconify-icons/svg-spinners/bars-scale"; 
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEAPIKEY as string;
const containerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: -1.286389, lng: 36.817223 }; // Default: Nairobi, Kenya

const LatLngPickerAndShare = ({
    name,
    onChange,
    onSave,
  }: {
    name: string;
    onChange: (field: string, value: any) => void;
    onSave: () => void;
  }) => {
  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isPicking, setisPicking] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile screens
      
  //const [price, setPrice] = useState<number>(0);
  //const [title, setTitle] = useState("");
  const { isLoaded } = useLoadScript({ googleMapsApiKey: GOOGLE_MAPS_API_KEY, libraries: ["places"] });
  const { suggestions, setValue, value, clearSuggestions } = usePlacesAutocomplete();
  const [error, setError] = useState<string>("");
  if (!isLoaded) return <div className="h-[80vh] items-center justify-center"> <Icon icon={Barsscale} className="w-6 h-6 text-gray-500" /></div>;

  const handleSelect = async (address: any) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setCenter({ lat, lng });
      setMarkerPosition({ lat, lng });
      setLatitude(lat.toFixed(6));
      setLongitude(lng.toFixed(6));
  
    } catch (error) {
      console.error("Error getting geocode:", error);
    }
  };

  const handleCoordinateSearch = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setCenter({ lat, lng });
      setMarkerPosition({ lat, lng });
      setLatitude(lat.toFixed(6));
      setLongitude(lng.toFixed(6));
      //onLocationSelect({ lat, lng });
      
    }
  };

  const handleMarkerDragEnd = (event:any) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
    //onLocationSelect({ lat, lng });
   
  };
 // Handle Save
 const handleSave = () => {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lon)) {
    setError("Latitude and Longitude must be numbers.");
    return;
  }

  if (lat < -90 || lat > 90) {
    setError("Latitude must be between -90 and 90.");
    return;
  }

  if (lon < -180 || lon > 180) {
    setError("Longitude must be between -180 and 180.");
    return;
  }
  
    onChange(name, { lat: latitude, lng: longitude });
    onSave();
  };
  const handleMyLocation = () => {
    setisPicking(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userLocation);
          setMarkerPosition(userLocation);
          setLatitude(Number(userLocation.lat).toFixed(6));
          setLongitude(Number(userLocation.lng).toFixed(6));
         
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
  return (<>
      {isMobile ? (
              // Fullscreen Popover for Mobile
              <div className="fixed inset-0 z-50 bg-gray-200 dark:bg-[#222528] dark:text-gray-100 p-1 lg:p-4 flex flex-col">
                <div className="flex mt-[60px] justify-between items-center border-b pb-2">
                  <h4 className="font-medium text-lg">Share property location</h4>
                  <Button variant="outline" onClick={() => onSave()}>
                    Close
                  </Button>
                </div>
                <div className="flex gap-2 flex-col lg:flex-row">
    <div className="flex-1 gap-2 mb-2">
    <div className="flex items-center gap-2">
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
      <div className="flex-1 gap-2 mb-2">
        <input type="text" placeholder="Search by address..." value={value} onChange={(e) => setValue(e.target.value)} className="w-full text-sm dark:bg-[#131B1E] dark:text-gray-300 dark:border-gray-600  p-2 border rounded" />
        {suggestions.status === "OK" && (
          <ul className="absolute z-10 text-sm dark:bg-[#131B1E] w-[350px] dark:text-gray-300 dark:border-gray-600 bg-white border rounded mt-1 max-h-40 overflow-auto">
            {suggestions.data.map((suggestion) => (
              <li key={suggestion.place_id} className="p-2 cursor-pointer hover:bg-gray-200" onClick={() => handleSelect(suggestion.description)}>
                {suggestion.description}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex justify-between">
      <div className="flex flex-col">
      
      <div className="flex w-full gap-2 mb-2">
        <input type="text" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="p-2 text-sm w-[100px] lg:w-[150px] dark:bg-[#131B1E] dark:text-gray-300 dark:border-gray-600  border rounded" />
        <input type="text" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="p-2 w-[100px] lg:w-[150px] text-sm dark:bg-[#131B1E] dark:text-gray-300 dark:border-gray-600  border rounded" />
        <Button  variant="default" onClick={handleCoordinateSearch} className="bg-blue-500 text-white rounded">Go</Button>
        {longitude && longitude && (
        <Button
        onClick={handleSave}
        variant="default"
        className="bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        Share
      </Button>) }
      </div>

      </div>
    
        </div></div>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}
       options={{
        zoomControl: true, // Enable zoom controls
        mapTypeControl: true, // Enable map type switch (optional)
        streetViewControl: true, // Enable Street View control (optional)
        fullscreenControl: true, // Enable Fullscreen button (optional)
      }}>
        <Marker position={markerPosition} draggable onDragEnd={handleMarkerDragEnd} />
      </GoogleMap>
                </div>):(
    <div className="w-full h-[80vh] p-1 dark:bg-[#2D3236] bg-gray-200 rounded-lg">
    <div className="flex gap-2 flex-col lg:flex-row">
    <div className="flex-1 gap-2 mb-2">
    <div className="flex items-center gap-2">
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
      <div className="flex-1 gap-2 mb-2">
        <input type="text" placeholder="Search by address..." value={value} onChange={(e) => setValue(e.target.value)} className="w-full text-sm dark:bg-[#131B1E] dark:text-gray-300 dark:border-gray-600  p-2 border rounded" />
        {suggestions.status === "OK" && (
          <ul className="absolute z-10 text-sm dark:bg-[#131B1E] w-[350px] dark:text-gray-300 dark:border-gray-600 bg-white border rounded mt-1 max-h-40 overflow-auto">
            {suggestions.data.map((suggestion) => (
              <li key={suggestion.place_id} className="p-2 cursor-pointer hover:bg-gray-200" onClick={() => handleSelect(suggestion.description)}>
                {suggestion.description}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex justify-between">
      <div className="flex flex-col">
      
      <div className="flex w-full gap-2 mb-2">
        <input type="text" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="p-2 text-sm w-[150px] dark:bg-[#131B1E] dark:text-gray-300 dark:border-gray-600  border rounded" />
        <input type="text" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="p-2 w-[150px] text-sm dark:bg-[#131B1E] dark:text-gray-300 dark:border-gray-600  border rounded" />
        <Button  variant="default" onClick={handleCoordinateSearch} className="bg-blue-500 text-white rounded">Go</Button>
        {longitude && longitude && (
        <Button
        onClick={handleSave}
        variant="default"
        className="bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        Share
      </Button>) }
      </div>

      </div>
    
        </div></div>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}
       options={{
        zoomControl: true, // Enable zoom controls
        mapTypeControl: true, // Enable map type switch (optional)
        streetViewControl: true, // Enable Street View control (optional)
        fullscreenControl: true, // Enable Fullscreen button (optional)
      }}>
        <Marker position={markerPosition} draggable onDragEnd={handleMarkerDragEnd} />
      </GoogleMap>
    </div>)}
    </>);
};

export default LatLngPickerAndShare;
