// components/ChatWindow.js
"use client";
import React, { useEffect, useState } from "react";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import Image from "next/image";
import CreateCategoryForm from "./CreateCategoryForm";
import { ScrollArea } from "../ui/scroll-area";
import CreateSubCategoryForm from "./CreateSubCategoryForm";
import { Button } from "../ui/button";
import CategoryFilterSearch from "./CategoryFilterSearch";
import CategoryFilterSearchMain from "./CategoryFilterSearchMain";
import { useToast } from "../ui/use-toast";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  categoryList: any;
  subcategoryList: any;
  hoveredCategory:any;
  handleCategory:(value:string)=> void;
  handleHoverCategory:(value:string)=> void;
  handleSubCategory:(category:string, subcategory:string)=> void;
}

const SearchTabWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  handleCategory,
  handleHoverCategory,
  categoryList,
  subcategoryList,
  hoveredCategory,
  handleSubCategory,
  onClose,
}) => {
  const { toast } = useToast()
 
if (!isOpen) return null;

  return (
<div className="fixed inset-0 z-40 bg-gray-200 dark:bg-[#222528] dark:text-gray-100 p-4 flex flex-col">  
<div className="relative flex w-full">
      <div className="w-full absolute">
      <div className="flex justify-between items-center border-b pb-2">
      <h1>Categories</h1>
        <div className="flex items-center">
        <Button variant="outline" onClick={onClose}>
            <CloseOutlinedIcon />
          </Button>
        </div>
        </div>
        <div
          className={`flex flex-col items-center transition-all duration-300`}
        >
          <div className="w-full dark:bg-[#2D3236] rounded-xl bg-white">
          
            <ScrollArea className="h-[80vh] w-full p-2">
              
              {categoryList.map((category: any, index: number) => (
                <div
                  key={index}
                 
                  onClick={() => {
                    if (category.adCount > 0) {
                      handleHoverCategory(category.name);
                    } else {
                      toast({
                        title: "0 Ads",
                        description: (
                          <>
                            No ads in <strong>{category.name}</strong> category
                          </>
                        ),
                        //action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
                      });
                    }
                  }}
                 // onMouseEnter={() => handleHoverCategory(category.name)}
                  className={`relative text-black dark:text-[#F1F3F3] flex flex-col items-center justify-center cursor-pointer p-2 border-b dark:border-gray-600 dark:hover:bg-[#131B1E] hover:bg-emerald-100 ${
                    hoveredCategory === category.name
                      ? "bg-emerald-100 dark:bg-[#131B1E]"
                      : "dark:bg-[#2D3236] bg-white"
                  } `}
                >
                  <div className={`flex gap-1 items-center mb-1 h-full w-full`}>
                    <span>
                      <div className="rounded-full dark:bg-[#131B1E] bg-gray-100 p-1">
                        <Image
                          className="w-6 h-6 object-cover"
                          src={category.imageUrl[0]}
                          alt={category.name}
                          width={60}
                          height={60}
                        />
                      </div>
                    </span>
                    <span className="flex-1 text-base hover:no-underline my-auto">
                      <div className="flex flex-col">
                        <h2
                          className={`text-base ${
                            category.adCount > 0
                              ? ""
                              : "text-gray-500 dark:text-gray-500"
                          } `}
                        >
                          {category.name}
                        </h2>
                        <p
                          className={`text-sm text-gray-500 dark:text-gray-500`}
                        >
                          {category.adCount} ads
                        </p>
                      </div>
                    </span>
                    <span
                      className={`text-right my-auto ${
                        category.adCount > 0
                          ? ""
                          : "text-gray-500 dark:text-gray-500"
                      } `}
                    >
                      <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                    </span>
                  </div>
                 
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
      {hoveredCategory && (
        <div
          className={`absolute w-full z-10 p-0 dark:bg-[#222528] bg-white transition-all duration-300"
          }`}
    
        >
          <div className="flex justify-between items-center border-b pb-2">
            <h1>Sub Categories</h1>
        <div className="flex items-center">
        <Button variant="outline" onClick={()=> handleHoverCategory('')}>
            <CloseOutlinedIcon />
          </Button>
        </div>
        </div>
        <div className="w-full dark:bg-[#2D3236] rounded-xl bg-white">
         
          <ScrollArea className="h-[80vh] w-full p-2">
            {subcategoryList
              .filter((cat: any) => cat.category.name === hoveredCategory)
              .map((sub: any, index: number) => (
                <div
                  key={index}
                  className="relative dark:bg-[#2D3236] text-black dark:text-[#F1F3F3] bg-white flex flex-col items-center justify-center cursor-pointer p-2 border-b dark:hover:dark:bg-[#131B1E] hover:bg-emerald-100 border-b dark:border-gray-600"
                  onClick={() => {
                    if (sub.adCount > 0) {
                      handleSubCategory(hoveredCategory, sub.subcategory)
                    } else {
                      toast({
                        title: "0 Ads",
                        description: (
                          <>
                            No ads in <strong>{sub.subcategory}</strong> subcategory
                          </>
                        ),
                        //action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
                      });
                    }
                  }}
                >
                  <div className="flex gap-1 items-center mb-1 w-full">
                    <span>
                      <div className="rounded-full dark:bg-[#131B1E] bg-gray-100 p-2">
                        <Image
                          className="h-6 w-6 object-cover"
                          src={sub.imageUrl[0] || ""}
                          alt={sub.subcategory}
                          width={60}
                          height={60}
                        />
                      </div>
                    </span>
                    <span className="flex-1 text-base hover:no-underline my-auto">
                      <div className="flex flex-col">
                        <h2
                          className={`text-base ${
                            sub.adCount > 0
                              ? ""
                              : "text-gray-500 dark:text-gray-500"
                          } `}
                        >
                          {sub.subcategory}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          {sub.adCount} ads
                        </p>
                      </div>
                    </span>
                  </div>
                
                </div>
              ))}
          </ScrollArea>
          </div>
        </div>
      )}
    
    </div>
            
    </div>
  );
};

export default SearchTabWindow;
