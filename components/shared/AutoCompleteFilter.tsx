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

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import React from "react";
import { getallcategories } from "@/lib/actions/subcategory.actions";
import { useMediaQuery } from "react-responsive"; // Detect mobile screens
import { Button } from "../ui/button";

const AutoCompleteFilter = ({
  selected,
  name,
  data,
  adsCount,
  onChange,
}: {
  selected: string | null;
  name: string;
  data: any;
  adsCount: any;
  onChange: (field: string, value: string) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const [total, settotal] = useState(0);
const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile screens

  useEffect(() => {
    try {
      //setQuery(searchParams.get(name) ?? "");
      const totalAdCount = adsCount
        .filter((item: any) => item.field === name) // Filter for entries where field is 'year'
        .reduce((sum: any, item: any) => sum + item.adCount, 0); // Sum up the adCount values
      settotal(totalAdCount);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setHasError(true);
    } finally {
      // setIsLoading(false);
    }
  }, []);
  return (
    
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="py-2 px-2 rounded-sm border border-gray-300 dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 items-start w-full rounded-lg cursor-pointer border">
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label className="text-sm font-medium dark:text-gray-400 text-gray-500">
                {capitalizeFirstLetter(name.replace("-", " "))}{" "}
              </label>
              {/*  <div className="dark:text-gray-400 text-emerald-600 flex gap-1 mr-2">
                {total}
                <div>ads</div>
              </div> */}
            </div>
            <div className="dark:text-gray-100 text-black text-sm lg:text-base">
              {selected ? (
                <>
                  <div className="flex justify-between items-center">
                    <div>{selected}</div>
                    {(() => {
                      const adItem = adsCount?.find(
                        (item: {
                          field: string;
                          value: string;
                          adCount: number;
                        }) => item.field === name && item.value === selected
                      );

                      const adCount = adItem?.adCount ?? 0;
                      const textColorClass =
                        adCount === 0
                          ? "dark:text-gray-500 text-gray-400"
                          : "dark:text-gray-300 text-emerald-600";

                      return (
                        <div className={`${textColorClass} flex gap-1 mr-2`}>
                          {adCount}
                          <div>ads</div>
                        </div>
                      );
                    })()}
                  </div>
                </>
              ) : (
                <>
                  {" "}
                  {`Select ${capitalizeFirstLetter(name.replace("-", " "))}`}
                </>
              )}
            </div>
          </div>
        </div>
      </PopoverTrigger>
      {isMobile && open ? (
                // Fullscreen Popover for Mobile
                <div className="fixed inset-0 z-50 bg-white dark:bg-[#222528] dark:text-gray-100 p-4 flex flex-col">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h4 className="font-medium text-lg">Select {capitalizeFirstLetter(name.replace("-", " "))}</h4>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Close
                    </Button>
                  </div>

        <Command>
          <div className="dark:bg-[#222528]">
            <CommandInput
              placeholder={`Search ${capitalizeFirstLetter(
                name.replace("-", " ")
              )}`}
            />
          </div>

          <CommandList className="dark:bg-[#222528] dark:text-gray-100">
            <CommandEmpty>No {name} found</CommandEmpty>
            <CommandGroup>
              {data.map((option: any) => (
                <CommandItem
                  key={option}
                   className="p-3 text-base cursor-pointer hover:bg-[#e4ebeb] dark:hover:bg-gray-800 rounded"
                  onSelect={() => {
                    onChange(name, option);
                    setOpen(false);
                  }}
                >
                  <div className="justify-between flex w-full">
                    {option}
                    {(() => {
                      const adItem = adsCount?.find(
                        (item: {
                          field: string;
                          value: string;
                          adCount: number;
                        }) => item.field === name && item.value === option
                      );

                      const adCount = adItem?.adCount ?? 0;
                      const textColorClass =
                        adCount === 0
                          ? "dark:text-gray-500 text-gray-400"
                          : "dark:text-gray-300 text-emerald-600";

                      return (
                        <div className={`${textColorClass} flex gap-1 mr-2`}>
                          {adCount}
                          <div>ads</div>
                        </div>
                      );
                    })()}
                  </div>

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

                  </div>):(
      <PopoverContent
        side="bottom"
        align="start"
        className="dark:bg-[#222528] dark:text-gray-100"
      >
        <Command>
          <div className="dark:bg-[#222528] border-b border-gray-800">
            <CommandInput
              placeholder={`Search ${capitalizeFirstLetter(
                name.replace("-", " ")
              )}`}
            />
          </div>

          <CommandList className="dark:bg-[#222528] dark:text-gray-100">
            <CommandEmpty>No {name} found</CommandEmpty>
            <CommandGroup>
              {data.map((option: any) => (
                <CommandItem
                  key={option}
                  //className="dark:hover:bg-[#131B1E]"
                  onSelect={() => {
                    onChange(name, option);
                    setOpen(false);
                  }}
                >
                  <div className="justify-between flex w-full">
                    {option}
                    {(() => {
                      const adItem = adsCount?.find(
                        (item: {
                          field: string;
                          value: string;
                          adCount: number;
                        }) => item.field === name && item.value === option
                      );

                      const adCount = adItem?.adCount ?? 0;
                      const textColorClass =
                        adCount === 0
                          ? "dark:text-gray-500 text-gray-400"
                          : "dark:text-gray-300 text-emerald-600";

                      return (
                        <div className={`${textColorClass} flex gap-1 mr-2`}>
                          {adCount}
                          <div>ads</div>
                        </div>
                      );
                    })()}
                  </div>

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
      </PopoverContent>
)}
    </Popover>
  );
};

export default AutoCompleteFilter;
