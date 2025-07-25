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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { createBookmark, deleteBookmark } from "@/lib/actions/bookmark.actions";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import sanitizeHtml from "sanitize-html";
import { Email, Phone } from '@mui/icons-material'; // Or from 'react-icons/md'
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { Icon } from "@iconify/react";
import threeDotsScale from "@iconify-icons/svg-spinners/3-dots-scale"; // Correct import
import { formatDistanceToNow, isBefore, subMonths } from "date-fns";
import { updatebookmarked, updateCreatedAt } from "@/lib/actions/dynamicAd.actions";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ScheduleVisitForm from "./Schedule";
import { Button } from "../ui/button";
import { SoldConfirmation } from "./SoldConfirmation";
import { DivIcon } from "leaflet";
import { DisputeBadge } from "./DisputeBadge";
import MapaVerifiedBadge from "./MapaVerifiedBadge";
const shouldShowRenewButton = (createdAt: Date, priority: number) => {
  const oneMonthAgo = subMonths(new Date(), 1);
  return priority === 1 && isBefore(new Date(createdAt), oneMonthAgo);
  //return true
};
// Correct import
type CardProps = {
  ad: any;
  userName: string;
  userImage: string;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
  userId: string;
  handleAdEdit: (ad: any) => void;
  handleAdView: (ad: any) => void;
  handleOpenPlan: () => void;
  handleOpenChatId: (value: any) => void;
};

