import { IAd } from "@/lib/database/models/ad.model";
import React, { useEffect, useRef, useState } from "react";
import Pagination from "./Pagination";
import VerticalCard from "./VerticalCard";
import HorizontalCard from "./HorizontalCard";
import Skeleton from "@mui/material/Skeleton";
import StreetmapAll from "./StreetmapAll";
import Image from "next/image";
import { getAllAd, getListingsNearLocation } from "@/lib/actions/ad.actions";
import { getAlldynamicAd } from "@/lib/actions/dynamicAd.actions";
import Masonry from "react-masonry-css";
import ProgressPopup from "./ProgressPopup";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "../ui/button";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useRouter } from "next/navigation";
type CollectionProps = {
  userId: string;
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  activeButton: number;
  queryObject: any;
  loadPopup: boolean;
  handleAdEdit: (id:string) => void;
  handleOpenSell: () => void;
  handleAdView: (id:string) => void;
  handleOpenPlan: () => void;
};

const CollectionSearch = ({
  userId,
  emptyTitle,
  emptyStateSubtext,
  limit,
  activeButton,
  queryObject,
  loadPopup,
  handleOpenSell,
  handleAdEdit,
  handleAdView,
  handleOpenPlan,
}: CollectionProps) => {
  const [data, setAds] = useState<IAd[]>([]); // Initialize with an empty array
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [newpage, setnewpage] = useState(false);
  const router = useRouter();
  const observer = useRef<IntersectionObserver | null>(null);


   //const [newqueryObject, setNewqueryObject] = useState<any>(queryObject);
 // const handleFilter = (value:any) => {
   // setNewqueryObject({
     // ...queryObject, // Preserve existing properties
      //location: lat+"/"+lng,
    //  value,
   // });
   // setAds([]);
   // };
  

  let Ads: any = [];
  const fetchAds = async () => {
    setLoading(true);
    try {
      Ads = await getAlldynamicAd({
        page,
        limit,
        queryObject,
      });
      // Update ads state using the latest prevAds for filtering

      if (newpage) {
        setnewpage(false);
        setAds((prevAds: IAd[]) => {
          const existingAdIds = new Set(prevAds.map((ad) => ad._id));

          // Filter out ads that are already in prevAds
          const newAds = Ads?.data.filter(
            (ad: IAd) => !existingAdIds.has(ad._id)
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
     // setIsOpenP(false);
      //closeLoading();
    }
  };

  useEffect(() => {
    if (!newpage) {
      setAds([]);
      setPage(1);
    }
    fetchAds();
  }, [page, queryObject]);

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
  return (
    <>
      {data.length > 0 ? (
        <>
          {activeButton === 0 && (
            <>
              <Masonry
                breakpointCols={breakpointColumns}
                className="flex mt-2 lg:mt-0 gap-1 lg:gap-4 min-h-screen"
                columnClassName="bg-clip-padding"
              >
                {data.map((ad: any, index: number) => {
                  const isAdCreator = userId === ad.organizer._id.toString();
                  if (data.length === index + 1) {
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
                          handleAdEdit={handleAdEdit}    
                          handleAdView={handleAdView}
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
                          handleAdEdit={handleAdEdit}    
                          handleAdView={handleAdView}
                          handleOpenPlan={handleOpenPlan}
                        />
                      </div>
                    );
                  }
                })}
              </Masonry>
            </>
          )}
          {activeButton === 1 && (
            <>
              <div className="flex p-1 rounded-lg min-h-screen">
                <ul className="w-full">
                  {data.map((ad: any, index: number) => {
                    const isAdCreator = userId === ad.organizer._id.toString();
                    if (data.length === index + 1) {
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
                            handleAdEdit={handleAdEdit}    
                            handleAdView={handleAdView}
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
                            handleOpenPlan={handleOpenPlan}                         />
                        </div>
                      );
                    }
                  })}
                </ul>
              </div>
            </>
          )}
          
        </>
      ) : (
        loading === false && (
          <>
            <div className="flex items-center min-h-[100px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
              <h3 className="font-bold text-[16px] lg:text-[25px]">
                {emptyTitle}
              </h3>
              <p className="text-sm lg:p-regular-14">{emptyStateSubtext}</p>
              <SignedIn>

<Button onClick={() => {
    handleOpenSell();
    //router.push("/ads/create");
}} variant="default" className="flex items-center gap-2">
<AddOutlinedIcon sx={{ fontSize: 16 }} /> Create Ad
</Button>

</SignedIn>

<SignedOut>
<Button  onClick={() => {
     // setIsOpenP(true);
      router.push("/sign-in");
    }} variant="outline" className="flex items-center gap-2">
<AddOutlinedIcon sx={{ fontSize: 16 }} /> Create Ad
</Button>
</SignedOut>
            </div>
          </>
        )
      )}
      {loading && (
        <div>
          <div className="w-full mt-10 h-full min-h-[100px] flex flex-col items-center justify-center">
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
    {/*  <ProgressPopup isOpen={loadPopup} onClose={handleCloseP} /> */} 
    </>
  );
};

export default CollectionSearch;
