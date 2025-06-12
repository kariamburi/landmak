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
import ProgressPopup from "./ProgressPopup";
type chatProps = {
  userId: string;
  userName: string;
  userImage: string;
  user: any;
  handleOpenShop:(shopId:any) => void;
  handleOpenReview:(value:any) => void;
  handlePay: (id:string) => void;
};
const SellerProfilePermonance = ({
  userId,
  userName,
  userImage,
  user,
  handleOpenShop,
  handleOpenReview,
  handlePay,
}: chatProps) => {
  const pathname = usePathname();
  const [isOpenP, setIsOpenP] = useState(false);
  const router = useRouter();
  const handleOpenP = () => {
    setIsOpenP(true);
  };

  const handleCloseP = () => {
    setIsOpenP(false);
  };
     const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0]?.toUpperCase() || '';
    const last = lastName?.[0]?.toUpperCase() || '';
    return `${first}${last}`;
  };
  
   function isDefaultClerkAvatar(imageUrl: string): boolean {
  try {
    const base64 = imageUrl.split("/").pop();
    if (!base64) return false;

    const json = atob(base64); // decode Base64
    const data = JSON.parse(json);

    return data.type === "default";
  } catch (e) {
    return false;
  }
}

  return (
    <div className="flex gap-1 items-center">
      <div className="flex flex-col lg:flex-row gap-1 items-center p-1 w-full">
        <div
          onClick={() => {
           // handleOpenP();
            handleOpenShop(user);
           // router.push(`/shop/${userId}`);
          }}
          className="cursor-pointer no-underline font-bold m-1"
        >
      
    {!isDefaultClerkAvatar(userImage) ? (
    <img
      src={userImage}
      alt="Organizer avatar"
      className="w-16 h-16 rounded-full object-cover"
    />
  ) : (
    <div className="w-16 h-16 bg-green-500 text-white flex items-center justify-center text-2xl font-bold rounded-full">
      {getInitials(user?.firstName, user?.lastName)}
    </div>
  )}
        
        </div>
        <div className="flex flex-col">
          <div
            onClick={() => {
              //handleOpenP();
              //router.push(`/shop/${userId}`);
              handleOpenShop(user);
            }}
            className="cursor-pointer no-underline font-bold m-1"
          >
            <p className="font-bold">{userName}</p>
          </div>

          <Verification user={user} fee={user.fee} userId={userId} isAdCreator={true} handlePayNow={handlePay}/>
          <Ratingsmobile recipientUid={userId} user={user} handleOpenReview={handleOpenReview} />
        </div>
      </div>
   
    </div>
  );
};

export default SellerProfilePermonance;
