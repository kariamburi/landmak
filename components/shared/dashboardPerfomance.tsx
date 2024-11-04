"use client";
import { IAd } from "@/lib/database/models/ad.model";
import { CreateUserParams } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import CollectionBookmark from "./CollectionBookmark";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { IUser } from "@/lib/database/models/user.model";
import Link from "next/link";
import SellerProfileMobile from "./SellerProfileMobile";
import Verification from "./Verification";
import Ratingsmobile from "./ratingsmobile";
import SellerProfilePermonance from "./SellerProfilePermonance";
import Verificationmobile from "./Verificationmobile";
import { DeleteConfirmation } from "./DeleteConfirmation";
import Image from "next/image";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CallIcon from "@mui/icons-material/Call";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import SplitscreenOutlinedIcon from "@mui/icons-material/SplitscreenOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import AssistantDirectionOutlinedIcon from "@mui/icons-material/AssistantDirectionOutlined";
import LowPriorityOutlinedIcon from "@mui/icons-material/LowPriorityOutlined";
import FlightTakeoffOutlinedIcon from "@mui/icons-material/FlightTakeoffOutlined";
import { getAdByUser } from "@/lib/actions/ad.actions";
type CollectionProps = {
  userId: string;
  userName: string;
  userImage: string;
  loggedId: string;
  daysRemaining?: number;
  packname?: string;
  color: string;
  sortby: string;
  //data: IAd[];
  user: IUser;
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  // page: number | string;
  // totalPages?: number;
  urlParamName?: string;
  isAdCreator: boolean;
  collectionType?: "Ads_Organized" | "My_Tickets" | "All_Ads";
};

