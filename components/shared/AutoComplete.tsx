"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "react-responsive"; // Detect mobile screens

const AutoComplete = ({
  selected,
  name,
  data,
  onChange,
}: {
  selected: string | null;
  name: string;
  data: string[];
  onChange: (field: string, value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile screens

  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleConfirm = () => {
    if (inputValue.trim() !== "") {
      onChange(name, inputValue.trim());
      setInputValue("");
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="py-2 px-2 bg-white rounded-sm border border-gray-300 dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 items-start w-full rounded-lg cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="flex flex-col">
            <label className="text-sm font-medium dark:text-gray-400 text-gray-500">
              {capitalizeFirstLetter(name.replace("-", " "))}
            </label>
            <div className="dark:text-gray-100 text-black text-sm lg:text-base">
              {selected || `Select ${capitalizeFirstLetter(name.replace("-", " "))}`}
            </div>
          </div>
        </div>
      </PopoverTrigger>

      {isMobile ? (
        open && (
          // Fullscreen Popover for Mobile
          <div className="fixed inset-0 z-50 bg-white dark:bg-[#222528] dark:text-gray-100 p-4 flex flex-col">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-medium text-lg">Select {capitalizeFirstLetter(name.replace("-", " "))}</h4>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>

            <Command>
              <div className="dark:bg-[#222528] p-2">
                <CommandInput
                  placeholder={`Search or enter ${capitalizeFirstLetter(name.replace("-", " "))}`}
                  value={inputValue}
                  onValueChange={setInputValue}
                 // onKeyDown={(e) => {
                 //   if (e.key === "Enter") {
                  //    handleConfirm();
                 //   }
                 // }}
                />
              </div>

              <CommandList className="max-h-[80vh] overflow-y-auto dark:bg-[#222528] dark:text-gray-100 flex-1 overflow-auto">
                <CommandEmpty>No {name} found</CommandEmpty>
                <CommandGroup>
                  {data.map((option) => (
                    <CommandItem
                    className="p-3 text-base cursor-pointer hover:bg-[#e4ebeb] dark:hover:bg-gray-800 rounded"
                      key={option}
                      onSelect={() => {
                        onChange(name, option);
                        setOpen(false);
                      }}
                    >
                      {option}
                      <Check
                        className={cn(
                          "ml-auto",
                          selected === option ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>

            {/* Confirm button for mobile
            <div className="p-2 flex justify-end">
              <Button size="sm" onClick={handleConfirm}>Confirm</Button>
            </div> */}
          </div>
        )
      ) : (
        // Regular Popover for Desktops
        <PopoverContent
          side="bottom"
          align="start"
          className="dark:bg-[#222528] dark:text-gray-100 w-full"
        >
          <Command>
            <div className="dark:bg-[#222528] p-2">
              <CommandInput
                placeholder={`Search or enter ${capitalizeFirstLetter(name.replace("-", " "))}`}
                value={inputValue}
                onValueChange={setInputValue}
               // onKeyDown={(e) => {
               //   if (e.key === "Enter") {
                //    handleConfirm();
                //  }
               // }}
              />
            </div>

            <CommandList className="dark:bg-[#222528] dark:text-gray-100">
              <CommandEmpty>No {name} found</CommandEmpty>
              <CommandGroup>
                {data.map((option) => (
                  <CommandItem
                    key={option}
                    onSelect={() => {
                      onChange(name, option);
                      setOpen(false);
                    }}
                  >
                    {option}
                    <Check
                      className={cn(
                        "ml-auto",
                        selected === option ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>

          {/* Confirm button for Desktop 
          <div className="p-2 flex justify-end">
            <Button size="sm" onClick={handleConfirm}>Confirm</Button>
          </div>*/}
        </PopoverContent>
      )}
    </Popover>
  );
};

export default AutoComplete;
