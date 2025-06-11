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
import { getAdById } from "@/lib/actions/dynamicAd.actions";
import AdsComponent from "./AdsComponent";
import Navbar from "./navbar";
import CircularProgress from "@mui/material/CircularProgress";
import BottomNavigation from "./BottomNavigation";
import EnhancedaAdView from "./EnhancedaAdView";

//import { getAllPackages, getData } from "@/lib/api";

interface WindowProps {
  isOpen: boolean;
  onClose: () => void;
  handleOpenSell: (category?:string, subcategory?:string) => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenBook: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleAdEdit: (ad:any) => void;
  handleAdView: (ad:any) => void;
  handleSubCategory:(category: string, subcategory: string) => void;
  handleOpenReview: (value:any) => void;
  handleOpenShop: (shopId:any) => void;
  handleOpenChatId: (value:string) => void;
  handleOpenSettings: () => void;
  handleOpenPerfomance: () => void;
  handleCategory:(value:string) => void;
  handlePay: (id:string) => void;
  type: string;
  userId: string;
  userName: string;
  userImage: string;
  ad:any;
  user:any;
}

const PopupAdView = ({ isOpen, type,user, userId, userName, userImage, ad, handlePay, handleOpenPerfomance, handleOpenSettings,
  handleOpenShop, handleCategory, handleSubCategory,handleOpenReview, handleOpenChatId,
  onClose, handleOpenSell,handleOpenBook ,handleOpenChat,handleOpenPlan, handleAdView, handleAdEdit, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety }: WindowProps) => {

  if (!isOpen) return null;
     


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#e4ebeb] z-50">
         <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white w-full h-[100vh] flex flex-col">
        {/**AdsComponent */}
          <EnhancedaAdView
            ad={ad}
            user={user}
            userId={userId}
            userName={userName}
            userImage={userImage}
            id={ad._id}
            handleAdView={handleAdView}
            onClose={onClose}
            handleSubCategory={handleSubCategory}
            handleOpenSell={handleOpenSell}
            handleOpenAbout={handleOpenAbout}
            handleOpenTerms={handleOpenTerms}
            handleOpenPrivacy={handleOpenPrivacy}
            handleOpenSafety={handleOpenSafety}
            handleOpenBook={handleOpenBook}
            handleOpenChat={handleOpenChat}
            handleOpenPlan={handleOpenPlan}
            handleAdEdit={handleAdEdit}
            handleOpenReview={handleOpenReview}
            handleOpenChatId={handleOpenChatId}
            handleOpenShop={handleOpenShop}
            handleOpenSettings={handleOpenSettings} 
            handleOpenPerfomance={handleOpenPerfomance}
            handlePay={handlePay}/>
            
        <Toaster />
      </div>
      </div>
  );
};

export default PopupAdView;
