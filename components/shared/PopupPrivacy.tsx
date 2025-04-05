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
import AboutComponent from "./AboutComponent";
import TermsComponent from "./TermsComponent";
import PrivacyComponent from "./PrivacyComponent";

//import { getAllPackages, getData } from "@/lib/api";

interface WindowProps {
  isOpen: boolean;
  onClose: () => void;
  handleOpenSell:() => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handleOpenShop: (shopId:any) => void;
  userId: string;
  user:any;
}

const PopupPrivacy = ({ isOpen,user, userId, onClose, handleOpenPerfomance,
  handleOpenSettings,
  handleOpenShop, handleOpenSell, handleOpenBook,handleOpenChat,handleOpenPlan, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety }: WindowProps) => {
 
  if (!isOpen) return null;
     
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white p-0 w-full h-[100vh] flex flex-col">
       
      <PrivacyComponent user={user} userId={userId} onClose={onClose} 
      handleOpenAbout={handleOpenAbout} 
      handleOpenTerms={handleOpenTerms}
      handleOpenPrivacy={handleOpenPrivacy}
      handleOpenSafety={handleOpenSafety}
      handleOpenSell={handleOpenSell}
      handleOpenBook={handleOpenBook}
      handleOpenChat={handleOpenChat} 
      handleOpenPlan={handleOpenPlan} 
      handleOpenSettings={handleOpenSettings}
                          handleOpenShop={handleOpenShop} 
                          handleOpenPerfomance={handleOpenPerfomance}/>
        <Toaster />
      </div>
    </div>
  );
};

export default PopupPrivacy;
