// components/ChatWindow.js
"use client";
import React, { useEffect, useRef, useState } from "react";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import Image from "next/image";
import CreateCategoryForm from "./CreateCategoryForm";

import { ICategory } from "@/lib/database/models/category.model";
import { getAllSubCategories } from "@/lib/actions/subcategory.actions";
import { formUrlQuerymultiple, removeKeysFromQuery } from "@/lib/utils";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import ProgressPopup from "./ProgressPopup";
import BottomNavigation from "./BottomNavigation";
import { useToast } from "../ui/use-toast";
import SearchNow from "./SearchNow";
import Masonry from "react-masonry-css";
import CardAutoHeight from "./CardAutoHeight";
import { getAlldynamicAd } from "@/lib/actions/dynamicAd.actions";
import { IdynamicAd } from "@/lib/database/models/dynamicAd.model";
import VerticalCard from "./VerticalCard";
import Skeleton from "@mui/material/Skeleton";
import SearchNowTitle from "./SearchNowTitle";
interface ChatWindowProps {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
  handleAdEdit: (ad:any) => void;
  handleAdView: (ad:any) => void;
 
  handleOpenPlan: () => void;
  handleOpenSearchByTitle: () => void;
  queryObject:any;
  
}

const SearchByTitle: React.FC<ChatWindowProps> = ({
  isOpen,
  userId,
  onClose,
  handleAdView,
  handleAdEdit,
  handleOpenPlan,
  handleOpenSearchByTitle,
  queryObject,
}) => {
  const { toast } = useToast();
 
const [loading, setLoading] = useState(true);
//const observer = useRef<IntersectionObserver | null>(null);
 const [data, setAds] = useState<IdynamicAd[]>([]); // Initialize with an empty array
 const [page, setPage] = useState(1);
 const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [newpage, setnewpage] = useState(false);
 const [totalPages, setTotalPages] = useState(1);
 const [newqueryObject, setNewqueryObject] = useState<any>(queryObject);
  const observer = useRef<IntersectionObserver | null>(null);
 // Keep the early return after defining hooks
 const handleFilter = (value:any) => {
   
  setNewqueryObject({
    ...queryObject, // Preserve existing properties
    ...value,
  });
  };
const fetchAds = async () => {
    setLoading(true);
    try {
      
      const Ads = await getAlldynamicAd({
        queryObject: newqueryObject,
        page,
        limit: 20,
      });

      if (newpage) {
        setnewpage(false);
        setAds((prevAds: IdynamicAd[]) => {
          const existingAdIds = new Set(prevAds.map((ad) => ad._id));
          // Filter out ads that are already in prevAds
          const newAds = Ads?.data.filter(
            (ad: IdynamicAd) => !existingAdIds.has(ad._id)
          );

          return [...prevAds, ...newAds]; // Return updated ads
        });
      } else {
        setnewpage(false);
        setAds(Ads?.data);
      }

      setTotalPages(Ads?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching ads", error);
    } finally {
      setLoading(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    if (!newpage) {
      setPage(1);
    }
    fetchAds();
  }, [page, newqueryObject]);

  const lastAdRef = (node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page < totalPages) {
        setnewpage(true);
        setPage((prevPage: any) => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  };
  const breakpointColumns = {
    default: 4, // 3 columns on large screens
    1100: 3, // 2 columns for screens <= 1100px
    700: 2, // 1 column for screens <= 700px
  };
 
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="dark:bg-[#2D3236] dark:text-gray-300 bg-gray-200 rounded-lg p-1 lg:p-6 w-full h-full flex flex-col">
       <button
                        onClick={onClose}
                        className="flex justify-center items-center h-12 w-12 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 hover:text-green-600 rounded-full"
                      >
                        <CloseOutlinedIcon />
                      </button>
        {/* Header */}
        <div className="flex flex-col items-center w-full h-[90vh]">
          <div className="w-full h-[60px] dark:bg-[#2D3236]">
          <SearchNowTitle handleFilter={handleFilter}/>
          </div>
        <ScrollArea.Root className="flex-1 overflow-hidden">
        <ScrollArea.Viewport className="h-full overflow-y-auto bg-gray-200 lg:rounded-t-0 border">
            
          
            {data.length > 0 ? (
             
               <Masonry
                  breakpointCols={breakpointColumns}
                  className="p-1 mt-4 mb-20 lg:mb-0 lg:mt-0 w-full flex gap-2 lg:gap-4 overflow-hidden"
                  columnClassName="bg-clip-padding"
                >
                  {data.map((ad: any, index: number) => {
                 
                    return (
                      <div
                        ref={data.length === index + 1 ? lastAdRef : null}
                        key={ad._id}
                        className="flex justify-center w-full"
                      >
                        <VerticalCard
                          ad={ad}
                          hasOrderLink={true}
                          hidePrice={false}
                          userId={userId}
                          handleAdEdit={handleAdEdit}
                          handleAdView={handleAdView}
                          handleOpenPlan={handleOpenPlan}
                        
                        />
                      </div>
                    );
                  })}
               </Masonry> 
            
            ) : (
              !loading && (
                <div className="flex items-center justify-center min-h-[400px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
                  <h3 className="font-bold text-[16px] lg:text-[25px]">0 results</h3>
                  <p className="text-sm lg:p-regular-14">No Search results</p>
                  
                </div>
              )
            )}
          {loading && (
              <div>
                {isInitialLoading ? (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <div key={index} className="bg-gray-200 dark:bg-[#2D3236] p-4 rounded-lg shadow-md w-full">
                        <Skeleton variant="rectangular" width="100%" height={140} />
                        <Skeleton variant="text" width="80%" height={30} className="mt-2" />
                        <Skeleton variant="text" width="60%" height={25} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full min-h-[400px] h-full flex flex-col items-center justify-center">
                    <Image src="/assets/icons/loading2.gif" alt="loading" width={40} height={40} unoptimized />
                  </div>
                )}
              </div>
            )}
       </ScrollArea.Viewport>
         <ScrollArea.Scrollbar orientation="vertical" />
             <ScrollArea.Corner />
           </ScrollArea.Root>
       
        </div>

      </div>
    </div>
  );
};

export default SearchByTitle;
