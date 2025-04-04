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
import DashboardPerformance from "./dashboardPerfomance";

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
  handleAdEdit: (ad:any) => void;
  handleAdView: (ad:any) => void;
  handlePay: (id:string) => void;
  handleOpenReview: (value:any) => void;
  handleOpenShop: (shopId:any) => void;
  handleOpenChatId: (value:string) => void;
  handleOpenSettings: () => void;
  handleOpenPerfomance: () => void;
  handleCategory:(value:string) => void;
  
  user: any;
  userId: string;
  userName: string;
  userImage: string;
}

const PopupPerfomance = ({ isOpen, userId,userName,userImage, user, handlePay, handleOpenReview, handleOpenPerfomance, handleOpenSettings,
  handleOpenShop, handleOpenChatId, onClose, handleOpenChat, handleOpenBook,handleOpenPlan, handleOpenSell, handleAdEdit,handleAdView, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety }: WindowProps) => {
 
  

  if (!isOpen) return null;
     
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white p-0 w-full h-[100vh] flex flex-col">
         
                  <DashboardPerformance
                          userId={userId}
                          loggedId={userId}
                          isAdCreator={true}
                          user={user}
                          userName={userName}
                          userImage={userImage}
                          sortby={"recommeded"}
                          emptyTitle="No ads have been created yet"
                          emptyStateSubtext="Go create some now"
                          collectionType="Ads_Organized"
                          limit={20}
                          urlParamName="adsPage"
                          onClose={onClose}
                          handleOpenSell={handleOpenSell}
                          handleOpenAbout={handleOpenAbout}
                          handleOpenTerms={handleOpenTerms}
                          handleOpenPrivacy={handleOpenPrivacy}
                          handleOpenSafety={handleOpenSafety}
                          handleAdView={handleAdView}
                          handleAdEdit={handleAdEdit} 
                          handleOpenBook={handleOpenBook}
                          handleOpenChat={handleOpenChat} 
                          handleOpenPlan={handleOpenPlan} 
                          handleOpenPerfomance={handleOpenPerfomance}
                          handleOpenSettings={handleOpenSettings}
                          handleOpenShop={handleOpenShop}
                          handleOpenReview={handleOpenReview}
                          handlePay={handlePay}
                          
                        />
  
     
        <Toaster />
      </div>
    </div>
  );
};

export default PopupPerfomance;
