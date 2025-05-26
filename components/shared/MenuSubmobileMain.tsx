"use client";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import {
  formUrlQuery,
  formUrlQuerymultiple,
  removeKeysFromQuery,
} from "@/lib/utils";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Image from "next/image";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import SubCategoryWindow from "./SubCategoryWindow";
import { useState } from "react";
import ProgressPopup from "./ProgressPopup";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
type Subcategory = {
  title: string;
};

type Category = {
  adCount: number;
  _id: string;
  name: string;
  subcategory: string;
  fields: any;
  imageUrl: string;
};

type MobileProps = {
  categoryList: Category[];
  subcategoryList: any;
   handleSubCategory: (category:string, subcategory:string) => void;
  handleOpenSell: (category?:string, subcategory?:string) => void;
  userId:string;
  handleOpenChat: () => void;
  handleCategory:(value:string)=> void;
  handleOpenSearchTab:(value:string)=> void;
  handleOpenSettings: () => void;
  handlePayNow:(id:string)=> void;
  loans:any;
  user:any;
  packagesList:any;
};

export default function MenuSubmobileMain({
  categoryList,
  subcategoryList,
  handleSubCategory,
  userId,
  handleOpenChat,
  handleOpenSell,
  handlePayNow,
  handleCategory,
  handleOpenSearchTab,
  handleOpenSettings,
packagesList,
  user,
  loans,
}: MobileProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

 
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("");
  const handleOpen = (query: string) => {
    setIsOpen(true);
    setCategory(query);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const [isOpenP, setIsOpenP] = useState(false);
  const handleOpenP = (query: string) => {
    setIsOpenP(true);
  };

  const handleCloseP = () => {
    setIsOpenP(false);
  };
  return (
    <div className="mx-auto">
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-7 m-0 gap-1">
        <SignedIn>
          <div
            onClick={() => {
              handleOpenSell();
            }}
            className="h-[140px] shadow-sm  bg-green-600 text-white flex flex-col items-center justify-center cursor-pointer rounded-sm p-1 border-0 border-green-300 hover:bg-green-700"
          >
            <div className="flex flex-col items-center text-center justify-center">
              <div className="h-12 w-12 rounded-full p-2">
              <AddOutlinedIcon/> 
              </div>
              <h2 className="text-lg font-bold">SELL</h2>
            </div>
          </div>
        </SignedIn>

        <SignedOut>
          <div
            onClick={() => {
              setIsOpenP(true);
              router.push("/sign-in");
            }}
            className="h-[140px] shadow-sm bg-green-600 text-white flex flex-col items-center justify-center cursor-pointer rounded-sm p-1 border-0 border-green-300 hover:bg-green-700"
          >
            <div className="flex flex-col items-center text-center justify-center">
              <div className="h-12 w-12 rounded-full p-2">
                <SellOutlinedIcon />
              </div>
              <h2 className="text-lg font-bold">SELL</h2>
            </div>
          </div>
        </SignedOut>

        {categoryList.map((category, index) => (
          <div
            key={index} // Using sub.title as a unique key
            // onClick={() => handleCategory(category.name)}
            onClick={() => handleOpen(category.name)}
            className="h-[140px] shadow-sm dark:bg-[#2D3236] text-black dark:text-[#F1F3F3] bg-white flex flex-col items-center justify-center cursor-pointer rounded-sm p-1 border hover:bg-emerald-100"
          >
            <div className="flex flex-col items-center text-center justify-center">
              <div className="rounded-full shadow-sm dark:bg-[#131B1E] bg-[#e4ebeb] p-2">
                <Image
                  className="w-14 h-14 object-cover"
                  src={category.imageUrl[0]}
                  alt={category.name}
                  width={60}
                  height={60}
                />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xs font-bold">{category.name}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {category.name === "Wanted Ads" ?  (category.adCount + loans.adCount): category.adCount} ads
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <SubCategoryWindow
        isOpen={isOpen}
        onClose={handleClose}
        category={category}
        subcategoryList={subcategoryList}
        userId={userId}
        handleSubCategory={handleSubCategory}
        handleOpenSell={handleOpenSell}
        handleOpenChat={handleOpenChat}
        handleCategory={handleCategory}
        handleOpenSearchTab={handleOpenSearchTab}
        handleOpenSettings={handleOpenSettings}
        loans={loans}
        user={user}
        packagesList={packagesList}
        handlePayNow={handlePayNow}
      />
      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
    </div>
  );
}
