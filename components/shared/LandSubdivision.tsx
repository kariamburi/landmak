"use client";
import { useState, useCallback, useRef } from "react";
import { GoogleMap, LoadScript, Polygon, Marker, useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
const containerStyle = {
  width: "100%",
  height: "400px",
};
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEAPIKEY as string;

const defaultcenter = {
  lat: -1.286389, // Default center (Nairobi, Kenya)
  lng: 36.817223,
};

const LandSubdivision = ({
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
  const [mode, setMode] = useState("draw"); // Modes: draw, upload, manual
  const [polygons, setPolygons] = useState<{ paths: google.maps.LatLngLiteral[]; label: string, status: string, area:number, color:string }[]>(selected ? selected:[]);
  const [currentPath, setCurrentPath] = useState<google.maps.LatLngLiteral[]>([]);

  const [area, setArea] = useState<number | null>(null);
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState("Available");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const mapRef = useRef<google.maps.Map | null>(null);
const [center, setCenter] = useState(selected.length > 0 ? selected.paths[0] : defaultcenter);
const [mapLink, setMapLink] = useState("");
const [distance, setDistance] = useState<string | null>(null);
const [showAmenities, setShowAmenities] = useState(false);
const [amenityType, setAmenityType] = useState<string | null>(null);
const [amenities, setAmenities] = useState<any[]>([]);
//const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [circles, setCircles] = useState<google.maps.LatLngLiteral[]>([]);

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (mode === "draw" && event.latLng) {
        const newPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        
        setCurrentPath((prev) => [...prev, newPoint]);
        setCircles((prev) => [...prev, newPoint]); // Add circle marker
      }
    },
    [mode]
  );
  
 
// Save the polygon with label
const handleSavePolygon = () => {
    if (currentPath.length > 2) {
      const polygonLabel = label || `${polygons.length + 1}`;
     
        const polygonPath = currentPath.map(coord => new google.maps.LatLng(coord.lat, coord.lng));
        const calculatedArea = google.maps.geometry.spherical.computeArea(polygonPath);
        setArea(calculatedArea); // Area in square meters
       let color = "#00FF00";
        if(status !=="Available"){
          color = "#FF0000";
        }
      setPolygons([...polygons, { paths: currentPath, label: polygonLabel, status:status, area:calculatedArea,color:color }]);
      setCurrentPath([]); // Reset for new polygon
      setLabel(""); // Reset label
    
    }
  };
  const handleClear = () => {
    setCurrentPath([]);
    setCircles([])
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.features) {
          const newPolygons = json.features.map((feature: any) => {
            const coordinates = feature.geometry.coordinates[0].map((coord: number[]) => ({
              lat: coord[1],
              lng: coord[0],
            }));
          // Convert to LatLng array for Google Maps
      const polygonPath = coordinates.map((coord:any) => new google.maps.LatLng(coord.lat, coord.lng));
      // Calculate area
      const calculatedArea = google.maps.geometry.spherical.computeArea(polygonPath);
      setArea(calculatedArea); // Area in square meters
      let color = "#00FF00";
      if(status !=="Available"){
        color = "#FF0000";
      }
            return { paths: coordinates, label: feature.properties.name || "Uploaded Polygon", status:status,area:calculatedArea, color:color };
          });
          setPolygons([...polygons, ...newPolygons]);
        }
      } catch (error) {
        console.error("Error parsing GeoJSON file:", error);
      }
    };
    reader.readAsText(file);
  };

  const handleAddCoordinate = () => {
    if (!lat || !lng) return;
    setCurrentPath([...currentPath, { lat: parseFloat(lat), lng: parseFloat(lng) }]);
    setCircles((prev) => [...prev, { lat: parseFloat(lat), lng: parseFloat(lng) }]); // Add circle marker
    setLat("");
    setLng("");
  };

  const { suggestions, setValue, value, clearSuggestions } = usePlacesAutocomplete();
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  // Handle Address Selection
  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setCenter({ lat, lng });
      setShowPopup(false)
    } catch (error) {
      console.error("Error getting geocode:", error);
    }
  };
   // Handle Coordinate Search
   const handleCoordinateSearch = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setCenter({ lat, lng });
      setShowPopup(false)
    }
  };

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userLocation);
          setShowPopup(false)
         
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
// Extract coordinates from a full Google Maps URL
const extractCoordinates = (url: string) => {
  const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  return match ? { lat: parseFloat(match[1]), lng: parseFloat(match[2]) } : null;
};

