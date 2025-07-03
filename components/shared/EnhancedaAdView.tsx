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
import MappingAds from "./MappingAds";
import AdsDetials from "./AdsDetials";
import { MapIcon, ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import ChatButtonBottom from "./ChatButtonBottom";
import { Toaster } from "../ui/toaster";
import CollectionRelated from "./CollectionRelated";
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
  onClose: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenSell: (category?: string, subcategory?: string) => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenBook: () => void;
  handleAdView: (ad: any) => void;
  handleAdEdit: (ad: any) => void;
  handlePay: (id: string) => void;
  handleSubCategory: (category: string, subcategory: string) => void;
  handleOpenReview: (value: any) => void;
  handleOpenShop: (value: any) => void;
  handleOpenChatId: (value: any) => void;
  handleOpenSettings: () => void;
  handleOpenPerfomance: () => void;
}

export default function EnhancedaAdView({
  userId,
  userName,
  userImage,
  user,
  ad,
  id,
  onClose,
  handleOpenSell,
  handleOpenBook,
  handleOpenChat,
  handleOpenPlan,
  handleAdView,
  handleAdEdit,
  handleSubCategory,
  handleOpenAbout,
  handleOpenTerms,
  handleOpenPrivacy,
  handleOpenSafety,
  handleOpenReview,
  handleOpenShop,
  handleOpenChatId,
  handleOpenSettings,
  handleOpenPerfomance,
  handlePay,
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


  const toggleMapCommit = () => {
    setShowList(false);
    setShowMap(true);
  };
  const toggleListCommit = () => {
    setShowList(true);
    setShowMap(false);
  };


  const [isOpenEnquire, setIsOpenEnquire] = useState(false);
  const handleCloseEnquire = () => {
    setIsOpenEnquire(false);
  };
  const handleOpenEnquire = () => {
    setIsOpenEnquire(true);
  };
  return (
    <div className="flex flex-col lg:flex-row w-full h-screen overflow-hidden">
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between">

        <Navbar user={user ?? []} userstatus={user?.status ?? "User"} userId={userId} onClose={onClose} popup={"sell"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
          handleOpenPerfomance={handleOpenPerfomance}
          handleOpenSettings={handleOpenSettings}
          handleOpenAbout={handleOpenAbout}
          handleOpenTerms={handleOpenTerms}
          handleOpenPrivacy={handleOpenPrivacy}
          handleOpenSafety={handleOpenSafety}
          handleOpenShop={handleOpenShop} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex bg-[#e4ebeb] flex-col lg:p-4 h-full overflow-hidden pt-[50px] lg:pt-[55px]">
        {/* Header*/}
        <div className="hidden lg:inline">

          <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
            <div className="flex">
              <div className="mt-2 border text-gray-600 hover:text-green-600 dark:hover:bg-[#3E454A] dark:bg-[#2D3236] dark:hover:text-gray-300 dark:text-gray-500 bg-white py-1 px-2 rounded-full mr-1">
                <div
                  onClick={() => {
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2 cursor-pointer ">
                    <p className="text-xs lg:text-sm"> All Ads</p><ArrowForwardIosOutlinedIcon sx={{ fontSize: 14 }} />
                  </div>
                </div>
              </div>
              <div className="mt-2 border text-gray-600 hover:text-green-600 dark:hover:bg-[#3E454A] dark:bg-[#2D3236] dark:hover:text-gray-300 dark:text-gray-500 bg-white py-1 px-2 rounded-full mr-1">
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
              <div className="mt-2 border text-gray-600 hover:text-green-600 dark:hover:bg-[#3E454A] dark:bg-[#2D3236] dark:hover:text-gray-300 bg-white dark:text-gray-500 py-1 px-2 rounded-full mr-1">
                <div className="flex items-center">
                  {ad && (
                    <div
                      onClick={() => {
                        handleSubCategory(ad.data.category, ad.data.subcategory);

                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >

                      <p className="text-xs lg:text-sm">{ad.data.subcategory}</p><ArrowForwardIosOutlinedIcon sx={{ fontSize: 14 }} />
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2 border text-gray-800 dark:bg-[#2D3236] dark:text-gray-300 bg-white py-1 px-2 rounded-full">
                <div className="flex items-center">

                  {ad && <p className="text-xs lg:text-sm">{ad.data.title}</p>}
                </div>
              </div>
            </div>

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
          </div>
        </div>
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
    </div>
  );
}

























































































































































