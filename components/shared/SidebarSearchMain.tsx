import { ICategory } from "@/lib/database/models/category.model";
import React, { useEffect, useRef, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter, useSearchParams } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import {
  formUrlQuerymultiple,
  formUrlQuery,
  removeKeysFromQuery,
} from "@/lib/utils";
//import { ScrollArea } from "@/components/ui/scroll-area";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SignalWifiStatusbarNullOutlinedIcon from "@mui/icons-material/SignalWifiStatusbarNullOutlined";
import { Label } from "@/components/ui/label";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
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
import InitialAvatar from "./InitialAvatar";
import { countAdsBySubcategoryAndType } from "./MainPage";
type sidebarProps = {
  category: string;
  subcategoryList: any;
  subcategory: string;
  allAds:any;
  type:string;
  handleFilter:(value:any) => void;
};
const SidebarSearchMain = ({
  category,
  subcategoryList,
  subcategory,
  type,
  handleFilter,
  allAds,
}: sidebarProps) => {
  const [query, setQuery] = useState(type);
  const selectedCategory = subcategoryList.find(
    (cat: any) => cat.subcategory ===   subcategory
  );
  const totalAdCount = selectedCategory ? selectedCategory.adCount : 0;
  const categoryImageUrl = selectedCategory ? selectedCategory.imageUrl[0] : "";
 const viewportRef_ = useRef<HTMLDivElement | null>(null);
  const [showScrollUp, setShowScrollUp] = useState(false);

  // Scroll listener to toggle scroll up/down buttons
  useEffect(() => {
    const viewport = viewportRef_.current;
    if (!viewport) return;

    const handleScroll = () => {
      setShowScrollUp(viewport.scrollTop > 10); // show top button after slight scroll
    };

    viewport.addEventListener("scroll", handleScroll);
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll up/down function
  const scrollBy = (amount: number) => {
    if (viewportRef_.current) {
      viewportRef_.current.scrollBy({ top: amount, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center w-full">
        
        <div className="w-full dark:bg-[#2D3236] bg-white rounded-lg">
       
          <div className="flex flex-col text-sm rounded-t-lg w-full">
            <div className="flex p-2 w-full justify-between gap-1 items-center mt-1 mb-1 border-gray-300 dark:border-gray-600">
         
              {selectedCategory && (
                <>
                  <div className="flex text-base font-bold gap-1 items-center">
                    <div className="rounded-full dark:bg-[#131B1E] bg-white">
                      <Image
                        className="h-7 w-8 object-cover"
                        src={categoryImageUrl}
                        alt={
                          selectedCategory ? selectedCategory.subcategory: ""
                        }
                        width={60}
                        height={60}
                      />
                    </div>
                    {selectedCategory ? selectedCategory.subcategory : ""}
                  </div>
                </>
              )}

              <div className="flex border-l pl-2 gap-1 items-center">
                <div className="text-sm dark:text-gray-500 text-gray-500">
                {totalAdCount} ads
                </div>
              </div>
            </div>
          </div>
          <div>
            
               <div className="relative flex-1 overflow-hidden">
                  <div className="absolute top-1 left-1/2 z-50 flex flex-col gap-2">
            
                  {showScrollUp && (
                      <button
                        onClick={() => scrollBy(-300)}
                        className="bg-gray-100 text-black h-10 w-10 p-0 rounded-full shadow"
                      >
                         <KeyboardArrowUpOutlinedIcon/>
                      </button>
                    )} 
                   
                   
                  </div>
                    <ScrollArea.Root 
                           className="h-[70vh]">
                        <ScrollArea.Viewport 
                           ref={viewportRef_}
                           className="h-full overflow-y-auto text-sm lg:text-base w-full dark:bg-[#2D3236] bg-white rounded-t-md border p-4">
                        
  {(() => {
  const matchedSubcategory = subcategoryList.find(
    (catg: any) => catg.subcategory === subcategory
  );
  const typeField = matchedSubcategory?.fields.find((f: any) =>
    f.name.includes("Type")
  );


  return typeField?.options.map((option: any, index: number) => (
    <div
      key={index}
    //  className="relative dark:bg-[#2D3236] text-black dark:text-[#F1F3F3] bg-white flex flex-col items-center justify-center cursor-pointer p-1 border-b dark:hover:dark:bg-[#131B1E] hover:bg-emerald-100 border-b dark:border-gray-600"
      className={`p-2 border-b rounded-sm dark:border-gray-600 flex items-center w-full justify-between text-sm cursor-pointer dark:hover:bg-[#131B1E] dark:hover:text-white hover:bg-green-100 ${
        query === option
          ? "bg-green-200 hover:bg-green-200"
          : "dark:bg-[#2D3236] bg-white"
      }`}
      onClick={() =>
        {handleFilter({category:category, subcategory:subcategory, ...{ [typeField.name]: option }});
        setQuery(option);
      }
      }
    >
      <div className="flex gap-1 items-center mb-1 w-full">
        <span>
          <InitialAvatar name={option} color={"#2D3236"} />
        </span>
        <span className="flex-1 text-sm hover:no-underline my-auto">
          <div className="flex flex-col">
            <h2 className="text-xs font-bold">{option}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-500">{countAdsBySubcategoryAndType(allAds, subcategory, typeField.name, option)} ads</p>
          </div>
        </span>
      </div>
    </div>
  ));
})()}
 </ScrollArea.Viewport>
     <ScrollArea.Scrollbar orientation="vertical" />
      <ScrollArea.Corner />
    </ScrollArea.Root>
  <div className="absolute bottom-1 left-1/2 z-50 flex flex-col gap-2">
    {!showScrollUp && (
          <button
            onClick={() => scrollBy(300)}
            className="bg-gray-100 text-black p-0 h-10 w-10 rounded-full shadow"
          >
           <KeyboardArrowDownOutlinedIcon/>
          </button>
        )}
       
      </div>
      </div>
        {/*    {filteredList.map((sub: any, index: number) => (
              <div
                key={index}
                onClick={() => handleQuery(index, sub.subcategory)}
                className={`border-b rounded-sm dark:border-gray-600 flex items-center w-full justify-between p-0 mb-0 text-sm cursor-pointer dark:hover:bg-[#131B1E] dark:hover:text-white hover:bg-green-100 ${
                  query === sub.subcategory
                    ? "bg-green-200 hover:bg-green-200"
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
                          ? "dark:text-gray-300 text-gray-500"
                          : "dark:text-gray-500 text-gray-500"
                      }`}
                    >
                      {sub.adCount}
                      <div>ads</div>
                    </div>
                  </div>
                </div>
            
              </div>
            ))}
            */} 
         
          </div>
        </div>
      
 
      </div>
    </>
  );
};

export default SidebarSearchMain;
