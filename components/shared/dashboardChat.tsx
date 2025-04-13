"use client";
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
import { auth } from "@clerk/nextjs/server";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { mode } from "@/constants";
const Sidebar = dynamic(() => import("@/components/shared/Sidebar"), {
  ssr: false,
  loading: () => (
    <div>
      <div className="w-full lg:w-[300px] h-full flex flex-col items-center justify-center">
        <Image
          src="/assets/icons/loading2.gif"
          alt="loading"
          width={40}
          height={40}
          unoptimized
        />
      </div>
    </div>
  ),
});
const SendMessage = dynamic(() => import("@/components/shared/SendMessage"), {
  ssr: false,
  loading: () => (
    <div>
      <div className="w-full h-[50px] flex rounded-lg flex-col items-center justify-center">
        <Image
          src="/assets/icons/loading2.gif"
          alt="loading"
          width={40}
          height={40}
          unoptimized
        />
      </div>
    </div>
  ),
});
const ChatBox = dynamic(() => import("@/components/shared/ChatBox"), {
  ssr: false,
  loading: () => (
    <div>
      <div className="w-full h-[300px] mb-2 rounded-lg flex flex-col items-center justify-center">
        <Image
          src="/assets/icons/loading2.gif"
          alt="loading"
          width={40}
          height={40}
          unoptimized
        />
      </div>
    </div>
  ),
});
type payProps = {
  senderName: string;
  senderImage: string;
  user: any;
  recipientUid: string;
  senderId: string;
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenSell: () => void;
  handleOpenShop: (shopId:any) => void;
  handleOpenChatId: (value:any) => void;
  handleOpenSettings: () => void;
  handleOpenPerfomance: () => void;
  handleCategory:(value:string) => void;
    handleOpenAbout: () => void;
    handleOpenTerms: () => void;
    handleOpenPrivacy: () => void;
    handleOpenSafety: () => void;
    handleAdEdit:(id:string)=> void;
    handleAdView:(id:string)=> void;
    
};
const DashboardChat = ({
  recipientUid,
  user,
  senderId,
  senderName,
  senderImage,
  handleAdEdit,
  handleAdView,
  handleCategory,
  handleOpenAbout,
  handleOpenTerms,
  handleOpenPrivacy,
  handleOpenSafety,
  handleOpenPerfomance, handleOpenSettings,
  onClose,handleOpenChatId, handleOpenChat,handleOpenBook,handleOpenPlan,handleOpenSell,handleOpenShop,
}: payProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };
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
    <div className="h-[100dvh] w-full dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] bg-white lg:bg-gray-200">
  {/* Fixed Navbar */}
  <div className="fixed top-0 left-0 w-full z-50">
    <Navbar
      userstatus={user.status}
      userId={senderId}
      user={user}
      onClose={onClose}
      handleOpenSell={handleOpenSell}
      handleOpenPlan={handleOpenPlan}
      popup={"chat"}
      handleOpenBook={handleOpenBook}
      handleOpenChat={handleOpenChat}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenSettings={handleOpenSettings}
      handleOpenAbout={handleOpenAbout}
      handleOpenTerms={handleOpenTerms}
      handleOpenPrivacy={handleOpenPrivacy}
      handleOpenSafety={handleOpenSafety}
      handleOpenShop={handleOpenShop}
    />
  </div>

  {/* Main Content with Padding to Prevent Overlap */}
  <div className="max-w-6xl mx-auto mt-[60px] flex">
    
    <div className="hidden lg:inline mr-2">
      <div className="w-full dark:bg-[#2D3236] bg-white p-1 max-h-[87dvh] rounded-lg">
        <div className="p-1 w-full items-center justify-center">
          <span className="logo font-bold text-[25px] dark:text-gray-400 text-emerald-950">
            Messanger
          </span>
          <div className="flex gap-1 items-center">
            <PeopleOutlinedIcon />
            Latest Chats
          </div>
        </div>
        <Sidebar userId={senderId} recipientUid= {recipientUid} handleOpenChatId={handleOpenChatId} />
      </div>
    </div>

    <div className="flex-1 w-full flex-col">
      <div className="rounded-0 lg:rounded-lg dark:bg-[#2D3236] bg-white max-w-6xl mx-auto flex flex-col">
       
          <ChatBox
            displayName={senderName}
            uid={senderId}
            photoURL={senderImage}
            recipientUid={recipientUid}
            recipient={user}
            client={false}
            handleAdEdit={handleAdEdit}
            handleAdView={handleAdView}
            handleCategory={handleCategory}
            handleOpenSell={handleOpenSell}
            handleOpenPlan={handleOpenPlan}
          />

          <SendMessage
            displayName={senderName}
            uid={senderId}
            photoURL={senderImage}
            recipientUid={recipientUid}
            client={false}
          />
        
      </div>
    </div>
    <Toaster />
  </div>
</div>

  );
};

export default DashboardChat;
