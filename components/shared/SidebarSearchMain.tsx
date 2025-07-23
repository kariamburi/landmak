import { ICategory } from "@/lib/database/models/category.model";
import React, { useEffect, useRef, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter, useSearchParams } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
//import * as ScrollArea from "@radix-ui/react-scroll-area";
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
  categoryList?: any;
  subcategory?: string;
  handleFilter: (value: any) => void;
  loans: any;
};
const SidebarSearchMain = ({
  category,
  categoryList,
  subcategory,
  handleFilter,
  loans,
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
      <div className="h-full text-sm lg:text-base w-full">

        {filteredList.map((sub: any, index: number) => (
          <div
            key={index}
            onClick={() => handleQuery(index, sub.subcategory)}
            className={`border-b dark:border-gray-600 flex items-center w-full justify-between p-1 mb-0 text-sm cursor-pointer dark:hover:bg-[#131B1E] dark:hover:text-white hover:bg-green-100 ${query === sub.subcategory
              ? "bg-green-600 text-white hover:bg-green-600 rounded-sm"
              : "dark:bg-[#2D3236] bg-white"
              }`}
          >
            <div className="flex w-full gap-1 items-center p-1">
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
                  className={`flex text-xs gap-1 ${query === sub.subcategory
                    ? "dark:text-white text-white"
                    : "dark:text-gray-500 text-gray-500"
                    }`}
                >
                  {sub.subcategory?.trim().toLowerCase() === "Property Financing Requests".toLowerCase() ? (sub.adCount + loans.adCount) : sub.adCount}
                  <div>ads</div>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>


    </>
  );
};

export default SidebarSearchMain;
