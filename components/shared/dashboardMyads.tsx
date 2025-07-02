"use client";
import { IAd } from "@/lib/database/models/ad.model";
import Link from "next/link";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  formUrlQuery,
  formUrlQuerymultiple,
  removeKeysFromQuery,
} from "@/lib/utils";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import { IUser } from "@/lib/database/models/user.model";
import Footersub from "./Footersub";
import Navbar from "./navbar";
import { FreePackId, mode } from "@/constants";
import { Toaster } from "../ui/toaster";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { getData } from "@/lib/actions/transactions.actions";
import { Icon } from "@iconify/react";
import Barsscale from "@iconify-icons/svg-spinners/bars-scale";
import sixDotsScale from "@iconify-icons/svg-spinners/6-dots-scale"; // Correct import
import CollectionMyads from "./CollectionMyads";
import SellerProfile from "./SellerProfile";
import SubscriptionSkeleton from "./SubscriptionSkeleton";
import CollectionLoans from "./CollectionLoans";
import CollectionMyLoans from "./CollectionMyLoans";
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import ChecklistRtlOutlinedIcon from '@mui/icons-material/ChecklistRtlOutlined';
import SellerProfileSidebar from "./SellerProfileSidebar";
// Correct import
//const CollectionMyads = dynamic(() => import("./CollectionMyads"), {
// ssr: false,
//loading: () => (
//  <div>
//     <div className="w-full min-h-[200px] h-full flex flex-col items-center justify-center">
//           <Icon icon={sixDotsScale} className="w-10 h-10 text-gray-500" />
//      </div>
// </div>
// ),
//});

type CollectionProps = {
  userId: string;
  shopAcc: any;

  //daysRemaining?: number;
  // packname?: string;
  // color: string;
  sortby: string;
  userImage: string;
  userName: string;
  user: any;
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  queryObject: any;
  urlParamName?: string;
  loans: any;
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
  handleAdEdit: (ad: any) => void;
  handleAdView: (ad: any) => void;
  handleOpenReview: (value: any) => void;
  handleOpenChatId: (value: string) => void;
  handleOpenSettings: () => void;
  handleOpenShop: (shopId: any) => void;
  handleOpenPerfomance: () => void;
  handlePay: (id: string) => void;
};

const DashboardMyads = ({
  userId,
  //data,
  // packname,
  // daysRemaining,
  loans,
  emptyTitle,
  emptyStateSubtext,
  sortby,
  userImage,
  userName,
  collectionType,
  urlParamName,
  // isAdCreator,
  user,
  shopAcc,
  queryObject,
  handlePay,
  handleOpenReview,
  handleOpenChatId,
  handleOpenSettings,
  handleOpenShop,
  handleOpenPerfomance,
  onClose, handleOpenChat, handleOpenBook, handleOpenPlan, handleOpenSell, handleAdEdit, handleAdView, handleOpenAbout, handleOpenTerms, handleOpenPrivacy, handleOpenSafety,
}: // Accept the onSortChange prop
  CollectionProps) => {
  const [activeButton, setActiveButton] = useState(0);
  const [isVertical, setisVertical] = useState(true);
  const [loading, setLoading] = useState(false);
  const isAdCreator = userId === shopAcc._id;
  const createdAt = new Date(user.transaction?.createdAt || new Date());
  const periodInDays = parseInt(user.transaction?.period) || 0;
  const expiryDate = new Date(createdAt.getTime() + periodInDays * 24 * 60 * 60 * 1000);
  const currentTime = new Date();
  const remainingTime = expiryDate.getTime() - currentTime.getTime();
  const daysRemaining = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));


  const handleButtonClick = (index: number) => {
    setActiveButton(index);
    if (index === 0) {
      setisVertical(true);
    } else {
      setisVertical(false);
    }
  };

  const [query, setQuery] = useState("");
  const [newqueryObject, setNewqueryObject] = useState<any>(queryObject);


  const handleSortChange = (selectedOption: string) => {
    //let newUrl = "";
    if (selectedOption) {

      setNewqueryObject({
        ...queryObject, // Preserve existing properties
        sortby: selectedOption,
      });

      setActiveButton(1);

    }

  };



  //console.log("loggedId:" + loggedId);
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
          <div className="top-0 z-10 fixed w-full">
            <Navbar user={user.user ?? []} userstatus={user.user?.status ?? "User"} userId={userId} onClose={onClose} popup={"shop"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
              handleOpenPerfomance={handleOpenPerfomance}
              handleOpenSettings={handleOpenSettings}
              handleOpenAbout={handleOpenAbout}
              handleOpenTerms={handleOpenTerms}
              handleOpenPrivacy={handleOpenPrivacy}
              handleOpenSafety={handleOpenSafety}
              handleOpenShop={handleOpenShop} />
          </div>
          <div className="lg:p-4 mt-[50px]">
            <div className="w-full flex flex-col">
              <div className="w-full flex">
                <div className="hidden lg:inline">
                  <div className="w-full">

                    <div className="flex mt-0 lg:mt-0 gap-1 flex-col border rounded-lg flex justify-center items-center w-full h-full">

                      <SellerProfileSidebar
                        user={shopAcc}
                        loggedId={userId}
                        userId={shopAcc._id}
                        daysRemaining={daysRemaining}
                        pack={user.currentpack.name || "Free"}
                        color={user.currentpack.color || "#000000"}
                        handleOpenReview={handleOpenReview}
                        handleOpenChatId={handleOpenChatId}
                        handleOpenSettings={handleOpenSettings}
                        handleOpenPlan={handleOpenPlan}
                        handlePay={handlePay} />
                      {/* <SellerProfile
                        user={shopAcc}
                        loggedId={userId}
                        userId={shopAcc._id}
                        handleOpenReview={handleOpenReview}
                        handleOpenChatId={handleOpenChatId}
                        handleOpenSettings={handleOpenSettings}
                        handlePay={handlePay}
                      />*/}
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-h-screen">
                  <div className="p-1 lg:hidden">
                    <div className="flex flex-col gap-1 w-full ">

                      <SellerProfileSidebar
                        user={shopAcc}
                        loggedId={userId}
                        userId={shopAcc._id}
                        daysRemaining={daysRemaining}
                        pack={user.currentpack.name || "Free"}
                        color={user.currentpack.color || "#000000"}
                        handleOpenReview={handleOpenReview}
                        handleOpenChatId={handleOpenChatId}
                        handleOpenSettings={handleOpenSettings}
                        handleOpenPlan={handleOpenPlan}
                        handlePay={handlePay} />
                    </div>
                  </div>
                  <div className="lg:flex-row lg:m-1 justify-center">
                    <section className="p-1">
                      <CollectionMyads
                        emptyTitle="No ads have been created yet"
                        emptyStateSubtext="Go create some now"
                        collectionType="Ads_Organized"
                        limit={20}
                        sortby={sortby}
                        urlParamName="adsPage"
                        userId={shopAcc._id}
                        userName={userName}
                        userImage={userImage}
                        isAdCreator={isAdCreator}
                        isVertical={isVertical}
                        loadPopup={loading}
                        handleAdView={handleAdView}
                        handleAdEdit={handleAdEdit}
                        handleOpenPlan={handleOpenPlan}
                        handleOpenChatId={handleOpenChatId}
                        loans={loans}
                      />





                    </section>
                  </div>
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
              handleOpenSafety={handleOpenSafety} />
          </footer>
        </div>
      </div >
    </>
  );
};

export default DashboardMyads;
