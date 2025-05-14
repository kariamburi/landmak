"use client";
import { IAd } from "@/lib/database/models/ad.model";
import { CreateUserParams } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import CollectionBookmark from "./CollectionBookmark";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { IUser } from "@/lib/database/models/user.model";
import Link from "next/link";
import SellerProfileMobile from "./SellerProfileMobile";
import Verification from "./Verification";
import Ratingsmobile from "./ratingsmobile";
import SellerProfilePermonance from "./SellerProfilePermonance";
import Verificationmobile from "./Verificationmobile";
import { DeleteConfirmation } from "./DeleteConfirmation";
import Image from "next/image";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CallIcon from "@mui/icons-material/Call";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import SplitscreenOutlinedIcon from "@mui/icons-material/SplitscreenOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import AssistantDirectionOutlinedIcon from "@mui/icons-material/AssistantDirectionOutlined";
import LowPriorityOutlinedIcon from "@mui/icons-material/LowPriorityOutlined";
import FlightTakeoffOutlinedIcon from "@mui/icons-material/FlightTakeoffOutlined";
//import { getAdByUser } from "@/lib/actions/ad.actions";
import Footersub from "./Footersub";
import { Toaster } from "../ui/toaster";
import { mode } from "@/constants";
import Navbar from "./navbar";
import { ScrollArea } from "../ui/scroll-area";
import { getAdByUser } from "@/lib/actions/dynamicAd.actions";
import { IdynamicAd } from "@/lib/database/models/dynamicAd.model";
import { getData } from "@/lib/actions/transactions.actions";
import { Icon } from "@iconify/react";
import Barsscale from "@iconify-icons/svg-spinners/bars-scale"; 
//import sixDotsScale from "@iconify-icons/svg-spinners/6-dots-scale"; // Correct import
 // Correct import
import AdPerformanceSkeleton from "./AdPerformanceSkeleton";
import SubscriptionSkeleton from "./SubscriptionSkeleton";
type CollectionProps = {
  userId: string;
  userName: string;
  userImage: string;
  loggedId: string;
 // daysRemaining?: number;
 // packname?: string;
 // color: string;
  sortby: string;
  user: any;
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  urlParamName?: string;
  isAdCreator: boolean;
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
  handleOpenReview: (value:any) => void;
  handleOpenShop: (shopId:any) => void;
  handleOpenSettings: () => void;
  handleOpenPerfomance: () => void;
  handlePay: (id:string) => void;
};

