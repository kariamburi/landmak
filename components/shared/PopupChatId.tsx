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
  handleOpenShop: (shopId:string) => void;
  handleOpenChatId: (value:string) => void;
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
}

const PopupChatId = ({ isOpen, userId,userName,userImage,recipientUid, handleOpenSearchTab, handleAdEdit,handleAdView,
  handleOpenPerfomance, handleCategory, handleOpenSettings, onClose, handleOpenChatId, handleOpenShop, handleOpenChat,handleOpenBook,handleOpenPlan, handleOpenSell, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety }: WindowProps) => {
  const [user, setuser] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      const fetchData = async () => {
        try {
         const user = await getUserById(userId);
         setuser(user);
        
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
      <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white p-1 w-full h-[100vh] flex flex-col">
          {loading ? (
                 <div className="h-screen w-full bg-gray-200"> 
                 <div className="top-0 z-10 fixed w-full">
                  <Navbar userstatus={"User"} userId={userId} onClose={onClose} popup={"chat"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
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
                    <footer>
                                                   
                                                   <div className="lg:hidden mt-0">
                                                     <BottomNavigation userId={userId} 
                                                     popup={"chat"}
                                                     onClose={onClose} 
                                                     handleOpenSell={handleOpenSell}
                                                     handleOpenChat={handleOpenChat}
                                                     handleOpenSearchTab={handleOpenSearchTab} />
                                                   </div>
                                                 </footer>
                 </div>
                
               ) : ( <DashboardChat
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
            handleAdView={handleAdView}/>
                   
     )}
     
        <Toaster />
      </div>
    </div>
  );
};

export default PopupChatId;
