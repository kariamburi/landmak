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
import { Button } from "../ui/button";
interface ChatWindowProps {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
  handleAdEdit: (ad:any) => void;
  handleAdView: (ad:any) => void;
 handleOpenChatId:(value:any) => void;
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
  handleOpenChatId,
  queryObject,
}) => {
  const { toast } = useToast();
 
const [loading, setLoading] = useState(false);
//const observer = useRef<IntersectionObserver | null>(null);
 const [data, setAds] = useState<IdynamicAd[]>([]); // Initialize with an empty array
 const [page, setPage] = useState(1);
 const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [newpage, setnewpage] = useState(false);
 const [totalPages, setTotalPages] = useState(1);
 const [query, setQuery] = useState('');
 const [newqueryObject, setNewqueryObject] = useState<any>([]);
  const observer = useRef<IntersectionObserver | null>(null);
 // Keep the early return after defining hooks
 const handleFilter = (value:any) => {
  setQuery(value.query);
  setNewqueryObject({
    ...queryObject, // Preserve existing properties
    ...value,
  });
  setAds([]);
  if(value.query){
  setLoading(true);
  fetchAds(value.query);
  }
  };
const fetchAds = async (value:string) => {
    setLoading(true);
    try {
      const Ads = await getAlldynamicAd({
        queryObject: {query:value},
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

   // useEffect(() => {
   // if (!newpage) {
   //   setPage(1);
   // }
   // fetchAds();
   // }, [page, newqueryObject]);

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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-20">
      <div className="dark:bg-[#2D3236] dark:text-gray-300 bg-[#e4ebeb] rounded-lg p-1 lg:p-6 w-full h-full flex flex-col">
      
        {/* Header */}
        <div className="flex flex-col items-center w-full h-[90vh]">
         
          <div className="w-full mt-2 flex h-[60px] dark:bg-[#2D3236]">
           
          <SearchNowTitle handleFilter={handleFilter} onClose={onClose}/>
        
        
          </div>
        <ScrollArea.Root className="flex-1 overflow-hidden">
        <ScrollArea.Viewport className="h-full overflow-y-auto bg-[#e4ebeb] lg:rounded-t-0 border">
            
          
            {data.length > 0 ? (<div className="flex flex-col">
              <p className="text-sm lg:text-[16px] text-gray-500">
             {data.length > 0
               ? `Found ${data.length} results for “${query}”`
               : `No results found for “${query}”`}
           </p>
               <Masonry
                  breakpointCols={breakpointColumns}
                  className="p-1 mt-2 mb-20 lg:mb-0 lg:mt-0 w-full flex gap-2 lg:gap-4 overflow-hidden"
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
                          handleOpenChatId={handleOpenChatId}
                          handleAdEdit={handleAdEdit}
                          handleAdView={handleAdView}
                          handleOpenPlan={handleOpenPlan}
                        
                        />
                      </div>
                    );
                  })}
               </Masonry> 
            
               </div>) : (
              !loading && (
                <div className="flex items-center justify-center min-h-[400px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
                <h3 className="font-bold text-[16px] lg:text-[25px]">No results found</h3>
                <p className="text-sm lg:text-[16px] text-gray-500">
                  We couldn&apos;t find anything matching your search. <br />
                  Try using different keywords or filters.
                </p>
              </div>
              
              )
            )}
          {loading && (
              <div>
               
                  <div className="w-full min-h-[400px] h-full flex flex-col items-center justify-center">
                    <Image src="/assets/icons/loading2.gif" alt="loading" width={40} height={40} unoptimized /><div>Searching..</div>
                  </div>
              
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
