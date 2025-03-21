// components/ChatWindow.js
"use client";
import React, { useEffect, useState } from "react";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import Image from "next/image";
import CreateCategoryForm from "./CreateCategoryForm";

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
import SellerProfile from "./SellerProfile";
import ReviewsBox from "./ReviewsBox";
import SendReviewMyAds from "./SendReviewMyAds";
import { ScrollArea } from "../ui/scroll-area";
import ReviewSection from "./ReviewSection";

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
   handleOpenSettings: () => void;
    handleOpenChatId: (value:string) => void;
    handleOpenReview: (value:string) => void;
  handleOpenShop: (shopId:string) => void;
  handleOpenPerfomance: () => void;
  handlePay: (id:string) => void;
  handleCategory: (value:string) => void;
  userImage: string;
  userId: string;
  userName: string;
  recipientUid:string;
}

const PopupReviews = ({ isOpen, userId,userName,userImage,recipientUid, onClose,handlePay, handleOpenShop, handleOpenPerfomance, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety, handleOpenBook,handleOpenPlan, handleOpenSell, handleOpenSettings,handleOpenReview,handleOpenChat,handleOpenChatId, }: WindowProps) => {
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
                  <Navbar userstatus={"User"} userId={userId} onClose={onClose} popup={"reviews"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
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
                
               ) : (<>
            
          <div className="h-[100vh] bg-gray-200 p-0 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
                 
                <div className="top-0 z-10 fixed w-full">
                  <Navbar userstatus={user.status} userId={userId} onClose={onClose} popup={"reviews"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings}
                  handleOpenAbout={handleOpenAbout}
                  handleOpenTerms={handleOpenTerms}
                  handleOpenPrivacy={handleOpenPrivacy}
                  handleOpenSafety={handleOpenSafety} 
                  handleOpenShop={handleOpenShop}/>
                 </div>
                <div className="w-full flex mt-[60px] p-1">

                <ReviewSection
                displayName={userName}
                uid={userId}
                photoURL={userImage}
                recipientUid={recipientUid}
                recipient={user}
                handleOpenReview={handleOpenReview} 
                handleOpenChatId={handleOpenChatId} 
                handleOpenSettings={handleOpenSettings}
                handlePay={handlePay}
                />

<Toaster />
                </div>
              </div>
          </>  )}
     
        <Toaster />
      </div>
    </div>
  );
};

export default PopupReviews;
