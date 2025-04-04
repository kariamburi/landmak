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
import { getUserById } from "@/lib/actions/user.actions";
import Navbar from "./navbar";
import DashboardBookmark from "./dashboardBookmark";
import CircularProgress from "@mui/material/CircularProgress";
import ChatComponent from "./ChatComponent";
import Footersub from "./Footersub";
import BottomNavigation from "./BottomNavigation";

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
  handleOpenChatId: (value:string) => void;
  handleOpenSettings: () => void;
  handleCategory: (value:string) => void;
  handleOpenReview: (value:any) => void;
  handleOpenShop: (shopId:any) => void;
  handleOpenPerfomance: () => void;
  handlePay: (id:string) => void;
  handleOpenSearchTab: (value:string) => void;
  userImage: string;
  userId: string;
  userName: string;
  user:any;
}

const PopupChat = ({ isOpen, userId,userName,userImage, user, onClose,
  handleOpenShop,handlePay,handleOpenSearchTab,
  handleOpenPerfomance, handleOpenSettings, handleOpenReview, handleCategory, handleOpenChat,handleOpenChatId, handleOpenBook,handleOpenPlan, handleOpenSell, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety }: WindowProps) => {
 
  if (!isOpen) return null;
     
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white p-0 w-full h-[100vh] flex flex-col">
        
      <ChatComponent
              user={user}
              senderImage={userImage}
              senderId={userId}
              senderName={userName}
              onClose={onClose}
              handleOpenSell={handleOpenSell}
              handleOpenAbout={handleOpenAbout}
              handleOpenTerms={handleOpenTerms}
              handleOpenPrivacy={handleOpenPrivacy}
              handleOpenSafety={handleOpenSafety}
              handleOpenBook={handleOpenBook}
              handleOpenChat={handleOpenChat}
              handleOpenPlan={handleOpenPlan}
              handleCategory={handleCategory}
              handleOpenChatId={handleOpenChatId}
              handleOpenSettings={handleOpenSettings}
              handleOpenReview={handleOpenReview}
              handleOpenShop={handleOpenShop} 
              handleOpenPerfomance={handleOpenPerfomance}
              handlePay={handlePay}
              handleOpenSearchTab={handleOpenSearchTab}
              />
     
        <Toaster />
      </div>
    </div>
  );
};

export default PopupChat;
