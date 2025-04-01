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
  handleAdView: (id:string) => void;
  handleAdEdit: (id:string) => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenShop: (shopId:string) => void;
  handleCategory: (value:string) => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handleOpenSearchTab: (value:string) => void;
  userId: string;
  userName: string;
  userImage:string;
  queryObject: any;
}

const PopupCategory = ({
  isOpen,
  queryObject,
  userId,
  userName,
  userImage,
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
  handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety,handleOpenPlan,handleOpenChat,
}: WindowProps) => {
  const [categoryList, setCategoryList] = useState<any>([]);
  const [subcategoryList, setsubCategoryList] = useState<any>([]);
  const [adsCount, setAdsCount] = useState<any>([]);
  const [AdsCountPerRegion, setAdsCountPerRegion] = useState<any>([]);
  const [AdsCountPerVerifiedTrue, setAdsCountPerVerifiedTrue] = useState<any>([]);
  const [AdsCountPerVerifiedFalse, setAdsCountPerVerifiedFalse] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoryData = await getAllCategories();
        setCategoryList(categoryData);

        const subcategoryData = await getAllSubCategories();
        setsubCategoryList(subcategoryData);

        const { category, subcategory } = queryObject;

        if (subcategory) {
          const getFieldsByCategoryAndSubcategory = (
            categoryName: string,
            subcategory: string,
            data: any
          ) => {
            return data
              .filter(
                (item: any) =>
                  item.category.name === categoryName &&
                  item.subcategory === subcategory
              )
              .map((item: any) => item.fields);
          };

          let adsCount: any = [];
          const dataString = getFieldsByCategoryAndSubcategory(
            category,
            subcategory,
            categoryData
          );
          const newfields = dataString[0]
            .filter((item: any) =>
              [
                "autocomplete",
                "radio",
                "multi-select",
                "select",
                "related-autocompletes",
                "year",
                "checkbox",
              ].includes(item.type)
            )
            .map((item: any) => item.name);

          let fields = newfields.flatMap((field: any) =>
            field === "make-model" ? ["make", "model"] : field
          );

          adsCount = await getAdsCount(category, subcategory, fields);
          setAdsCount(adsCount);
        }

        const [region, verifiedTrue, verifiedFalse] = await Promise.all([
          getAdsCountPerRegion(category, subcategory),
          getAdsCountPerVerifiedTrue(category, subcategory),
          getAdsCountPerVerifiedFalse(category, subcategory),
        ]);

        setAdsCountPerRegion(region);
        setAdsCountPerVerifiedTrue(verifiedTrue);
        setAdsCountPerVerifiedFalse(verifiedFalse);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, queryObject]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white rounded-0 p-1 w-full h-[100vh] flex flex-col">
        {loading ? (
          <div className="h-screen w-full bg-gray-200"> 
          <div className="top-0 z-10 fixed w-full">
           <Navbar userstatus="User" userId={userId} onClose={onClose} popup={"category"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
            handleOpenShop={handleOpenShop} 
            handleOpenPerfomance={handleOpenPerfomance}
            handleOpenSettings={handleOpenSettings} 
            handleOpenAbout={handleOpenAbout} 
            handleOpenTerms={handleOpenTerms}
            handleOpenPrivacy={handleOpenPrivacy}
            handleOpenSafety={handleOpenSafety}
            />
          </div>
           <div className="flex justify-center items-center h-full text-lg font-bold">
           <div className="flex gap-2 items-center">  <CircularProgress sx={{ color: "gray" }} size={30} /> <div className="hidden lg:inline">Loading...</div></div>
          </div>
           <footer>
                                  
                                   <div className="lg:hidden mt-0">
                                     <BottomNavigation userId={userId} 
                                     popup={"category"}
                                     onClose={onClose} 
                                     handleOpenSell={handleOpenSell}
                                     handleOpenChat={handleOpenChat}
                                     handleOpenSearchTab={handleOpenSearchTab} />
                                   </div>
                                 </footer>
          </div>
         
        ) : (
          <MainCategory
            userId={userId}
            userName={userName}
            userImage={userImage}
            emptyTitle="No ads have been created yet"
            emptyStateSubtext="Go create some now"
            limit={20}
            categoryList={categoryList}
            subcategoryList={subcategoryList}
            queryObject={queryObject}
            AdsCountPerRegion={AdsCountPerRegion}
            AdsCountPerVerifiedTrue={AdsCountPerVerifiedTrue}
            AdsCountPerVerifiedFalse={AdsCountPerVerifiedFalse}
            adsCount={adsCount}
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
          />
        )}
        <Toaster />
      </div>
    </div>
  );
};

export default PopupCategory;
