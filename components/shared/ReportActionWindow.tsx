"use client";
import React, { useEffect, useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import { usePathname, useRouter } from "next/navigation";
import ProgressPopup from "./ProgressPopup";
import sanitizeHtml from "sanitize-html";
import {
  deleteAd,
  getAdByUser,
  updateBanAll,
  updateStatus,
} from "@/lib/actions/dynamicAd.actions";
import { updateUserStatus } from "@/lib/actions/user.actions";
import ContactSeller from "./ContactSeller";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  ad: any;
  handleOpenChatId:(value:string)=> void;
}

const ReportActionWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  ad,
  onClose,
  handleOpenChatId,
}) => {
 
  const [status, setStatus] = useState(ad.adstatus);
  const [Userstatus, setUserStatus] = useState("User");
  const pathname = usePathname();
  const router = useRouter();
  const isAdCreator = true;
  const page = 1000;
  const sortby = "recommended";
  const [userId, setUserId] = useState(ad.organizer);
  const [organizerAds, setOrganizerAds] = useState<any>([]);
  const [selectAds, setSelectAds] = useState<any>([]);
  const [isOpenP, setIsOpenP] = useState(false);
  const [isOpenContact, setIsOpenContact] = useState(false);
  const handleOpenContact = (ad:any) => {
    setSelectAds(ad);
    setIsOpenContact(true)
  };
  const handleCloseContact = () => setIsOpenContact(false);

  const handleOpenP = () => setIsOpenP(true);
  const handleCloseP = () => setIsOpenP(false);
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this ad?")) {
      try {
        await deleteAd({
          adId: ad._id,
          deleteImages: ad.data.imageUrls,
          path: pathname,
        });
      } catch (error) {
        console.error("Error deleting ad:", error);
      }
    }
  };

  const handleStatusChange = async () => {
    const newStatus = status === "Active" ? "Inactive" : "Active";
    try {
      await updateStatus({ _id: ad._id, adstatus: newStatus, path: pathname });
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleStatusChangeUser = async () => {
    const newStatus = Userstatus === "User" ? "Banned" : "User";
    try {
      await updateUserStatus(userId, newStatus);
      setUserStatus(newStatus);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleBanAll = async () => {
    if (confirm("Are you sure you want to deactivate all creator ads?")) {
      try {
        const phone = ad.data.phone;
        await updateBanAll(phone, "Inactive");
      } catch (error) {
        console.error("Error banning all ads:", error);
      }
    }
  };

  const fetchAds = async () => {
    try {
      const organizedAds = await getAdByUser({
        userId,
        page,
        sortby,
        myshop: isAdCreator,
      });
      setOrganizerAds(organizedAds);
    } catch (error) {
      console.error("Error fetching ads", error);
    }
  };
  const truncateDescription = (description: string, charLimit: number) => {
    const safeMessage = sanitizeHtml(description); 
    const truncatedMessage =
    safeMessage.length > charLimit
      ? `${safeMessage.slice(0, charLimit)}...`
      : safeMessage;
    return truncatedMessage;
  };
  useEffect(() => {
    if (isOpen) {
    fetchAds();
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="dark:bg-[#2D3236] dark:text-gray-300 bg-white rounded-lg p-4 lg:p-6 w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Reported Ad</h3>
          <button
            onClick={onClose}
            className="flex justify-center items-center h-12 w-12 dark:text-white text-black hover:bg-black hover:text-white rounded-full"
          >
            <CloseOutlinedIcon />
          </button>
        </div>

        {/* Scrollable Form */}
        <ScrollArea className="p-2">
          <div className="border rounded-lg shadow-md p-4 dark:bg-[#131B1E] bg-white">
            <h2 className="text-sm font-bold">{ad.data.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-500">
              Price:{" "}
              <span className="font-semibold">
                Ksh {ad.data.price.toLocaleString()}
              </span>
            </p>

            {/* Ad Images */}
            <div className="mt-1 flex space-x-2 overflow-x-auto">
              {ad.data.imageUrls.map((url: string, index: number) => (
                <Image
                  key={index}
                  src={url}
                  alt={ad.data.title}
                  width={100}
                  height={75}
                  className="rounded-lg"
                />
              ))}
            </div>

            <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">
             
        <span dangerouslySetInnerHTML={{ __html:  truncateDescription(ad.data.description, 180) }} />
        
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Condition: {ad.data.condition}
            </p>

            {/* Status and Actions */}
            <div className="mt-4 flex justify-between">
            <div className="flex gap-1 items-center">
            <div
                className={`h-3 w-3 rounded-full ${
                  status === "Active"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></div>
              <span
                className={`text-sm rounded-sm ${
                  status === "Active"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {status}
              </span>
              </div>
              <div className="space-x-2">
              <button
                  onClick={() => handleOpenContact(ad)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                 Contact Seller
                </button>
                <button
                  onClick={handleStatusChange}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  {status === "Active" ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Ad Creator Info */}
            {organizerAds.length > 0 && (
              <div className="border mt-2 p-2 rounded-xl dark:bg-[#2D3236] bg-gray-100">
                <h3 className="font-semibold text-sm">Ad Creator</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Phone: {ad.data.phone}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Active Ads: {organizerAds.length}
                </p>

                {/* Creator Actions */}
                <div className="mt-1 space-x-2">
                  <button
                    onClick={handleStatusChangeUser}
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    {Userstatus === "User" ? "Ban Creator" : "Activate Creator"}
                  </button>
                  <button
                    onClick={handleBanAll}
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Deactivate All Creator Ads
                  </button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Progress Popup */}
      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
      <ContactSeller isOpen={isOpenContact} ad={selectAds} handleOpenChatId={handleOpenChatId} onClose={handleCloseContact}/>
    </div>
  );
};

export default ReportActionWindow;
