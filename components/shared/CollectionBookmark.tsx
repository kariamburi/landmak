import { IAd } from "@/lib/database/models/ad.model";
import React, { useEffect, useRef, useState } from "react";
import Pagination from "./Pagination";
import VerticalCard from "./VerticalCard";
import HorizontalCard from "./HorizontalCard";
import { getallBookmarkByuserId } from "@/lib/actions/bookmark.actions";
import Image from "next/image";
import Masonry from "react-masonry-css";
import ProgressPopup from "./ProgressPopup";
import Skeleton from "@mui/material/Skeleton";
import { Icon } from "@iconify/react";
import sixDotsScale from "@iconify-icons/svg-spinners/6-dots-scale"; // Correct import
 // Correct import
type CollectionProps = {
  userId: string;
  //data: IAd[];
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  //page: number | string;
  //totalPages?: number;
  urlParamName?: string;
  isAdCreator: boolean;
  isVertical: boolean;
  collectionType?: "Ads_Organized" | "My_Tickets" | "All_Ads";
  handleAdEdit: (ad:any) => void;
  handleAdView: (ad:any) => void;
  handleOpenPlan: () => void;
};

const CollectionBookmark = ({
  //data,
  userId,
  emptyTitle,
  emptyStateSubtext,
  // page,
  // totalPages = 0,
  collectionType,
  urlParamName,
  isAdCreator,
  isVertical,
  handleAdView,
  handleAdEdit,
  handleOpenPlan,
}: CollectionProps) => {
  const [data, setAds] = useState<IAd[]>([]); // Initialize with an empty array
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
   const [isInitialLoading, setIsInitialLoading] = useState(true);
  // const observer = useRef();
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const bookmark = await getallBookmarkByuserId(userId);

      // Update ads state using the latest prevAds for filtering
      setAds((prevAds: IAd[]) => {
        const existingAdIds = new Set(prevAds.map((ad) => ad._id));

        // Filter out ads that are already in prevAds
        const newAds = bookmark?.data.filter(
          (ad: IAd) => !existingAdIds.has(ad._id)
        );

        return [...prevAds, ...newAds]; // Return updated ads
      });
      setTotalPages(bookmark?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching ads", error);
    } finally {
      setLoading(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [page]);

  const lastAdRef = (node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page < totalPages) {
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
  const [isOpenP, setIsOpenP] = useState(false);
  const handleOpenP = () => {
    setIsOpenP(true);
  };

  const handleCloseP = () => {
    setIsOpenP(false);
  };
  return (
    <>
      {data.length > 0 ? (
        isVertical ? (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex gap-1 lg:gap-4"
            columnClassName="bg-clip-padding"
          >
            {data.map((ad: any, index: number) => {
              if (data.length === index + 1) {
                return (
                  <div
                    ref={lastAdRef}
                    key={index}
                    className="flex justify-center"
                  >
                    {/* Render Ad */}
                 {ad.adId && (<><VerticalCard
                      ad={ad.adId}
                      userId={userId}
                      isAdCreator={isAdCreator}
                      handleAdView={handleAdView} 
                      handleAdEdit={handleAdEdit} 
                      handleOpenPlan={handleOpenPlan}
                      popup={"bookmark"}/></>)}   
                  </div>
                );
              } else {
                return (
                  <div key={index} className="flex justify-center">
                    {/* Render Ad */}
                    {ad.adId && (<><VerticalCard
                      ad={ad.adId}
                      userId={userId}
                      isAdCreator={isAdCreator}
                      handleAdView={handleAdView} 
                      handleAdEdit={handleAdEdit}
                      handleOpenPlan={handleOpenPlan}
                      popup={"bookmark"}
                    /></>)}  
                  </div>
                );
              }
            })}
          </Masonry>
        ) : (
          <div className="flex p-1 bg-grey-50 rounded-lg">
            <ul className="w-full">
              {data.map((ad: any, index: number) => {
                if (data.length === index + 1) {
                  return (
                    <div
                      ref={lastAdRef}
                      key={index}
                      className="flex justify-center"
                    >
                      {/* Render Ad */}
                     
                       {ad.adId && (<> <HorizontalCard
                        ad={ad}
                        userId={userId}
                        isAdCreator={isAdCreator}
                        handleAdView={handleAdView} 
                        handleAdEdit={handleAdEdit}
                        handleOpenPlan={handleOpenPlan}
                        popup={"bookmark"}
                      /></>)}  
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="flex justify-center">
                      {/* Render Ad */}
                      {ad.adId && (<> <HorizontalCard
                        ad={ad}
                        userId={userId}
                        isAdCreator={isAdCreator}
                        handleAdView={handleAdView} 
                      handleAdEdit={handleAdEdit}
                      handleOpenPlan={handleOpenPlan}
                      /></>)}  
                    </div>
                  );
                }
              })}
            </ul>
          </div>
        )
      ) : (
        loading === false && (
          <>
            <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
              <h3 className="font-bold text-[16px] lg:text-[25px]">
                {emptyTitle}
              </h3>
              <p className="text-sm lg:p-regular-14">{emptyStateSubtext}</p>
            </div>
          </>
        )
      )}
      {loading && (
               <>
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
                   <div className="w-full min-h-[200px] h-full flex flex-col items-center justify-center">
                      <Icon icon={sixDotsScale} className="w-10 h-10 text-gray-500" />
                   </div>
                 )}
                 </>)}
    </>
  );
};

export default CollectionBookmark;
