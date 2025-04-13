"use client";
import { IAd } from "@/lib/database/models/ad.model";
import { CreateUserParams } from "@/types";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import CollectionBookmark from "./CollectionBookmark";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { mode } from "@/constants";
import Navbar from "./navbar";
import { Toaster } from "../ui/toaster";
import Footersub from "./Footersub";
import { ScrollArea } from "../ui/scroll-area";

type CollectionProps = {
  userId: string;
  user: CreateUserParams;
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  urlParamName?: string;
  collectionType?: "Ads_Organized" | "My_Tickets" | "All_Ads";
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenSell: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleAdEdit: (ad:any) => void;
  handleAdView: (ad:any) => void;
  handleOpenShop: (value:any) => void;
  handleOpenChatId: (value:string) => void;
  handleOpenSettings: () => void;
  handleOpenPerfomance: () => void;
};

const DashboardBookmark = ({
  userId,
  user,
  emptyTitle,
  emptyStateSubtext,
  collectionType,
  urlParamName,
  handleOpenShop,
  handleOpenChatId,
  handleOpenSettings,
  handleOpenPerfomance,
  onClose, handleOpenBook,handleOpenChat, handleAdView, handleAdEdit, handleOpenSell, handleOpenPlan, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety
}: // Accept the onSortChange prop
CollectionProps) => {
  const [isVertical, setisVertical] = useState(true);
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
     <ScrollArea className="h-[100vh] bg-gray-200 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
       
      <div className="z-10 top-0 fixed w-full">
            <Navbar user={user} userstatus={user.status} userId={userId} onClose={onClose} handleOpenSell={handleOpenSell} handleOpenPlan={handleOpenPlan} popup={"bookmark"} handleOpenBook={handleOpenBook} handleOpenChat={handleOpenChat}
             handleOpenPerfomance={handleOpenPerfomance}
             handleOpenSettings={handleOpenSettings}
             handleOpenAbout={handleOpenAbout}
             handleOpenTerms={handleOpenTerms}
             handleOpenPrivacy={handleOpenPrivacy}
             handleOpenSafety={handleOpenSafety} 
             handleOpenShop={handleOpenShop}/>
          </div>
      <div className="min-h-screen mt-[60px]">
      <div className="max-w-6xl mx-auto flex mt-3 p-1">
        <div className="flex-1">
          <div className="max-w-6xl mx-auto lg:flex-row mt-2 p-1 justify-center">
            <section className="bg-grey-50 bg-dotted-pattern bg-cover bg-center py-0 md:py-0 rounded-sm">
              <div className="wrapper flex gap-1 items-center justify-center">
                <BookmarkIcon />
                <h3 className="font-bold text-[25px] sm:text-left">Bookmark</h3>
              </div>
            </section>
            <section className=" my-2">
              <CollectionBookmark
                emptyTitle="No Saved Ad"
                emptyStateSubtext="Go and bookmark your favorite ads"
                collectionType="Ads_Organized"
                limit={20}
                urlParamName="adsPage"
                userId={userId}
                isAdCreator={false}
                isVertical={isVertical}
                handleAdView={handleAdView}
                handleAdEdit={handleAdEdit}
                handleOpenPlan={handleOpenPlan}
              />
            </section>
          </div>
        </div>
      </div>
      <Toaster />
      </div>
      <footer>
        <Footersub
        handleOpenAbout={handleOpenAbout}
         handleOpenTerms={handleOpenTerms}
         handleOpenPrivacy={handleOpenPrivacy}
         handleOpenSafety={handleOpenSafety}/>
      </footer>
    </ScrollArea>
    </>
  );
};

export default DashboardBookmark;
