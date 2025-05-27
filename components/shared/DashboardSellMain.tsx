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
  user: any;
 // daysRemaining: number;
  userImage?: string;
  userName: string;
  type: string;
  ad?: any;
  adId?: string;
  category?:string;
  subcategory?:string;
  packagesList:any;
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenChat: () => void;
  handleOpenPlan: () => void;
  handleOpenSell: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleAdView: (ad:any) => void;
  handleCategory:(value:string) => void;
  handlePay?:(id:string) => void;
  popup:string;
  subcategoryList:any;
  handleOpenShop: (shopId:any) => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
};
const DashboardSellMain = ({
  userId,
  user,
  userImage,
  userName,
  packagesList,
  type,
  ad,
  adId,
  category,
  subcategory,
  subcategoryList,
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
  <div className="h-[100vh] bg-[#e4ebeb] p-0 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] overflow-hidden">
    <div className="h-full overflow-y-auto bg-[#e4ebeb] border">
       <style jsx>{`
    @media (max-width: 1024px) {
      div::-webkit-scrollbar {
        display: none;
      }
    }
  `}</style>   
      <div className="z-10 top-0 fixed w-full">
    <Navbar
      user={user?.user ?? []}
      userstatus={user.user?.status ?? "User"}
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
  
  <div className="flex flex-col justify-center w-full h-full mt-[50px]">
      
  <div className="p-1 lg: p-2 flex min-h-[100vh] flex-col w-full lg:max-w-3xl lg:mx-auto h-full rounded-lg">
   
              <EventForm
                userId={userId}
                type={type}
                ad={ad}
                categories={subcategoryList}
                adId={adId}
                user={user}
                userName={userName}
                category={category}
                subcategory={subcategory}
                handleOpenShop={handleOpenShop}
                userImage={userImage}
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
</div></div>

    </>
  );
};

export default DashboardSellMain;
