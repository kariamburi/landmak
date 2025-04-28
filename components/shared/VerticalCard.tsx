import { IAd } from "@/lib/database/models/ad.model";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { formatKsh } from "@/lib/help";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PartyModeOutlinedIcon from "@mui/icons-material/PartyModeOutlined";
import LocalSeeOutlinedIcon from "@mui/icons-material/LocalSeeOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import LinkedCameraOutlinedIcon from "@mui/icons-material/LinkedCameraOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import ThreeDRotationOutlinedIcon from '@mui/icons-material/ThreeDRotationOutlined';
import FilterOutlinedIcon from '@mui/icons-material/FilterOutlined';
import sanitizeHtml from "sanitize-html";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { createBookmark, deleteBookmark } from "@/lib/actions/bookmark.actions";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { updatebookmarked } from "@/lib/actions/ad.actions";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Icon } from "@iconify/react";
import threeDotsScale from "@iconify-icons/svg-spinners/3-dots-scale"; // Correct import
 // Correct import
type CardProps = {
  ad: any;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
  userId: string;
 isAdCreator?: boolean;
  popup?: string;
  handleAdEdit: (ad:any) => void;
  handleAdView: (ad:any) => void;
  handleOpenPlan: () => void;
};

const VerticalCard = ({
  ad,
  hasOrderLink,
  hidePrice,
  userId,
  isAdCreator,
  handleAdEdit,
  handleAdView,
  handleOpenPlan,
  popup,
}: CardProps) => {
  const pathname = usePathname();
  const { toast } = useToast();

  const router = useRouter();

  //const isAdCreator = userId === ad.organizer._id.toString();
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
  // Apply truncation after sanitization
 



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
  const [isLoadingsmall, setIsLoadingsmall] = useState(true);
  //console.log(ad.imageUrls);
  return (
    <>
      <div
        className={`mb-2 w-full lg:min-w-[200px] rounded-lg border shadow-sm bg-white dark:bg-[#2D3236] overflow-hidden`}
        style={
          ad.plan.name !== "Free"
            ? {
                border: "2px solid",
                borderColor: ad.plan.color, // Border color for non-free plans
              }
            : undefined
        }
      >
        {/* Image section with dynamic height */}

        <div className="relative w-full">
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
            src={`${ad.data.imageUrls[0]}`}
            alt={`${ad.data.title}`}
            width={400} // Set a width to control layout consistency
            height={0} // Proportional height
            style={{ minHeight: "200px" }} // Set the minimum height here
            className={`w-full h-auto object-cover cursor-pointer ${
              isLoadingsmall ? "opacity-0" : "opacity-100"
            } transition-opacity duration-300`}
            onLoadingComplete={() => setIsLoadingsmall(false)}
            placeholder="empty" // Optional: you can use "empty" if you want a placeholder before loading
          />

          {ad.plan.name !== "Free" && (
            <div
              style={{
                backgroundColor: ad.plan.color,
              }}
              className="absolute top-0 shadow-lg left-0 text-white text-[10px] py-1 px-1 lg:text-xs lg:py-1 lg:px-3 rounded-br-lg rounded-tl-sm"
            >
              <div
                onClick={() => {
                  handleOpenPlan();
                }}
              >
                <div className="flex gap-1 cursor-pointer">{ad.plan.name}</div>
              </div>
            </div>
          )}
          {ad.organizer.verified &&
            ad.organizer?.verified[0]?.accountverified === true && (
              <div className="absolute bg-green-100 top-0 right-0 dark:text-green-900 text-[10px] py-1 px-1 lg:text-xs lg:py-1 lg:px-3 rounded-bl-lg rounded-tr-lg">
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

          <div className="w-full flex justify-between absolute bottom-[15px] left-1/2 transform -translate-x-1/2 p-1 rounded-full">
            <div className="gap-1 cursor-pointer bg-[#000000] bg-opacity-70 text-[10px] text-white flex rounded-sm p-1 shadow-sm transition-all">
              <FilterOutlinedIcon
                sx={{ fontSize: 16, cursor: "pointer" }}
              />
              {ad.data.imageUrls.length}
            </div>
            {ad.data["youtube-link"] && (
              <div className="gap-1 cursor-pointer bg-[#000000] bg-opacity-70 text-[10px] text-white flex rounded-sm p-1 shadow-sm transition-all">
                <YouTubeIcon
                  sx={{ fontSize: 16, cursor: "pointer" }}
                 
                />
              </div>
            )}
              {ad.data["virtualTourLink"] && (
              <div className="gap-1 cursor-pointer bg-[#000000] bg-opacity-70 text-[10px] text-white flex rounded-sm p-1 shadow-sm transition-all">
                <ThreeDRotationOutlinedIcon
                  sx={{ fontSize: 16, cursor: "pointer" }}
                
                />
             
              </div>
            )}
            
            {(ad.data["propertyarea"]) && (
              <div className="gap-1 cursor-pointer bg-[#000000] bg-opacity-70 text-[10px] text-white flex rounded-sm p-1 shadow-sm transition-all">
                <LocationOnIcon
                  sx={{ fontSize: 16, cursor: "pointer" }}
                 
                />
             
              </div>
            )}
          </div>
          {!isAdCreator && !popup && (
                      <>
                        <div className="w-full flex justify-end absolute bottom-[-19px] left-1/2 transform -translate-x-1/2 p-1 rounded-full">
                          <SignedIn>
                            <div
                              className="w-8 h-8 p-1 shadow flex items-center justify-center rounded-full bg-white hover:text-emerald-800 tooltip tooltip-bottom text-[#2BBF4E] hover:cursor-pointer"
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
                               
                                router.push(`/sign-in`);
                              }}
                              className="cursor-pointer"
                            >
                              <div
                                className="w-8 h-8 p-1 shadow flex items-center justify-center rounded-full bg-white hover:text-emerald-800 tooltip tooltip-bottom text-[#2BBF4E] hover:cursor-pointer"
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
                      </>
                    )}
                    {popup && (
                      <div className="w-full flex justify-end absolute bottom-[-19px] left-1/2 transform -translate-x-1/2 p-1 rounded-full">
                        <div
                          className="w-8 h-8 p-1 shadow-lg flex items-center justify-center rounded-full bg-red-100 text-emerald-500 tooltip tooltip-bottom hover:text-[#2BBF4E] hover:cursor-pointer"
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
                              <TooltipContent side="left">
                                <p className="text-sm"> Remove Ad</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    )}
         {/*  <div className="w-full flex justify-end absolute bottom-[-19px] left-1/2 transform -translate-x-1/2 p-1 rounded-full">
            <SignedIn>
              <div
                className="w-8 h-8 p-1 shadow flex items-center justify-center rounded-full bg-white hover:text-emerald-800 tooltip tooltip-bottom text-[#2BBF4E] hover:cursor-pointer"
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
                  className="w-8 h-8 p-1 shadow flex items-center justify-center rounded-full bg-white hover:text-emerald-800 tooltip tooltip-bottom text-[#2BBF4E] hover:cursor-pointer"
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
          </div>*/}
        </div>

        {/* Text section */}
        <div className="p-2 lg:p-4">
          <div
            onClick={() => {
             handleAdView(ad);
            }}
            className="font-semibold text-sm cursor-pointer lg:text-base"
          >
            <h2>{ad.data.title}</h2>
          </div>
         
          <p className="dark:text-gray-300 text-gray-700 text-[12px] hidden lg:inline">
        <span dangerouslySetInnerHTML={{ __html:  truncateDescription(ad.data.description, 180) }} />
        </p>
        <p className="dark:text-gray-300 text-gray-700 text-[12px] lg:inline">
        <span dangerouslySetInnerHTML={{ __html:  truncateDescription(ad.data.description, 100) }} />
        </p>
          <div className="text-gray-500 flex gap-1 items-center dark:text-gray-500 text-[12px] lg:text-xs">
            <LocationOnIcon sx={{ fontSize: 14 }} />
            {ad.data.region} - {ad.data.area}
          </div>
          {ad.calcDistance && (
            <div className="flex text-sm mt-1 fount-bold bg-green-100 rounded-lg p-1 text-green-600">
              {Math.round(ad.calcDistance / 100) / 10} KM Away
            </div>
          )}
          <div
            onClick={() => {
              handleAdView(ad);
            }}
            className="flex gap-1 cursor-pointer items-center dark:text-green-500 text-emerald-700 no-underline"
          >
            {ad.data.contact && ad.data.contact === "contact" ? (
              <div className="text-sm lg:text-base font-bold">Contact for price</div>
            ) : (
              <>
                <span className="text-sm lg:text-base font-bold">
                  Ksh {ad.data.price.toLocaleString()}
                </span>
              </>
            )}{" "}
            {ad.data.unit && ad.data.contact === "specify" && (
              <div className="text-xs dark:text-green-500">{ad.data.unit}</div>
            )}{" "}
            {ad.data.per && (
              <div className="text-xs dark:text-green-500">{ad.data.per}</div>
            )}
            {ad.data.period && (
              <div className="text-xs dark:text-green-500">
                {ad.data.period}
              </div>
            )}
          </div>

          <div className="flex gap-2 text-gray-500 text-sm mt-2">
            {ad.data.period && (
              <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
                Rent
              </div>
            )}
            {ad.data.condition && (
              <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
                {ad.data.condition}
              </div>
            )}
            {ad.data.transimmison && (
              <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
                {ad.data.transimmison}
              </div>
            )}
            {ad.data["engine-CC"] && (
              <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
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
                Bulk Price
              </div>
            )}
            {ad.data["delivery"] && (
              <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
                Delivery
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VerticalCard;
