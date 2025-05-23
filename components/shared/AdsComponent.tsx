"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Navbar from "@/components/shared/navbar";
import Ads from "@/components/shared/Ads";
import Footersub from "@/components/shared/Footersub";
import Contact from "@/components/shared/contact";
//import CollectionRelated from "@/components/shared/CollectionRelated";
import { Toaster } from "@/components/ui/toaster";
import { mode } from "@/constants";
//import { ScrollArea } from "../ui/scroll-area";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import CollectionRelated from "@/components/shared/CollectionRelated";
import ChatButtonBottom from "./ChatButtonBottom";
const CollectionRelateddd = dynamic(
  () => import("@/components/shared/CollectionRelated"),
  {
    ssr: false,
    loading: () => (
      <div>
        <div className="w-full h-[300px] mb-2 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] bg-[#e4ebeb] rounded-lg flex flex-col items-center justify-center">
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
    handleOpenSell: (category?:string, subcategory?:string) => void;
    handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenBook: () => void;
    handleAdView: (ad:any) => void;
   handleAdEdit: (ad:any) => void;
    handlePay: (id:string) => void;
    handleSubCategory:(category: string, subcategory: string) => void;
    handleOpenReview: (value:any) => void;
    handleOpenShop: (value:any) => void;
    handleOpenChatId: (value:any) => void;
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
 const [showBottomNav, setShowBottomNav] = useState(true);
 const [isOpenEnquire, setIsOpenEnquire] = useState(false);
    const handleCloseEnquire = () => {
      setIsOpenEnquire(false);
    };
    const handleOpenEnquire = () => {
      setIsOpenEnquire(true);
    };
  const scrollRefB = useRef<HTMLDivElement>(null);
const lastScrollTop = useRef(0);
const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
const SCROLL_THRESHOLD = 100; // pixels
  useEffect(() => {
    const timer = setTimeout(() => {
      const el = scrollRefB.current;
      if (el) {
       
      const handleScroll = () => {
      const currentScrollTop = el.scrollTop;
      const scrollDiff = currentScrollTop - lastScrollTop.current;
  
      // Ignore small scrolls
      if (Math.abs(scrollDiff) < SCROLL_THRESHOLD) return;
  
      if (scrollDiff > 0) {
        // Scrolling down
        setShowBottomNav(false);
      } else {
        // Scrolling up
        setShowBottomNav(true);
      }
  
      lastScrollTop.current = currentScrollTop;
    };
        el.addEventListener('scroll', handleScroll);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
    <ScrollArea.Root className="h-[100vh] bg-[#e4ebeb] p-0 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] overflow-hidden">
    <ScrollArea.Viewport ref={scrollRefB} className="h-full overflow-y-auto bg-[#e4ebeb] border">
         
      <div className="top-0 z-10 fixed w-full">
                    <Navbar user={user?? []} userstatus={user?.status ?? "User"} userId={userId} onClose={onClose} popup={"sell"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
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
          user={user}
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
            handleOpenChatId={handleOpenChatId}
            handleAdView={handleAdView}
            handleAdEdit={handleAdEdit}
            handleOpenPlan={handleOpenPlan}
          />
        {isOpenEnquire && (<ChatButtonBottom
                        ad={ad}
                        userId={userId}
                        userImage={userImage}
                        userName={userName}
                        handleCloseEnquire={handleCloseEnquire}
                      />)}   
          <Toaster />
        </div>

        <div
                 className={`fixed bottom-0 left-0 right-0 dark:bg-[#233338] dark:text-gray-300 dark:lg:bg-transparent bg-[#e4ebeb] lg:bg-transparent h-auto  z-10 p-3 shadow-md flex flex-col md:flex-row justify-between items-center transition-transform duration-300 ${
                   showBottomNav ? "translate-y-0" : "translate-y-full"
                 }`}
               >
       
          <Contact
            ad={ad}
            handleOpenEnquire={handleOpenEnquire}
            user={user}
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
   </ScrollArea.Viewport>
       <ScrollArea.Scrollbar orientation="vertical" />
         <ScrollArea.Corner />
       </ScrollArea.Root>
  );
};

export default AdsComponent;
