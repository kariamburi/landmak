"use client";
import { IAd } from "@/lib/database/models/ad.model";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import React, { useState } from "react";
import ChatButton from "./ChatButton";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/Call";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import Link from "next/link";
import Verification from "./Verification";
import Image from "next/image";
import SellerProfileMobile from "./SellerProfileMobile";
import Verificationmobile from "./Verificationmobile";
import Ratingsmobile from "./ratingsmobile";
import { updatecalls, updatewhatsapp } from "@/lib/actions/ad.actions";
import ChatButtonBottom from "./ChatButtonBottom";
import ProgressPopup from "./ProgressPopup";
type chatProps = {
  userId: string;
  userName: string;
  userImage: string;
  ad: any;
  user: any;
  handleOpenReview: (value:any) => void;
  handleOpenChatId: (value:string) => void;
  handleOpenShop: (value:any) => void;
  handleOpenPlan: () => void;
  handleOpenSettings: () => void;
  handleOpenEnquire: () => void;
  handlePay: (id:string) => void;
};
const Contact = ({ ad, user, userId, userName, userImage, handleOpenEnquire, handlePay, handleOpenReview, handleOpenChatId, handleOpenSettings, handleOpenShop }: chatProps) => {
  const [showphone, setshowphone] = useState(false);
  const [isOpenP, setIsOpenP] = useState(false);
  const handleOpenP = () => {
    setIsOpenP(true);
  };

  const handleCloseP = () => {
    setIsOpenP(false);
  };
  const handleShowPhoneClick = async (e: any) => {
    setshowphone(true);
    setIsOpenP(true);
    const calls = (Number(ad.calls ?? "0") + 1).toString();
    const _id = ad._id;
    await updatecalls({
      _id,
      calls,
      path: `/ads/${ad._id}`,
    });
    window.location.href = `tel:${ad.data.phone}`;
    setIsOpenP(false);
  };

  const handlewhatsappClick = async (e: any) => {
    setIsOpenP(true);
    const whatsapp = (Number(ad.whatsapp ?? "0") + 1).toString();
    const _id = ad._id;
    await updatewhatsapp({
      _id,
      whatsapp,
      path: `/ads/${ad._id}`,
    });
    window.location.href = `https://wa.me/${ad.organizer.whatsapp}/`;
    setIsOpenP(false);
  };

  const isAdCreator = userId === ad.organizer._id;
   
  return (
    <div className="w-full">
      <div className="lg:hidden justify-between flex w-full gap-1">
        <Verificationmobile
          user={ad.organizer}
          userId={userId}
          fee={user?.user?.fee ?? 500}
          isAdCreator={isAdCreator}
          handlePayNow={handlePay}
        />
        <Ratingsmobile recipientUid={ad.organizer._id} user={ad.organizer} handleOpenReview={handleOpenReview} />
      </div>
      <div className="justify-between lg:justify-end flex w-full gap-1">
        <div className="lg:hidden flex gap-1 items-center p-1 w-full">
          <SellerProfileMobile
            userId={userId}
            ad={ad}
            userName={userName}
            userImage={userImage} handleOpenReview={handleOpenReview} handleOpenChatId={handleOpenChatId} handleOpenSettings={handleOpenSettings} handleOpenShop={handleOpenShop}/>
        </div>
        <div className="flex items-center gap-2 p-1 lg:bottom-[10px] lg:mr-20">
          <SignedIn>
            <button
              className="bg-green-600 hover:bg-green-700 text-white text-xs mt-2 p-2 rounded-lg shadow"
              onClick={handleShowPhoneClick}
            >
              <CallIcon sx={{ fontSize: 24 }} />

             {/* <div className="hidden lg:inline">Call</div> */}
            </button>
          </SignedIn>
          <SignedOut>
            <a href={`/sign-in`}>
              <button className="bg-green-600 hover:bg-green-700 text-white text-xs mt-2 p-2 rounded-lg shadow">
                <CallIcon sx={{ fontSize: 24 }} />
               {/*  <div className="hidden lg:inline">Call</div>*/}
              </button>
            </a>
          </SignedOut>

          <SignedIn>
             <button
                          className="bg-green-600 hover:bg-green-700 text-white text-xs mt-2 p-2 rounded-lg shadow"
                          onClick={() => handleOpenEnquire()}
                        >
                          <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 24 }} />
                          {/*<div className="hidden lg:inline"> Enquire</div>*/}
                        </button>
           
          </SignedIn>
          <SignedOut>
            <a href={`/sign-in`}>
              <button className="flex gap-1 bg-green-600 hover:bg-green-700 text-white text-xs mt-2 p-2 rounded-lg shadow">
                <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 24 }} />
                {/*<div className="hidden lg:inline">Message</div>*/}
              </button>
            </a>
          </SignedOut>

          {ad.organizer.whatsapp && (
            <>
              <SignedIn>
                <button
                  onClick={handlewhatsappClick}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs mt-2 p-2 rounded-lg shadow"
                >
                  <WhatsAppIcon sx={{ fontSize: 24 }} />

                 {/*  <div className="hidden lg:inline">WhatsApp</div>*/}
                </button>
              </SignedIn>
              <SignedOut>
                <a href={`/sign-in`}>
                  <button className="bg-green-600 hover:bg-green-700 text-white text-xs mt-2 p-2 rounded-lg shadow">
                    <WhatsAppIcon sx={{ fontSize: 24 }} />

                  {/*  <div className="hidden lg:inline">WhatsApp</div>*/}
                  </button>
                </a>
              </SignedOut>
            </>
          )}
        </div>
      </div>
      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
    </div>
  );
};

export default Contact;
