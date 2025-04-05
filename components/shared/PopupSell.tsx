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
  subcategoryList:any;
  user:any;
  handleAdView: (ad:any) => void;
  handleOpenShop: (shopId:any) => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handleOpenSearchTab:(value:string)=> void;
}

const PopupSell = ({ isOpen, type, userId, user, userName, subcategoryList, handleAdView, handleOpenSettings,
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
         // daysRemaining={daysRemaining}
         // packname={planPackage}
          //planId={planId}
          userName={userName}
        //  packagesList={packagesList}
        //  listed={remainingAds}
         // expirationDate={expirationDate}
         // priority={priority}
        //  adstatus={adStatus}
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
