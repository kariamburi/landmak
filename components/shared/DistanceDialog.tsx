import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEAPIKEY!;
const defaultcenter = {
  lat: 0, // Default center (Nairobi, Kenya)
  lng: 0,
};
export function DistanceDialog({ open, onOpenChange, handleDistance }: { open: boolean; onOpenChange: (open: boolean) => void , handleDistance :(lat:number, lng:number)=> void}) {
  const [step, setStep] = useState<"options" | "addressInput">("options");
  const [searchQuery, setSearchQuery] = useState("");
   const [error, setError] = useState("");
  const [center, setCenter] = useState<{lat:number, lng:number}>(defaultcenter);
  const handleSelectOption = (option: "map" | "address") => {
    if (option === "map") {
      onOpenChange(false);
      // Trigger map tap mode here
    } else if (option === "address") {
      setStep("addressInput");
    }
  };

  const handleSearch = () => {
    // Trigger search logic here with `searchQuery`
     setError("")
    if(center.lat && center.lng){
    handleDistance(center.lat, center.lng);
    onOpenChange(false);
    }else{
     setError("Select location")
    }
  };
const handleSelect = (e: any) => {
    geocodeByAddress(e.value.description)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setCenter({ lat, lng })
      });
  };

  return (
    <AlertDialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) setStep("options");
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Distance Options</AlertDialogTitle>
          <AlertDialogDescription>
            {step === "options" ? (
              <>
                <div
                  onClick={() => handleSelectOption("map")}
                  className="cursor-pointer p-2 border rounded mb-2 hover:bg-gray-100"
                >
                  1. Tap on the map to calculate distance
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
                                      apiKey={GOOGLE_MAPS_API_KEY}
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
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancel</AlertDialogCancel>
          {step === "addressInput" ? (
            <AlertDialogAction onClick={handleSearch}>Search</AlertDialogAction>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
