import { IAd } from "@/lib/database/models/ad.model";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { formatKsh } from "@/lib/help";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import YouTubeIcon from "@mui/icons-material/YouTube";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import LocalSeeOutlinedIcon from "@mui/icons-material/LocalSeeOutlined";
import RadioButtonCheckedOutlinedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import ThreeDRotationOutlinedIcon from '@mui/icons-material/ThreeDRotationOutlined';
import FilterOutlinedIcon from '@mui/icons-material/FilterOutlined';
import { Email, Phone } from '@mui/icons-material'; // Or from 'react-icons/md'
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import { usePathname, useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { createBookmark, deleteBookmark } from "@/lib/actions/bookmark.actions";
import { updatebookmarked } from "@/lib/actions/ad.actions";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import CircularProgress from "@mui/material/CircularProgress";
import sanitizeHtml from "sanitize-html";
import { Icon } from "@iconify/react";
import threeDotsScale from "@iconify-icons/svg-spinners/3-dots-scale"; // Correct import
import { formatDistanceToNow, isBefore, subMonths } from "date-fns";
import { updateCreatedAt, updateReverseStatus } from "@/lib/actions/dynamicAd.actions";
import ScheduleVisitForm from "./Schedule";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { Button } from "../ui/button";
import { SoldConfirmation } from "./SoldConfirmation";
import { DisputeBadge } from "./DisputeBadge";
import MapaVerificationForm from "./MapaVerificationForm";
import MapaVerifiedBadge from "./MapaVerifiedBadge";
const shouldShowRenewButton = (updatedAt: Date, priority: number) => {
  const oneMonthAgo = subMonths(new Date(), 1);
  return priority === 1 && isBefore(new Date(updatedAt), oneMonthAgo);
};
 // Correct import
type CardProps = {
  userId: string;
   userName:string;
  userImage:string;
  ad: any;
  isAdCreator?: boolean;
  handleAdEdit: (ad:any) => void;
  handleAdView: (ad:any) => void;
  handleOpenChatId:(value:any) => void;
  handleOpenPlan: () => void;
  popup?: string;
};

const HorizontalCard = ({
  userId,
  userName,
  userImage,
  ad:initialAd,
  isAdCreator,
  handleAdEdit,
  handleAdView,
  handleOpenPlan,
  handleOpenChatId,
  popup,
}: CardProps) => {
  const pathname = usePathname();
  const [ad, setAd] = useState(initialAd); 
  const isbookmark = pathname === "/bookmark";
const [isDeleted, setIsDeleted] = useState(false);
  const { toast } = useToast();
  const truncateTitle = (title: string, maxLength: number) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };
  const truncateaddress = (address: string, maxLength: number) => {
    if (address.length > maxLength) {
      return address.substring(0, maxLength) + "...";
    }
    return address;
  };
   const truncateDescription = (description: string, charLimit: number) => {
      const safeMessage = sanitizeHtml(description); 
      const truncatedMessage =
      safeMessage.length > charLimit
        ? `${safeMessage.slice(0, charLimit)}...`
        : safeMessage;
      return truncatedMessage;
    };
  const handle = async (id: string) => {
    if (userId) {
      const newBookmark = await createBookmark({
        bookmark: {
          userBId: userId,
          adId: id,
        },
        path: pathname,
      });
      if (newBookmark === "Ad Saved to Bookmark") {
        const bookmarked = (Number(ad.bookmarked ?? "0") + 1).toString();
        const _id = ad._id;
        await updatebookmarked({
          _id,
          bookmarked,
          path: `/ads/${ad._id}`,
        });
        toast({
          title: "Alert",
          description: newBookmark,
          duration: 5000,
          className: "bg-black text-white",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed!",
          description: newBookmark,
          duration: 5000,
        });
      }
    } else {
      window.location.reload();
    }
  };
  const handledeletebk = async (id: string) => {
    const delBookmark = await deleteBookmark({
      bookmark: {
        userBId: userId,
        adId: id,
      },
      path: pathname,
    });
    if (delBookmark === "Bookmark deleted successfully") {
      const bookmarked = (Number(ad.bookmarked ?? "1") - 1).toString();
      const _id = ad._id;
      await updatebookmarked({
        _id,
        bookmarked,
        path: `/ads/${ad._id}`,
      });
      toast({
        variant: "destructive",
        title: "Deleted!",
        description: delBookmark,
        duration: 5000,
      });
    }
  };
  const router = useRouter();
  const [isLoadingsmall, setIsLoadingsmall] = useState(true);
   const handleRenew = async (_id: string) => {
    try {
     await updateCreatedAt(
            _id
          );
          toast({
            title: "Alert",
            description: "Renewal successful",
            duration: 5000,
            className: "bg-black text-white",
          });
    } catch (error) {
      console.error(error);
      alert("Error renewing ad.");
    }
  };
   const handleUndo = async (_id: string) => {
    try {
    
     await updateReverseStatus(_id);
      setAd((prev:any) => ({
    ...prev,
    adstatus: 'Active',
  }));
          toast({
            title: "Alert",
            description: "Status Updated",
            duration: 5000,
            className: "bg-black text-white",
          });
    } catch (error) {
      console.error(error);
      alert("Error renewing ad.");
    }
  };
const [isPopupOpenSchedule, setIsPopupOpenSchedule] = useState(false);
    const [selectedAd, setSelectedAd] = useState<any>([]);
  
  const handleOpenPopupSchedule = (ad:any) => {
      setSelectedAd(ad);
      setIsPopupOpenSchedule(true);
    };
    const handleClosePopupSchedule = () => {
      setIsPopupOpenSchedule(false);
    };
     const rentCategories = [
  'Houses & Apartments for Rent',
  'Land & Plots for Rent',
  'Commercial Property for Rent',
  'Short Let Property',
  'Event Centres, Venues & Workstations'
];

const saleCategories = [
  'Houses & Apartments for Sale',
  'Land & Plots for Sale',
  'Commercial Property for Sale',
  'New builds'
];
const isRent = rentCategories.includes(ad.data.category);
const isSale = saleCategories.includes(ad.data.category);
const onStatusUpdate = (newStatus:string) => {
  setAd((prev:any) => ({
    ...prev,
    adstatus: newStatus,
  }));
}
  return (
    <>{ad.loanterm ? (<>
    
     <div className="flex w-full justify-between bg-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-xs border border-gray-300 dark:border-gray-600">
  {/* Section 1: Ad Info */}
  <div className="px-4 py-2">
    <div className="flex gap-2">
      <div className="flex gap-1 border-b p-1 w-full items-start">
        <div className="relative rounded"
          onClick={() => {
           {  
            handleAdView(ad.adId);
           }
            }}>
          {isLoadingsmall && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-100">
              <Icon icon={threeDotsScale} className="w-6 h-6 text-gray-500" />
            </div>
          )}
         
            <Image
              src={ad.adId.data.imageUrls[0]}
              alt={ad.adId.data.title}
              width={800}
              height={400}
              className={`w-[150px] h-[100px] rounded object-cover cursor-pointer ${
                isLoadingsmall ? "opacity-0" : "opacity-100"
              } transition-opacity duration-300`}
              onLoadingComplete={() => setIsLoadingsmall(false)}
              placeholder="empty"
            />
        
        </div>

        <div className="flex flex-col justify-between h-full">
          <p className="text-sm font-semibold mb-1">
            {ad.adId.data.title.length > 50
              ? `${ad.adId.data.title.substring(0, 50)}...`
              : ad.adId.data.title}
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 max-w-[200px]">
            <span
              dangerouslySetInnerHTML={{
                __html: truncateDescription(ad.adId.data.description ?? "", 65),
              }}
            />
          </p>

          <span className="font-bold text-green-600 dark:text-green-600 mt-1">
            {formatKsh(ad.adId.data.price)}
          </span>
        </div>
      </div>
    </div>
  </div>

  {/* Section 2: User Info */}
  <div className="px-4 py-2">
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        {/* Optional Avatar */}
      
       <div className="flex flex-col">
        <p className="text-sm font-semibold">
  CUSTOMER INFO
  </p>
  <p className="text-sm font-semibold">
    {ad.userId.firstName} {ad.userId.lastName}
  </p>

  
</div>
      </div>
 <p className="text-xs text-gray-600 dark:text-gray-300">
       Loan Amount:
        <span className="font-semibold"> KES {ad.LoanAmount.toLocaleString()}</span>
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-300">
        Monthly Income:
        <span className="font-semibold"> KES {ad.monthlyIncome.toLocaleString()}</span>
      </p>

      <p className="text-xs text-gray-600 dark:text-gray-300">
        Deposit Amount:
        <span className="font-semibold"> KES {ad.deposit.toLocaleString()}</span>
      </p>

      <p className="text-xs text-gray-600 dark:text-gray-300">
        Preferred Loan Term:
        <span className="font-semibold"> {ad.loanterm}</span>
      </p>

      <p className="text-xs text-gray-600 dark:text-gray-300">
        Employment Status:
        <span className="font-semibold"> {ad.employmentStatus}</span>
      </p>

      <p className="text-xs text-gray-600 dark:text-gray-300">
        Message Comments:
        <span className="font-semibold"> {ad.messageComments}</span>
      </p>

      <p className="flex gap-2 text-xs text-gray-600 dark:text-gray-300">
        Status:
        <span
          className={`flex p-1 justify-center items-center w-[70px] rounded-full ${
            ad.status === "Pending"
              ? "bg-orange-100"
              : ad.status === "Failed"
              ? "bg-red-100"
              : "bg-green-100"
          }`}
        >
          {ad.status}
        </span>
      </p>
 {/*
      <p className="text-xs text-gray-600 dark:text-gray-300">
        <button
          onClick={() => handleOpenContact(ad.userId)}
          className="bg-gray-100 border px-3 py-1 rounded hover:bg-[#e4ebeb]"
        >
          <QuestionAnswerOutlinedIcon /> Contact Client
        </button>
      </p>*/}
    </div>
  </div>

  {/* Section 3: Footer (e.g., Delete) */}
  <div className="px-4 py-2 flex flex-col">
  <div className="flex items-center gap-2 mb-1 border-b py-1">
    <a href={`mailto:${ad.userId.email}`} className="flex items-center text-green-600 hover:underline">
      <Email className="w-4 h-4 mr-1" /> Email
    </a>
  </div>

  <div className="flex items-center gap-2 mb-1 border-b py-1">
    <a href={`tel:${ad.userId.phone}`} className="flex items-center text-green-600 hover:underline">
      <Phone className="w-4 h-4 mr-1" /> Call
    </a>
  </div>
  <div className="flex items-center gap-2 mb-1 border-b py-1">
      <div onClick={() => handleOpenChatId(ad.userId)} className="flex cursor-pointer items-center text-green-600 hover:underline">
        <ChatBubbleOutlineOutlinedIcon className="w-4 h-4 mr-1" /> Chat
      </div>
    </div>
  </div>
</div>

    
    
    
    </>):(<>
       {!isDeleted && (
      <div
        className={`flex w-full mb-2 border rounded-lg dark:bg-[#2D3236] text-black dark:text-gray-300 bg-white hover:cursor-pointer`}
       
      >
        <div
          onClick={() => {
           // handleOpenP();
            //router.push(`/ads/${ad._id}`);
            handleAdView(ad);
          }}
          className="relative rounded-l-lg w-[160px] lg:w-[200px] h-[200px]"
          style={
          ad.plan.name !== "Free"
            ? {
                border: "2px solid",
                borderColor: ad.plan.color, // Border color for non-free plans
              }
            : undefined
        }
        >
          <div className="relative w-full h-full">
            {isLoadingsmall && (
                            <div 
                            onClick={() => {
                              handleAdView(ad);
                             }}
                             className="absolute inset-0 flex justify-center items-center bg-gray-100">
                              <Icon icon={threeDotsScale} className="w-6 h-6 text-gray-500" />
                            </div>
                          )}

            <Image
              onClick={() => handleAdView(ad)}
             src={ad.data.imageUrls.length > 0 ? ad.data.imageUrls[0] : "/fallback.jpg"}
             alt={ad.data.title || "Ad image"}
              width={400} // Adjust width to match the `w-36` Tailwind class
              height={400} // Adjust height to match the `h-24` Tailwind class
              className={`rounded-l-lg object-cover cursor-pointer w-full h-full ${
                isLoadingsmall ? "opacity-0" : "opacity-100"
              } transition-opacity duration-300`}
              onLoadingComplete={() => setIsLoadingsmall(false)}
              placeholder="empty" // Optional: you can use "empty" if you want a placeholder before loading
            />
          </div>
          {ad.plan.name !== "Free" && (
            <div
              style={{
                backgroundColor: ad.plan.color,
              }}
              className="absolute top-0 shadow-lg left-0 text-white text-[10px] py-1 px-1 lg:text-xs lg:py-1 lg:px-1 rounded-br-lg rounded-tl-lg"
            >
              <div
                onClick={() => {
                 // handleOpenP();
                 handleOpenPlan();
                }}
              >
                <div className="flex gap-1 cursor-pointer">{ad.plan.name}</div>
              </div>
            </div>
          )}
          {ad.organizer.verified &&
            ad.organizer?.verified[0]?.accountverified === true && (
              <div className="absolute bg-emerald-100 top-0 right-0 text-[10px] py-1 px-1 lg:text-xs lg:py-1 lg:px-1 rounded-bl-lg">
                <div className="flex gap-1 cursor-pointer">
                  <VerifiedUserOutlinedIcon sx={{ fontSize: 16 }} />
                  Verified
                </div>
              </div>
            )}
          {isAdCreator && (
            <div className="absolute right-2 top-10 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
              <div
                onClick={() => {
                  handleAdEdit(ad);
                }}
                className="cursor-pointer"
              >
                <Image
                  src="/assets/icons/edit.svg"
                  alt="edit"
                  width={20}
                  height={20}
                />
              </div>
              <DeleteConfirmation adId={ad._id} imageUrls={ad.data.imageUrls} onDeleteSuccess={() => setIsDeleted(true)}/>
            </div>
          )}

          {popup && (
            <div className="w-full flex justify-end  absolute top-2/3 left-1/2 transform -translate-x-1/2 p-1 rounded-full">
              <div
                className="w-8 h-8 p-1 mt-[-20px] shadow-lg flex items-center justify-center rounded-full bg-red-100 text-emerald-500 tooltip tooltip-bottom hover:text-[#2BBF4E] hover:cursor-pointer"
                data-tip="Bookmark"
                onClick={() => handledeletebk(ad._id)}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Image
                        src="/assets/icons/delete.svg"
                        alt="edit"
                        width={20}
                        height={20}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm"> Delete Ad</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}
           <div className="w-full flex justify-between absolute bottom-[15px] left-1/2 transform -translate-x-1/2 p-1 rounded-full">
          <div className="ml-1 mb-1 gap-1 bg-gray-800 bg-opacity-70 text-[10px] text-white right-50 top-100 flex rounded-lg p-1 shadow-sm transition-all">
            <FilterOutlinedIcon sx={{ fontSize: 16 }} />
            {ad.data.imageUrls.length}
          </div>
               {ad.data["propertyarea"] && (
                        <div className="gap-1 cursor-pointer bg-[#000000] bg-opacity-70 text-[10px] text-white flex rounded-sm p-1 shadow-sm transition-all">
                          <LocationOnIcon
                            sx={{ fontSize: 16, cursor: "pointer" }}
                          
                          />
                       
                        </div>
                      )}
          {ad.data["youtube-link"] && (
            <div className="mb-1 mr-1 cursor-pointer bg-[#000000] bg-opacity-70 text-[10px] text-white right-0 top-100 flex rounded-lg p-1 shadow-sm transition-all">
              <YouTubeIcon
                sx={{ fontSize: 16, cursor: "pointer" }}
              />
            
            </div>
          )}
           {ad.data["virtualTourLink"] && (
              <div className="mb-1 mr-1 cursor-pointer bg-[#000000] bg-opacity-70 text-[10px] text-white right-0 top-100 flex rounded-lg p-1 shadow-sm transition-all">
                <ThreeDRotationOutlinedIcon
                  sx={{ fontSize: 16, cursor: "pointer" }}
                />
              
              </div>
            )}
          {/*  {(ad.data["propertyarea"]) && (
              <div className="mb-1 mr-1 cursor-pointer bg-[#000000] bg-opacity-70 text-[10px] text-white right-0 top-100 flex rounded-lg p-1 shadow-sm transition-all">
                <LocationOnIcon
                  sx={{ fontSize: 16, cursor: "pointer" }}
                />
              
              </div>
            )} */}
          
            </div>
        </div>

        <div className="flex-1 mt-2 p-2">
          <div
            onClick={() => {
              //handleOpenP();
              ////router.push(`/ads/${ad._id}`);
              handleAdView(ad);
            }}
            className="cursor-pointer dark:text-gray-400 text-emerald-950 font-bold text-sm lg:text-basefont-bold line-clamp-2 hover:no-underline"
          >
            {ad.data.title}
          </div>
          <div className="text-[12px] lg:text-sm"></div>

          <p className="dark:text-gray-300 text-sm hidden lg:inline">
        <span dangerouslySetInnerHTML={{ __html:  truncateDescription(ad?.data.description, 250) }} />
        </p>
        <p className="dark:text-gray-300 text-[12px] lg:hidden">
        <span dangerouslySetInnerHTML={{ __html:  truncateDescription(ad?.data.description, 100) }} />
        </p>      

        {ad.data.propertyarea?.mapaddress && (
                 <div className="text-gray-500 flex gap-1 items-center dark:text-gray-500 text-[12px] lg:text-xs">
                 <LocationOnIcon sx={{ fontSize: 14 }} />
                 {truncateaddress(ad.data.propertyarea?.mapaddress, 25)}
               </div>
             )} 
          {ad.calcDistance && (
            <div className="flex w-[130px] text-sm mt-1 fount-bold bg-green-100 rounded-lg p-1 text-green-600">
              {Math.round(ad.calcDistance / 100) / 10} KM Away
            </div>
          )}
          {isAdCreator ? (
            <div className="flex justify-between items-center w-full">
              <div
                onClick={() => {
                  //handleOpenP();
                 // router.push(`/ads/${ad._id}`);
                 handleAdView(ad);
                }}
                className="flex gap-1 cursor-pointer items-center no-underline"
              >
                {ad.data.contact && ad.data.contact === "contact" ? (
                  <div className="text-[12px] w-full lg:text-lg font-bold rounded-full dark:text-green-500 text-emerald-700">
                    Contact for price
                  </div>
                ) : (
                  <>
                   
                      <span className="text-[12px] lg:text-lg font-bold w-min rounded-full dark:text-green-500 text-emerald-700">
              {ad.data.budget ? (<> Budget : Ksh {ad.data.budget.toLocaleString()}</>):(<> {ad.data.price > 0 && (
                                   <span>
                                  Ksh {ad.data.price.toLocaleString()}
                                  </span>)} 
                                  </>)}   
                </span>
                  </>
                )}{" "}
                {ad.data.unit && ad.data.contact === "specify" && (
                  <div className="text-xs dark:text-green-500">
                    {ad.data.unit}
                  </div>
                )}{" "}
                {ad.data.per && (
                  <div className="text-xs dark:text-green-500">
                    {ad.data.per}
                  </div>
                )}
                {ad.data.period && (
                  <div className="text-xs dark:text-green-500">
                    {ad.data.period}
                  </div>
                )}
                 {ad.data["Maximum Amount"] && ad.data["Minimum Amount"] && (
  <div className="flex flex-col font-bold">
    <p>Min: Ksh {Number(ad.data["Minimum Amount"]).toLocaleString()} </p>
    <p>Max: Ksh {Number(ad.data["Maximum Amount"]).toLocaleString()}</p>
  </div>
)}
              </div>
              {ad.adstatus && isAdCreator && (
                <div
                  className={`flex gap-1 text-[8px] lg:text-[10px] p-1 justify-center items-center rounded-full ${
                    ad.adstatus === "Pending"
                      ? "text-yellow-600"
                      : ad.adstatus === "Failed"
                      ? "text-red-600 "
                      : "text-green-600"
                  }`}
                >
                  <RadioButtonCheckedOutlinedIcon sx={{ fontSize: 10 }} />{" "}
                  {ad.adstatus}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center">
              <div
                onClick={() => {
                 // handleOpenP();
                 // router.push(`/ads/${ad._id}`);
                 handleAdView(ad);
                }}
                className="flex gap-1 cursor-pointer items-center no-underline"
              >
                  {ad.data.price > 0 && (
                                     <span className="text-[12px] lg:text-lg font-bold w-min rounded-full dark:text-green-500 text-emerald-700">
                  {formatKsh(ad.data.price)}
                </span>)} 
               {" "}
                {ad.data.per && (
                  <div className="text-xs dark:text-white">{ad.data.per}</div>
                )}
                {ad.data.period && (
                  <div className="text-xs dark:text-white">
                    {ad.data.period}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-between w-full">
            <div className="flex gap-1 mt-1">
               {ad.data.category?.toLowerCase().includes("rent") && ( 
  <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
    Rent
  </div>
)}
{ad.data.category?.toLowerCase().includes("sale") && ( 
  <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
    Sale
  </div>
)}
              {ad.data.condition && (
                <div className="flex gap-2 text-[8px] lg:text-xs  dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-sm p-1 justify-center border">
                  {ad.data.condition}
                </div>
              )}
              {ad.data.transmission && (
                <div className="flex gap-2 text-[8px] lg:text-xs  dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-sm p-1 justify-center border">
                  {ad.data.transmission}
                </div>
              )}
              {ad.data["engine-CC"] && (
                <div className="flex gap-2 text-[8px] lg:text-xs  dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-sm p-1 justify-center border">
                  {ad.data["engine-CC"]}
                </div>
              )}
            
            {ad.data["land-Type"] && (
              <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
                {ad.data["land-Type"]}
              </div>
            )}

              {ad.data["land-Area(acres)"] && (
                <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
                  {ad.data["land-Area(acres)"]}
                </div>
              )}
              {ad.data["bulkprice"] && (
                <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
                  Bulkprice
                </div>
              )}
              {ad.data["delivery"] && (
                <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
                  Delivery
                </div>
              )}
            </div>
            {!isAdCreator && !isbookmark && (
              <div className="">
                <SignedIn>
                  <div
                    className="w-8 h-8 p-1 shadow-[0px_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center rounded-full bg-white text-emerald-500 tooltip tooltip-bottom hover:text-[#2BBF4E] hover:cursor-pointer"
                    data-tip="Bookmark"
                    onClick={() => handle(ad._id)}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <BookmarkAddedOutlinedIcon sx={{ fontSize: 20 }} />
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p className="text-sm"> Save Ad</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </SignedIn>

                <SignedOut>
                  <div
                    onClick={() => {
                      //handleOpenP();
                      router.push(`/sign-in`);
                    }}
                    className="cursor-pointer"
                  >
                    <div
                      className="w-8 h-8 p-1 shadow-[0px_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center rounded-full bg-white text-emerald-500 tooltip tooltip-bottom hover:text-[#2BBF4E] hover:cursor-pointer"
                      data-tip="Bookmark"
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <BookmarkAddedOutlinedIcon sx={{ fontSize: 20 }} />
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p className="text-sm"> Save Ad</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </SignedOut>
              </div>
            )}
          </div>
          {ad.disputeStatus && (<DisputeBadge status={ad?.disputeStatus} />)}
          {ad.mapaVerificationStatus && ad.mapaVerificationStatus === 'verified' && <MapaVerifiedBadge size="sm" />}
            
       {ad.mapaVerificationStatus==='unverified' && isSale && isAdCreator && (
         <MapaVerificationForm userId={userId} ad={ad} userName={userName} userImage={userImage} />
       )}
          {!ad.hasSiteVisit && isAdCreator && (<div className="flex mt-2 w-full justify-between items-center"><div onClick={()=> handleOpenPopupSchedule(ad)} className="flex cursor-pointer rounded w-full text-xs p-2 text-green-600 border border-green-600 bg-green-100 hover:bg-green-200 justify-center items-center gap-1">
                                      <CalendarMonthOutlinedIcon sx={{ fontSize: 16 }}/>
                                     Schedule Site Visit
                              </div></div>)}

{isAdCreator && ad.adstatus === 'Active' && (isSale || isRent) && (
  <SoldConfirmation onStatusUpdate={onStatusUpdate} _id={ad._id} status={isSale ? 'Sold' : 'Rented'} />
)}


{isAdCreator && ['Sold', 'Rented'].includes(ad.adstatus) && (
  <Button
    onClick={() => handleUndo(ad._id)}
    variant={"outline"}
    className="flex mt-2 rounded w-full p-2 justify-center items-center gap-1"
  >
    Undo {ad.adstatus}
  </Button>
)}
           {isAdCreator && shouldShowRenewButton(ad.updatedAt, ad.priority) && (<div className="flex mt-2 w-full text-xs justify-between items-center">
             <button
    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
    onClick={() => handleRenew(ad._id)}
  >
    Renew Ad
  </button>
  <button
  className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
  onClick={() => handleOpenPlan()}
>
  Top Ad
</button>
          </div>
 
)}
        </div>
      </div>)}
         <ScheduleVisitForm userId={userId} ad={selectedAd} isOpen={isPopupOpenSchedule} onClose={handleClosePopupSchedule} userName={userName} userImage={userImage}/>
       </>)}
    </>
  );
};

export default HorizontalCard;
