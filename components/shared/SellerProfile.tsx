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
import { Phone, MessageCircle, MessageSquare, Mail } from 'lucide-react';
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
import { updatewhatsapp } from "@/lib/actions/dynamicAd.actions";
import QRCode from 'qrcode';
import Ratingsmobile from "./ratingsmobile";
type CollectionProps = {
  userId: string;
  loggedId: string;
  user: any;
  handleOpenReview: (value:any) => void;
  handleOpenChatId: (value:string) => void;
  handleOpenSettings: () => void;
  handlePay: (id:string) => void;
};

const SellerProfile = ({ userId, loggedId, user, handlePay, handleOpenReview, handleOpenChatId, handleOpenSettings }: CollectionProps) => {
  const [activationfee, setactivationfee] = useState(500);
  const [showphone, setshowphone] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === "/shop/" + userId;
  const isActiveReviews = pathname === "/reviews/" + userId;
  const router = useRouter();
  const isAdCreator = userId === loggedId;
  const handlewhatsappClick = () => {
     
      window.location.href = `https://wa.me/${user.whatsapp}/`;
    };
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
 
  const [isOpenP, setIsOpenP] = useState(false);
    const handleOpenP = () => {
      setIsOpenP(true);
    };
  
    const handleCloseP = () => {
      setIsOpenP(false);
    };
  
    const [copied, setCopied] = useState(false);
    
    const adUrl =process.env.NEXT_PUBLIC_DOMAIN_URL+"?Profile="+user._id;
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
              title: "Check out this Profile!",
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

  return (<>
  <div className="flex p-0 items-center flex-col">
  <div className="bg-white dark:bg-[#2D3236] rounded-xl shadow-sm p-4 w-full lg:w-[350px]">
    {/* Seller Info */}
    <div className="flex items-center gap-4">
     <div className="relative">
     
    {user?.photo && !isDefaultClerkAvatar(user.photo) ? (
    <img
      src={user.photo}
      alt="Organizer avatar"
      className="w-16 h-16 rounded-full object-cover"
    />
  ) : (
    <div className="w-16 h-16 bg-green-500 text-white flex items-center justify-center text-2xl font-bold rounded-full">
      {getInitials(user?.firstName, user?.lastName)}
    </div>
  )}
  </div>
  <div>
        <div className="text-lg font-semibold text-gray-800 dark:text-white"> {user.firstName} {user.lastName}</div>
         <Verification
                fee={user.fee}
                user={user}
                userId={userId}
                isAdCreator={isAdCreator}
                handlePayNow={handlePay}
              />
  
       <Ratingsmobile  
       user={user}
      recipientUid={user._id}
      handleOpenReview={handleOpenReview}/>
      </div>
    </div>
  
    {/* Contact Buttons */}
   {userId !== loggedId && ( <div className="flex items-center justify-center w-full gap-2 mt-4">
   <SignedIn>
       <button onClick={handleShowPhoneClick} className="flex text-sm gap-1 items-center justify-center border border-green-500 text-green-700 hover:bg-green-50 py-1 px-2 rounded-md text-sm font-medium">
         <Phone className="w-5 h-5" /> Call
      </button>
     
      <button onClick={() => {
        handleOpenChatId(userId);
      }} className="flex text-sm gap-1 items-center justify-center border border-green-500 text-green-700 hover:bg-green-50 py-1 px-2 rounded-md text-sm font-medium">
       <Mail className="w-5 h-5" /> Message
      </button>
   
      <button onClick={handlewhatsappClick} className="flex text-sm gap-1 items-center justify-center border border-green-500 text-green-700 hover:bg-green-50 py-1 px-2 rounded-md text-sm font-medium">
         <MessageCircle className="w-5 h-5" /> WhatsApp
      </button>
    </SignedIn>
      <SignedOut>
       <button onClick={() => {
         setIsOpenP(true);
                    router.push(`/sign-in`);
                  }} className="flex text-sm gap-1 items-center justify-center items-center justify-center border border-green-500 text-green-700 hover:bg-green-50 py-1 px-2 rounded-md text-sm font-medium">
        <Phone className="w-5 h-5" /> Call
      </button>
      <button onClick={() => {
         setIsOpenP(true);
                    router.push(`/sign-in`);
                  }} className="flex text-sm gap-1 items-center justify-center border border-green-500 text-green-700 hover:bg-green-50 py-1 px-2 rounded-md text-sm font-medium">
       <Mail className="w-5 h-5" /> Message
      </button>
      <button onClick={() => {
         setIsOpenP(true);
                    router.push(`/sign-in`);
                  }}
                  className="flex text-sm gap-1 items-center justify-center border border-green-500 text-green-700 hover:bg-green-50 py-1 px-2 rounded-md text-sm font-medium">
         <MessageCircle className="w-5 h-5" /> WhatsApp
      </button>
    </SignedOut>
  
     
    </div> )} 
  
    {/* Leave Feedback */}
    <div className="mt-4 justify-center items-center w-full">
       {userId === loggedId ? (
        <>
        <button onClick={() => handleOpenSettings()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-white border border-green-600 rounded-full shadow-sm hover:bg-green-50 active:bg-green-100 transition lg:text-base">
          <EditOutlinedIcon sx={{ fontSize: 14 }} />
           Edit Profile
        </button>
                </>):(
                  <>
                 <button onClick={() => {
                  handleOpenReview(user)
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-md text-sm font-semibold">
        😃 Leave Your Feedback
      </button>
      </>)}
               
             
     
    </div>
  
    {/* Share Section */}
    <div className="mt-6 border-t pt-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-white mb-2">Share Seller Profile</h3>
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
      
       
        <button onClick={handleCopy} className="flex items-center gap-1 hover:text-green-600">
          📋 {copied ? "Copied!" : "Copy Link"}
        </button>
        <button onClick={saveQRcode} className="flex items-center gap-1 hover:text-green-600">
          🔳 QR Code
        </button>
        <button onClick={handleShare} className="flex items-center gap-1 hover:text-green-600">
          📤 Share
        </button>
  
      </div>
    </div>
  </div>
        <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} /> 
      </div>
 
 
      <div className="flex w-full lg:w-[350px] flex-col mt-2 items-center dark:bg-[#2D3236] border dark:text-gray-100 bg-white rounded-lg p-1">
        <div className="divider"></div>
      
        {isActiveReviews === false && (
          <>
            <div className="divider"></div>
            {user?.businessname?.length > 0 ? (
              <>
                <div className="flex w-full gap-5 p-1 dark:bg-[#2D3236] dark:text-gray-100 bg-white rounded-lg">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        <p className="">
                          Seller business details...
                        </p>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-0 rounded-lg m-2">
                          {user?.imageUrl && (
                            <div className="flex h-50 w-full flex-1 justify-center">
                              <div className="relative">
                                {isLoading && (
                                  <div className="absolute inset-0 rounded-t-lg flex items-center justify-center bg-[#000000] bg-opacity-50">
                                    {/* Spinner or loading animation */}
                                    <CircularProgress
                                      sx={{ color: "white" }}
                                      size={30}
                                    />
                                  </div>
                                )}
                                <Zoom>
                                  <Image
                                    src={user?.imageUrl}
                                    alt="image"
                                    width={900}
                                    height={500}
                                    className={`object-center rounded-t-lg ${
                                      isLoading ? "opacity-0" : "opacity-100"
                                    } transition-opacity duration-300`}
                                    onLoadingComplete={() =>
                                      setIsLoading(false)
                                    }
                                    placeholder="empty" // Optional: you can use "empty" if you want a placeholder before loading
                                  />
                                </Zoom>
                              </div>
                            </div>
                          )}
                          <div className="m-3 p-1">
                            {user?.businessname && (
                              <div className="mb-5 md:flex-row">
                                <div className="text-gray-500 dark:text-gray-500 text-xs">
                                  Business Name
                                </div>
                                <div>{user?.businessname}</div>
                              </div>
                            )}
                            {user?.aboutbusiness && (
                              <div className="mb-5 md:flex-row">
                                <div className="text-gray-500 dark:text-gray-500 text-xs">
                                  About Business
                                </div>
                                <div>{user?.aboutbusiness}</div>
                              </div>
                            )}
                            {user?.businessaddress && (
                              <div className="mb-5 md:flex-row">
                                <div className="dark:text-gray-500 text-xs">
                                  Business Address
                                </div>
                                <div>{user?.businessaddress}</div>
                              </div>
                            )}
                            {user?.latitude && user?.latitude && (
                              <>
                                <div className="p-0 text-l rounded-lg overflow-hidden">
                                  <div className="">
                                    <p className="text-gray-500 dark:text-gray-500 text-xs">
                                      Location
                                    </p>
                                    <p className="mb-1 lg:text-xs text-[10px]">
                                      <LocationOnIcon sx={{ fontSize: 20 }} />{" "}
                                      GPS Location
                                    </p>
                                    <StreetmapOfice
                                      id={userId}
                                      name={user?.businessname}
                                      address={user?.businessaddress}
                                      imageUrl={user?.imageUrl ?? user?.photo}
                                      lat={user?.latitude}
                                      lng={user?.longitude}
                                    />
                                    <div className="justify-between flex w-full mb-5">
                                      <button
                                        onClick={handleDirectionClick}
                                        className="hover:bg-green-700 bg-[#000000] text-white text-xs mt-2 p-2 rounded-lg shadow"
                                      >
                                        <AssistantDirectionIcon
                                          sx={{ marginRight: "5px" }}
                                        />
                                        Get Direction
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {user?.businesshours &&
                              user?.businesshours?.length > 0 && (
                                <>
                                  <div className="flex flex-col gap-5 mb-0 md:flex-row">
                                    <div>
                                      <>
                                        <div className="flex flex-col gap-5 mb-0 md:flex-row">
                                          <div>
                                            <label>
                                              <p className="text-gray-500 dark:text-gray-500 text-xs">
                                                Office Open Time:
                                              </p>
                                            </label>
                                            <div className="flex flex-col gap-5 mb-5 md:flex-row text-[10px] lg:text-xs">
                                              <select
                                                className="dark:bg-[#131B1E] dark:text-[#F1F3F3] bg-gray-100 p-1 border rounded-sm"
                                                value={
                                                  user?.businesshours?.[0]
                                                    .openHour ?? ""
                                                }
                                              >
                                                {Array.from(
                                                  { length: 24 },
                                                  (_, i) => i
                                                ).map((hour) => (
                                                  <option
                                                    key={hour}
                                                    value={hour
                                                      .toString()
                                                      .padStart(2, "0")}
                                                  >
                                                    {hour
                                                      .toString()
                                                      .padStart(2, "0")}
                                                  </option>
                                                ))}
                                              </select>
                                              <select
                                                className="dark:bg-[#131B1E] dark:text-[#F1F3F3] bg-gray-100 p-1 border rounded-sm"
                                                value={
                                                  user?.businesshours?.[0]
                                                    .openMinute ?? ""
                                                }
                                              >
                                                {Array.from(
                                                  { length: 60 },
                                                  (_, i) => i
                                                ).map((minute) => (
                                                  <option
                                                    key={minute}
                                                    value={minute
                                                      .toString()
                                                      .padStart(2, "0")}
                                                  >
                                                    {minute
                                                      .toString()
                                                      .padStart(2, "0")}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>
                                          <div>
                                            <label>
                                              {" "}
                                              <p className="dark:text-gray-500 text-xs">
                                                Office Close Time:
                                              </p>
                                            </label>
                                            <div className="flex flex-col gap-5 mb-0 md:flex-row text-[10px] lg:text-xs">
                                              <select
                                                className="dark:bg-[#131B1E] dark:text-[#F1F3F3] bg-gray-100 p-1 border rounded-sm"
                                                value={
                                                  user?.businesshours?.[0]
                                                    .closeHour ?? ""
                                                }
                                              >
                                                {Array.from(
                                                  { length: 24 },
                                                  (_, i) => i
                                                ).map((hour) => (
                                                  <option
                                                    key={hour}
                                                    value={hour
                                                      .toString()
                                                      .padStart(2, "0")}
                                                  >
                                                    {hour
                                                      .toString()
                                                      .padStart(2, "0")}
                                                  </option>
                                                ))}
                                              </select>
                                              <select
                                                className="dark:bg-[#131B1E] dark:text-[#F1F3F3] bg-gray-100 p-1 border rounded-sm"
                                                value={
                                                  user?.businesshours?.[0]
                                                    .closeMinute ?? ""
                                                }
                                              >
                                                {Array.from(
                                                  { length: 60 },
                                                  (_, i) => i
                                                ).map((minute) => (
                                                  <option
                                                    key={minute}
                                                    value={minute
                                                      .toString()
                                                      .padStart(2, "0")}
                                                  >
                                                    {minute
                                                      .toString()
                                                      .padStart(2, "0")}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    </div>
                                  </div>
                                </>
                              )}

                            {user?.businesshours &&
                              user?.businessworkingdays?.length > 0 && (
                                <>
                                  <div className="flex flex-col gap-5 mb-5 md:flex-row">
                                    <div>
                                      <label>
                                        <p className="text-gray-500 dark:text-gray-500 text-xs">
                                          Office Working Days:
                                        </p>
                                      </label>

                                      <>
                                        <div className="flex text-[10px] gap-1 w-full items-center lg:text-xs">
                                          <input
                                            type="checkbox"
                                            checked={user?.businessworkingdays?.includes(
                                              "Sunday"
                                            )}
                                          />

                                          <label>Sunday</label>
                                        </div>
                                        <div className="flex text-[10px] gap-1 w-full items-center lg:text-xs">
                                          <input
                                            type="checkbox"
                                            checked={user?.businessworkingdays?.includes(
                                              "Monday"
                                            )}
                                          />
                                          <label>Monday</label>
                                        </div>
                                        <div className="flex text-[10px] gap-1 w-full items-center lg:text-xs">
                                          <input
                                            type="checkbox"
                                            checked={user?.businessworkingdays?.includes(
                                              "Tuesday"
                                            )}
                                          />
                                          <label>Tuesday</label>
                                        </div>
                                        <div className="flex text-[10px] gap-1 w-full items-center lg:text-xs">
                                          <input
                                            type="checkbox"
                                            checked={user?.businessworkingdays?.includes(
                                              "Wednesday"
                                            )}
                                          />
                                          <label>Wednesday</label>
                                        </div>
                                        <div className="flex text-[10px] gap-1 w-full items-center lg:text-xs">
                                          <input
                                            type="checkbox"
                                            checked={user?.businessworkingdays?.includes(
                                              "Thursday"
                                            )}
                                          />
                                          <label>Thursday</label>
                                        </div>
                                        <div className="flex text-[10px] gap-1 w-full items-center lg:text-xs">
                                          <input
                                            type="checkbox"
                                            checked={user?.businessworkingdays?.includes(
                                              "Friday"
                                            )}
                                          />
                                          <label>Friday</label>
                                        </div>
                                        <div className="flex text-[10px] gap-1 w-full items-center lg:text-xs">
                                          <input
                                            type="checkbox"
                                            checked={user?.businessworkingdays?.includes(
                                              "Saturday"
                                            )}
                                          />
                                          <label>Saturday</label>
                                        </div>
                                      </>
                                    </div>
                                  </div>
                                </>
                              )}
                      <div className="flex w-full gap-5 p-1 dark:bg-[#2D3236] dark:text-gray-100 bg-white rounded-lg">
                  
                        <p>
                        Seller Social media...
                        </p>
                     
                      <div className="justify-center gap-5">
                {user?.whatsapp && (
                  <Link
                    href={`${user?.facebook}`}
                    className="no-underline font-boldm-1 mr-2"
                  >
                    <FontAwesomeIcon icon={faFacebook} className="text-2xl" />
                  </Link>
                )}

                {user?.twitter && (
                  <Link
                    href={`${user?.twitter}`}
                    className="no-underline font-boldm-1 mr-2"
                  >
                    <FontAwesomeIcon icon={faTwitter} className="text-2xl" />
                  </Link>
                )}

                {user?.instagram && (
                  <Link
                    href={`${user?.instagram}`}
                    className="no-underline font-boldm-1 mr-2"
                  >
                    <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
                  </Link>
                )}
                {user?.tiktok && (
                  <Link
                    href={`${user?.tiktok}`}
                    className="no-underline font-boldm-1 mr-2"
                  >
                    <FontAwesomeIcon icon={faTiktok} className="text-2xl" />
                  </Link>
                )}

                {user?.website && (
                  <Link
                    href={`${user?.website}`}
                    className="no-underline font-boldm-1 mr-2"
                  >
                    <FontAwesomeIcon icon={faChrome} className="text-2xl" />
                  </Link>
                )}
              </div>
              </div>   
                       
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </>
            ) : (
              <>
                {/*     {userId === loggedId && (
                <div className="flex justify-center w-full p-1 items-center">
                  <div>
                    <a href={`/settings/`}>
                      <button className="p-2 gap-1 text-xs bg-green-900 rounded-lg text-white  hover:bg-green-600">
                        <EditOutlinedIcon sx={{ fontSize: 14 }} />
                        Edit your Profile
                      </button>
                    </a>
                  </div>
                </div>
              )}*/}
              </>
            )}
           
          </>
        )}
      </div>
   
     </>
  );
};

export default SellerProfile;
