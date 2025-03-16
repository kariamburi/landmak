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
        <div className="w-full p-2 items-start rounded-lg cursor-pointer">
          <div className="flex flex-col w-full">
            <label className="text-sm font-medium dark:text-gray-400 text-gray-500 cursor-pointer">
              {capitalizeFirstLetter(name.replace("-", " "))}
            </label>
            <div className="dark:text-gray-100 text-black text-sm lg:text-base">
              {selectedFeatures
                ? selectedFeatures.join(", ")
                : `Select ${capitalizeFirstLetter(name.replace("-", " "))}`}
            </div>
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        className={`dark:bg-[#222528] dark:text-gray-100 ${
          isMobile ? "fixed inset-0 z-50 w-full h-full p-4" : "w-80"
        }`}
        side="bottom"
        align="start"
      >
        <ScrollArea className="h-[300px] w-full rounded-md border p-2">
          <div className="grid gap-4 cursor-pointer">
            <div className="flex items-center space-y-2 border-b p-2 justify-between">
              <h4 className="font-medium leading-none">
                {capitalizeFirstLetter(name)}
              </h4>
              {isMobile && (
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Close
                </Button>
              )}
            </div>

            <div className="mb-0">
              <ul className="p-2 w-full rounded">
                {features.map((feature: any) => (
                  <li
                    key={feature}
                    className="flex items-center p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
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
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
