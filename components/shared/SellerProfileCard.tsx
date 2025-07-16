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
import {
  FaStar,
  FaLock,
  FaEdit,
  FaShareAlt,
  FaLink,
  FaQrcode,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaTwitter,
  FaTiktok,
  FaPhoneAlt,      // Phone icon
  FaGlobe,         // Website/Internet icon
  FaBuilding,
  FaMapMarkerAlt,
  FaEnvelope
} from "react-icons/fa";
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
import { Phone, MessageCircle, MessageSquare, Mail } from 'lucide-react';
import QRCode from 'qrcode';
type chatProps = {
  userId: string;
  ad: any;
  fee: string;
  titleId: string;
  userImage: string;
  userName: string;
  handleOpenReview: (value: any) => void;
  handleOpenShop: (value: any) => void;
  handlePay: (id: string) => void;
};
const SellerProfileCard = ({ ad, fee, userId, userImage, userName, titleId, handlePay, handleOpenReview, handleOpenShop, }: chatProps) => {
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
  const [showCallDisclaimer, setShowCallDisclaimer] = useState(false);
  const handleShowPhoneClick = async () => {
    setShowCallDisclaimer(true);
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

  const [copied, setCopied] = useState(false);

  const adUrl = process.env.NEXT_PUBLIC_DOMAIN_URL + "?" + titleId + "=" + ad._id;
  const handleCopy = () => {
    navigator.clipboard.writeText(adUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this " + titleId + "!",
          url: adUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing is not supported on this device.");
    }
  };
  const saveQRcode = async () => {

    try {
      const qrDataURL = await QRCode.toDataURL(adUrl);

      // Create download link
      const link = document.createElement('a');
      link.href = qrDataURL;
      link.download = 'mapa-qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error('Failed to generate QR code', err);
    }

  }
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
    <div className="flex p-0 items-center flex-col">

      <div className="bg-white dark:bg-[#2D3236] rounded-xl shadow-sm p-4 w-full">
        {/* Seller Info */}
        <div className="flex items-center gap-4">
          <div onClick={() => {
            handleOpenShop(ad.organizer);
          }} className="relative">
            {ad.organizer?.photo && !isDefaultClerkAvatar(ad.organizer.photo) ? (
              <img
                src={ad.organizer.photo}
                alt="Organizer avatar"
                className="w-16 h-16 cursor-pointer rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 cursor-pointer bg-green-500 text-white flex items-center justify-center text-2xl font-bold rounded-full">
                {getInitials(ad.organizer?.firstName, ad.organizer?.lastName)}
              </div>
            )}
          </div>


          <div>
            <div onClick={() => {
              handleOpenShop(ad.organizer);
            }} className="text-lg cursor-pointer hover:underline font-semibold text-gray-800 dark:text-white"> {ad.organizer.firstName} {ad.organizer.lastName}</div>
            <Verification
              fee={fee}
              user={ad.organizer}
              userId={userId}
              isAdCreator={isAdCreator}
              handlePayNow={handlePay}
            />

            <Ratingsmobile
              user={ad.organizer}
              recipientUid={ad.organizer._id}
              handleOpenReview={handleOpenReview} />
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-4">

          <SignedIn>
            <button onClick={handleShowPhoneClick} className="flex gap-1 items-center justify-center border border-green-500 text-green-700 hover:bg-green-50 py-1 rounded-md text-sm font-medium">
              <FaPhoneAlt /> {showCallDisclaimer ? (<p className="text-xs">{ad.data?.phone}</p>) : (<>Call</>)}
            </button>
            <ChatButton
              ad={ad}
              userId={userId}
              userImage={userImage}
              userName={userName}
            />
            {ad.organizer.whatsapp && (<><button onClick={handlewhatsappClick} className="flex text-sm gap-1 items-center justify-center border border-green-500 text-green-700 hover:bg-green-50 py-1 px-2 rounded-md text-sm font-medium">
              <MessageCircle className="w-5 h-5" /> WhatsApp
            </button></>)}
          </SignedIn>
          <SignedOut>
            <button onClick={() => {
              setIsOpenP(true);
              router.push(`/sign-in`);
            }} className="flex gap-1 items-center justify-center items-center justify-center border border-green-500 text-green-700 hover:bg-green-50 py-1 rounded-md text-sm font-medium">
              <FaPhoneAlt /> Call
            </button>
            <button onClick={() => {
              setIsOpenP(true);
              router.push(`/sign-in`);
            }} className="flex gap-1 items-center justify-center border border-green-500 text-green-700 hover:bg-green-50 py-1 rounded-md text-sm font-medium">
              <FaEnvelope /> Enquire
            </button>
            <button onClick={() => {
              setIsOpenP(true);
              router.push(`/sign-in`);
            }}
              className="flex gap-1 items-center justify-center border border-green-500 text-green-700 hover:bg-green-50 py-1 rounded-md text-sm font-medium">
              <FaWhatsapp /> WhatsApp
            </button>
          </SignedOut>


        </div>
        {showCallDisclaimer && (
          <p className="text-xs bg-gray-100 text-gray-500 mt-1 border rounded-sm p-1">
            ⚠️ Never pay before meeting the seller and verifying the property. mapa.co.ke doesn&apos;t offer payment protection. Report fraud: <a href="mailto:support@mapa.co.ke" className="underline">support@mapa.co.ke</a>
          </p>
        )}
        {/* Leave Feedback */}
        <div className="mt-4">
          <button onClick={() => {
            handleOpenReview(ad.organizer)
          }}
            className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-md text-sm font-semibold">
            😃 Leave Your Feedback
          </button>
        </div>

        {/* Share Section */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-white mb-2">Share Ad</h3>
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">


            <button onClick={handleCopy} className="flex items-center gap-1 hover:text-green-600">
              <FaLink /> {copied ? "Copied!" : "Copy Link"}
            </button>
            <button onClick={saveQRcode} className="flex items-center gap-1 hover:text-green-600">
              <FaQrcode /> QR Code
            </button>
            <button onClick={handleShare} className="flex items-center gap-1 hover:text-green-600">
              <FaShareAlt /> Share
            </button>

          </div>
        </div>
      </div>
      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
    </div>
  );
};

export default SellerProfileCard;
