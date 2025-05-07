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
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { Check } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "react-responsive";

const SubCategorySelect = ({
  selected,
  data,
  onChange,
}: {
  selected: string | null;
  data: any;
  onChange: (field: string, value: string, _id: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleConfirm = () => {
    if (inputValue.trim() !== "") {
      onChange("subcategory", inputValue.trim(), "");
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
              Sub Category*
            </label>
            <div className="dark:text-gray-100 text-black text-sm lg:text-base">
              {selected || "Search Sub Category"}
            </div>
          </div>
        </div>
      </PopoverTrigger>

      {isMobile ? (
        open && (
          <div className="fixed inset-0 z-50 bg-white dark:bg-[#222528] dark:text-gray-100 p-4 flex flex-col">
            <div className="flex w-full gap-2 items-center dark:bg-[#131B1E] border-b pb-2">
                           
                            <button
                             onClick={() => setOpen(false)}
                              className="flex justify-center p-2 items-center text-gray-600 dark:text-[#e4ebeb] dark:hover:bg-gray-700 hover:text-green-600 rounded-full"
                            >
                              <ArrowBackOutlinedIcon />
                            </button>
                            <h4 className="font-medium text-lg">Select Sub Category</h4>
                          </div>
            

            <Command>
              <div className="dark:bg-[#222528] p-2">
                <CommandInput
                  placeholder="Search sub category"
                  value={inputValue}
                  onValueChange={setInputValue}
                 // onKeyDown={(e) => {
                 //   if (e.key === "Enter") {
                   //   handleConfirm();
                  // }
                  //}}
                />
              </div>

              <CommandList className="max-h-[90vh] overflow-y-auto dark:bg-[#222528] dark:text-gray-100 flex-1 overflow-auto">
                <CommandEmpty>No sub categories found</CommandEmpty>
                <CommandGroup>
                  {data.map((category: any, index: number) => (
                    <CommandItem
                      key={index}
                      onSelect={() => {
                        onChange("subcategory", category.subcategory, category._id);
                        setOpen(false);
                      }}
                       className="p-3 cursor-pointer hover:bg-[#e4ebeb] dark:hover:bg-gray-800 rounded"
                    >
                      <div className="text-base flex gap-1 items-center">
                        <Image
                          className="h-4 w-6 object-cover"
                          src={category.imageUrl || ""}
                          alt={category.subcategory || ""}
                          width={60}
                          height={60}
                        />
                        {category.subcategory}
                      </div>
                      <Check className={cn("ml-auto", selected === category.subcategory ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>

           
          </div>
        )
      ) : (
        <PopoverContent side="bottom" align="start" className="dark:bg-[#222528] dark:text-gray-100 w-full">
          <Command>
            <div className="dark:bg-[#222528] border-b border-gray-800 p-2">
              <CommandInput
                placeholder="Search sub category"
                value={inputValue}
                onValueChange={setInputValue}
                //onKeyDown={(e) => {
                //  if (e.key === "Enter") {
                //    handleConfirm();
                //  }
                //}}
              />
            </div>

            <CommandList className="dark:bg-[#222528] dark:text-gray-100">
              <CommandEmpty>No sub categories found</CommandEmpty>
              <CommandGroup>
                {data.map((category: any, index: number) => (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      onChange("subcategory", category.subcategory, category._id);
                      setOpen(false);
                    }}
                  >
                    <div className="flex gap-1 items-center">
                      <Image
                        className="h-4 w-6 object-cover"
                        src={category.imageUrl || ""}
                        alt={category.subcategory || ""}
                        width={60}
                        height={60}
                      />
                      {category.subcategory}
                    </div>
                    <Check className={cn("ml-auto", selected === category.subcategory ? "opacity-100" : "opacity-0")} />
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

export default SubCategorySelect;
