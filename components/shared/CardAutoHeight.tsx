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
const shouldShowRenewButton = (updatedAt: Date, priority: number) => {
  const oneMonthAgo = subMonths(new Date(), 1);
  return priority === 1 && isBefore(new Date(updatedAt), oneMonthAgo);
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

const CardAutoHeight = ({
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
  // Safely get shapes array or fallback to empty array
  // const shapes = ad.data?.propertyarea?.shapes ?? [];
  // Calculate total area size
  //const areaSize = Array.isArray(shapes)
  //  ? shapes.reduce((sum: number, shape: any) => sum + parseFloat(shape.area || 0), 0)
  // : 0;
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
        onClick={() => {
          handleAdView(ad);
        }}
        className="rounded-xl bg-white shadow-md overflow-hidden hover:shadow-lg cursor-pointer transition duration-300 w-full max-w-xs sm:max-w-sm md:max-w-md"
      >
        {/* Image */}
        <div className="relative h-48 w-full">
          <Image
            src={ad.data.imageUrls.length > 0 ? ad.data.imageUrls[0] : "/fallback.jpg"}
            alt={ad.data.title}
            fill
            className="object-cover"
          />
          {/* Image count badge */}
          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            📷 {ad.data.imageUrls.length}
          </div>
          {/* Action Icon (e.g., share or save) */}
          <div className="absolute top-2 right-2 bg-white text-green-600 rounded-full w-7 h-7 flex items-center justify-center shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h2l1 2h13m1 0a9 9 0 11-3-6.708" />
            </svg>
          </div>
        </div>

        {/* Text content */}
        <div className="p-3 space-y-1">
          <h3 className="text-sm font-semibold text-gray-800 truncate">{ad.data.title.length > 50
            ? `${ad.data.title.substring(0, 50)}...`
            : ad.data.title}</h3>
            
          <p className="text-xs text-gray-500">📍 {truncateaddress(ad.data.propertyarea?.mapaddress, 25)}</p>
          <p className="text-green-600 font-bold text-sm">
            {ad.data.price.toLocaleString()}
            {ad.data.unit && <span className="text-xs text-gray-600 font-normal"> {ad.data.unit}</span>}
          </p>
          <div className="inline-block text-xs text-white bg-green-600 rounded px-2 py-[2px]">
            Sale
          </div>
        </div>
      </div>
      <ScheduleVisitForm userId={userId} ad={selectedAd} isOpen={isPopupOpenSchedule} onClose={handleClosePopupSchedule} userName={userName} userImage={userImage} />
    </>)}
    </>)}</>
  );
};

export default CardAutoHeight;