// Open a popup window and instruct the user to copy the final URL
const openPopup = () => {
  const popup = window.open(mapLink, "GoogleMapsPopup", "width=800,height=600");
  if (!popup) {
    alert("Please allow popups for this site.");
  } else {
    alert("After the map loads, copy the full URL and paste it below.");
  }
};

// Extract coordinates when the final URL is pasted
const handleFinalUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const finalUrl = e.target.value;
  setMapLink(finalUrl); // Update input field
  const coords = extractCoordinates(finalUrl);
  if (coords) {
    //setCoordinates(coords);
    setCenter(coords);
    setShowPopup(false)
  } else {
    console.warn("Could not extract coordinates.");
  }
};

const handleMarkerDragEnd = (event:any) => {
  const lat = event.latLng.lat();
  const lng = event.latLng.lng();
  setCenter({ lat, lng });
  setLatitude(lat.toFixed(6));
  setLongitude(lng.toFixed(6));
  setShowPopup(false)
 
};
 
const [showPopup, setShowPopup] = useState(false);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  // Handle Save
const handleSave = () => {
  onChange(name, polygons); // Remove extra []
  onSave();
};
  const [inputMode, setInputMode] = useState< 'coordinates' | 'maplink' | 'address' | 'mylocation'>('mylocation');
 
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places", "geometry", "drawing"],
  });

 
 
 
  return isLoaded ? (
    <div className="w-full p-1 lg:p-4">
      <h2 className="text-lg font-semibold mb-2">Land Subdivision Tool</h2>
      
      <div className="grid grid-cols-3 lg:grid-cols-6 flex gap-2">
        <button onClick={() => setMode("draw")} className={`p-2 text-sm rounded-tl-xl ${mode === "draw"  ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-gray-600 text-white'}`}>Draw on Map</button>
        <button onClick={() => setMode("upload")} className={`p-2  text-sm ${mode === "upload" ? "bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white" : "bg-gray-600 text-white"}`}>Upload data JSON</button>
        <button onClick={() => setMode("manual")} className={`p-2  text-sm rounded-tr-xl ${mode === "manual" ? "bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white" : "bg-gray-600 text-white"}`}>Enter manually Lat/Lng</button>
     
      </div>
      <div className="bg-white lg:rounded-tr-xl dark:bg-[#131B1E] p-0 flex items-center justify-between">
      <div className="flex">
      {mode === "draw" && (<div className="justify-between flex items-center">
        <div className="p-2 flex flex-col lg:flex-row gap-2">
          <input
            type="text"
            placeholder="Enter label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="p-2 dark:bg-[#2D3236] dark:text-gray-100 border rounded w-64"
          />
          <select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    className={`p-2 border rounded dark:bg-[#2D3236] dark:text-gray-100`}
  >
    <option value="Available">Available</option>
    <option value="Sold">Sold</option>
  </select>

          <button onClick={handleSavePolygon} className="flex items-center gap-1 bg-blue-600  text-sm text-white px-4 py-2 rounded"><AddOutlinedIcon/> Save</button>
          <button onClick={handleClear} className="flex gap-1 items-center bg-red-600  text-sm text-white px-4 py-2 rounded"><ClearOutlinedIcon/> Clear</button>
        </div>
  
       
        </div>)}


      {mode === "upload" &&  <div className="p-2 flex gap-2"><input type="file" accept=".geojson,.json" onChange={handleFileUpload} className="p-2 border dark:bg-[#2D3236] dark:text-gray-100  border rounded" /></div>}
      
      {mode === "manual" && (
        <div className="p-2 flex flex-col lg:flex-row gap-2">
          <input type="text" placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} className="p-2 border dark:bg-[#2D3236] dark:text-gray-100  border rounded" />
          <input type="text" placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} className="p-2 border dark:bg-[#2D3236] dark:text-gray-100  border rounded" />
          <button onClick={handleAddCoordinate} className="flex gap-1 items-center bg-green-600 text-white text-sm px-4 py-2 rounded"><AddOutlinedIcon/> Add Point</button>
          <button onClick={handleClear} className="flex gap-1 items-center bg-red-600 text-white  text-sm px-4 py-2 rounded"><ClearOutlinedIcon/> Clear</button>
        {/* Ask for label before saving */}
    {currentPath.length > 2 && (
      <div className="mb-0 flex gap-2">
        <input
          type="text"
          placeholder="Subdivision Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="p-2 dark:bg-[#2D3236] dark:text-gray-100 border rounded"
        />
        <select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    className={`p-2 rounded dark:bg-[#2D3236] dark:text-gray-100`}
  >
    <option value="Available">Available</option>
    <option value="Sold">Sold</option>
  </select>

        <button onClick={handleSavePolygon} className="flex gap-1 items-center bg-green-600 text-white px-4 py-2 rounded">
        <AddOutlinedIcon/>Save Polygon
        </button>
      </div>
    )}

        </div>
      )}

</div>
{polygons.length > 0 && (<div className="p-2"><button
        onClick={handleSave}
        className="flex gap-1 items-center text-sm bg-orange-500 text-white py-2 px-3 rounded hover:bg-orange-600 transition"
      >
       <CheckOutlinedIcon/> Save Data
      </button></div>)} 

</div>
<div className="bg-white rounded-b-xl dark:bg-[#131B1E] p-2 flex flex-col">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          onClick={handleMapClick}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          options={{
            draggableCursor: mode === "draw" ? "crosshair" : "default",
            zoomControl: true, // Enable zoom controls
            mapTypeControl: true, // Enable map type switch (optional)
            streetViewControl: true, // Enable Street View control (optional)
            fullscreenControl: true, // Enable Fullscreen button (optional)
          }}
        >
            {mode === "draw" && (<Marker position={center} draggable onDragEnd={handleMarkerDragEnd} />)}  
          {currentPath.length > 0 && (
            <Polygon
              paths={currentPath}
              options={{ fillColor: "#0000FF", fillOpacity: 0.4, strokeColor: "#0000FF", strokeOpacity: 1, strokeWeight: 2 }}
            />
          )}
{circles.map((circle, index) => (
  <Marker
    key={index}
    position={circle}
    icon={{
      path: google.maps.SymbolPath.CIRCLE,
      scale: 3, // Size of the circle
      fillColor: "red",
      fillOpacity: 1,
      strokeWeight: 0,
    }}
  />
))}
          {polygons.map((poly, index) => (
            <Polygon
              key={index}
              paths={poly.paths}
              options={{ fillColor: poly.color, fillOpacity: 0.4, strokeColor:poly.color, strokeOpacity: 1, strokeWeight: 2 }}
            />
          ))}

          {polygons.map((poly, index) => (
            <Marker key={index} position={poly.paths[0]} label={poly.label}  icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 0, // Size of the circle
              fillColor: "green",
              fillOpacity: 1,
              strokeWeight: 0,
            }}/>
          ))}
              {polygons.length > 0 && (
  <div className="absolute top-20 left-5 p-2 text-white bg-green-600 z-5 rounded-md shadow-md">
    <div className="text-sm">
      <strong>Total Land Area:</strong>
      <div>{polygons.reduce(
        (sum, polygon) => sum + polygon.area,
        0
      ).toFixed(2)} m²</div>
      <div>{(polygons.reduce(
        (sum, polygon) => sum + polygon.area,
        0
      ) / 10000).toFixed(2)} ha</div>
      <div>{(polygons.reduce(
        (sum, polygon) => sum + polygon.area,
        0
      ) / 4046.86).toFixed(2)} acres</div>
    </div>
  </div>
)}
{distance && (
  <div className="absolute top-20 right-5 p-2 text-white bg-green-600 z-5 rounded-md shadow-md">
    <div className="text-sm">
      <strong>Distance:</strong>
      <div>{distance}</div>
    </div>
  </div>
)}

