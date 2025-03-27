// components/ChatWindow.js
"use client";
import React, { useEffect, useState } from "react";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import Image from "next/image";
import CreateCategoryForm from "./CreateCategoryForm";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import CreateSubCategoryForm from "./CreateSubCategoryForm";
import PackageForm from "./packageForm";
import { IPackages } from "@/lib/database/models/packages.model";

import { Toaster } from "../ui/toaster";
import { FreePackId, mode } from "@/constants";
import { getAllPackages } from "@/lib/actions/packages.actions";
import { getData } from "@/lib/actions/transactions.actions";
import DashboardSellMain from "./DashboardSellMain";
import { getallcategories } from "@/lib/actions/subcategory.actions";
import Navbar from "./navbar";
import CircularProgress from "@mui/material/CircularProgress";
import BottomNavigation from "./BottomNavigation";

//import { getAllPackages, getData } from "@/lib/api";

interface WindowProps {
  isOpen: boolean;
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenSell: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenChat: () => void;
  handlePay:(id:string)=> void;
  handleCategory:(value:string)=> void;
  type: string;
  userId: string;
  userName: string;
  handleOpenShop: (shopId:string) => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handleOpenSearchTab:(value:string)=> void;
}

const PopupSell = ({ isOpen, type, userId, userName, handleOpenSettings,
  handleOpenShop,handleOpenSearchTab,
  handleOpenPerfomance, handleCategory, handleOpenChat, onClose,handleOpenPlan, handleOpenBook, handleOpenSell, handlePay, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety }: WindowProps) => {
  const [subscription, setSubscription] = useState<any>(null);
  const [packagesList, setPackagesList] = useState<IPackages[]>([]);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [remainingAds, setRemainingAds] = useState(0);
  const [listed, setListed] = useState(0);
  const [planPackage, setPlanPackage] = useState("Free");
  const [planId, setPlanId] = useState(FreePackId);
  const [priority, setPriority] = useState(0);
  const [adStatus, setAdStatus] = useState("Pending");
  const [color, setColor] = useState("#000000");
   const [loading, setLoading] = useState<boolean>(true);
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    if (isOpen && userId) {
      const fetchData = async () => {
        try {
          setLoading(true);
        const category = await getallcategories();
        setCategories(category);

          const packages = await getAllPackages();
          setPackagesList(packages);
          const subscriptionData = await getData(userId);
          if (subscriptionData) {
            setSubscription(subscriptionData);
            const listedAds = subscriptionData.ads || 0;
            setListed(listedAds);
            setRemainingAds(Number(subscriptionData.currentpack.list) - listedAds);
            setPriority(Number(subscriptionData.currentpack.priority));
            setColor(subscriptionData.currentpack.color);
            setPlanPackage(subscriptionData.currentpack.name);
            setPlanId(subscriptionData.transaction?.planId || FreePackId);
            const createdAtDate = new Date(subscriptionData.transaction?.createdAt || new Date());
            const periodDays = parseInt(subscriptionData.transaction?.period) || 0;
            const expiryDate = new Date(createdAtDate.getTime() + periodDays * 24 * 60 * 60 * 1000);
            setExpirationDate(expiryDate);
            const currentDate = new Date();
            const remainingDays = Math.ceil((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
            setDaysRemaining(remainingDays);
            if ((remainingDays > 0 && remainingAds > 0) || (remainingAds > 0 && planPackage === "Free")) {
              setAdStatus("Active");
            }
          }
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
                        <Navbar userstatus={"User"} userId={userId} onClose={onClose} popup={"sell"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
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
                          <footer>
                                                         
                                                         <div className="lg:hidden mt-0">
                                                           <BottomNavigation userId={userId} 
                                                           popup={"sell"}
                                                           onClose={onClose} 
                                                           handleOpenSell={handleOpenSell}
                                                           handleOpenChat={handleOpenChat}
                                                           handleOpenSearchTab={handleOpenSearchTab} />
                                                         </div>
                                                       </footer>
                       </div>
                      
                     ) : (
        <DashboardSellMain
          userId={userId}
          type={type}
          daysRemaining={daysRemaining}
          packname={planPackage}
          planId={planId}
          userName={userName}
          packagesList={packagesList}
          listed={remainingAds}
          expirationDate={expirationDate}
          priority={priority}
          adstatus={adStatus}
          categories={categories}
          onClose={onClose}
          handleOpenSell={handleOpenSell}
          handlePay={handlePay}
          popup={"sell"}
          handleOpenAbout={handleOpenAbout}
          handleOpenTerms={handleOpenTerms}
          handleOpenPrivacy={handleOpenPrivacy}
          handleOpenSafety={handleOpenSafety}
          handleOpenBook={handleOpenBook}
          handleCategory={handleCategory}
          handleOpenChat={handleOpenChat}
           handleOpenPlan={handleOpenPlan}
           handleOpenShop={handleOpenShop} 
           handleOpenPerfomance={handleOpenPerfomance}
           handleOpenSettings={handleOpenSettings} />)}
        <Toaster />
      </div>
    </div>
  );
};

export default PopupSell;