const DashboardPerformance = ({
  userId,
  userName,
  userImage,
  sortby,
 // packname,
 // daysRemaining,
 // color,
  emptyTitle,
  emptyStateSubtext,
  collectionType,
  urlParamName,
  isAdCreator,
  user,
  loggedId,handlePay, handleOpenPerfomance, handleOpenSettings,
  handleOpenShop, handleOpenReview,
  onClose, handleOpenChat, handleOpenBook,handleOpenPlan, handleOpenSell, handleAdEdit,handleAdView, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety
}: // Accept the onSortChange prop
CollectionProps) => {
  const [activeButton, setActiveButton] = useState(0);
  const [isVertical, setisVertical] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [data, setAds] = useState<IdynamicAd[]>([]); // Initialize with an empty array
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  // const observer = useRef();
  const observer = useRef<IntersectionObserver | null>(null);
 const [loadingSub, setLoadingSub] = useState<boolean>(false);
 const createdAt = new Date(user.transaction?.createdAt || new Date());
     const periodInDays = parseInt(user.transaction?.period) || 0;
     const expiryDate = new Date(createdAt.getTime() + periodInDays * 24 * 60 * 60 * 1000);
     const currentTime = new Date();
     const remainingTime = expiryDate.getTime() - currentTime.getTime();
     const daysRemaining = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
    const planPackage = user.currentpack.name;
    const color = user.currentpack.color;
  const fetchAds = async () => {
    setLoading(true);
    try {
      const organizedAds = await getAdByUser({
        userId,
        page,
        sortby,
        myshop: isAdCreator,
      });

      // Update ads state using the latest prevAds for filtering
      setAds((prevAds: IdynamicAd[]) => {
        const existingAdIds = new Set(prevAds.map((ad) => ad._id));

        // Filter out ads that are already in prevAds
        const newAds = organizedAds?.data.filter(
          (ad: IdynamicAd) => !existingAdIds.has(ad._id)
        );

        return [...prevAds, ...newAds]; // Return updated ads
      });
      setTotalPages(organizedAds?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching ads", error);
    } finally {
      setLoading(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [page]);

  const lastAdRef = (node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page < totalPages) {
        setPage((prevPage: any) => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  };

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
  <ScrollArea className="h-[100vh] bg-[#e4ebeb] p-0 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
     
      <div className="top-0 z-10 fixed w-full">
        <Navbar user={user.user} userstatus={user.user.status} userId={userId} onClose={onClose} popup={"performance"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
         handleOpenPerfomance={handleOpenPerfomance}
         handleOpenSettings={handleOpenSettings}
         handleOpenAbout={handleOpenAbout}
         handleOpenTerms={handleOpenTerms}
         handleOpenPrivacy={handleOpenPrivacy}
         handleOpenSafety={handleOpenSafety} 
         handleOpenShop={handleOpenShop}/>
      </div>
      <div className="min-h-screen mt-[60px]">
      <div className="w-full lg:max-w-6xl mx-auto p-1">
        <section className="lg:bg-gray-50 dark:bg-[#2D3236] bg-dotted-pattern bg-cover bg-center py-0 md:py-0 rounded-sm">
          <div className="flex items-center p-1 flex-col">
            <div className="flex flex-col">
              <SellerProfilePermonance
                userId={userId}
                userName={userName}
                userImage={userImage}
                user={user.user}
                handleOpenReview={handleOpenReview}
                handleOpenShop={handleOpenShop}
                handlePay={handlePay}
              />
            </div>
            {loadingSub ? (<>   <Icon icon={Barsscale} className="w-6 h-6 text-gray-500" /></>):(<>

                             {isAdCreator &&
                             planPackage !== "Free" &&
                             daysRemaining &&
                             daysRemaining > 0 ? (
                               <>
                                

                                 <div className="w-full lg:max-w-2xl flex gap-1 w-full items-center bg-green-100 px-3 py-1 rounded-lg">
                                 <div
                                   style={{
                                     backgroundColor: color,
                                   }}
                                   className="h-5 w-5 rounded-full"
                                 ></div>
    <span className="text-sm text-green-700 font-semibold">Active | {planPackage} Plan | {daysRemaining} Days Left </span>
    <button  onClick={()=> handleOpenPlan()} className="ml-2 text-green-600 underline">Upgrade</button>
  </div>



                               </>
                             ) : (
                               <>

<div className="w-full lg:max-w-2xl flex w-full items-center gap-1 bg-green-100 px-3 py-1 rounded-lg">
<div
                                   style={{
                                     backgroundColor: color,
                                   }}
                                   className="h-5 w-5 rounded-full"
                                 ></div>
    <span className="text-sm text-green-700 font-semibold">Active | {planPackage} Plan </span>
    <button  onClick={()=> handleOpenPlan()} className="ml-2 text-green-600 underline">Upgrade</button>
  </div>

                            
                               </>
                             )}
                             </>)}
          </div>
        </section>
        <h1 className="text-3xl font-bold">Ad Performance</h1>
        <h1 className="border-b p-1 rounded-full mb-6 dark:text-gray-300 text-gray-500 text-sm">
          Total Ads: {data.length}
        </h1>

        {data.length > 0 ? (
          <div>
            {data.map((ad: any, index: number) => {
              if (data.length === index + 1) {
                return (
                  <div
                    ref={lastAdRef}
                    key={ad._id}
                    className="flex flex-col lg:flex-row gap-1 bg-white shadow-lg rounded-lg overflow-hidden mb-6 border border-[#e4ebeb]"
                  >
                    {/* Ad Image */}
                  
                    <img
                      src={ad.data.imageUrls[0] || "/default-ad-image.jpg"}
                      alt={ad.data.title}
                      className="flex w-full lg:w-64 h-40 lg:h-full object-cover"
                    />

                    <div className="flex-1 p-2 grid grid-cols-2 lg:grid-cols-3 w-full">
                      {/* 1. Ad Details */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <p className="text-xs lg:text-base font-bold mb-1 text-gray-800">
                          Ad Details
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <SplitscreenOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Title: </strong> {ad.data.title}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <ClassOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Category: </strong> {ad.data.subcategory || "N/A"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <AccessTimeIcon sx={{ fontSize: 14 }} />
                          <strong>Created Date: </strong>
                          {new Date(ad.createdAt).toLocaleDateString()}
                        </p>
                      </section>

                      {/* 2. Ad Engagement */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <p className="text-xs lg:text-base font-bold mb-1 text-gray-800">
                          Ad Engagement
                        </p>

                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <VisibilityIcon sx={{ fontSize: 14 }} />
                          <strong>Ad Views: </strong> {ad.views}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <ChatBubbleOutlineOutlinedIcon
                            sx={{ fontSize: 14 }}
                          />
                          <strong>Inquiries: </strong> {ad.inquiries || "0"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <CallIcon sx={{ fontSize: 14 }} />
                          <strong>Calls: </strong> {ad.calls || "0"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <WhatsAppIcon sx={{ fontSize: 14 }} />
                          <strong>WhatsApp: </strong> {ad.whatsapp || "0"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <ShareOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Shared: </strong> {ad.shared || "0"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <BookmarkIcon sx={{ fontSize: 14 }} />
                          <strong>Bookmarked: </strong> {ad.bookmarked || "0"}
                        </p>
                      </section>

                      {/* 3. Ad Duration & Status */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <h2 className="text-xs lg:text-base font-bold mb-1  text-gray-800">
                          Ad Status
                        </h2>

                        {ad.adstatus && (
                          <div
                            className={`flex flex-col w-[100px] text-[8px] lg:text-[10px] p-1 text-white justify-center items-center rounded-full ${
                              ad.adstatus === "Pending"
                                ? "bg-yellow-600"
                                : ad.adstatus === "Failed"
                                ? "bg-red-600 "
                                : "bg-green-600"
                            }`}
                          >
                            {ad.adstatus}
                          </div>
                        )}
                        <div className="flex mt-2 gap-4 rounded-xl p-3 shadow-sm transition-all">
                          <div 
                          onClick={()=> handleAdEdit(ad)}
                          >
                            <Image
                              src="/assets/icons/edit.svg"
                              alt="edit"
                              width={20}
                              height={20}
                            />
                          </div>
                          <DeleteConfirmation
                            adId={ad._id}
                            imageUrls={ad.data.imageUrls}
                          />
                        </div>
                      </section>

                      {/* 4. Ad Performance */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <h2 className="text-xs lg:text-base font-bold mb-1 text-gray-800">
                          Ad Performance
                        </h2>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <LowPriorityOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Priority Level: </strong>{" "}
                          {ad.priority || "N/A"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <FlightTakeoffOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Plan: </strong> {ad.plan?.name || "Free"}
                        </p>
                      </section>

                      {/* 5. Contact Info */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <h2 className="text-xs lg:text-base font-bold mb-1  text-gray-800">
                          Contact Info
                        </h2>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <CallIcon sx={{ fontSize: 14 }} />
                          <strong>Phone: </strong> {ad.data.phone || "N/A"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <WhatsAppIcon sx={{ fontSize: 14 }} />
                          <strong>WhatsApp: </strong>{" "}
                          {ad.organizer?.whatsapp || "N/A"}
                        </p>
                        <p
                          className={`flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs ${
                            ad.organizer?.verified[0]?.accountverified === true
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <ShieldOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Verified Status: </strong>{" "}
                          {ad.organizer?.verified[0]?.accountverified === true
                            ? "Verified"
                            : "Not Verified"}
                        </p>
                      </section>

                      {/* 6. Geographical Info */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <h2 className="text-xs lg:text-base font-bold mb-1  text-gray-800">
                          Geographical Info
                        </h2>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <LocationOnIcon sx={{ fontSize: 14 }} />
                          <strong>Location: </strong>  {ad.data.region} - {ad.data.area}
                        </p>
                        {(ad.data["propertyarea"]) && (
                                      <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                                      <AssistantDirectionOutlinedIcon
                                        sx={{ fontSize: 14 }}
                                      />
                                      <strong>Map Enabled: </strong> {"Yes"}
                                    </p>
                                    )}

                      </section>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={ad._id}
                    className="flex flex-col lg:flex-row gap-1 bg-white shadow-lg rounded-lg overflow-hidden mb-6 border border-[#e4ebeb]"
                  >
                    {/* Ad Image */}
                    <img
                      src={ad.data.imageUrls[0] || "/default-ad-image.jpg"}
                      alt={ad.data.title}
                      className="w-full lg:w-64 h-40 lg:h-full object-cover"
                    />

                    <div className="p-2 grid grid-cols-2 lg:grid-cols-3 w-full">
                      {/* 1. Ad Details */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <p className="text-xs lg:text-base font-bold mb-1 text-gray-800">
                          Ad Details
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <SplitscreenOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Title: </strong> {ad.data.title}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <ClassOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Category: </strong> {ad.data.subcategory || "N/A"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <AccessTimeIcon sx={{ fontSize: 14 }} />
                          <strong>Created Date: </strong>
                          {new Date(ad.createdAt).toLocaleDateString()}
                        </p>
                      </section>

                      {/* 2. Ad Engagement */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <p className="text-xs lg:text-base font-bold mb-1 text-gray-800">
                          Ad Engagement
                        </p>

                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <VisibilityIcon sx={{ fontSize: 14 }} />
                          <strong>Ad Views: </strong> {ad.views}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <ChatBubbleOutlineOutlinedIcon
                            sx={{ fontSize: 14 }}
                          />
                          <strong>Inquiries: </strong> {ad.inquiries || "0"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <CallIcon sx={{ fontSize: 14 }} />
                          <strong>Calls: </strong> {ad.calls || "0"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <WhatsAppIcon sx={{ fontSize: 14 }} />
                          <strong>WhatsApp: </strong> {ad.whatsapp || "0"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <ShareOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Shared: </strong> {ad.shared || "0"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <BookmarkIcon sx={{ fontSize: 14 }} />
                          <strong>Bookmarked: </strong> {ad.bookmarked || "0"}
                        </p>
                      </section>

                      {/* 3. Ad Duration & Status */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <h2 className="text-xs lg:text-base font-bold mb-1  text-gray-800">
                          Ad Status
                        </h2>

                        {ad.adstatus && (
                          <div
                            className={`flex flex-col w-[100px] text-[8px] lg:text-[10px] p-1 text-white justify-center items-center rounded-full ${
                              ad.adstatus === "Pending"
                                ? "bg-yellow-600"
                                : ad.adstatus === "Failed"
                                ? "bg-red-600 "
                                : "bg-green-600"
                            }`}
                          >
                            {ad.adstatus}
                          </div>
                        )}
                        <div className="flex mt-2 gap-4 rounded-xl p-3 shadow-sm transition-all">
                        <div 
                          onClick={()=> handleAdEdit(ad)}
                          >
                            <Image
                              src="/assets/icons/edit.svg"
                              alt="edit"
                              width={20}
                              height={20}
                            />
                          </div>
                          <DeleteConfirmation
                            adId={ad._id}
                            imageUrls={ad.data.imageUrls}
                          />
                        </div>
                      </section>

                      {/* 4. Ad Performance */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <h2 className="text-xs lg:text-base font-bold mb-1 text-gray-800">
                          Ad Performance
                        </h2>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <LowPriorityOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Priority Level: </strong>{" "}
                          {ad.priority || "N/A"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <FlightTakeoffOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Plan: </strong> {ad.plan?.name || "Free"}
                        </p>
                      </section>

                      {/* 5. Contact Info */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <h2 className="text-xs lg:text-base font-bold mb-1  text-gray-800">
                          Contact Info
                        </h2>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <CallIcon sx={{ fontSize: 14 }} />
                          <strong>Phone: </strong> {ad.data.phone || "N/A"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <WhatsAppIcon sx={{ fontSize: 14 }} />
                          <strong>WhatsApp: </strong>{" "}
                          {ad.organizer?.whatsapp || "N/A"}
                        </p>
                        <p
                          className={`flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs ${
                            ad.organizer?.verified[0]?.accountverified === true
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <ShieldOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Verified Status: </strong>{" "}
                          {ad.organizer?.verified[0]?.accountverified === true
                            ? "Verified"
                            : "Not Verified"}
                        </p>
                      </section>

                      {/* 6. Geographical Info */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <h2 className="text-xs lg:text-base font-bold mb-1  text-gray-800">
                          Geographical Info
                        </h2>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <LocationOnIcon sx={{ fontSize: 14 }} />
                          <strong>Location: </strong>  {ad.data.region} - {ad.data.area}
                        </p>
                         {(ad.data["propertyarea"]) && (
                                      <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                                      <AssistantDirectionOutlinedIcon
                                        sx={{ fontSize: 14 }}
                                      />
                                      <strong>Map Enabled: </strong> {"Yes"}
                                    </p>
                                    )}

                       
                      </section>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        ) : (
          loading === false && (
            <div className="flex items-center lg:min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-5 lg:py-28 text-center">
              <h3 className="font-bold text-[16px] lg:text-[25px]">
                0 ads
              </h3>
              <p className="text-sm lg:p-regular-14">No ads to display.</p>
             
            </div>
          )
        )}

{loading && (
           <div>
          
            
                       <div className="w-full mt-10 lg:min-h-[200px] flex flex-col items-center justify-center">
                         <Image
                           src="/assets/icons/loading2.gif"
                           alt="loading"
                           width={40}
                           height={40}
                           unoptimized
                         />
                       </div>
                     
                   
            
           </div>
         )}
      </div>
      <Toaster />
      </div>
      <footer>
        <Footersub handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} />
      </footer>
    </ScrollArea>
    </>
  );
};

export default DashboardPerformance;
