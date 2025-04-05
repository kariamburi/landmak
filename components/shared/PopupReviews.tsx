// components/ChatWindow.js
"use client";
import React, { useEffect, useState } from "react";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import Image from "next/image";
import CreateCategoryForm from "./CreateCategoryForm";

import CreateSubCategoryForm from "./CreateSubCategoryForm";
import PackageForm from "./packageForm";
import { IPackages } from "@/lib/database/models/packages.model";

import { Toaster } from "../ui/toaster";
import { FreePackId, mode } from "@/constants";
import { getAllPackages } from "@/lib/actions/packages.actions";
import { getData } from "@/lib/actions/transactions.actions";
import DashboardSellMain from "./DashboardSellMain";
import { getUserById } from "@/lib/actions/user.actions";
import Navbar from "./navbar";
import DashboardBookmark from "./dashboardBookmark";
import CircularProgress from "@mui/material/CircularProgress";
import ChatComponent from "./ChatComponent";
import SellerProfile from "./SellerProfile";
import SendReviewMyAds from "./SendReviewMyAds";
import { ScrollArea } from "../ui/scroll-area";
import ReviewsComponent from "./ReviewsComponent";

//import { getAllPackages, getData } from "@/lib/api";

interface WindowProps {
  isOpen: boolean;
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenSell: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
   handleOpenSettings: () => void;
    handleOpenChatId: (value:string) => void;
    handleOpenReview: (value:any) => void;
  handleOpenShop: (shopId:any) => void;
  handleOpenPerfomance: () => void;
  handlePay: (id:string) => void;
  handleCategory: (value:string) => void;
  userImage: string;
  userId: string;
  userName: string;
  recipient:any;
  user:any;
  
}

const PopupReviews = ({ isOpen, userId, userName, userImage, user, recipient, onClose,handlePay, handleOpenShop, handleOpenPerfomance, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety, handleOpenBook,handleOpenPlan, handleOpenSell, handleOpenSettings,handleOpenReview,handleOpenChat,handleOpenChatId, }: WindowProps) => {
 

  if (!isOpen) return null;
     
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white p-0 w-full h-[100vh] flex flex-col">
        
            <ReviewsComponent
              displayName={userName}
              uid={userId}
              photoURL={userImage}
              recipient={recipient}
              user={user}
              handleOpenReview={handleOpenReview}
              handleOpenChatId={handleOpenChatId}
              handleOpenSettings={handleOpenSettings}
              handleOpenSell={handleOpenSell}
              handleOpenBook={handleOpenBook}
              handleOpenPlan={handleOpenPlan}
              handleOpenChat={handleOpenChat}
              handleOpenPerfomance={handleOpenPerfomance}
              handleOpenAbout={handleOpenAbout}
              handleOpenTerms={handleOpenTerms}
              handleOpenPrivacy={handleOpenPrivacy}
              handleOpenSafety={handleOpenSafety}
              handleOpenShop={handleOpenShop} 
              onClose={onClose} 
              handlePay={handlePay}/>
                
        <Toaster />
      </div>
    </div>
  );
};

export default PopupReviews;
