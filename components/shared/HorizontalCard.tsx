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
 // Correct import
type CardProps = {
  userId: string;
  ad: any;
  isAdCreator?: boolean;
  handleAdEdit: (ad:any) => void;
  handleAdView: (ad:any) => void;
  handleOpenPlan: () => void;
  popup?: string;
};

const HorizontalCard = ({
  userId,
  ad,
  isAdCreator,
  handleAdEdit,
  handleAdView,
  handleOpenPlan,
  popup,
}: CardProps) => {
  const pathname = usePathname();
  const isbookmark = pathname === "/bookmark";

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
          className: "bg-[#30AF5B] text-white",
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
  // console.log(ad.imageUrls);
  return (
    <>
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
              onClick={() => {
                handleAdView(ad);
              }}
              src={ad.data.imageUrls[0]}
              alt="ad image"
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
              <DeleteConfirmation adId={ad._id} imageUrls={ad.data.imageUrls} />
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
                      {formatKsh(ad.data.price)}
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
                <span className="text-[12px] lg:text-lg font-bold w-min rounded-full dark:text-green-500 text-emerald-700">
                  {formatKsh(ad.data.price)}
                </span>{" "}
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
              {ad.data.period && (
                <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
                  Rent
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
        </div>
      </div>
    </>
  );
};

export default HorizontalCard;
