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
import DashboardChat from "./dashboardChat";
import BottomNavigation from "./BottomNavigation";

//import { getAllPackages, getData } from "@/lib/api";

interface WindowProps {
  isOpen: boolean;
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenSell: () => void;
  handleOpenShop: (shopId:any) => void;
  handleOpenChatId: (value:any) => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenSettings: () => void;
  handleCategory: (value:string) => void;
  handleOpenPerfomance: () => void;
  handleAdEdit:(id:string)=> void;
  handleAdView:(id:string)=> void;
  handleOpenSearchTab: (value:string) => void;
  userImage: string;
  userId: string;
  recipientUid: string;
  userName: string;
  user:any;
}

const PopupChatId = ({ isOpen, userId,userName,userImage,recipientUid, user, handleOpenSearchTab, handleAdEdit,handleAdView,
  handleOpenPerfomance, handleCategory, handleOpenSettings, onClose, handleOpenChatId, handleOpenShop, handleOpenChat,handleOpenBook,handleOpenPlan, handleOpenSell, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety }: WindowProps) => {
 
  if (!isOpen) return null;
     
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white p-0 w-full h-[100vh] flex flex-col">
         <DashboardChat
            user={user}
            senderImage={userImage}
            senderId={userId}
            senderName={userName}
            recipientUid={recipientUid}
            onClose={onClose}
            handleOpenSell={handleOpenSell}
            handleOpenBook={handleOpenBook}
            handleOpenChat={handleOpenChat}
            handleOpenPlan={handleOpenPlan}
            handleOpenShop={handleOpenShop}
            handleOpenChatId={handleOpenChatId}
            handleOpenAbout={handleOpenAbout}
            handleOpenTerms={handleOpenTerms}
            handleOpenPrivacy={handleOpenPrivacy}
            handleOpenSafety={handleOpenSafety}
            handleOpenSettings={handleOpenSettings}
            handleOpenPerfomance={handleOpenPerfomance}
            handleCategory={handleCategory} 
            handleAdEdit={handleAdEdit} 
            handleAdView={handleAdView}
                   
    />
     
        <Toaster />
      </div>
    </div>
  );
};

export default PopupChatId;
