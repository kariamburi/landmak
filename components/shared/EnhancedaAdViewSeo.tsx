"use client";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Navbar from "./navbar";
import Ads from "./Ads";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MessageIcon from "@mui/icons-material/Message";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DiamondIcon from "@mui/icons-material/Diamond";
import MappingAds from "./MappingAds";
import AdsDetials from "./AdsDetials";
import { MapIcon, ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import ChatButtonBottom from "./ChatButtonBottom";
import { Toaster } from "../ui/toaster";
import CollectionRelated from "./CollectionRelated";
import MobileNav from "./MobileNav";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import Unreadmessages from "./Unreadmessages";
import StyledBrandName from "./StyledBrandName";
import { useRouter } from "next/navigation";
import ProgressPopup from "./ProgressPopup";
const options = [
  { value: 'both', label: 'Split View', icon: <Squares2X2Icon className="w-5 h-5" /> },
  { value: 'map', label: 'Map View', icon: <MapIcon className="w-5 h-5" /> },
  { value: 'list', label: 'Ad View', icon: <ListBulletIcon className="w-5 h-5" /> },
];

interface AdsProps {
  userId: string;
  userName: string;
  userImage: string;
  ad: any;
  user: any;
  id: string;
  //onClose: () => void;
  //handleOpenAbout: () => void;
  ////handleOpenTerms: () => void;
  //handleOpenPrivacy: () => void;
  //handleOpenSafety: () => void;
  //handleOpenSell: (category?: string, subcategory?: string) => void;
  //handleOpenPlan: () => void;
  //handleOpenChat: () => void;
  //handleOpenBook: () => void;
  //handleAdView: (ad: any) => void;
  //handleAdEdit: (ad: any) => void;
  //handlePay: (id: string) => void;
  //handleSubCategory: (category: string, subcategory: string) => void;
  //handleOpenReview: (value: any) => void;
  //handleOpenShop: (value: any) => void;
  //handleOpenChatId: (value: any) => void;
  //handleOpenSettings: () => void;
  //handleOpenPerfomance: () => void;
}

export default function EnhancedaAdViewSeo({
  userId,
  userName,
  userImage,
  user,
  ad,
  id,
  //onClose,
  //handleOpenSell,
  //handleOpenBook,
  //handleOpenChat,
  //handleOpenPlan,
  //handleAdView,
  //handleAdEdit,
  //handleSubCategory,
  //handleOpenAbout,
  //handleOpenTerms,
  //handleOpenPrivacy,
  //handleOpenSafety,
  //handleOpenReview,
  //handleOpenShop,
  //handleOpenChatId,
  //handleOpenSettings,
  //handleOpenPerfomance,
  //handlePay,
}: AdsProps) {

  const [showList, setShowList] = useState(true);
  const [showMap, setShowMap] = useState(true);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  const handleSelectOpt = (opt: typeof options[number]) => {
    setSelected(opt);
    setOpen(false);
    setShowMap(opt.value === 'map' || opt.value === 'both');
    setShowList(opt.value === 'list' || opt.value === 'both');
  };
  useEffect(() => {
    const isMobile = window.innerWidth < 640; // Tailwind's sm breakpoint

    if (isMobile) {
      setShowList(true);
      setShowMap(false); // Show only list on mobile
    } else {
      setShowList(true);
      setShowMap(true); // Show both on desktop
    }
  }, []);
  const toggleMap = () => {
    if (!showMap && !showList) setShowList(true); // always show at least one
    setShowMap(!showMap);
  };

  const toggleList = () => {
    if (!showMap && !showList) setShowMap(true);
    setShowList(!showList);
  };

  const truncatetitle = (address: string, maxLength: number) => {
    if (address.length > maxLength) {
      return address.substring(0, maxLength) + "...";
    }
    return address;
  };
  const toggleMapCommit = () => {
    setShowList(false);
    setShowMap(true);
  };
  const toggleListCommit = () => {
    setShowList(true);
    setShowMap(false);
  };

  const [isOpenP, setIsOpenP] = useState(false);
  const router = useRouter();
  const handleCloseP = () => {
    setIsOpenP(false);
  };
  const handleOpenP = () => {
    setIsOpenP(true);
  };

  const [isOpenEnquire, setIsOpenEnquire] = useState(false);
  const handleCloseEnquire = () => {
    setIsOpenEnquire(false);
  };
  const handleOpenEnquire = () => {
    setIsOpenEnquire(true);
  };

  const handleSubCategory = (category: string, subcategory: string) => {
    setIsOpenP(true);
    router.push("/?category=" + ad.data.category + "&subcategory=" + ad.data.subcategory);
  };


  const onClose = () => {
    setIsOpenP(true);
    router.push("/");
  };
  const handleOpenAbout = () => {
    setIsOpenP(true);
    router.push("/?about=about");
  };
  const handleOpenTerms = () => {
    setIsOpenP(true);
    router.push("/?terms=terms");
  };
  const handleOpenPrivacy = () => {
    setIsOpenP(true);
    router.push("/?privacy=privacy");
  };

  const handleOpenSafety = () => {
    setIsOpenP(true);
    router.push("/?safety=safety");
  };
  const handleOpenShop = (value: any) => {
    setIsOpenP(true);
    router.push("/?shop=" + value);
  };
  const handleOpenPerfomance = () => {
    setIsOpenP(true);
    router.push("/?performance=performance");
  };
  const handleOpenSettings = () => {
    setIsOpenP(true);
    router.push("/?settings=settings");
  };

  const handleOpenBook = () => {
    setIsOpenP(true);
    router.push("/?bookmark=bookmark");
  };
  const handleOpenPlan = () => {
    setIsOpenP(true);
    router.push("/?plan=plan");
  };
  const handleOpenChat = () => {
    setIsOpenP(true);
    router.push("/?chat=chat");
  };

  const handleOpenSell = (category?: string, subcategory?: string) => {
    setIsOpenP(true);
    router.push("/?sell_category=" + category || 'sell' + "&sell_subcategory=" + subcategory || '');
  };
  const handlePay = (id: string) => {
    setIsOpenP(true);
    router.push("/?payId=" + id);
  };
  const handleOpenReview = (value: any) => {
    setIsOpenP(true);
    router.push("/?reviewId=" + value);
  };
  const handleOpenChatId = (value: any) => {
    setIsOpenP(true);
    router.push("/?chatId=" + value);
  };
  const handleAdView = (ad: any) => {
    setIsOpenP(true);
    router.push("/?Ad=" + ad._id);
  };
  const handleAdEdit = () => {
    setIsOpenP(true);
    router.push("/?AdEdit=" + ad._id);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen overflow-hidden">
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between">


        <div
          className={`bg-gradient-to-b from-green-600 to-green-600 lg:from-[#e4ebeb] justify-center pl-2 pr-2 h-[60px] lg:to-[#e4ebeb] transition-all duration-300 overflow-visible w-full flex flex-col items-center`}
        >
          <div className="w-full h-full justify-between flex items-center">
            <div className="flex items-center gap-1">

              <div
                className="mr-2 w-5 h-8 flex text-white lg:text-gray-700 items-center justify-center rounded-sm tooltip tooltip-bottom hover:cursor-pointer lg:hover:text-green-600"
                data-tip="Back"
                onClick={() => {
                  setIsOpenP(true);
                  router.push("/");
                }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ArrowBackOutlinedIcon />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Home</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center gap-2">

                <img src="/logo_white.png" alt="Logo" className="w-8 h-8 lg:hidden rounded-full" />
                <img src="/logo.png" alt="Logo" className="w-8 h-8 hidden lg:inline rounded-full" />
                <StyledBrandName />
              </div>

            </div>

            {/*  <div className="hidden lg:inline">

              <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex">
                  <div className="mt-2 shadow-sm border text-gray-600 hover:text-green-600 dark:hover:bg-[#3E454A] dark:bg-[#2D3236] dark:hover:text-gray-300 dark:text-gray-500 bg-white py-1 px-2 rounded-full mr-1">
                    <div
                      onClick={() => {
                        setIsOpenP(true);
                        router.push("/");
                      }}
                    >
                      <div className="flex items-center gap-2 cursor-pointer ">
                        <p className="text-xs lg:text-sm"> All Ads</p><ArrowForwardIosOutlinedIcon sx={{ fontSize: 14 }} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 shadow-sm border text-gray-600 hover:text-green-600 dark:hover:bg-[#3E454A] dark:bg-[#2D3236] dark:hover:text-gray-300 dark:text-gray-500 bg-white py-1 px-2 rounded-full mr-1">
                    <div className="flex items-center">
                      {ad && (
                        <div
                          onClick={() => {
                            handleSubCategory(ad.data.category, '');


                          }}
                          className="flex items-center gap-2 cursor-pointer"
                        >

                          <p className="text-xs lg:text-sm">{ad.data.category}</p><ArrowForwardIosOutlinedIcon sx={{ fontSize: 14 }} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 shadow-sm border text-gray-600 hover:text-green-600 dark:hover:bg-[#3E454A] dark:bg-[#2D3236] dark:hover:text-gray-300 bg-white dark:text-gray-500 py-1 px-2 rounded-full mr-1">
                    <div className="flex items-center">
                      {ad && (
                        <div
                          onClick={() => {
                            handleSubCategory(ad.data.category, ad.data.subcategory);
                            // setIsOpenP(true);
                            // router.push("/category=" + ad.data.category+"&subcategory=");

                          }}
                          className="flex items-center gap-2 cursor-pointer"
                        >

                          <p className="text-xs lg:text-sm">{ad.data.subcategory}</p><ArrowForwardIosOutlinedIcon sx={{ fontSize: 14 }} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 shadow-sm border text-gray-800 dark:bg-[#2D3236] dark:text-gray-300 bg-white py-1 px-2 rounded-full">
                    <div className="flex items-center">

                      {ad && <p className="text-xs truncate w-full max-w-full lg:text-sm">{truncatetitle(ad.data.title, 30)}</p>}
                    </div>
                  </div>
                </div>


              </div>
           
           
       </div>
        */}
            <div className="flex gap-2 items-center">
              <div className="hidden lg:inline">

                <div className="flex items-center gap-2">
                  <div className="relative w-48 text-sm">
                    <button
                      onClick={() => setOpen(!open)}
                      className="flex items-center justify-between w-full px-4 py-2 border rounded bg-white shadow-sm"
                    >
                      <span className="flex items-center gap-2">
                        {selected.icon}
                        {selected.label}
                      </span>
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {open && (
                      <ul className="absolute mt-1 w-full bg-white border rounded shadow z-50">
                        {options.map((opt) => (
                          <li
                            key={opt.value}
                            onClick={() => handleSelectOpt(opt)}
                            className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                          >
                            {opt.icon}
                            {opt.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <SignedIn>
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white hover:bg-gray-100 emerald-500 tooltip tooltip-bottom hover:cursor-pointer"
                      data-tip="Messages"
                      onClick={() => {
                        handleOpenBook();
                      }}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <BookmarkIcon sx={{ fontSize: 16 }} className="" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Bookmark</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </SignedIn>
                  <SignedOut>
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white hover:bg-gray-100 tooltip tooltip-bottom hover:cursor-pointer"
                      data-tip="Messages"
                      onClick={() => {
                        setIsOpenP(true);
                        router.push("/sign-in");
                      }}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <BookmarkIcon sx={{ fontSize: 16 }} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Bookmark</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </SignedOut>
                  <SignedIn>
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white hover:bg-gray-100 tooltip tooltip-bottom hover:cursor-pointer"
                      data-tip="Messages"
                      onClick={() => {
                        handleOpenChat();
                      }}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="relative flex items-center justify-center">
                              <MessageIcon sx={{ fontSize: 16 }} className="absolute " />
                              <div className="absolute z-10">
                                <Unreadmessages userId={userId} popup={"home"} />
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div
                              onClick={() => {
                                handleOpenChat();
                              }}
                              className="flex gap-1"
                            >
                              Chats
                              <Unreadmessages userId={userId} popup={"home"} />
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </SignedIn>
                  <SignedOut>
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white tooltip tooltip-bottom hover:cursor-pointer"
                      data-tip="Messages"
                      onClick={() => {
                        setIsOpenP(true);
                        router.push("/sign-in");
                      }}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <MessageIcon sx={{ fontSize: 16 }} className="absolute" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Message</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </SignedOut>


                  <div
                    className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white hover:bg-gray-100 tooltip tooltip-bottom hover:cursor-pointer"
                    data-tip="Messages"
                    onClick={() => {
                      handleOpenPlan();
                    }}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DiamondIcon sx={{ fontSize: 16 }} className="" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Premium Services</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div>
                    <SignedIn>

                      <Button onClick={() => {
                        handleOpenSell();
                      }} variant="default" className="flex bg-green-600 hover:bg-green-700 items-center gap-2">
                        <AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL
                      </Button>

                    </SignedIn>


                  </div>
                  <div>
                    <SignedOut>
                      <Button onClick={() => {
                        setIsOpenP(true);
                        router.push("/sign-in");
                      }} variant="default" className="flex bg-green-600 hover:bg-green-700 items-center gap-2">
                        <AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL
                      </Button>


                    </SignedOut>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <SignedIn>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white tooltip tooltip-bottom hover:cursor-pointer">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>

                <MobileNav userstatus={user?.status ?? "User"} userId={userId ?? null} user={user ?? []}
                  popup={"sell"}
                  handleOpenSell={handleOpenSell}
                  handleOpenBook={handleOpenBook}
                  handleOpenPlan={handleOpenPlan}
                  handleOpenChat={handleOpenChat}
                  handleOpenShop={handleOpenShop}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings}
                  handleOpenAbout={handleOpenAbout}
                  handleOpenTerms={handleOpenTerms}
                  handleOpenPrivacy={handleOpenPrivacy}
                  handleOpenSafety={handleOpenSafety}
                  onClose={onClose} />
              </div>

            </div>
          </div>
        </div>


      </div>

      {/* Main Content */}
      <main className="flex-1 flex bg-[#e4ebeb] flex-col lg:p-4 h-full overflow-hidden pt-[50px] lg:pt-[55px]">
        {/* Header*/}


        <div className="relative flex-1 overflow-hidden">

          {/* Dynamic Layout */}
          <div
            className="grid gap-4 h-full transition-all duration-300 relative"
            style={{
              gridTemplateColumns:
                showList && showMap
                  ? '2fr 1fr'
                  : showList || showMap
                    ? '1fr'
                    : '0fr',
            }}
          >
            {/* Property List */}
            {showList && (
              <div className="relative lg:space-y-4 overflow-y-auto lg:pr-2 h-full">
                {/* Toggle Button - Positioned at edge of Property List */}
                <style jsx>{`
    @media (max-width: 1024px) {
      div::-webkit-scrollbar {
        display: none;
      }
    }
  `}</style>
                <AdsDetials
                  ad={ad}
                  user={user}
                  userId={userId || ""}
                  userName={userName || ""}
                  userImage={userImage || ""}
                  isMapVisible={showMap}
                  handlePay={handlePay}
                  onClose={onClose}
                  handleSubCategory={handleSubCategory}
                  handleOpenReview={handleOpenReview}
                  handleOpenShop={handleOpenShop}
                  handleOpenSell={handleOpenSell}
                  handleOpenPlan={handleOpenPlan}
                  handleOpenSafety={handleOpenSafety} />

                <h2 className="font-bold p-2 text-[30px]">Related Ads</h2>
                <div className="p-1 mb-24 lg:mb-0">
                  <CollectionRelated
                    emptyTitle="No Related Ads Found"
                    emptyStateSubtext="Come back later"
                    collectionType="All_Ads"
                    limit={16}
                    userId={userId || ""}
                    userName={userName || ""}
                    userImage={userImage || ""}
                    categoryId={ad.subcategory.category}
                    subcategory={ad.data.subcategory}
                    adId={id}
                    handleOpenChatId={handleOpenChatId}
                    handleAdView={handleAdView}
                    handleAdEdit={handleAdEdit}
                    handleOpenPlan={handleOpenPlan}
                  />
                  {isOpenEnquire && (<ChatButtonBottom
                    ad={ad}
                    userId={userId}
                    userImage={userImage}
                    userName={userName}
                    handleCloseEnquire={handleCloseEnquire}
                  />)}
                  <Toaster />
                </div>

                {/* Floating Map Button - Only on mobile */}
                {showList && !showMap && (
                  <button
                    className="fixed flex gap-1 bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg sm:hidden"
                    onClick={() => toggleMapCommit()}
                  >
                    <MapIcon className="w-5 h-5" /> View Map
                  </button>
                )}
              </div>
            )}

            {/* Map View */}
            {showMap && ad.data.category !== 'Wanted Ads' && ad.data.propertyarea?.location && ad.data.propertyarea?.location.length !== 0 && (
              <div className="w-full h-full">
                <MappingAds
                  category={ad.data.category}
                  data={ad.data.propertyarea}
                />
                {/* Back to List Button */}
                {showMap && !showList && (
                  <button
                    className="flex gap-1 absolute bottom-4 left-4 bg-white text-black px-3 py-1 rounded shadow"
                    onClick={() => toggleListCommit()}
                  >
                    ← Back to Ad View <ListBulletIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>


      </main>
      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
    </div>
  );
}

























































































































































