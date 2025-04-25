"use client";

import MessageIcon from "@mui/icons-material/Message";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DiamondIcon from "@mui/icons-material/Diamond";
import { useRouter, redirect, usePathname } from "next/navigation";
//import { useSession } from "next-auth/react";
//import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import MobileNav from "./MobileNav";
import Image from "next/image";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
//import Unreadmessages from "./Unreadmessages";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Unreadmessages from "./Unreadmessages";
import dynamic from "next/dynamic";
import StyledBrandName from "./StyledBrandName";
import ToggleTheme from "./toggleTheme";
import ProgressPopup from "./ProgressPopup";
import { useState } from "react";
import { Button } from "../ui/button";

const SignedIn = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignedIn),
  { ssr: false }
);
const SignedOut = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignedOut),
  { ssr: false }
);
const UserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  { ssr: false }
);

type NavProps = {
  userstatus: string;
  userId: string;
  user:any;
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenSell: () => void;
  handleOpenShop: (shopId:any) => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void; 
  handleOpenSafety: () => void;
  popup:string;
};

export default function Navbar({ userstatus, userId, user, onClose, popup, handleOpenSell,handleOpenChat, handleOpenBook,handleOpenPlan ,
  handleOpenShop,
  handleOpenPerfomance,
  handleOpenSettings, 
  handleOpenAbout,
  handleOpenTerms,
  handleOpenPrivacy,
  handleOpenSafety,
}: NavProps) {
  // const [unreadCount, setUnreadCount] = useState<number>(0);
  const router = useRouter();
  // Get the params of the User
  const pathname = usePathname();
  const isActive = pathname === "/";
  const [isOpenP, setIsOpenP] = useState(false);
  const handleCloseP = () => {
    setIsOpenP(false);
  };
  return (
    <div className="h-[60px] items-center flex p-2 lg:p-3 gap-1 w-full border-b bg-gradient-to-b from-white to-gray-200 lg:from-white lg:to-white">
      <div className="flex-1 mt-1">
        <div className="flex items-center">
       
            <div
              className="mr-2 w-5 h-8 flex text-gray-500 lg:text-gray-500 items-center justify-center rounded-sm tooltip tooltip-bottom hover:cursor-pointer lg:hover:text-green-600"
              data-tip="Back"
              onClick={() => {
                onClose()
              }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ArrowBackOutlinedIcon />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Back</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
         
           <div className="flex items-center gap-2">
          
                          <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
                          <StyledBrandName/>
              </div>
        
        </div>
      </div>
    
      <div className="hidden lg:inline">
        
      <div className="flex mt-1 items-center gap-2">   
      {popup !=="bookmark" && (<>
         <SignedIn>
         <div
            className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-gray-200 hover:bg-gray-300 tooltip tooltip-bottom hover:cursor-pointer"
            data-tip="Messages"
            onClick={() => {
              handleOpenBook();
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <BookmarkIcon sx={{ fontSize: 16 }} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bookmark</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          </SignedIn>
          <SignedOut>
         <div
            className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-gray-200 hover:bg-gray-300 tooltip tooltip-bottom hover:cursor-pointer"
            data-tip="Messages"
            onClick={() => {
              setIsOpenP(true);
               router.push("/sign-in");
             }} 
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <BookmarkIcon sx={{ fontSize: 16 }} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bookmark</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          </SignedOut>
          </>)}    
        {popup !=="chat" && (<>
            <SignedIn>
             <div
            className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-gray-200 hover:bg-gray-300  tooltip tooltip-bottom hover:cursor-pointer"
            data-tip="Messages"
            onClick={() => {
              handleOpenChat();
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative flex items-center justify-center">
                    <MessageIcon sx={{ fontSize: 16 }} className="absolute" />
                    <div className="absolute z-10">
                      <Unreadmessages userId={userId} popup={popup}/>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div
                    onClick={() => {
                      handleOpenChat();
                    }}
                    className="flex gap-1"
                  >
                    Chats
                    <Unreadmessages userId={userId} popup={popup} />
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          </SignedIn>
          <SignedOut>
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Messages"
              onClick={() => {
                setIsOpenP(true);
                 router.push("/sign-in");
               }} 
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <MessageIcon sx={{ fontSize: 16 }} className="absolute" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Message</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            </SignedOut>
          </>
        )}  

         {popup !=="plan" && (
          
          <div
            className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-gray-200 hover:bg-gray-300 tooltip tooltip-bottom hover:cursor-pointer"
            data-tip="Messages"
            onClick={() => {
              handleOpenPlan();
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DiamondIcon sx={{ fontSize: 16 }} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Premium Services</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )} 

          {popup !=="sell" && (  <div className="flex gap-1">
          <SignedIn>

<Button  onClick={() => {
                   handleOpenSell();
                 
                  }} 
                  variant="default" className="flex bg-green-600 hover:bg-green-700 items-center gap-2">
<AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL
</Button>

</SignedIn>

<SignedOut>
<Button  onClick={() => {
      setIsOpenP(true);
      router.push("/sign-in");
    }} variant="default" className="flex bg-green-600 hover:bg-green-700 items-center gap-2">
<AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL
</Button>

  
</SignedOut>

          </div>)}
        
        </div>
      </div>
      <SignedIn>
        <div className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white tooltip tooltip-bottom hover:cursor-pointer">
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
      <MobileNav userstatus={userstatus} userId={userId}
      popup={popup}
      user={user}
      handleOpenSell={handleOpenSell}
      handleOpenBook={handleOpenBook}
      handleOpenPlan={handleOpenPlan}
      handleOpenChat={handleOpenChat}
      handleOpenShop={handleOpenShop}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenSettings={handleOpenSettings}
      handleOpenAbout={handleOpenAbout}
      handleOpenTerms={handleOpenTerms}
      handleOpenPrivacy={handleOpenPrivacy}
      handleOpenSafety={handleOpenSafety} onClose={onClose}/>
      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
    </div>
  );
}
