"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { useMediaQuery } from "react-responsive";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
type featureProps = {
  features: any;
  selectedFeatures: any;
  name: string;
  onChange: (field: string, value: any) => void;
};

export function Multiselect({
  features,
  selectedFeatures,
  name,
  onChange,
}: featureProps) {
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile screens
  const [open, setOpen] = useState(false);

  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="w-full p-2 items-start rounded-lg cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="flex flex-col w-full">
            <label className="text-sm font-medium dark:text-gray-400 text-gray-500 cursor-pointer">
              {capitalizeFirstLetter(name.replace("-", " "))}
            </label>
            <div className="dark:text-gray-100 text-black text-sm lg:text-base">
              {selectedFeatures?.length > 0
                ? selectedFeatures.join(", ")
                : `Select ${capitalizeFirstLetter(name.replace("-", " "))}`}
            </div>
          </div>
        </div>
      </PopoverTrigger>

      {isMobile ? (
        // Fullscreen PopoverContent on Mobile
        open && (
          <div className="fixed inset-0 z-50 bg-white dark:bg-[#222528] dark:text-gray-100 p-4 flex flex-col">
           
            <div className="flex w-full gap-2 items-center dark:bg-[#131B1E] border-b pb-2">
                                                  
                                                   <button
                                                    onClick={() => setOpen(false)}
                                                     className="flex justify-center p-2 items-center text-gray-600 dark:text-[#e4ebeb] dark:hover:bg-gray-700 hover:text-green-600 rounded-full"
                                                   >
                                                     <ArrowBackOutlinedIcon />
                                                   </button>
                                                   <h4 className="font-medium text-lg">
                {capitalizeFirstLetter(name)}
              </h4>
                                                 </div>
           
          

            <ScrollArea className="flex-1 mt-2">
              <ul className="p-2 w-full rounded">
                {features.map((feature: any) => (
                  <li
                    key={feature}
                    className="text-base flex items-center p-2 cursor-pointer hover:bg-[#e4ebeb] dark:hover:bg-gray-800 rounded"
                  >
                    <input
                      type="checkbox"
                      id={feature}
                      value={feature}
                      checked={selectedFeatures.includes(feature)}
                      onChange={() => onChange(name, feature)}
                      className="mr-2"
                      aria-labelledby={`label-${feature}`}
                    />
                    <label
                      id={`label-${feature}`}
                      htmlFor={feature}
                      className="cursor-pointer"
                    >
                      {feature}
                    </label>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )
      ) : (
        // Default PopoverContent on larger screens
        <PopoverContent
          className="w-80 dark:bg-[#222528] dark:text-gray-100"
          side="bottom"
          align="start"
        >
          <ScrollArea className="h-[300px] w-full rounded-md border p-2">
            <div className="grid gap-4 cursor-pointer">
              <div className="flex items-center space-y-2 border-b p-2 justify-between">
                <h4 className="font-medium leading-none">
                  {capitalizeFirstLetter(name)}
                </h4>
              </div>

              <ul className="p-2 w-full rounded">
                {features.map((feature: any) => (
                  <li
                    key={feature}
                    className="flex items-center p-2 cursor-pointer hover:bg-[#e4ebeb] dark:hover:bg-gray-800 rounded"
                  >
                    <input
                      type="checkbox"
                      id={feature}
                      value={feature}
                      checked={selectedFeatures.includes(feature)}
                      onChange={() => onChange(name, feature)}
                      className="mr-2"
                      aria-labelledby={`label-${feature}`}
                    />
                    <label
                      id={`label-${feature}`}
                      htmlFor={feature}
                      className="cursor-pointer"
                    >
                      {feature}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollArea>
        </PopoverContent>
      )}
    </Popover>
  );
}
