"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Navbar from "@/components/shared/navbar";
import Ads from "@/components/shared/Ads";
import Footersub from "@/components/shared/Footersub";
import Contact from "@/components/shared/contact";
//import CollectionRelated from "@/components/shared/CollectionRelated";
import { Toaster } from "@/components/ui/toaster";
import { mode } from "@/constants";
import { ScrollArea } from "../ui/scroll-area";
import CollectionRelated from "@/components/shared/CollectionRelated";
const CollectionRelateddd = dynamic(
  () => import("@/components/shared/CollectionRelated"),
  {
    ssr: false,
    loading: () => (
      <div>
        <div className="w-full h-[300px] mb-2 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] bg-gray-200 rounded-lg flex flex-col items-center justify-center">
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
  }
);
interface AdsProps {
    userId: string;
    userName: string;
    userImage: string;
    ad: any;
    user:any;
    id: string;
    onClose: () => void;
    handleOpenAbout: () => void;
    handleOpenTerms: () => void;
    handleOpenPrivacy: () => void;
    handleOpenSafety: () => void;
    handleOpenSell: () => void;
    handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenBook: () => void;
    handleAdView: (ad:any) => void;
   handleAdEdit: (ad:any) => void;
    handlePay: (id:string) => void;
    handleSubCategory:(category: string, subcategory: string) => void;
    handleOpenReview: (value:any) => void;
    handleOpenShop: (value:string) => void;
    handleOpenChatId: (value:string) => void;
    handleOpenSettings: () => void;
    handleOpenPerfomance: () => void;
}

const AdsComponent = ({
    userId,
    userName,
    userImage,
    user,
    ad,
    id,
    onClose,
    handleOpenSell,
    handleOpenBook,
    handleOpenChat,
    handleOpenPlan,
    handleAdView,
    handleAdEdit,
    handleSubCategory,
    handleOpenAbout,
    handleOpenTerms,
    handleOpenPrivacy,
    handleOpenSafety,
    handleOpenReview,
    handleOpenShop,
    handleOpenChatId,
    handleOpenSettings,
    handleOpenPerfomance,
    handlePay,
}: AdsProps) => {
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
    <ScrollArea className="h-[100vh] bg-gray-200 p-0 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
   
      <div className="top-0 z-10 fixed w-full">
                    <Navbar user={user} userstatus={user.status} userId={userId} onClose={onClose} popup={"sell"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                    handleOpenPerfomance={handleOpenPerfomance}
                    handleOpenSettings={handleOpenSettings}
                    handleOpenAbout={handleOpenAbout}
                    handleOpenTerms={handleOpenTerms}
                    handleOpenPrivacy={handleOpenPrivacy}
                    handleOpenSafety={handleOpenSafety} 
                    handleOpenShop={handleOpenShop}/>
                   </div>
      <div className="dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] max-w-6xl mx-auto mt-[60px]">
        <Ads
          ad={ad}
          userId={userId || ""}
          userName={userName || ""}
          userImage={userImage || ""}
          onClose={onClose}
          handlePay={handlePay}
          handleSubCategory={handleSubCategory}
          handleOpenReview={handleOpenReview}
          handleOpenShop={handleOpenShop}
          handleOpenSell={handleOpenSell} 
          handleOpenPlan={handleOpenPlan}
          handleOpenSafety={handleOpenSafety}/>
        <h2 className="font-bold p-2 text-[30px]">Related Ads</h2>
        <div className="p-1 mb-24 lg:mb-0">
          <CollectionRelated
            emptyTitle="No Related Ads Found"
            emptyStateSubtext="Come back later"
            collectionType="All_Ads"
            limit={16}
            userId={userId || ""}
            userName={userName || ""}
            userImage={userImage || ""}
            categoryId={ad.subcategory.category}
            subcategory={ad.data.subcategory}
            adId={id}
            handleAdView={handleAdView}
            handleAdEdit={handleAdEdit}
            handleOpenPlan={handleOpenPlan}
          />
          <Toaster />
        </div>

        
        <div className="fixed bottom-0 left-0 right-0 dark:bg-[#233338] dark:text-gray-300 dark:lg:bg-transparent bg-gray-200 lg:bg-transparent h-auto  z-10 p-3 shadow-md flex flex-col md:flex-row justify-between items-center">
          <Contact
            ad={ad}
            userId={userId || ""}
            userName={userName || ""}
            userImage={userImage || ""}
            handleOpenReview={handleOpenReview}
            handleOpenChatId={handleOpenChatId}
            handleOpenShop={handleOpenShop}
            handleOpenPlan={handleOpenPlan}
            handleOpenSettings={handleOpenSettings} 
            handlePay={handlePay}          />
        </div>
      </div>
      <footer className="bg-white">
          <div>
            <Footersub  
      handleOpenAbout={handleOpenAbout} 
      handleOpenTerms={handleOpenTerms}
      handleOpenPrivacy={handleOpenPrivacy}
      handleOpenSafety={handleOpenSafety}/>
          </div>
        </footer>
      </ScrollArea>
  );
};

export default AdsComponent;
