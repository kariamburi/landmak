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
type navprop = {
  userId: string;
  popup: string;
  onClose: () => void;
  handleOpenSell: () => void;
  handleOpenChat: () => void;
  handleOpenSearchTab: (value:string) => void;

};
const BottomNavigation = ({ userId, popup, handleOpenSearchTab, handleOpenSell, handleOpenChat, onClose }: navprop) => {
  const router = useRouter();
  const pathname = usePathname();
 
  const isActive = (path: string) => pathname === path;
  const shareUrl = "https://landmak.co.ke"; // Replace with the URL you want to share

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out LandMak",
          text: "I found this amazing site for property classification!",
          url: shareUrl,
        });
        console.log("Share was successful.");
      } catch (error) {
        console.error("Sharing failed:", error);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      console.log("Share not supported on this browser.");
      // You can also show a modal or a tooltip with the URL or instructions here.
    }
  };
  return (
    <nav className="fixed dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] bottom-0 z-5 w-full bg-white shadow-md border-t dark:border-gray-700 border-gray-200">
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
              <HomeIcon />
            </span>
            <span className="text-xs">Home</span>
          </div>
        </div>

        <div
          onClick={() => {
            handleOpenSearchTab('Property');
           // if (
//pathname !==
//`/category?category=Vehicle&subcategory=${encodeURIComponent(
             //   "Cars, Vans & Pickups"
             // )}`
            //) {
            //   setIsOpenP(true);
            //  router.push(
              //  `/category?category=Vehicle&subcategory=${encodeURIComponent(
            //      "Cars, Vans & Pickups"
              //  )}`
             // );
            //}
          }}
        >
          <div
            className={`flex flex-col cursor-pointer items-center hover:text-green-700 ${
              popup === "category" ?  "text-green-600" : "text-gray-600"
            }`}
          >
            <span>
              <SearchOutlinedIcon />
            </span>
            <span className="text-xs">Search</span>
          </div>
        </div>

        {/* Sell Button */}

        <SignedIn>
          <div
            onClick={() => {
              handleOpenSell();
              //if (pathname !== "/ads/create") {
              //  setIsOpenP(true);
              //  router.push("/ads/create");
              //}
            }}
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="flex justify-center cursor-pointer items-center w-16 h-16 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 active:bg-emerald-800 transition duration-200">
                <AddCircleOutlineOutlinedIcon className="text-3xl" />
              </div>
            </div>
          </div>
        </SignedIn>

        <SignedOut>
          <div
            onClick={() => {
             // if (pathname !== "/sign-in") {
              //  setIsOpenP(true);
                router.push("/sign-in");
//}
            }}
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="flex justify-center cursor-pointer items-center w-16 h-16 bg-green-600 text-white rounded-full shadow-lg hover:bg-emerald-700 active:bg-emerald-800 transition duration-200">
                <AddCircleOutlineOutlinedIcon className="text-3xl" />
              </div>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <div
            onClick={() => {
             // if (pathname !== "/chat") {
              handleOpenChat();
              //  router.push("/chat");
             // }
            }}
          >
            <div
              className={`flex cursor-pointer flex-col items-center hover:text-green-700 ${
                popup === "chat" ? "text-green-600" : "text-gray-600"
              }`}
            >
              <span className="flex">
                <CommentOutlinedIcon />
                <Unreadmessages userId={userId} />
              </span>
              <span className="text-xs">Chat</span>
            </div>
          </div>
        </SignedIn>

        <SignedOut>
          <div
            onClick={() => {
             // if (pathname !== "/sign-in") {
              //  setIsOpenP(true);
                router.push("/sign-in");
            //  }
            }}
          >
            <div
              className={`flex flex-col cursor-pointer items-center hover:text-green-700 ${
                popup === "chat" ? "text-green-600" : "text-gray-600"
              }`}
            >
              <span className="flex">
                <CommentOutlinedIcon />
                <Unreadmessages userId={userId} />
              </span>
              <span className="text-xs">Chat</span>
            </div>
          </div>
        </SignedOut>

        <div
          className={`flex flex-col cursor-pointer items-center hover:text-green-700 ${
            popup === "share" ? "text-green-600" : "text-gray-600"
          }`}
          onClick={handleShare}
        >
          <span>
            <ShareOutlinedIcon />
          </span>
          <span className="text-xs">Share</span>
        </div>
      </div>
     
    </nav>
  );
};

export default BottomNavigation;
