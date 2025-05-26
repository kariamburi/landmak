// components/ChatWindow.js
"use client";
import React, { useEffect, useState } from "react";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import Image from "next/image";
import CreateCategoryForm from "./CreateCategoryForm";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { ICategory } from "@/lib/database/models/category.model";
import { getAllSubCategories } from "@/lib/actions/subcategory.actions";
import { formUrlQuerymultiple, removeKeysFromQuery } from "@/lib/utils";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import ProgressPopup from "./ProgressPopup";
import BottomNavigation from "./BottomNavigation";
import { useToast } from "../ui/use-toast";
import { getallPendingLaons } from "@/lib/actions/loan.actions";
import { VerificationPackId } from "@/constants";
import { createTransaction } from "@/lib/actions/transactions.actions";
import { v4 as uuidv4 } from "uuid";
import { DrawerDemo } from "./DrawerDemo";
interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  subcategoryList: any;
  handleSubCategory: (category:string, subcategory:string) => void;
  userId:string;
  user:any;
  packagesList:any;
  handleOpenChat: () => void;
  handleOpenSell:(category?:string, subcategory?:string)=> void;
  handleCategory:(value:string)=> void;
  handleOpenSearchTab:(value:string)=> void;
  handlePayNow:(id:string)=> void;
  handleOpenSettings: () => void; 
  loans:any;
}

const SubCategoryWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  category,
  onClose,
  user,
  packagesList,
  subcategoryList,
  userId,
  handlePayNow,
  handleSubCategory,
  handleOpenChat,
  handleOpenSell,
  handleCategory,
  handleOpenSearchTab,
  handleOpenSettings,
  loans,
}) => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpenP, setIsOpenP] = useState(false);
const [showWantedPopup, setShowWantedPopup] = useState(false);
  if (!isOpen) return null; // Keep the early return after defining hooks

  const handleOpenP = (query: string) => {
    setIsOpenP(true);
  };

  const handleClose = () => {
    setShowWantedPopup(false);
  };

  const handleQuery = (query: string) => {
  if (query) {
    if (category.toString() === "Wanted Ads") {
      setQuery(query);
      setShowWantedPopup(true); // Show the popup instead
    } else {
      setQuery(query);
      handleSubCategory(category.toString(), query.toString());
      onClose();
    }
  }
};


  const totalAdCount = subcategoryList.reduce((sum: any, item: any) => {
    if (item.category.name === category) {
      return sum + item.adCount;
    }
    return sum;
  }, 0);


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="dark:bg-[#2D3236] dark:text-gray-300 bg-[#e4ebeb] rounded-lg p-1 lg:p-6 w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-center w-full h-full">
          <div className="w-full h-full dark:bg-[#2D3236]">
            <Command className="w-full h-[100vh]">
              <div className="flex w-full gap-2 items-center dark:bg-[#131B1E] border-0 border-gray-600">
               
                <button
                  onClick={onClose}
                  className="flex justify-center p-2 items-center text-gray-600 dark:text-[#e4ebeb] dark:hover:bg-gray-700 hover:text-green-600 rounded-full"
                >
                  <ArrowBackOutlinedIcon />
                </button>
                <CommandInput className="text-base flex-1" placeholder={`Search category`} />
              </div>

              <CommandList className="max-h-[90vh] overflow-y-auto dark:bg-[#2D3236]">
                <CommandEmpty>No subcategory found</CommandEmpty>
                <CommandGroup
                  className="dark:bg-[#2D3236]"
                  heading={
                    <div className="flex mb-2 text-sm gap-1 items-center text-gray-500 dark:text-gray-400">
                      {totalAdCount} results for{" "}
                      <p className="text-black dark:text-white font-bold">{category}</p>
                    </div>
                  }
                >
                  {subcategoryList
                    .filter((cat: any) => cat.category.name === category)
                    .map((sub: any, index: number) => (
                        <CommandItem
                        key={index}
                        className="relative p-0 mb-0 cursor-pointer"
                        onSelect={() => {
                          if (category.toString() === "Wanted Ads" ?  (sub.adCount + loans.adCount + 1) > 0: sub.adCount > 0) {
                            handleQuery(sub.subcategory);
                          } else {
                            toast({
                              title: "0 Ads",
                              description: (
                                <>
                                  No ads in <strong>{sub.subcategory}</strong> subcategory
                                </>
                              ),
                            });
                          }
                        }}
                      >
                        <div className="w-full border-b">
                          <div className="flex w-full gap-1 items-center p-3">
                            <div className="flex rounded-lg p-2 shadow-sm dark:bg-[#2D3236] bg-[#e4ebeb] items-center">
                              <Image
                                className="h-10 w-10 object-cover"
                                src={sub.imageUrl[0] || ""}
                                alt={sub.subcategory}
                                width={60}
                                height={60}
                              />
                            </div>
                            <div className="flex-1 w-full text-base flex-col">
                              <div
                                className={`font-bold w-full ${
                                  sub.subcategory?.trim().toLowerCase() === "Property Financing Requests".toLowerCase() ?  (sub.adCount + loans.adCount) > 0: sub.adCount > 0 ? "" : "text-gray-500 dark:text-gray-500"
                                }`}
                              >
                                {sub.subcategory}
                              </div>
                              <div className="flex text-sm text-gray-500 dark:text-gray-500 gap-1">
                                {sub.subcategory?.trim().toLowerCase() === "Property Financing Requests".toLowerCase() ?  (sub.adCount + loans.adCount): sub.adCount}
                                <div>ads</div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`flex items-center justify-end w-full ${
                              sub.subcategory?.trim().toLowerCase() === "Property Financing Requests".toLowerCase() ?  (sub.adCount + loans.adCount) > 0: sub.adCount > 0 ? "" : "text-gray-500 dark:text-gray-500"
                            }`}
                          >
                         {/* <ArrowForwardIosIcon sx={{ fontSize: 14 }} /> */}
                          </div>
                        </div>
                      </CommandItem>
                    
                   ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>
<DrawerDemo 
  handleOpenSell={handleOpenSell}
  handlePayNow={handlePayNow}
  userId={userId}
  category={category}
  subcategory={query}
  user={user}
isOpen={showWantedPopup} 
packagesList={packagesList}
onClose={handleClose} 
handleSubCategory={handleSubCategory}/>
  
      </div>
    </div>
  );
};

export default SubCategoryWindow;
