"use client";
import EventForm from "@/components/shared/EventForm";
import { IAd } from "@/lib/database/models/ad.model";
import Footersub from "./Footersub";
import BottomNavigation from "./BottomNavigation";
import Navbar from "./navbar";
import { useEffect, useState } from "react";
import { mode } from "@/constants";
import { ScrollArea } from "../ui/scroll-area";
type Package = {
  imageUrl: string;
  name: string;
  _id: string;
  description: string;
  price: string[];
  features: string[];
  color: string;
};
type dashboardProps = {
  userId: string;
  planId: string;
  daysRemaining: number;
  packname: string;
  userName: string;
  type: string;
  ad?: any;
  adId?: string;
  packagesList: any;
  listed: number;
  priority: number;
  expirationDate: Date;
  adstatus: string;
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenChat: () => void;
  handleOpenPlan: () => void;
  handleOpenSell: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleAdView?:(id:string) => void;
  handleCategory:(value:string) => void;
  handlePay?:(id:string) => void;
  popup:string;
  categories:any;
  handleOpenShop: (shopId:string) => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
};
const DashboardSellMain = ({
  userId,
  planId,
  packname,
  userName,
  daysRemaining,
  type,
  ad,
  adId,
  packagesList,
  listed,
  priority,
  expirationDate,
  adstatus,
  categories,
  onClose,
  handleCategory,
  handleOpenSell,
  handleOpenBook,
  handleOpenPlan,
  handleOpenChat,
  handleAdView,
  handlePay,
  handleOpenAbout,
  handleOpenTerms,
  handleOpenPrivacy,
  handleOpenSafety,
  handleOpenSettings,
  handleOpenShop,
  handleOpenPerfomance,
  popup,
}: dashboardProps) => {
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
    <>
   <ScrollArea className="h-[100dvh] bg-gray-200 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
       
      <div className="z-10 top-0 fixed w-full">
    <Navbar
      userstatus="User"
      userId={userId}
      onClose={onClose}
      popup={popup}
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
      handleOpenSafety={handleOpenSafety}
    />
  </div>
  
  <div className="flex flex-col justify-center w-full h-full pt-[60px]">
      
  <div className="p-1 lg:p-2 flex min-h-[100dvh] flex-col w-full lg:max-w-3xl lg:mx-auto h-full rounded-lg">
   
              <EventForm
                userId={userId}
                type={type}
                ad={ad}
                categories={categories}
                adId={adId}
                planId={planId}
                userName={userName}
                daysRemaining={daysRemaining}
                packname={packname}
                listed={listed}
                priority={priority}
                expirationDate={expirationDate}
                adstatus={adstatus}
                packagesList={packagesList}
                handleAdView={handleAdView}
                handlePay={handlePay}
                handleOpenTerms={handleOpenTerms}
              />
            </div>

    <footer className="mt-10">
      <div>
        <div className="hidden lg:inline">
          <Footersub
            handleOpenAbout={handleOpenAbout}
            handleOpenTerms={handleOpenTerms}
            handleOpenPrivacy={handleOpenPrivacy}
            handleOpenSafety={handleOpenSafety}
          />
        </div>
      </div>
    </footer>
  </div>
</ScrollArea>

    </>
  );
};

export default DashboardSellMain;
