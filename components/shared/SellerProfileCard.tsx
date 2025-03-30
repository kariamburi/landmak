"use client";
import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/Call";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AssistantDirectionIcon from "@mui/icons-material/AssistantDirection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faTiktok,
  faChrome,
} from "@fortawesome/free-brands-svg-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CreateUserParams } from "@/types";

import Streetmap from "./Streetmap";
import Link from "next/link";
import StreetmapOfice from "./StreetmapOffice";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { format, isToday, isYesterday } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import Share from "./Share";
import { v4 as uuidv4 } from "uuid";
import { createTransaction } from "@/lib/actions/transactions.actions";
import { getVerfiesfee } from "@/lib/actions/verifies.actions";
import Verification from "./Verification";
import { IUser } from "@/lib/database/models/user.model";
import Image from "next/image";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { IAd } from "@/lib/database/models/ad.model";
import Ratingsmobile from "./ratingsmobile";
import Verificationmobile from "./Verificationmobile";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import RatingsCard from "./RatingsCard";
import ChatButton from "./ChatButton";
import { updatecalls, updatewhatsapp } from "@/lib/actions/ad.actions";
import SafetyCheckOutlinedIcon from "@mui/icons-material/SafetyCheckOutlined";
//import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
//import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ProgressPopup from "./ProgressPopup";
import { Button } from "../ui/button";
type chatProps = {
  userId: string;
  ad: any;
  userImage: string;
  userName: string;
  handleOpenReview: (value:string) => void;
  handleOpenShop: (value:string) => void;
  handlePay: (id:string) => void;
};
const SellerProfileCard = ({ ad, userId, userImage, userName,handlePay, handleOpenReview,handleOpenShop, }: chatProps) => {
  const pathname = usePathname();

  const isAdCreator = userId === ad.organizer._id;
  const isAds = pathname === "/ads/" + ad._id;
  let formattedCreatedAt = "";
  try {
    const createdAtDate = new Date(ad.organizer?.verified[0]?.verifieddate); // Convert seconds to milliseconds

    // Get today's date
    const today = new Date();

    // Check if the message was sent today
    if (isToday(createdAtDate)) {
      formattedCreatedAt = "Today " + format(createdAtDate, "HH:mm"); // Set as "Today"
    } else if (isYesterday(createdAtDate)) {
      // Check if the message was sent yesterday
      formattedCreatedAt = "Yesterday " + format(createdAtDate, "HH:mm"); // Set as "Yesterday"
    } else {
      // Format the createdAt date with day, month, and year
      formattedCreatedAt = format(createdAtDate, "dd-MM-yyyy"); // Format as 'day/month/year'
    }

    // Append hours and minutes if the message is not from today or yesterday
    if (!isToday(createdAtDate) && !isYesterday(createdAtDate)) {
      formattedCreatedAt += " " + format(createdAtDate, "HH:mm"); // Append hours and minutes
    }
  } catch {
    // Handle error when formatting date
  }
  const handleShowPhoneClick = async (e: any) => {
    //setshowphone(true);
    const calls = (Number(ad.calls ?? "0") + 1).toString();
    const _id = ad._id;
    await updatecalls({
      _id,
      calls,
      path: `/ads/${ad._id}`,
    });
    window.location.href = `tel:${ad.data.phone}`;
  };
  const router = useRouter();
  const handlewhatsappClick = async (e: any) => {
    const whatsapp = (Number(ad.whatsapp ?? "0") + 1).toString();
    const _id = ad._id;
    await updatewhatsapp({
      _id,
      whatsapp,
      path: `/ads/${ad._id}`,
    });
    window.location.href = `https://wa.me/${ad.organizer.whatsapp}/`;
  };
  const [isOpenP, setIsOpenP] = useState(false);
  const handleOpenP = () => {
    setIsOpenP(true);
  };

  const handleCloseP = () => {
    setIsOpenP(false);
  };
  return (
    <div className="flex p-0 items-center flex-col">
      <div className="flex flex-col border dark:bg-[#2D3236] dark:text-gray-100 bg-white items-center p-1 w-full rounded-lg">
      <div className="flex gap-4 justify-center items-center p-1">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-white relative">
            <Image
              onClick={() => {
                //handleOpenP();
                handleOpenShop(ad.organizer._id);
                //router.push(`/shop/${ad.organizer._id}`);
              }}
              className="w-full h-full cursor-pointer rounded-full object-cover"
              src={ad.organizer.photo ?? "/avator.png"}
              alt="Avator"
              width={200}
              height={200}
            />

            {/* Verified Icon */}
            {ad.organizer.verified &&
            ad.organizer?.verified[0]?.accountverified === true ? (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="shadow-[0px_4px_20px_rgba(0,0,0,0.3)] absolute text-white bottom-0 right-0 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full p-1">
                        <VerifiedUserOutlinedIcon />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-emerald-500">Verified Seller</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            ) : (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="shadow-[0px_4px_20px_rgba(0,0,0,0.3)] absolute text-gray-100 bottom-0 right-0 bg-gradient-to-b from-gray-500 to-gray-600 rounded-full p-1">
                        <ShieldOutlinedIcon />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-red-500">Unverified Seller</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>

          <div
            onClick={() => {
             // handleOpenP();
             // router.push(`/shop/${ad.organizer._id}`);
             handleOpenShop(ad.organizer._id);
            }}
            className="ml-2 text-xl cursor-pointer font-bold hover:underline hover:text-emerald-600"
          >
            {ad.organizer.firstName} {ad.organizer.lastName}
          </div>
          <div className="m-1">
            <Verification
              user={ad.organizer}
              userId={userId}
              isAdCreator={isAdCreator}
              handlePayNow={handlePay}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <RatingsCard
            recipientUid={ad.organizer._id}
            handleOpenReview={handleOpenReview}
          />
        </div>
    
        </div>
          <div className="flex gap-1 items-center p-1 w-full">
            <SignedIn>
            <Button onClick={handleShowPhoneClick} variant="outline" className="flex w-full items-center gap-2">
            <CallIcon sx={{ fontSize: 18 }} /><div className="hidden lg:inline">Call</div>
           </Button>
              
            </SignedIn>
            <SignedOut>
            <Button onClick={() => {
                 // handleOpenP();
                  router.push(`/sign-in`);
                }} variant="outline" className="flex w-full items-center gap-2">
            <CallIcon sx={{ fontSize: 18 }} /><div className="hidden lg:inline">Call</div>
           </Button>
             
            </SignedOut>

            <SignedIn>
              <ChatButton
                ad={ad}
                userId={userId}
                userImage={userImage}
                userName={userName}
              />
            </SignedIn>
            <SignedOut>
            <Button onClick={() => {
                 // handleOpenP();
                  router.push(`/sign-in`);
                }}
                 variant="outline" className="flex w-full items-center gap-2">
            <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 18 }} />
            <div className="hidden lg:inline">Message</div>
           </Button>

             
            </SignedOut>

            {ad.organizer.whatsapp && (
              <>
                <SignedIn>
                <Button  onClick={handlewhatsappClick}
                 variant="outline" className="flex w-full items-center gap-2">
            <WhatsAppIcon sx={{ fontSize: 18 }} />

<div className="hidden lg:inline">WhatsApp</div>
           </Button>

                  
                </SignedIn>
                <SignedOut>
                <Button  onClick={() => {
                     // handleOpenP();
                      router.push(`/sign-in`);
                    }}
                 variant="outline" className="flex w-full items-center gap-2">
           <WhatsAppIcon sx={{ fontSize: 18 }} />

<div className="hidden lg:inline">WhatsApp</div>
           </Button>

                 
                </SignedOut>
              </>
            )}
          </div>
         

          </div>
     
    </div>
  );
};

export default SellerProfileCard;
