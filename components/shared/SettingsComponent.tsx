"use client"
import Navbar from "@/components/shared/navbar";
import { getUserById } from "@/lib/actions/user.actions";
import { Toaster } from "@/components/ui/toaster";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { auth } from "@clerk/nextjs/server";
import Verification from "@/components/shared/Verification";
import Image from "next/image";
import BottomNavigation from "@/components/shared/BottomNavigation";
import Footersub from "@/components/shared/Footersub";
import SettingsEdit from "./SettingsEdit";
import { useEffect, useState } from "react";
import { mode } from "@/constants";
import { ScrollArea } from "../ui/scroll-area";

type setingsProp = {
 
  userId: string;
  user: any;
  handleOpenSell:() => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  onClose:() => void;
  handleOpenAbout:() => void;
  handleOpenTerms: () => void;
handleOpenPrivacy: () => void;
handleOpenSafety: () => void;
handleOpenSettings: () => void;
  handleOpenShop: (shopId:string) => void;
  handlePay: (id:string) => void;
  handleCategory: (value:string) => void;
  handleOpenPerfomance: () => void;
};

const SettingsComponent = ({userId,user,onClose,
  handleOpenShop,
  handleOpenPerfomance, 
  handleOpenSettings,
  handleOpenSell,
  handleOpenBook,
  handleOpenChat,
  handlePay,
  handleCategory,
  handleOpenPlan, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety}:setingsProp) => {
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
    
  const isAdCreator = true;
  return (
      <ScrollArea className="h-[100vh] bg-gray-200 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
       
      <div className="top-0 z-10 fixed w-full">
                              <Navbar userstatus={user.status} userId={userId} onClose={onClose} popup={"settings"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                              handleOpenPerfomance={handleOpenPerfomance}
                              handleOpenSettings={handleOpenSettings}
                              handleOpenAbout={handleOpenAbout}
                              handleOpenTerms={handleOpenTerms}
                              handleOpenPrivacy={handleOpenPrivacy}
                              handleOpenSafety={handleOpenSafety} 
                              handleOpenShop={handleOpenShop}/>
                             </div>
      <div className="max-w-3xl mx-auto flex mt-[80px] lg:mt-[60px] p-1 min-h-screen">
        <div className="hidden lg:inline mr-5"></div>

        <div className="flex-1">
          <div className="w-full lg:max-w-6xl lg:mx-auto lg:mb-3 dark:bg-[#2D3236] p-1 mb-20 justify-center">
            <section className="w-full p-0">
              <div className="w-full flex flex-col lg:flex-row lg:justify-between">
                <div className="flex text-lg mb-1 gap-1 font-bold">
                  <SettingsOutlinedIcon />
                  <h3 className="font-bold text-[25px]">Settings</h3>
                </div>
                <div className="flex">
                  <Verification
                    user={user}
                    userId={userId}
                    isAdCreator={isAdCreator}
                    handlePayNow={handlePay}
                  />
                </div>
              </div>
            </section>

            <SettingsEdit user={user} type="Update" userId={userId} />
            <Toaster />
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
       
      </footer>
    </ScrollArea>
  );
};
export default SettingsComponent;
