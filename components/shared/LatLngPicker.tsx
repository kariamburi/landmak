"use client";

import { useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEAPIKEY as string; // Replace with actual API key
const containerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: -1.286389, lng: 36.817223 }; // Default: Nairobi, Kenya

const LatLngPicker = ({
    selected,
    name,
    onChange,
    onSave,
  }: {
    selected: any;
    name: string;
    onChange: (field: string, value: any) => void;
    onSave: () => void;
  }) => {
  const [center, setCenter] = useState(selected ? { lat: Number(selected.latitude), lng:Number(selected.longitude) }:defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(selected ? { lat:  Number(selected.latitude), lng: Number(selected.longitude) }:defaultCenter);
  const [latitude, setLatitude] = useState(selected ? selected.latitude:"");
  const [longitude, setLongitude] = useState(selected ? selected.longitude:"");
  const { isLoaded } = useLoadScript({ googleMapsApiKey: GOOGLE_MAPS_API_KEY, libraries: ["places"] });
  const { suggestions, setValue, value, clearSuggestions } = usePlacesAutocomplete();

  if (!isLoaded) return <p className="text-center">Loading Map...</p>;

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
    //  onLocationSelect({ lat, lng });
    

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
    onChange(name, { latitude: latitude, longitude: longitude });
    onSave();
  };
  return (
    <div className="w-full p-1 dark:bg-[#2D3236] bg-[#e4ebeb] rounded-lg">
    <div className="flex gap-2 flex-col lg:flex-row">
      <div className="flex-1 gap-2 mb-2">
        <input type="text" placeholder="Search by address..." value={value} onChange={(e) => setValue(e.target.value)} className="w-full text-sm dark:bg-[#131B1E] dark:text-gray-300 dark:border-gray-600  p-2 border rounded" />
        {suggestions.status === "OK" && (
          <ul className="absolute z-10 text-sm dark:bg-[#131B1E] w-[350px] dark:text-gray-300 dark:border-gray-600 bg-white border rounded mt-1 max-h-40 overflow-auto">
            {suggestions.data.map((suggestion) => (
              <li key={suggestion.place_id} className="p-2 cursor-pointer hover:bg-[#e4ebeb]" onClick={() => handleSelect(suggestion.description)}>
                {suggestion.description}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex justify-between">
      <div className="flex gap-2 mb-2">
        <input type="text" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="p-2 text-sm w-[150px] dark:bg-[#131B1E] dark:text-gray-300 dark:border-gray-600  border rounded" />
        <input type="text" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="p-2 w-[150px] text-sm dark:bg-[#131B1E] dark:text-gray-300 dark:border-gray-600  border rounded" />
        <button onClick={handleCoordinateSearch} className="p-1 bg-blue-500 text-white rounded">Go</button>
        {longitude && longitude && (<><button
        onClick={handleSave}
        className="text-sm bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition"
      >
        Save
      </button></>) }
      </div>
    
        </div></div>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}>
        <Marker position={markerPosition} draggable onDragEnd={handleMarkerDragEnd} />
      </GoogleMap>
    </div>
  );
};

export default LatLngPicker;
