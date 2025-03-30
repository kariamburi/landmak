// components/Chat.js
"use client"
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Image from "next/image";
import { getUserById } from "@/lib/actions/user.actions";
import Navbar from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SellerProfile from "@/components/shared/SellerProfile";
import { auth } from "@clerk/nextjs/server";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import Sidebar from "@/components/shared/Sidebar";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import Footersub from "@/components/shared/Footersub";
import BottomNavigation from "@/components/shared/BottomNavigation";
import Sidebarmain from "@/components/shared/Sidebarmain";
import { mode } from "@/constants";
import SellerProfileReviews from "./SellerProfileReviews";
import SellerProfileChat from "./SellerProfileChat";
interface AdsProps {
  senderId: string;
  senderName: string;
  senderImage: string;
  user: any;
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
  handleOpenReview: (value:string) => void;
  handleCategory: (value:string) => void;
  handleOpenSearchTab: (value:string) => void;
  handleOpenShop: (shopId:string) => void;
  handleOpenPerfomance: () => void;
  handlePay: (id:string) => void;
}

const ChatComponent =  ({senderId,senderName,senderImage,user,onClose, handlePay,handleOpenSearchTab, handleOpenShop,
  handleOpenPerfomance, handleCategory,handleOpenSettings,handleOpenReview,handleOpenChat,handleOpenChatId, handleOpenBook, handleOpenSell, handleOpenPlan, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety}:AdsProps) => {
 
  const recipientUid = senderId;
  // console.log(senderId);
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
  
      useEffect(() => {
         const savedTheme = localStorage.getItem("theme") || mode; // Default to "dark"
         const isDark = savedTheme === mode;
         
         setIsDarkMode(isDark);
         document.documentElement.classList.toggle(mode, isDark);
       }, []);
     
       useEffect(() => {
         if (isDarkMode === null) return; // Prevent running on initial mount
     
         document.documentElement.classList.toggle(mode, isDarkMode);
         localStorage.setItem("theme", isDarkMode ? "dark" : "light");
       }, [isDarkMode]);
     
       if (isDarkMode === null) return null; // Avoid flickering before state is set
     
  return (
     <div className="h-[100vh] bg-white lg:bg-gray-200 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
       
      <div className="z-10 top-0 fixed w-full">
                 <Navbar userstatus={user.status} userId={senderId} onClose={onClose} 
                 handleOpenSell={handleOpenSell} 
                 handleOpenPlan={handleOpenPlan} 
                 popup={"chat"} 
                 handleOpenBook={handleOpenBook} 
                 handleOpenChat={handleOpenChat}
                  handleOpenShop={handleOpenShop} 
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings} 
                  handleOpenAbout={handleOpenAbout} 
                  handleOpenTerms={handleOpenTerms}
                  handleOpenPrivacy={handleOpenPrivacy}
                  handleOpenSafety={handleOpenSafety}/>
               </div>
      <div className="w-full lg:max-w-6xl lg:mx-auto h-full flex mt-[73px] lg:mt-[60px] mb-0 p-1">
        <div className="hidden lg:inline mr-5">
          <div className="w-full rounded-lg p-1">
            <SellerProfileChat
              user={user}
              loggedId={senderId}
              userId={recipientUid}
              handleOpenReview={handleOpenReview} 
              handleOpenChatId={handleOpenChatId} 
              handleOpenSettings={handleOpenSettings} 
              handlePay={handlePay}/>
          </div>
        </div>

        <div className="flex-1 h-screen">
        
          <div className="rounded-lg mb-20 h-full lg:mb-0 max-w-6xl mx-auto flex flex-col">
            <div className="lg:flex-1 h-screen p-1">
              <div className="w-full p-1 w-full bg-white rounded-t-lg border-b dark:bg-[#2D3236] items-center">
                <span className="logo font-bold text-base lg:text-[25px] dark:text-gray-400 text-emerald-950">
                  Messanger
                </span>
                <div className="text-xs lg:text-base flex gap-1 items-center">
                  <PeopleOutlinedIcon />
                  Latest Chats
                </div>
              </div>
              <ScrollArea className="h-[75vh] p-1 bg-white rounded-b-lg dark:bg-[#2D3236]">
    
              <Sidebarmain userId={senderId} handleOpenChatId={handleOpenChatId}/>
              </ScrollArea>
              <Toaster />
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div className="hidden lg:inline">
          <Footersub 
          handleOpenAbout={handleOpenAbout}
         handleOpenTerms={handleOpenTerms}
         handleOpenPrivacy={handleOpenPrivacy}
         handleOpenSafety={handleOpenSafety}/>
        </div>
        <div className="lg:hidden mt-[65px]">
          <BottomNavigation userId={senderId} 
          popup={"chat"}
          onClose={onClose} 
          handleOpenSell={handleOpenSell}
          handleOpenChat={handleOpenChat}
          handleOpenSearchTab={handleOpenSearchTab} />
        </div>
      </footer>
    </div>
  );
};

export default ChatComponent;


