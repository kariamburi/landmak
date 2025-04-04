import { ICategory } from "@/lib/database/models/category.model";
import React, { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter, useSearchParams } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  formUrlQuerymultiple,
  formUrlQuery,
  removeKeysFromQuery,
} from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SignalWifiStatusbarNullOutlinedIcon from "@mui/icons-material/SignalWifiStatusbarNullOutlined";
import { Label } from "@/components/ui/label";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import CategoryFilterSearch from "./CategoryFilterSearch";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import InvertColorsOutlinedIcon from "@mui/icons-material/InvertColorsOutlined";
import FormatPaintOutlinedIcon from "@mui/icons-material/FormatPaintOutlined";
import FormatStrikethroughOutlinedIcon from "@mui/icons-material/FormatStrikethroughOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import AirlineSeatReclineExtraOutlinedIcon from "@mui/icons-material/AirlineSeatReclineExtraOutlined";
import SignalWifiStatusbarConnectedNoInternet4OutlinedIcon from "@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4Outlined";
import Image from "next/image";
import FilterComponent from "./FilterComponent";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
type sidebarProps = {
  category: string;
  categoryList?: any;
  subcategory?: string;
  handleFilter:(value:any) => void;
};
const SidebarSearchMain = ({
  category,
  categoryList,
  subcategory,
  handleFilter,
}: sidebarProps) => {
  const [query, setQuery] = useState(subcategory);
 
  // Usage
  const handleQuery = (index: number, query: string) => {

    handleFilter({
          category: category.toString(),
           subcategory: query.toString(),
        });
        setQuery(query);
  };

  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };
  


  const selectedCategory = categoryList.find(
    (cat: any) => cat.category.name === category
  );
  const totalAdCount = categoryList.reduce((sum: any, item: any) => {
    if (item.category.name === category) {
      return sum + item.adCount;
    }
    return sum;
  }, 0);

  //const totalAdCount = selectedCategory ? selectedCategory.adCount : 0;
  const categoryImageUrl = selectedCategory
    ? selectedCategory.category.imageUrl[0]
    : "";
 
  const filteredList =
    categoryList?.filter((cat: any) => cat.category.name === category) || [];

 // const visibleItems = showAll ? filteredList : filteredList.slice(0, 6);

  return (
    <>
      <div className="flex flex-col items-center w-full">
        
        <div className="w-full p-0 dark:bg-[#2D3236] bg-white rounded-lg">
       
          <div className="flex flex-col p-1 text-sm font-bold rounded-t-lg w-full">
            <div className="flex w-full justify-between p-1 text-lg gap-1 items-center mt-1 mb-1 border-b border-gray-300 dark:border-gray-600">
              {selectedCategory && (
                <>
                  <div className="flex gap-1 items-center">
                    <div className="rounded-full dark:bg-[#131B1E] bg-white p-1">
                      <Image
                        className="h-7 w-8 object-cover"
                        src={categoryImageUrl}
                        alt={
                          selectedCategory ? selectedCategory.category.name : ""
                        }
                        width={60}
                        height={60}
                      />
                    </div>
                    {selectedCategory ? selectedCategory.category.name : ""}
                  </div>
                </>
              )}

              <div className="flex gap-1 items-center">
                <div className="text-sm dark:text-gray-500 text-gray-700">
                  {totalAdCount} ads
                </div>
              </div>
            </div>
          </div>
          <div>
            
            {filteredList.map((sub: any, index: number) => (
              <div
                key={index}
                onClick={() => handleQuery(index, sub.subcategory)}
                className={`border-b rounded-sm dark:border-gray-600 flex items-center w-full justify-between p-0 mb-0 text-sm cursor-pointer dark:hover:bg-[#131B1E] dark:hover:text-white hover:bg-emerald-100 hover:text-emerald-600 ${
                  query === sub.subcategory
                    ? "bg-green-600 text-white hover:bg-green-600 hover:text-white "
                    : "dark:bg-[#2D3236] bg-white"
                }`}
              >
                <div className="flex w-full gap-1 items-center p-2">
                  <Image
                    className="h-6 w-7 object-cover"
                    src={sub.imageUrl[0] || ""}
                    alt={sub.subcategory}
                    width={60}
                    height={60}
                  />
                  <div className="flex text-sm flex-col">
                    {sub.subcategory}
                    <div
                      className={`flex text-xs gap-1 ${
                        query === sub.subcategory
                          ? "dark:text-gray-300 text-white"
                          : "dark:text-gray-500 text-gray-500"
                      }`}
                    >
                      {sub.adCount}
                      <div>ads</div>
                    </div>
                  </div>
                </div>
              {/* <ArrowForwardIosIcon sx={{ fontSize: 14 }} /> */} 
              </div>
            ))}

         
          </div>
        </div>
      
 
      </div>
    </>
  );
};

export default SidebarSearchMain;
