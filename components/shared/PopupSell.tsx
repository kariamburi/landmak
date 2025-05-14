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
import PackageForm from "./packageForm";
import { IPackages } from "@/lib/database/models/packages.model";

import { Toaster } from "../ui/toaster";
import { FreePackId, mode } from "@/constants";
import { getAllPackages } from "@/lib/actions/packages.actions";
import { getData } from "@/lib/actions/transactions.actions";
import DashboardSellMain from "./DashboardSellMain";
import { getallcategories } from "@/lib/actions/subcategory.actions";
import Navbar from "./navbar";
import CircularProgress from "@mui/material/CircularProgress";
import BottomNavigation from "./BottomNavigation";

//import { getAllPackages, getData } from "@/lib/api";

interface WindowProps {
  isOpen: boolean;
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenSell: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenChat: () => void;
  handlePay:(id:string)=> void;
  handleCategory:(value:string)=> void;
  type: string;
  userId: string;
  userName: string;
  userImage:string;
  subcategoryList:any;
  packagesList:any;
  user:any;
  category?:string;
  subcategory?:string;
  handleAdView: (ad:any) => void;
  handleOpenShop: (shopId:any) => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handleOpenSearchTab:(value:string)=> void;
}

const PopupSell = ({ isOpen, type, userId, user, userName,userImage, category,
  subcategory, subcategoryList, packagesList, handleAdView, handleOpenSettings,
  handleOpenShop,handleOpenSearchTab,
  handleOpenPerfomance, handleCategory, handleOpenChat, onClose,handleOpenPlan, handleOpenBook, handleOpenSell, handlePay, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety }: WindowProps) => {
 
  if (!isOpen) return null;
     
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white p-0 w-full h-[100vh] flex flex-col">
     
        <DashboardSellMain
          userId={userId}
          type={type}
          user={user}
          category={category}
          subcategory={subcategory}
          userName={userName}
          userImage={userImage}
          packagesList={packagesList}
          subcategoryList={subcategoryList}
          onClose={onClose}
          handleOpenSell={handleOpenSell}
          handlePay={handlePay}
          popup={"sell"}
          handleOpenAbout={handleOpenAbout}
          handleOpenTerms={handleOpenTerms}
          handleOpenPrivacy={handleOpenPrivacy}
          handleOpenSafety={handleOpenSafety}
          handleOpenBook={handleOpenBook}
          handleCategory={handleCategory}
          handleOpenChat={handleOpenChat}
           handleOpenPlan={handleOpenPlan}
           handleOpenShop={handleOpenShop} 
           handleOpenPerfomance={handleOpenPerfomance}
           handleOpenSettings={handleOpenSettings}
           handleAdView={handleAdView} />
        <Toaster />
      </div>
    </div>
  );
};

export default PopupSell;
