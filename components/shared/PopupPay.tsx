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
import { getData, getpayTransaction } from "@/lib/actions/transactions.actions";
import DashboardSellMain from "./DashboardSellMain";
import DashboardPay from "./dashboardPay";
import CircularProgress from "@mui/material/CircularProgress";
import Navbar from "./navbar";

//import { getAllPackages, getData } from "@/lib/api";

interface WindowProps {
  isOpen: boolean;
  onClose: () => void;
  handleOpenSell: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;

  handleOpenShop: (shopId:any) => void;
  handleOpenChatId: (value:string) => void;
  handleOpenSettings: () => void;
  handleOpenPerfomance: () => void;
  handleCategory:(value:string) => void;
  userId: string;
  userName: string;
  txtId: string;
  user:any;
}

const PopupPay = ({ isOpen, userId, userName, txtId, user,  handleOpenPerfomance, handleOpenSettings,
  handleOpenShop, handleOpenChatId, onClose, handleOpenSell, handleOpenChat, handleOpenBook, handleOpenPlan, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety, }: WindowProps) => {
  const [trans, settrans] = useState<any>(null);
 const [loading, setLoading] = useState<boolean>(true);
 
  useEffect(() => {
    if (isOpen && userId) {
      const fetchData = async () => {
        try {
          setLoading(true);
         const tran = await getpayTransaction(txtId);
         settrans(tran);
         
        } catch (error) {
                 console.error("Failed to fetch data", error);
               } finally {
                 setLoading(false); // Mark loading as complete
               }
      };

      fetchData();
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;
     
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white p-0 w-full h-[100vh] flex flex-col">
       
       {loading ? (
                   <div className="h-screen w-full bg-gray-200"> 
                   <div className="top-0 z-10 fixed w-full">
                    <Navbar user={user} userstatus={user.status} userId={userId} onClose={onClose} popup={"pay"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                    handleOpenPerfomance={handleOpenPerfomance}
                    handleOpenSettings={handleOpenSettings}
                    handleOpenAbout={handleOpenAbout}
                    handleOpenTerms={handleOpenTerms}
                    handleOpenPrivacy={handleOpenPrivacy}
                    handleOpenSafety={handleOpenSafety} 
                    handleOpenShop={handleOpenShop}/>
                    </div>
                    <div className="flex justify-center items-center h-full text-lg font-bold">
                    <div className="flex gap-2 items-center">  <CircularProgress sx={{ color: "gray" }} size={30} /> <div className="hidden lg:inline">Loading...</div></div>
                   </div>
                   </div>
                  
                 ) : (
         <DashboardPay user={user} userId={userId} trans={trans} recipientUid={userId} onClose={onClose} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout}
            handleOpenTerms={handleOpenTerms}
            handleOpenPrivacy={handleOpenPrivacy}
            handleOpenSafety={handleOpenSafety}
            handleOpenPlan={handleOpenPlan}
            handleOpenBook={handleOpenBook}
            handleOpenChat={handleOpenChat}
            handleOpenPerfomance={handleOpenPerfomance}
            handleOpenSettings={handleOpenSettings}
            handleOpenShop={handleOpenShop}
            handleOpenChatId={handleOpenChatId}/>)}
       
        <Toaster />
      </div>
    </div>
  );
};

export default PopupPay;
