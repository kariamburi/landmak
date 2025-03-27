import { IAd } from "@/lib/database/models/ad.model";
import React, { useEffect, useRef, useState } from "react";
import Pagination from "./Pagination";
import VerticalCard from "./VerticalCard";
import HorizontalCard from "./HorizontalCard";
import Image from "next/image";
import { getAdByUser } from "@/lib/actions/dynamicAd.actions";
import Masonry from "react-masonry-css";
import ProgressPopup from "./ProgressPopup";
type CollectionProps = {
  userId: string;
  sortby: string;
  // data: IAd[];
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  //page: number | string;
  //totalPages?: number;
  urlParamName?: string;
  isAdCreator: boolean;
  isVertical: boolean;
  loadPopup: boolean;
  handleAdEdit: (id:string) => void;
  handleAdView: (id:string) => void;
  handleOpenPlan: () => void;
  collectionType?: "Ads_Organized" | "My_Tickets" | "All_Ads";
};

const CollectionMyads = ({
  // data,
  userId,
  emptyTitle,
  emptyStateSubtext,
  sortby,
  //totalPages = 0,
  collectionType,
  urlParamName,
  isAdCreator,
  isVertical,
  loadPopup,
  handleAdEdit,
  handleAdView,
  handleOpenPlan,
}: CollectionProps) => {
  const [data, setAds] = useState<IAd[]>([]); // Initialize with an empty array
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
 // const [isOpenP, setIsOpenP] = useState(false);
  // const observer = useRef();
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchAds = async () => {
    setLoading(true);

    try {
      const organizedAds = await getAdByUser({
        userId,
        page,
        sortby: sortby,
        myshop: isAdCreator,
      });
      // alert(organizedAds);
      // Update ads state using the latest prevAds for filtering
      setAds((prevAds: IAd[]) => {
        const existingAdIds = new Set(prevAds.map((ad) => ad._id));

        // Filter out ads that are already in prevAds
        const newAds = organizedAds?.data.filter(
          (ad: IAd) => !existingAdIds.has(ad._id)
        );

        return [...prevAds, ...newAds]; // Return updated ads
      });
      setTotalPages(organizedAds?.totalPages || 1);
    } catch (error) {
      //alert(error);
      console.error("Error fetching ads", error);
    } finally {
      setLoading(false);
      //setIsOpenP(false);
      //closeLoading();
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAds();
    }
  }, [page, sortby]);

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
    default: 3, // 3 columns on large screens
    1100: 3, // 2 columns for screens <= 1100px
    700: 2, // 1 column for screens <= 700px
  };

  const [selectedCategory, setSelectedCategory] = useState("");

  // Get unique categories
const categories = Array.from(new Set(data.map((item: any) => item.data.category)));

// Filter data
const filteredAds = selectedCategory
  ? data.filter((item: any) => item.data.category === selectedCategory)
  : data;


  return (
    <div>
  <div className="flex flex-col lg:flex-row items-center justify-between w-full">
  <h3 className="font-bold text-[25px] text-center sm:text-left">
                    Seller Ads
                  </h3>
   <div className="w-full lg:w-[450px] justify-between lg:justify-end flex items-center gap-4 mb-2 p-1 rounded-md">   
      <label className="text-xs lg:text-base">Filter by Category: </label>
      <select
      className="py-2 border rounded-md w-[250px]"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All</option>
        {categories.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      </div>

      </div>
      {filteredAds.length > 0 ? (
        isVertical ? (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex gap-1 lg:gap-4"
            columnClassName="bg-clip-padding"
          >
            {filteredAds.map((ad: any, index: number) => {
              if (filteredAds.length === index + 1) {
                return (
                  <div
                    ref={lastAdRef}
                    key={ad._id}
                    className="flex justify-center"
                  >
                    {/* Render Ad */}
                    <VerticalCard
                      ad={ad}
                      userId={userId}
                      isAdCreator={isAdCreator}
                      handleAdView={handleAdView} 
                      handleAdEdit={handleAdEdit}
                      handleOpenPlan={handleOpenPlan}
                    />
                  </div>
                );
              } else {
                return (
                  <div key={ad._id} className="flex justify-center">
                    {/* Render Ad */}
                    <VerticalCard
                      ad={ad}
                      userId={userId}
                      isAdCreator={isAdCreator}
                      handleAdView={handleAdView} 
                      handleAdEdit={handleAdEdit}
                      handleOpenPlan={handleOpenPlan}
                    />
                  </div>
                );
              }
            })}
          </Masonry>
        ) : (
          <div className="flex p-1 rounded-lg">
            <ul className="w-full">
              {filteredAds.map((ad: any, index: number) => {
                if (filteredAds.length === index + 1) {
                  return (
                    <div
                      ref={lastAdRef}
                      key={ad._id}
                      className="flex justify-center"
                    >
                      {/* Render Ad */}
                      <HorizontalCard
                        ad={ad}
                        userId={userId}
                        isAdCreator={isAdCreator}
                        handleAdView={handleAdView} 
                      handleAdEdit={handleAdEdit}
                      handleOpenPlan={handleOpenPlan}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div key={ad._id} className="flex justify-center">
                      {/* Render Ad */}
                      <HorizontalCard
                        ad={ad}
                        userId={userId}
                        isAdCreator={isAdCreator}
                        handleAdView={handleAdView} 
                      handleAdEdit={handleAdEdit}
                      handleOpenPlan={handleOpenPlan}
                      />
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
            <div className="flex-center wrapper min-h-[100px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
              <h3 className="font-bold text-[16px] lg:text-[25px]">
                {emptyTitle}
              </h3>
              <p className="text-sm lg:p-regular-14">{emptyStateSubtext}</p>
            </div>
          </>
        )
      )}
      {loading && (
        <div>
          <div className="w-full mt-10 h-full flex flex-col items-center justify-center">
            <Image
              src="/assets/icons/loading2.gif"
              alt="loading"
              width={40}
              height={40}
              unoptimized
            />
          </div>
        </div>
      )}
      
    </div>
  );
};

export default CollectionMyads;