const CardAuto = ({
  ad: initialAd,
  userName,
  userImage,
  hasOrderLink,
  hidePrice,
  userId,
  handleAdEdit,
  handleAdView,
  handleOpenPlan,
  handleOpenChatId,
}: CardProps) => {
  const pathname = usePathname();
  const { toast } = useToast();
  const [ad, setAd] = useState(initialAd);
  const router = useRouter();

  let isAdCreator;
  if (ad.loanterm) {
    isAdCreator = userId === ad.userId._id.toString();
  } else {
    isAdCreator = userId === ad.organizer._id.toString();
  }
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
  const [isLoadingsmall, setIsLoadingsmall] = useState(true);
  const truncateDescription = (description: string, charLimit: number) => {
    const safeMessage = sanitizeHtml(description);
    const truncatedMessage =
      safeMessage.length > charLimit
        ? `${safeMessage.slice(0, charLimit)}...`
        : safeMessage;
    return truncatedMessage;
  };
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
  //console.log(ad.imageUrls);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isPopupOpenSchedule, setIsPopupOpenSchedule] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any>([]);
  const [isSold, setIsSold] = useState(false);
  const handleOpenPopupSchedule = (ad: any) => {
    setSelectedAd(ad);
    setIsPopupOpenSchedule(true);
  };
  const handleClosePopupSchedule = () => {
    setIsPopupOpenSchedule(false);
  };
  const onStatusUpdate = (newStatus: string) => {
    setAd((prev: any) => ({
      ...prev,
      adstatus: newStatus,
    }));
  };

  const areaSize = ad.data?.propertyarea?.totalArea || 0;
  return (
    <>{ad.loanterm ? (<><div className="bg-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-xs border border-gray-300 dark:border-gray-600">
      <div className="relative rounded w-full"
        onClick={() => {
          handleAdView(ad.adId);
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
          className={`w-full h-[200px] rounded object-cover cursor-pointer ${isLoadingsmall ? "opacity-0" : "opacity-100"
            } transition-opacity duration-300`}
          onLoadingComplete={() => setIsLoadingsmall(false)}
          placeholder="empty"
        />

      </div>
      <div className="p-2">
        <div className="flex flex-col">
          <div className="flex flex-col border-b p-1 w-full items-start">


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
      <div className="p-2">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            {/* Optional Avatar */}

            <div className="flex flex-col">
              <p className="text-sm font-semibold">
                Financing Request from:
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Client Name:
            <span className="font-semibold">  {ad.userId.firstName} {ad.userId.lastName}</span>
          </p>
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
              className={`flex p-1 justify-center items-center w-[70px] rounded-full ${ad.status === "Pending"
                ? "bg-orange-100"
                : ad.status === "Failed"
                  ? "bg-red-100"
                  : "bg-green-100"
                }`}
            >
              {ad.status}
            </span>
          </p>

        </div>
      </div>

      {/* Section 3: Footer (e.g., Delete) */}
      <div className="p-2 flex justify-between w-full">
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
    </>) : (<>{!isDeleted && (<>
      <div
        className={`mb-2 w-full lg:min-w-[200px] rounded-lg border shadow-sm bg-white dark:bg-[#2D3236]`}

      >
        {/* Image section with dynamic height */}


        <div className="relative rounded-t-lg w-full"
          style={
            ad.plan.name !== "Free"
              ? {
                border: "2px solid",
                borderColor: ad.plan.color, // Border color for non-free plans
              }
              : undefined
          }
        >


          {isLoadingsmall && ad.data.imageUrls.length > 0 && (
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
            width={400}
            height={400}
            // style={{ minHeight: "200px" }}
            className={`w-full rounded-t-lg h-[200px] object-cover cursor-pointer ${isLoadingsmall ? "opacity-0" : "opacity-100"
              } transition-opacity duration-300`}
            onLoadingComplete={() => setIsLoadingsmall(false)}
            placeholder="empty"
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
                  // router.push(`/plan`);
                }}
              >
                <div className="flex gap-1 cursor-pointer">{ad.plan.name}</div>
              </div>
            </div>
          )}
          {ad.organizer.verified &&
            ad.organizer?.verified[0]?.accountverified === true && (
              <div className="absolute bg-emerald-100 top-0 right-0 dark:text-emerald-900 text-[10px] py-1 px-1 lg:text-xs lg:py-1 lg:px-3 rounded-bl-lg rounded-tr-lg">
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
              <DeleteConfirmation adId={ad._id} imageUrls={ad.data.imageUrls} onDeleteSuccess={() => setIsDeleted(true)} />
            </div>
          )}

          <div className="w-full flex justify-between absolute bottom-[15px] left-1/2 transform -translate-x-1/2 p-1 rounded-full">
            {/* <div className="gap-1 cursor-pointer bg-[#000000] bg-opacity-70 text-[10px] text-white flex rounded-sm p-1 shadow-sm transition-all">
              <FilterOutlinedIcon
                sx={{ fontSize: 16, cursor: "pointer" }}
              />
              {ad.data.imageUrls.length}
            </div>

              Image count badge */}
            <div className="bg-black/60 text-white items-center text-xs px-2 py-1 rounded-full">
              📷 {ad.data.imageUrls.length}
            </div>
            {ad.data["propertyarea"] && (
              <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                <LocationOnIcon
                  sx={{ fontSize: 16, cursor: "pointer" }}

                />

              </div>
            )}

            {ad.data["youtube-link"] && (
              <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                <YouTubeIcon
                  sx={{ fontSize: 16, cursor: "pointer" }}

                />
              </div>
            )}
            {ad.data["virtualTourLink"] && (
              <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                <ThreeDRotationOutlinedIcon
                  sx={{ fontSize: 16, cursor: "pointer" }}

                />

              </div>
            )}

          </div>
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
          </div>
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

          {ad.data.propertyarea?.mapaddress && (
            <div className="text-gray-500 flex gap-1 items-center dark:text-gray-500 text-xs">
              <LocationOnIcon sx={{ fontSize: 14 }} />
              {truncateaddress(ad.data.propertyarea?.mapaddress, 25)}
            </div>
          )}
          <div
            onClick={() => {
              handleAdView(ad);
            }}
            className="flex-wrap gap-1 cursor-pointer items-center dark:text-green-500 text-emerald-700 no-underline"
          >
            {ad.data.contact && ad.data.contact === "contact" ? (
              <div className="font-bold">Contact for price</div>
            ) : (
              <>
                <span className="font-bold">
                  {ad.data.budget ? (<> Budget : Ksh {ad.data.budget.toLocaleString()}</>) : (<> {ad.data.price > 0 && (
                    <span>
                      Ksh {ad.data.price.toLocaleString()}
                    </span>)}
                  </>)}
                </span>
              </>
            )}{" "}
            {ad.data.unit && ad.data.contact === "specify" && (
              <div className="text-xs dark:text-green-500">{'(' + ad.data.unit + ')'}</div>
            )}{" "}
            {ad.data.per && (
              <div className="text-xs dark:text-green-500">{'(' + ad.data.per + ')'}</div>
            )}
            {ad.data.period && (
              <div className="text-xs dark:text-green-500">
                {'(' + ad.data.period + ')'}
              </div>
            )}
            {ad.data["Maximum Amount"] && ad.data["Minimum Amount"] && (
              <div className="flex flex-col font-bold">
                <p>Min: Ksh {Number(ad.data["Minimum Amount"]).toLocaleString()} </p>
                <p>Max: Ksh {Number(ad.data["Maximum Amount"]).toLocaleString()}</p>
              </div>
            )}
          </div>
          {areaSize > 0 && (
            <div className="flex mt-1 gap-2 text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
              <label className="mb-1">
                Approx. Land Size
                <br />
                ≈ {areaSize.toFixed(2)} m²

                ≈ {(areaSize / 4046.86).toFixed(2)} ac

                ≈ {(areaSize / 10000).toFixed(2)} ha


              </label>
            </div>
          )}
          <div className="flex gap-2 text-gray-500 text-sm mt-2">
            {ad.data.category === 'Property Services' && (
              <div className="inline-block text-xs text-white bg-green-600 rounded px-2 py-[2px]">
                {ad.data.subcategory}
              </div>
            )}
            {ad.data.category?.toLowerCase().includes("rent") && (<>
              {/* <div className="flex gap-2 text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
                Rent
              </div>*/}
              <div className="inline-block text-xs text-white bg-green-600 rounded px-2 py-[2px]">
                Rent
              </div>
            </>)}
            {ad.data.category?.toLowerCase().includes("sale") && (
              <div className="inline-block text-xs text-white bg-green-600 rounded px-2 py-[2px]">
                Sale
              </div>
            )}
            {ad.data.condition && (
              <div className="inline-block text-xs text-white bg-green-600 rounded px-2 py-[2px]">
                {ad.data.condition}
              </div>

            )}

            {ad.data["land-Type"] && (
              <div className="inline-block text-xs text-white bg-green-600 rounded px-2 py-[2px]">
                {ad.data["land-Type"]}
              </div>

            )}

          </div>
          {ad.disputeStatus && (<DisputeBadge status={ad.disputeStatus} />)}
          {ad.mapaVerificationStatus && ad.mapaVerificationStatus === 'verified' && <MapaVerifiedBadge size="sm" />}


          {isAdCreator && shouldShowRenewButton(ad.createdAt, ad.priority) && (<div className="flex mt-2 w-full text-xs justify-between items-center">
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

      </div>
      <ScheduleVisitForm userId={userId} ad={selectedAd} isOpen={isPopupOpenSchedule} onClose={handleClosePopupSchedule} userName={userName} userImage={userImage} />
    </>)}
    </>)
    }</>
  );
};

export default CardAuto;
