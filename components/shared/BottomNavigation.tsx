"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Unreadmessages from "./Unreadmessages";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ProgressPopup from "./ProgressPopup";
import { useState } from "react";
import { DivideSquare } from "lucide-react";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Bell, HelpCircle, CirclePlus , User, BarChart, Search , MessageCircle, Heart, PlusSquare, Home } from 'lucide-react';

type navprop = {
  userId: string;
  popup: string;
  onClose: () => void;
  handleOpenSell: () => void;
  handleOpenChat: () => void;
  handleOpenSettings: () => void;
  handleOpenP: () => void;
  handleOpenSearchTab: (value:string) => void;

};
const BottomNavigation = ({ userId, popup, handleOpenP, handleOpenSearchTab, handleOpenSettings, handleOpenSell, handleOpenChat, onClose }: navprop) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <nav className="dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] bottom-0 z-5 w-full bg-white shadow-md border-t dark:border-gray-700 border-gray-200">
      <div className="flex justify-around py-2 relative">
        <div
          onClick={() => {
            onClose();
          }}
        >
          <div
            className={`flex cursor-pointer flex-col items-center hover:text-green-700 ${
              popup === "home" ? "text-green-600" : "text-gray-600"
            }`}
          >
            <span>
              <Home />
            </span>
            <span className="text-xs">Home</span>
          </div>
        </div>

        <div
          onClick={() => {
            handleOpenSearchTab('Property');

          }}
        >
          <div
            className={`flex flex-col cursor-pointer items-center hover:text-green-700 ${
              popup === "category" ?  "text-green-600" : "text-gray-600"
            }`}
          >
            <span>
              <Search  />
            </span>
            <span className="text-xs">Search</span>
          </div>
        </div>

        {/* Sell Button */}

        <SignedIn>
          <div
            onClick={() => {
              handleOpenSell();
             
            }}
          >
             <div
            className={`flex flex-col cursor-pointer items-center hover:text-emerald-700 ${
              popup === "sell" ?  "text-emerald-600" : "dark:text-gray-400 text-gray-600"
            }`}
          >
            <span>
              <CirclePlus  />
            </span>
            <span className="text-xs">Sell</span>
          </div>
          </div>
        </SignedIn>

        <SignedOut>
          <div
            onClick={() => {
              handleOpenP();
                router.push("/sign-in");

            }}
          >
              <div
            className={`flex flex-col cursor-pointer items-center hover:text-emerald-700 ${
              popup === "sell" ?  "text-emerald-600" : "dark:text-gray-400 text-gray-600"
            }`}
          >
            <span>
              <CirclePlus />
            </span>
            <span className="text-xs">Sell</span>
          </div>
          </div>
        </SignedOut>

        <SignedIn>
          <div
            onClick={() => {
           
              handleOpenChat();
             
            }}
          >
            <div
              className={`flex cursor-pointer flex-col items-center hover:text-green-700 ${
                popup === "chat" ? "text-green-600" : "text-gray-600"
              }`}
            >
              <span className="relative inline-block w-6 h-6">
  <div className="absolute inset-0 flex items-center justify-center">
    <MessageCircle />
  </div>
  <div className="absolute top-0 right-0">
    <Unreadmessages userId={userId} />
  </div>
</span>

              <span className="text-xs">Chat</span>
            </div>
          </div>
        </SignedIn>

        <SignedOut>
          <div
            onClick={() => {
              handleOpenP();
                router.push("/sign-in");
            }}
          >
            <div
              className={`flex flex-col cursor-pointer items-center hover:text-green-700 ${
                popup === "chat" ? "text-green-600" : "text-gray-600"
              }`}
            >
             <span className="relative inline-block w-6 h-6">
  <div className="absolute inset-0 flex items-center justify-center">
  <MessageCircle />
  </div>
  <div className="absolute top-0 right-0">
    <Unreadmessages userId={userId} />
  </div>
</span>

              <span className="text-xs">Chat</span>
            </div>
          </div>
        </SignedOut>
        <SignedIn>
        <div
          className={`flex flex-col cursor-pointer items-center hover:text-green-700 ${
            popup === "settings" ? "text-green-600" : "text-gray-600"
          }`}
          onClick={handleOpenSettings}
        >
          <span>
            <User />
          </span>
          <span className="text-xs">Profile</span>
        </div>
        </SignedIn>
        <SignedOut>
        <div
          className={`flex flex-col cursor-pointer items-center hover:text-green-700 ${
            popup === "settings" ? "text-green-600" : "text-gray-600"
          }`}
          onClick={() => {
            handleOpenP();
            router.push("/sign-in");
        }}
        >
          <span>
            <PersonOutlineOutlinedIcon />
          </span>
          <span className="text-xs">Profile</span>
        </div>
        </SignedOut>
       
      </div>
     
    </nav>
  );
};

export default BottomNavigation;
