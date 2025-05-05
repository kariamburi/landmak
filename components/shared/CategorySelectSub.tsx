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
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Button } from "@/components/ui/button";

const CategorySelectSub = ({
  selected,
  data,
  onChange,
}: {
  selected: string | null;
  data: any;
  onChange: (field: string, value: string, id: string) => void;
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile screens
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="py-2 px-1 rounded-sm border border-gray-300 dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 items-start w-full rounded-lg cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="flex flex-col">
            <label className="text-sm font-medium dark:text-gray-400 text-gray-500">
              Category*
            </label>
            <div className="dark:text-gray-100 text-black text-sm lg:text-base">
              {selected || "Search Category"}
            </div>
          </div>
        </div>
      </PopoverTrigger>

      {isMobile ? (
        open && (
          // Fullscreen PopoverContent for Mobile
          <div className="fixed inset-0 z-50 bg-white dark:bg-[#222528] dark:text-gray-100 p-4 flex flex-col">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-medium text-lg">Select Category</h4>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>

            <Command>
              <div className="dark:bg-[#222528]">
                <CommandInput placeholder="Search category..." />
              </div>
              <CommandList className="dark:bg-[#222528] dark:text-gray-100 flex-1 overflow-auto">
                <CommandEmpty>No A categories found</CommandEmpty>
                <CommandGroup>
                  {data.map((category: any) => (
                    <CommandItem
                      key={category._id}
                      onSelect={() => {
                        onChange("category", category.name, category._id);
                        setOpen(false);
                      }}
                      className="p-3 cursor-pointer hover:bg-[#e4ebeb] dark:hover:bg-gray-800 rounded"
                    >
                      <div className="flex gap-2 items-center">
                        <Image
                          className="h-6 w-6 object-cover rounded"
                          src={category.imageUrl[0] || ""}
                          alt={category.name || ""}
                          width={24}
                          height={24}
                        />
                        {category.name}
                      </div>

                      <Check
                        className={cn(
                          "ml-auto",
                          selected === category.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )
      ) : (
        // Regular PopoverContent for Larger Screens
        <PopoverContent
          side="bottom"
          align="start"
          className="w-80 dark:bg-[#222528] dark:text-gray-100"
        >
          <Command>
            <div className="dark:bg-[#222528] border-b border-gray-800">
              <CommandInput placeholder="Search category..." />
            </div>
            <CommandList className="dark:bg-[#222528] dark:text-gray-100">
              <CommandEmpty>No B categories found</CommandEmpty>
              <CommandGroup>
                {data.map((category: any) => (
                  <CommandItem
                    key={category._id}
                    onSelect={() => {
                      onChange("category", category.name, category._id);
                      setOpen(false);
                    }}
                    className="p-3 cursor-pointer hover:bg-[#e4ebeb] dark:hover:bg-gray-800 rounded"
                  >
                    <div className="flex gap-2 items-center">
                      <Image
                        className="h-6 w-6 object-cover rounded"
                        src={category.imageUrl[0] || ""}
                        alt={category.name || ""}
                        width={24}
                        height={24}
                      />
                      {category.name}
                    </div>

                    <Check
                      className={cn(
                        "ml-auto",
                        selected === category.name ? "opacity-100" : "opacity-0"
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

export default CategorySelectSub;