const DashboardPerformance = ({
  userId,
  userName,
  userImage,
  sortby,
  packname,
  daysRemaining,
  color,
  emptyTitle,
  emptyStateSubtext,
  // page,
  // totalPages = 0,
  collectionType,
  urlParamName,
  isAdCreator,
  user,
  loggedId,
}: // Accept the onSortChange prop
CollectionProps) => {
  const [activeButton, setActiveButton] = useState(0);
  const [isVertical, setisVertical] = useState(true);

  const [data, setAds] = useState<IAd[]>([]); // Initialize with an empty array
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  // const observer = useRef();
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const organizedAds = await getAdByUser({
        userId,
        page,
        sortby,
        myshop: isAdCreator,
      });

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
      console.error("Error fetching ads", error);
    } finally {
      setLoading(false);
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
  return (
    <>
      <div className="w-full lg:max-w-6xl mx-auto p-1">
        <section className="bg-grey-50 bg-dotted-pattern bg-cover bg-center py-0 md:py-0 rounded-sm">
          <div className="flex items-center p-1 justify-between">
            <div className="flex flex-col">
              <SellerProfilePermonance
                userId={userId}
                userName={userName}
                userImage={userImage}
                user={user}
              />
            </div>

            {isAdCreator &&
            packname !== "Free" &&
            daysRemaining &&
            daysRemaining > 0 ? (
              <>
                <div
                  style={{
                    backgroundColor: color,
                  }}
                  className="text-center sm:text-left rounded-lg p-3 text-white relative"
                >
                  <div className="flex flex-col">
                    <div className="font-bold text-sm mt-4">
                      Plan: {packname}
                    </div>
                    <div className="text-xs">
                      Days remaining: {daysRemaining}
                    </div>
                  </div>
                  {/* Green ribbon */}
                  <div className="absolute top-0 shadow-lg left-0 bg-green-500 text-white text-xs py-1 px-3 rounded-bl-lg rounded-tr-lg">
                    Active
                  </div>
                  <Link href="/plan">
                    <div className="p-1 items-center flex flex-block text-black underline text-xs cursor-pointer border-2 border-transparent rounded-full hover:bg-[#000000]  hover:text-white">
                      <div>Upgrade Plan</div>
                    </div>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    backgroundColor: color,
                  }}
                  className="text-center sm:text-left rounded-lg p-3 text-white relative"
                >
                  <div className="flex flex-col">
                    <div className="font-bold text-sm mt-4">
                      Plan: {packname}
                    </div>
                  </div>
                  {/* Green ribbon */}
                  <div className="absolute top-0 shadow-lg left-0 bg-green-500 text-white text-xs py-1 px-3 rounded-bl-lg rounded-tr-lg">
                    Active
                  </div>
                  <Link href="/plan">
                    <div className="p-1 items-center flex flex-block text-black underline text-xs cursor-pointer border-2 border-transparent rounded-full hover:bg-[#000000]  hover:text-white">
                      <div>Upgrade Plan</div>
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
        <h1 className="text-3xl font-bold">Ad Performance</h1>
        <h1 className="bg-white p-1 rounded-full mb-6 text-gray-500 text-sm">
          Total Ads: {data.length}
        </h1>

        {data.length > 0 ? (
          <div>
            {data.map((ad: any, index: number) => {
              if (data.length === index + 1) {
                return (
                  <div
                    ref={lastAdRef}
                    key={ad._id}
                    className="flex flex-col lg:flex-row gap-1 bg-white shadow-lg rounded-lg overflow-hidden mb-6 border border-gray-200"
                  >
                    {/* Ad Image */}
                    <img
                      src={ad.imageUrls[0] || "/default-ad-image.jpg"}
                      alt={ad.title}
                      className="w-full lg:w-64 h-40 lg:h-64 object-cover"
                    />

                    <div className="p-2 grid grid-cols-2 lg:grid-cols-3">
                      {/* 1. Ad Details */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <p className="text-xs lg:text-base font-bold mb-1 text-gray-800">
                          Ad Details
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <SplitscreenOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Title: </strong> {ad.title}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <ClassOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Category: </strong> {ad.subcategory || "N/A"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <AccessTimeIcon sx={{ fontSize: 14 }} />
                          <strong>Created Date: </strong>
                          {new Date(ad.createdAt).toLocaleDateString()}
                        </p>
                      </section>

                      {/* 2. Ad Engagement */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <p className="text-xs lg:text-base font-bold mb-1 text-gray-800">
                          Ad Engagement
                        </p>

                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <VisibilityIcon sx={{ fontSize: 14 }} />
                          <strong>Ad Views: </strong> {ad.views}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <ChatBubbleOutlineOutlinedIcon
                            sx={{ fontSize: 14 }}
                          />
                          <strong>Inquiries: </strong> {ad.inquiries || "0"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <CallIcon sx={{ fontSize: 14 }} />
                          <strong>Calls: </strong> {ad.calls || "0"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <WhatsAppIcon sx={{ fontSize: 14 }} />
                          <strong>WhatsApp: </strong> {ad.whatsapp || "0"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <ShareOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Shared: </strong> {ad.shared || "0"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <BookmarkIcon sx={{ fontSize: 14 }} />
                          <strong>Bookmarked: </strong> {ad.bookmarked || "0"}
                        </p>
                      </section>

                      {/* 3. Ad Duration & Status */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <h2 className="text-xs lg:text-base font-bold mb-1  text-gray-800">
                          Ad Status
                        </h2>

                        {ad.adstatus && (
                          <div
                            className={`flex flex-col w-[100px] text-[8px] lg:text-[10px] p-1 text-white justify-center items-center rounded-full ${
                              ad.adstatus === "Pending"
                                ? "bg-yellow-600"
                                : ad.adstatus === "Failed"
                                ? "bg-red-600 "
                                : "bg-green-600"
                            }`}
                          >
                            {ad.adstatus}
                          </div>
                        )}
                        <div className="flex mt-2 gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
                          <Link href={`/ads/${ad._id}/update`}>
                            <Image
                              src="/assets/icons/edit.svg"
                              alt="edit"
                              width={20}
                              height={20}
                            />
                          </Link>
                          <DeleteConfirmation
                            adId={ad._id}
                            imageUrls={ad.imageUrls}
                          />
                        </div>
                      </section>

                      {/* 4. Ad Performance */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <h2 className="text-xs lg:text-base font-bold mb-1 text-gray-800">
                          Ad Performance
                        </h2>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <LowPriorityOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Priority Level: </strong>{" "}
                          {ad.priority || "N/A"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <FlightTakeoffOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Plan: </strong> {ad.plan?.name || "Free"}
                        </p>
                      </section>

                      {/* 5. Contact Info */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <h2 className="text-xs lg:text-base font-bold mb-1  text-gray-800">
                          Contact Info
                        </h2>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <CallIcon sx={{ fontSize: 14 }} />
                          <strong>Phone: </strong> {ad.phone || "N/A"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <WhatsAppIcon sx={{ fontSize: 14 }} />
                          <strong>WhatsApp: </strong>{" "}
                          {ad.organizer?.whatsapp || "N/A"}
                        </p>
                        <p
                          className={`flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs ${
                            ad.organizer?.verified[0]?.accountverified === true
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <ShieldOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Verified Status: </strong>{" "}
                          {ad.organizer?.verified[0]?.accountverified === true
                            ? "Verified"
                            : "Not Verified"}
                        </p>
                      </section>

                      {/* 6. Geographical Info */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <h2 className="text-xs lg:text-base font-bold mb-1  text-gray-800">
                          Geographical Info
                        </h2>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <LocationOnIcon sx={{ fontSize: 14 }} />
                          <strong>Location: </strong> {ad.address || "N/A"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <AssistantDirectionOutlinedIcon
                            sx={{ fontSize: 14 }}
                          />
                          <strong>Map Enabled: </strong> {"Yes"}
                        </p>
                      </section>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={ad._id}
                    className="flex flex-col lg:flex-row gap-1 bg-white shadow-lg rounded-lg overflow-hidden mb-6 border border-gray-200"
                  >
                    {/* Ad Image */}
                    <img
                      src={ad.imageUrls[0] || "/default-ad-image.jpg"}
                      alt={ad.title}
                      className="w-full lg:w-64 h-40 lg:h-64 object-cover"
                    />

                    <div className="p-2 grid grid-cols-2 lg:grid-cols-3">
                      {/* 1. Ad Details */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <p className="text-xs lg:text-base font-bold mb-1 text-gray-800">
                          Ad Details
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <SplitscreenOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Title: </strong> {ad.title}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <ClassOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Category: </strong> {ad.subcategory || "N/A"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <AccessTimeIcon sx={{ fontSize: 14 }} />
                          <strong>Created Date: </strong>
                          {new Date(ad.createdAt).toLocaleDateString()}
                        </p>
                      </section>

                      {/* 2. Ad Engagement */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <p className="text-xs lg:text-base font-bold mb-1 text-gray-800">
                          Ad Engagement
                        </p>

                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <VisibilityIcon sx={{ fontSize: 14 }} />
                          <strong>Ad Views: </strong> {ad.views}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <ChatBubbleOutlineOutlinedIcon
                            sx={{ fontSize: 14 }}
                          />
                          <strong>Inquiries: </strong> {ad.inquiries || "0"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <CallIcon sx={{ fontSize: 14 }} />
                          <strong>Calls: </strong> {ad.calls || "0"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <WhatsAppIcon sx={{ fontSize: 14 }} />
                          <strong>WhatsApp: </strong> {ad.whatsapp || "0"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <ShareOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Shared: </strong> {ad.shared || "0"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <BookmarkIcon sx={{ fontSize: 14 }} />
                          <strong>Bookmarked: </strong> {ad.bookmarked || "0"}
                        </p>
                      </section>

                      {/* 3. Ad Duration & Status */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <h2 className="text-xs lg:text-base font-bold mb-1  text-gray-800">
                          Ad Status
                        </h2>

                        {ad.adstatus && (
                          <div
                            className={`flex flex-col w-[100px] text-[8px] lg:text-[10px] p-1 text-white justify-center items-center rounded-full ${
                              ad.adstatus === "Pending"
                                ? "bg-yellow-600"
                                : ad.adstatus === "Failed"
                                ? "bg-red-600 "
                                : "bg-green-600"
                            }`}
                          >
                            {ad.adstatus}
                          </div>
                        )}
                        <div className="flex mt-2 gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
                          <Link href={`/ads/${ad._id}/update`}>
                            <Image
                              src="/assets/icons/edit.svg"
                              alt="edit"
                              width={20}
                              height={20}
                            />
                          </Link>
                          <DeleteConfirmation
                            adId={ad._id}
                            imageUrls={ad.imageUrls}
                          />
                        </div>
                      </section>

                      {/* 4. Ad Performance */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <h2 className="text-xs lg:text-base font-bold mb-1 text-gray-800">
                          Ad Performance
                        </h2>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <LowPriorityOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Priority Level: </strong>{" "}
                          {ad.priority || "N/A"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <FlightTakeoffOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Plan: </strong> {ad.plan?.name || "Free"}
                        </p>
                      </section>

                      {/* 5. Contact Info */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <h2 className="text-xs lg:text-base font-bold mb-1  text-gray-800">
                          Contact Info
                        </h2>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <CallIcon sx={{ fontSize: 14 }} />
                          <strong>Phone: </strong> {ad.phone || "N/A"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <WhatsAppIcon sx={{ fontSize: 14 }} />
                          <strong>WhatsApp: </strong>{" "}
                          {ad.organizer?.whatsapp || "N/A"}
                        </p>
                        <p
                          className={`flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs ${
                            ad.organizer?.verified[0]?.accountverified === true
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <ShieldOutlinedIcon sx={{ fontSize: 14 }} />
                          <strong>Verified Status: </strong>{" "}
                          {ad.organizer?.verified[0]?.accountverified === true
                            ? "Verified"
                            : "Not Verified"}
                        </p>
                      </section>

                      {/* 6. Geographical Info */}
                      <section className="mb-1 mr-1 bg-gray-100 p-1 rounded-lg">
                        <h2 className="text-xs lg:text-base font-bold mb-1  text-gray-800">
                          Geographical Info
                        </h2>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <LocationOnIcon sx={{ fontSize: 14 }} />
                          <strong>Location: </strong> {ad.address || "N/A"}
                        </p>
                        <p className="flex gap-1 mb-1 text-gray-700 text-[10px] lg:text-xs">
                          <AssistantDirectionOutlinedIcon
                            sx={{ fontSize: 14 }}
                          />
                          <strong>Map Enabled: </strong> {"Yes"}
                        </p>
                      </section>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        ) : (
          loading === false && (
            <>
              <p className="text-gray-500">No ads to display.</p>
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
    </>
  );
};

export default DashboardPerformance;