<div className="absolute top-3 right-20 z-5">
    <button  title="Wide View" onClick={()=> handleOpenPopup()} 
     className="p-2 flex gap-1 items-center text-sm bg-black hover:bg-gray-800 text-white rounded-sm"
        >
  <AddOutlinedIcon/> Property Location
</button></div>
        </GoogleMap>
     

     

                    {showPopup && (
                      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90 z-50">
                        <div className="dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 bg-white p-1 lg:p-6 w-full  lg:max-w-3xl rounded-md shadow-md relative">
                          <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1">  <LocationOnIcon /> Property Location</div>
                            <button
                              onClick={handleClosePopup}
                              className="flex justify-center items-center h-12 w-12 text-black dark:text-[#e4ebeb] dark:hover:bg-gray-700 hover:bg-black hover:text-white rounded-full"
                            >
                              <CloseOutlinedIcon />
                            </button>
                          </div>
                          <div className="mb-0 flex gap-1">
                          <button onClick={() => setInputMode('mylocation')} className={`border p-2 text-sm rounded-tl-xl ${inputMode === 'mylocation' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-gray-600 text-white'}`}>My Location</button>
        <button onClick={() => setInputMode('coordinates')} className={`border p-2 text-sm ${inputMode === 'coordinates' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-gray-600 text-white'}`}>Enter Coordinates</button>
        <button onClick={() => setInputMode('maplink')} className={`border p-2 text-sm ${inputMode === 'maplink' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-gray-600 text-white'}`}>Google map link</button>
        <button onClick={() => setInputMode('address')} className={`border p-2 text-sm rounded-tr-xl ${inputMode === 'address' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-gray-600 text-white'}`}>Search by Address</button>
        </div>
  
        <div className="bg-white border rounded-b-xl rounded-tr-xl dark:bg-[#131B1E] p-2 flex flex-col">
        {inputMode === 'mylocation' && (
          <div className="mb-2 h-[300px]">
          
             <label>
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleMyLocation()
                      }
                    />
                   My current Location
                  </label>
           
          </div>
        )}
        {/* Address Search Input */}
        {inputMode === 'address' && (
          <div className="mb-2 h-[300px]">
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
        {inputMode === 'coordinates' && (<div className="h-[300px]">
          <div className="mb-2 flex gap-2 ">
            <input
              type="text"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="p-2 text-sm border dark:bg-[#2D3236] dark:text-gray-300 dark:border-gray-600 border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="p-2 border text-sm dark:bg-[#2D3236] dark:text-gray-300 dark:border-gray-600 border-gray-300 rounded-md"
            />
            <button onClick={handleCoordinateSearch} className="p-1 text-sm bg-blue-500 text-white rounded">Go</button>
          </div>
          </div>)}
          {inputMode === 'maplink' && (
          <div className="mb-2 flex flex-col gap-2 h-[300px]">
            
{/* <input
  type="text"
  placeholder="Paste short Google Maps link..."
  value={mapLink}
  onChange={(e) => setMapLink(e.target.value)}
  className="p-2 border dark:bg-[#131B1E] dark:text-gray-300 rounded w-full mb-2"
/>

<button
  onClick={openPopup}
  className="p-2 bg-blue-500 text-white rounded w-full mb-4"
>
  Open in Popup
</button>
*/}

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
                      </div>
                    )}
    </div></div>
  ) : (
    <p>Loading Map...</p>
  );
};

export default LandSubdivision;
