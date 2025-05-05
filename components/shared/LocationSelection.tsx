import { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import React from "react";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { REGIONS_WITH_AREA } from "@/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "react-responsive"; // Detect mobile screens
import { Button } from "../ui/button";

interface Props {
  onClose: () => void;
  onSelected: (value: string) => void;
  handleFilter: (value: any) => void;
  AdsCountPerRegion: any;
}

const LocationSelection = ({ onClose, onSelected, handleFilter, AdsCountPerRegion }: Props) => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchArea, setSearchArea] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
   const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile screens

  const sortedLocations = REGIONS_WITH_AREA
    .filter((loc) => loc.region.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.region.localeCompare(b.region));

  const filteredLocations =
    sortedLocations.find((loc: any) => loc.region === selectedLocation)?.area.filter((location: any) =>
      location.toLowerCase().includes(searchArea.toLowerCase())
    ) || [];

  const totalAdCount = AdsCountPerRegion.reduce((sum: any, item: any) => sum + item.adCount, 0);

  const handleRegionClick = (region: any) => {
    if (region) {
      handleFilter({ region: region.toString(), area: "" });
    }
  };

  const handleAreaClick = (region: any, area: any) => {
    if (region && area) {
      handleFilter({ region: region.toString(), area: area.toString() });
    }
  };

  const handleClear = () => {
    handleFilter({ region: "", area: "" });
  };

  return (<>
     {isMobile ? (
           
              // Fullscreen Popover for Mobile
              <div className="fixed inset-0 z-10 bg-[#e4ebeb] dark:bg-[#222528] dark:text-gray-100 p-4 flex flex-col">
                <div className="flex justify-between items-center border-b pb-2">
                <div onClick={() => { onSelected("All Kenya"); handleClear(); onClose(); }} className="flex hover:text-green-600 cursor-pointer gap-1 items-center">
                <span className="font-bold">All Kenya</span>
                <span>.</span>
                <span className="text-gray-500">{totalAdCount} ads</span>
              </div>
                  <Button variant="outline" onClick={onClose}>
                  <CloseOutlinedIcon />
                  </Button>
                </div>
                <div className="relative w-full">
          <div className="absolute h-[95vh] bg-[#e4ebeb] dark:bg-[#2D3236] dark:text-gray-100 rounded-lg w-full max-w-full p-0">
           
            <div className="flex w-full items-center mb-0">
                <input
                  type="text"
                  placeholder="Find state, city or district..."
                  className="dark:bg-[#222528] dark:text-gray-300 w-full px-3 py-2 border dark:border-gray-600 rounded-t-md"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             
            </div>

            <div className="mt-1 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <ul className="cursor-pointer p-0">
                {sortedLocations.map((location: any, index: number) => (
                  <li key={index} className={`flex items-center dark:bg-[#222528] bg-white gap-2 p-2 cursor-pointer rounded-0 ${selectedLocation === location.region ? "bg-green-100 text-green-600" : "hover:text-green-600"}`}
                    onClick={() => setSelectedLocation(location.region)}>
                    <span>{location.region}</span>
                    <span>.</span>
                    <span className="text-gray-500">{AdsCountPerRegion.filter((item: { region: string; adCount: number }) => item.region === location.region).reduce((sum: any, item: any) => sum + item.adCount, 0)} ads</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {selectedLocation && (
            <div className="absolute h-[90vh] bg-[#e4ebeb] dark:bg-[#2D3236] dark:text-gray-100 rounded-lg w-full max-w-full p-0">
              <div className="flex justify-start items-center mb-1">
                <button onClick={() => { setSearchArea(""); setSelectedLocation(""); }} className="flex gap-1 justify-center items-center bg-white text-black dark:bg-black text-sm px-2 py-1 dark:text-[#e4ebeb] dark:hover:text-green-600 hover:text-green-600 rounded-lg">
                  <ArrowBackIosNewOutlinedIcon sx={{ fontSize: 14 }} /> Back
                </button>
              </div>
              <div className="flex items-center border-b pb-2">
                <input
                  type="text"
                  placeholder="Find state, city or district..."
                  className="dark:bg-[#222528] dark:text-gray-300 w-full px-3 py-2 border dark:border-gray-600 rounded-t-md"
                  value={searchArea}
                  onChange={(e) => setSearchArea(e.target.value)}
                />
              </div>
              <div className="mt-1 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <ul className="cursor-pointer p-0">
                  {filteredLocations.map((location: string, index: number) => (
                    <li key={index} className={`flex items-center dark:bg-[#222528] bg-white gap-2 p-2 cursor-pointer rounded-0 ${selectedArea === location ? "bg-green-100 text-green-600" : "hover:text-green-600"}`}
                      onClick={() => { setSelectedArea(location); onSelected(location); handleAreaClick(selectedLocation, location); onClose(); }}>
                      <span>{location}</span>
                      <span>.</span>
                      <span className="text-gray-500">{AdsCountPerRegion.filter((item: { area: string; adCount: number }) => item.area === location).reduce((sum: any, item: any) => sum + item.adCount, 0)} ads</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
                </div>
     ):(
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90 z-50">
      <div className="h-[90vh] dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 bg-gray-100 p-0 w-full lg:max-w-3xl rounded-md shadow-md relative">
        <div className="relative w-full">
          <div className="absolute h-[90vh] bg-[#e4ebeb] dark:bg-[#2D3236] dark:text-gray-100 rounded-lg w-full max-w-full p-5">
            <div className="flex justify-end items-center mb-1">
            <Button variant="outline" onClick={onClose}>
                  <CloseOutlinedIcon />
                  </Button>
            </div>

            <div className="flex justify-between items-center mb-1">
              <div onClick={() => { onSelected("All Kenya"); handleClear(); onClose(); }} className="flex hover:text-green-600 cursor-pointer gap-1 items-center">
                <span className="font-bold">All Kenya</span>
                <span>.</span>
                <span className="text-gray-500">{totalAdCount} ads</span>
              </div>
              <div className="flex items-center border-b pb-2">
                <input
                  type="text"
                  placeholder="Find state, city or district..."
                  className="dark:bg-[#222528] dark:text-gray-300 w-full px-3 py-2 border dark:border-gray-600 rounded-md"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-1 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <ul className="cursor-pointer p-0">
                {sortedLocations.map((location: any, index: number) => (
                  <li key={index} className={`flex items-center dark:bg-[#222528] bg-white gap-2 p-2 text-sm cursor-pointer rounded-0 ${selectedLocation === location.region ? "bg-green-100 text-green-600" : "hover:text-green-600"}`}
                    onClick={() => setSelectedLocation(location.region)}>
                    <span>{location.region}</span>
                    <span>.</span>
                    <span className="text-gray-500">{AdsCountPerRegion.filter((item: { region: string; adCount: number }) => item.region === location.region).reduce((sum: any, item: any) => sum + item.adCount, 0)} ads</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {selectedLocation && (
            <div className="absolute h-[90vh] bg-[#e4ebeb] dark:bg-[#2D3236] dark:text-gray-100 rounded-lg w-full max-w-full p-5">
              <div className="flex justify-start items-center mb-3">
                <button onClick={() => { setSearchArea(""); setSelectedLocation(""); }} className="flex justify-center items-center bg-white text-black dark:bg-black text-sm px-2 py-1 dark:text-[#e4ebeb] dark:hover:text-green-600 hover:text-green-600 rounded-full">
                  <ArrowBackIosNewOutlinedIcon sx={{ fontSize: 16 }} /> Back
                </button>
              </div>
              <div className="flex items-center border-b pb-2">
                <input
                  type="text"
                  placeholder="Find state, city or district..."
                  className="dark:bg-[#222528] dark:text-gray-300 w-full px-3 py-2 border dark:border-gray-600 rounded-md"
                  value={searchArea}
                  onChange={(e) => setSearchArea(e.target.value)}
                />
              </div>
              <div className="mt-1 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <ul className="cursor-pointer p-0">
                  {filteredLocations.map((location: string, index: number) => (
                    <li key={index} className={`flex items-center dark:bg-[#222528] bg-white gap-2 p-2 text-sm cursor-pointer rounded-0 ${selectedArea === location ? "bg-green-100 text-green-600" : "hover:text-green-600"}`}
                      onClick={() => { setSelectedArea(location); onSelected(location); handleAreaClick(selectedLocation, location); onClose(); }}>
                      <span>{location}</span>
                      <span>.</span>
                      <span className="text-gray-500">{AdsCountPerRegion.filter((item: { area: string; adCount: number }) => item.area === location).reduce((sum: any, item: any) => sum + item.adCount, 0)} ads</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>)}
    </>
  );
};

export default LocationSelection;