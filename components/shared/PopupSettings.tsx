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
import SettingsComponent from "./SettingsComponent";
import { getUserById } from "@/lib/actions/user.actions";
import CircularProgress from "@mui/material/CircularProgress";
import Navbar from "./navbar";

interface WindowProps {
  isOpen: boolean;
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenSell: () => void;
  handleOpenChat: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenSettings: () => void;
  handleOpenShop: (shopId:any) => void;
  handleOpenPerfomance: () => void;
  handlePay: (id:string) => void;
  handleCategory: (value:string) => void;
  userId: string;
  user:any;
}

const PopupSettings = ({ isOpen, userId, user, handleCategory, handleOpenShop,handlePay,
  handleOpenPerfomance, handleOpenSettings, onClose, handleOpenBook,handleOpenChat,handleOpenPlan, handleOpenSell,handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety }: WindowProps) => {

  if (!isOpen) return null;
     
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white p-0 w-full h-[100vh] flex flex-col">
       
      <SettingsComponent 
      userId={userId} 
      user={user}
      onClose={onClose}
        handleOpenAbout={handleOpenAbout}
        handleOpenTerms={handleOpenTerms}
        handleOpenPrivacy={handleOpenPrivacy}
        handleOpenSafety={handleOpenSafety}
        handleOpenSell={handleOpenSell}
        handleOpenBook={handleOpenBook}
        handleOpenChat={handleOpenChat}
        handleOpenPlan={handleOpenPlan}
        handleOpenPerfomance={handleOpenPerfomance}
        handleOpenSettings={handleOpenSettings}
        handleOpenShop={handleOpenShop}
        handlePay={handlePay}
        handleCategory={handleCategory}
        />
        <Toaster />
      </div>
    </div>
  );
};

export default PopupSettings;
