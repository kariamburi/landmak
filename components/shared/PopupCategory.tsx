import React, { useEffect, useState } from "react";
import { Toaster } from "../ui/toaster";
import MainCategory from "./MainCategory";
import { getAllSubCategories } from "@/lib/actions/subcategory.actions";
import {
  getAdsCount,
  getAdsCountPerRegion,
  getAdsCountPerVerifiedFalse,
  getAdsCountPerVerifiedTrue,
} from "@/lib/actions/dynamicAd.actions";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import Navbar from "./navbar";
import BottomNavigation from "./BottomNavigation";
import { getAllCategories } from "@/lib/actions/category.actions";

interface WindowProps {
  isOpen: boolean;
  onClose: () => void;
  handleOpenSell: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleAdEdit: (ad:any) => void;
  handleAdView: (ad:any) => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenShop: (shopId:any) => void;
  handleCategory: (value:string) => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handleOpenSearchByTitle: () => void;
  handleOpenSearchTab: (value:string) => void;
  userId: string;
  userName: string;
  userImage:string;
  queryObject: any;
  categoryList:any;
  subcategoryList:any;
  user:any;
}

const PopupCategory = ({
  isOpen,
  queryObject,
  categoryList,
  subcategoryList,
  userId,
  userName,
  userImage,
  user,
  onClose,
  handleOpenBook,
  handleOpenSell,
  handleAdView,
  handleAdEdit,
  handleOpenShop,
  handleOpenPerfomance,
  handleOpenSettings,
  handleCategory,
  handleOpenSearchTab,
  handleOpenSearchByTitle,
  handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety,handleOpenPlan,handleOpenChat,
}: WindowProps) => {
 

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-20">
      <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white rounded-0 p-0 w-full h-[100vh] flex flex-col">
       
          <MainCategory
            userId={userId}
            userName={userName}
            userImage={userImage}
            emptyTitle="No ads have been created yet"
            emptyStateSubtext="Go create some now"
            limit={20}
            user={user}
            categoryList={categoryList}
            subcategoryList={subcategoryList}
            queryObject={queryObject}
            onClose={onClose}
            loading={false}
            handleOpenSell={handleOpenSell}
            handleAdView={handleAdView}
            handleOpenAbout={handleOpenAbout} 
      handleOpenTerms={handleOpenTerms}
      handleOpenPrivacy={handleOpenPrivacy}
      handleOpenSafety={handleOpenSafety}
      handleOpenBook={handleOpenBook}
      handleOpenPlan={handleOpenPlan}
      handleOpenChat={handleOpenChat}
      handleOpenShop={handleOpenShop} 
            handleOpenPerfomance={handleOpenPerfomance}
            handleOpenSettings={handleOpenSettings}
            handleCategory={handleCategory}
            handleAdEdit={handleAdEdit}
            handleOpenSearchTab={handleOpenSearchTab}
            handleOpenSearchByTitle={handleOpenSearchByTitle}
          />
        
        <Toaster />
      </div>
    </div>
  );
};

export default PopupCategory;
