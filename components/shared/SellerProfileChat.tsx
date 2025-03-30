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
import Ratings from "./ratings";
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
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import CircularProgress from "@mui/material/CircularProgress";
import RatingsCard from "./RatingsCard";
import ProgressPopup from "./ProgressPopup";
import CopyShareAdLink from "./CopyShareAdLink";
import { Email } from "@mui/icons-material";
import { Button } from "../ui/button";

type CollectionProps = {
  userId: string;
  loggedId: string;
  user: any;
  handleOpenReview: (value:string) => void;
  handleOpenChatId: (value:string) => void;
  handleOpenSettings: () => void;
  handlePay: (id:string) => void;
};

const SellerProfileChat = ({ userId, loggedId, user, handlePay, handleOpenReview, handleOpenChatId, handleOpenSettings }: CollectionProps) => {
  const [activationfee, setactivationfee] = useState(500);
  const [showphone, setshowphone] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === "/shop/" + userId;
  const isActiveReviews = pathname === "/reviews/" + userId;
  const router = useRouter();
  const isAdCreator = userId === loggedId;
  const handleShowPhoneClick = (e: any) => {
    setshowphone(true);
    window.location.href = `tel:${user.phone}`;
  };
  // console.log(user);
  const handleDirectionClick = () => {
    // Perform navigation or other actions when direction button is clicked
    // Example: Open a new tab with Google Maps directions
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${user.latitude},${user.longitude}`,
      "_blank"
    );
  };
const handlewhatsappClick = () => {
     
      window.location.href = `https://wa.me/${user.whatsapp}/`;
    };
  let formattedCreatedAt = "";
  try {
    const createdAtDate = new Date(user?.verified[0]?.verifieddate); // Convert seconds to milliseconds

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
  const [isLoading, setIsLoading] = useState(true);
 
  return (
    <div className="flex flex-col m-0 dark:text-gray-100 items-center w-full lg:w-[350px]">
     
     <div className="flex flex-col dark:bg-[#2D3236] dark:text-gray-100 border bg-white justify-between items-center p-1 w-full rounded-lg">
      <div className="flex gap-4 dark:bg-[#2D3236] dark:text-gray-100 bg-white  items-center p-1 w-full rounded-lg">
        <div className="flex flex-col w-full items-center w-full border-r">
          <div className="w-24 h-24 rounded-full bg-white relative">
            <Zoom>
              <Image
                className="w-full h-full rounded-full object-cover"
                src={user.photo ?? "/avator.png"}
                alt="Avator"
                width={200}
                height={200}
              />
            </Zoom>
            {/* Verified Icon */}
            {user.verified && user?.verified[0]?.accountverified === true ? (
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

          <div className="ml-2 text-xl font-bold">
            {user.firstName} {user.lastName}
          </div>
          <div className="m-1">
            <Verification
              user={user}
              userId={userId}
              isAdCreator={isAdCreator}
              handlePayNow={handlePay}
            />
          </div>
          
        </div>
        <div className="flex mb-2 flex-col mt-4 items-center dark:bg-[#2D3236] dark:text-gray-100 bg-white rounded-lg w-full p-1">
        <RatingsCard recipientUid={user._id} handleOpenReview={handleOpenReview} />
      </div>
      </div>
    
     <div className="flex flex-col gap-1 items-center w-full">
                  <SignedIn>
                  <Button onClick={handleShowPhoneClick} variant="default" className="w-full">
                  <CallIcon sx={{ fontSize: 18 }} /><div>Call</div>
                 </Button>
                    
                  </SignedIn>
                 
                  <SignedOut>
                  <Button onClick={() => {
                       // handleOpenP();
                        router.push(`/sign-in`);
                      }} variant="default" className="w-full">
                  <CallIcon sx={{ fontSize: 18 }} /><div>Call</div>
                 </Button>
                   
                  </SignedOut>
                  {userId !== loggedId && (<>
                  <SignedIn>
                  <Button onClick={() => {
                           
                             handleOpenChatId(userId);
                             
                            }}
                       variant="default" className="w-full">
                  <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                  <div>Message</div>
                 </Button>
                  </SignedIn>
                  <SignedOut>
                  <Button onClick={() => {
                       // handleOpenP();
                        router.push(`/sign-in`);
                      }}
                       variant="default" className="w-full">
                  <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                  <div>Message</div>
                 </Button>
      
                   
                  </SignedOut>
                  </>)}
                  {user.whatsapp && (
                    <div className="w-full">
                      <SignedIn>
                    
                      <Button 
                      onClick={handlewhatsappClick}
                       variant="default" className="w-full">
                  <WhatsAppIcon sx={{ fontSize: 18 }} />
      
                 <div>WhatsApp</div>
                 </Button>
                         
                     
      
                        
                      </SignedIn>
                      <SignedOut>
                      <Button  onClick={() => {
                           // handleOpenP();
                            router.push(`/sign-in`);
                          }}
                       variant="default" className="w-full">
                 <WhatsAppIcon sx={{ fontSize: 18 }} />
      
      <div >WhatsApp</div>
                 </Button>
      
                       
                      </SignedOut>
                    </div>
                  )}
                </div>
      
                </div>
    </div>
  );
};

export default SellerProfileChat;
