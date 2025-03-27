// components/ChatWindow.js
"use client";
import React, { useEffect, useState } from "react";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import Image from "next/image";
import CreateCategoryForm from "./CreateCategoryForm";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import CreateSubCategoryForm from "./CreateSubCategoryForm";
import { Button } from "../ui/button";
import CategoryFilterSearch from "./CategoryFilterSearch";
import CategoryFilterSearchMain from "./CategoryFilterSearchMain";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  handleSubCategory: (category:string, subcategory:string) => void;
  categoryList: any;
  subcategoryList: any;
  category: string;
}

const SearchTabWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  category,
  categoryList,
  subcategoryList,
  handleSubCategory,
  onClose,
}) => {
  if (!isOpen) return null;
  const [query, setQuery] = useState("");
  //const totalAconst [query, setQuery] = useState("");
const [categoryselect, setcategoryselect] = useState(category);
const [filteredSubcategories, setFilteredSubcategories] = useState<any[]>([]);

// Update subcategories when category changes
useEffect(() => {
  const updatedSubcategories =
    subcategoryList?.filter((cat: any) => cat.category.name === categoryselect) || [];
  setFilteredSubcategories(updatedSubcategories);
}, [categoryselect, subcategoryList]);

const onSelectCategory = (value: string) => {
  setcategoryselect(value);
};

const selectedCategory = subcategoryList.find(
  (cat: any) => cat.category.name === categoryselect
);
const totalAdCount = filteredSubcategories.reduce((sum, item) => sum + item.adCount, 0);

const categoryImageUrl = selectedCategory ? selectedCategory.category.imageUrl[0] : "";

  return (
    <div className="fixed inset-0 z-40 bg-gray-200 dark:bg-[#222528] dark:text-gray-100 p-4 flex flex-col">
      <div className="flex justify-end items-center border-b pb-2">
        <div className="flex items-center">
        <Button variant="outline" onClick={onClose}>
            <CloseOutlinedIcon />
          </Button>
        </div>
        </div>
        <div className="w-full p-0 mt-2 mb-3">
            <CategoryFilterSearchMain categoryList={categoryList} onSelectCategory={onSelectCategory}/>
        </div>
          
       <div className="w-full p-0 dark:bg-[#2D3236] bg-white rounded-lg">
               {/* <div className="flex flex-col bg-[#064E3B] font-bold text-white items-center rounded-t-lg w-full p-1">
                  CATEGORY
                </div> */}
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
                  
                  {filteredSubcategories.map((sub: any, index: number) => (
                    <div
                      key={index}
                      onClick={() => {handleSubCategory(categoryselect, sub.subcategory); setQuery(sub.subcategory); onClose();}}
                      className={`rounded-sm dark:border-gray-600 flex items-center w-full justify-between p-0 mb-0 text-sm cursor-pointer dark:hover:bg-[#131B1E] dark:hover:text-white hover:bg-emerald-100 hover:text-emerald-600 ${
                        query === sub.subcategory
                          ? "bg-emerald-600 text-white hover:bg-emerald-600 hover:text-white "
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
  );
};

export default SearchTabWindow;
