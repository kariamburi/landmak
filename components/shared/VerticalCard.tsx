import { IAd } from "@/lib/database/models/ad.model";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { formatKsh } from "@/lib/help";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PartyModeOutlinedIcon from "@mui/icons-material/PartyModeOutlined";
import LocalSeeOutlinedIcon from "@mui/icons-material/LocalSeeOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import LinkedCameraOutlinedIcon from "@mui/icons-material/LinkedCameraOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import ThreeDRotationOutlinedIcon from '@mui/icons-material/ThreeDRotationOutlined';
import FilterOutlinedIcon from '@mui/icons-material/FilterOutlined';
import sanitizeHtml from "sanitize-html";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { createBookmark, deleteBookmark } from "@/lib/actions/bookmark.actions";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { getAdById, updatebookmarked } from "@/lib/actions/ad.actions";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Icon } from "@iconify/react";
import threeDotsScale from "@iconify-icons/svg-spinners/3-dots-scale"; // Correct import
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import ContactUser from "./ContactUser";
import { Email, Phone } from '@mui/icons-material'; // Or from 'react-icons/md'
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { formatDistanceToNow, isBefore, subMonths } from "date-fns";
import { updateCreatedAt } from "@/lib/actions/dynamicAd.actions";
const shouldShowRenewButton = (updatedAt: Date, priority: number) => {
  const oneMonthAgo = subMonths(new Date(), 1);
  return priority === 1 && isBefore(new Date(updatedAt), oneMonthAgo);
};
 // Correct import
type CardProps = {
  ad: any;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
  userId: string;
 isAdCreator?: boolean;
  popup?: string;
  handleAdEdit: (ad:any) => void;
  handleAdView: (ad:any) => void;
  handleOpenPlan: () => void;
  handleOpenChatId: (value:any) => void;
};

const VerticalCard = ({
  ad,
  hasOrderLink,
  hidePrice,
  userId,
  isAdCreator,
  handleAdEdit,
  handleAdView,
  handleOpenPlan,
  handleOpenChatId,
  popup,
}: CardProps) => {
  const pathname = usePathname();
  const { toast } = useToast();
const [isDeleted, setIsDeleted] = useState(false);
  const router = useRouter();

  //const isAdCreator = userId === ad.organizer._id.toString();
  const truncateTitle = (title: string, maxLength: number) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };
  const truncateaddress = (address: string, maxLength: number) => {
    if (address.length > maxLength) {
      return address.substring(0, maxLength) + "...";
    }
    return address;
  };
  const truncateDescription = (description: string, charLimit: number) => {
    const safeMessage = sanitizeHtml(description); 
    const truncatedMessage =
    safeMessage.length > charLimit
      ? `${safeMessage.slice(0, charLimit)}...`
      : safeMessage;
    return truncatedMessage;
  };
  // Apply truncation after sanitization
 



  const handle = async (id: string) => {
    if (userId) {
      const newBookmark = await createBookmark({
        bookmark: {
          userBId: userId,
          adId: id,
        },
        path: pathname,
      });
      if (newBookmark === "Ad Saved to Bookmark") {
        const bookmarked = (Number(ad.bookmarked ?? "0") + 1).toString();
        const _id = ad._id;
        await updatebookmarked({
          _id,
          bookmarked,
          path: `/ads/${ad._id}`,
        });
        toast({
          title: "Alert",
          description: newBookmark,
          duration: 5000,
          className: "bg-black text-white",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed!",
          description: newBookmark,
          duration: 5000,
        });
      }
    } else {
      window.location.reload();
    }
  };
  const handledeletebk = async (id: string) => {
    const delBookmark = await deleteBookmark({
      bookmark: {
        userBId: userId,
        adId: id,
      },
      path: pathname,
    });
    if (delBookmark === "Bookmark deleted successfully") {
      const bookmarked = (Number(ad.bookmarked ?? "1") - 1).toString();
      const _id = ad._id;
      await updatebookmarked({
        _id,
        bookmarked,
        path: `/ads/${ad._id}`,
      });
      toast({
        variant: "destructive",
        title: "Deleted!",
        description: delBookmark,
        duration: 5000,
      });
    }
  };
  const [isLoadingsmall, setIsLoadingsmall] = useState(true);
  //console.log(ad.imageUrls);
    const [selectUser, setSelectAUser] = useState<any>([]);
             const [isOpenContact, setIsOpenContact] = useState(false);
               const handleOpenContact = (user:any) => {
                 setSelectAUser(user);
                 setIsOpenContact(true)
               };
          const handleCloseContact = () => setIsOpenContact(false);
           const handleRenew = async (_id: string) => {
            try {
             await updateCreatedAt(
                    _id
                  );
                  toast({
                    title: "Alert",
                    description: "Renewal successful",
                    duration: 5000,
                    className: "bg-black text-white",
                  });
            } catch (error) {
              console.error(error);
              alert("Error renewing ad.");
            }
          };
  return (
    <>
    {ad.loanterm ? (<>
    
     <div className="bg-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-xs border border-gray-300 dark:border-gray-600">
  <div className="relative rounded w-full"
          onClick={() => {
             handleAdView(ad.adId);
            }}>
          {isLoadingsmall && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-100">
              <Icon icon={threeDotsScale} className="w-6 h-6 text-gray-500" />
            </div>
          )}
         
             <Image
             onClick={() => handleAdView(ad)}
             src={ad.data.imageUrls.length > 0 ? ad.data.imageUrls[0] : "/fallback.jpg"}
             alt={ad.data.title || "Ad image"}
             width={400}
             height={0}
             style={{ minHeight: "200px" }}
             className={`w-full rounded-t-lg h-auto object-cover cursor-pointer ${
               isLoadingsmall ? "opacity-0" : "opacity-100"
             } transition-opacity duration-300`}
             onLoadingComplete={() => setIsLoadingsmall(false)}
             placeholder="empty"
           />
        
        </div>
  <div className="p-2">
    <div className="flex flex-col">
      <div className="flex flex-col border-b p-1 w-full items-start">
       

        <div className="flex flex-col justify-between h-full">
          <p className="text-sm font-semibold mb-1">
            {ad.adId.data.title.length > 50
              ? `${ad.adId.data.title.substring(0, 50)}...`
              : ad.adId.data.title}
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 max-w-[200px]">
            <span
              dangerouslySetInnerHTML={{
                __html: truncateDescription(ad.adId.data.description ?? "", 65),
              }}
            />
          </p>

          <span className="font-bold text-green-600 dark:text-green-600 mt-1">
            {formatKsh(ad.adId.data.price)}
          </span>
        </div>
      </div>
    </div>
  </div>

  {/* Section 2: User Info */}
  <div className="p-2">
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        {/* Optional Avatar */}
      
       <div className="flex flex-col">
        <p className="text-sm font-semibold">
  Financing Request from:
  </p>
 
</div>
      </div>
  <p className="text-xs text-gray-600 dark:text-gray-300">
        Client Name:
        <span className="font-semibold">  {ad.userId.firstName} {ad.userId.lastName}</span>
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-300">
        Monthly Income:
        <span className="font-semibold"> KES {ad.monthlyIncome.toLocaleString()}</span>
      </p>

      <p className="text-xs text-gray-600 dark:text-gray-300">
        Deposit Amount:
        <span className="font-semibold"> KES {ad.deposit.toLocaleString()}</span>
      </p>

      <p className="text-xs text-gray-600 dark:text-gray-300">
        Preferred Loan Term:
        <span className="font-semibold"> {ad.loanterm}</span>
      </p>

      <p className="text-xs text-gray-600 dark:text-gray-300">
        Employment Status:
        <span className="font-semibold"> {ad.employmentStatus}</span>
      </p>

      <p className="text-xs text-gray-600 dark:text-gray-300">
        Message Comments:
        <span className="font-semibold"> {ad.messageComments}</span>
      </p>

      <p className="flex gap-2 text-xs text-gray-600 dark:text-gray-300">
        Status:
        <span
          className={`flex p-1 justify-center items-center w-[70px] rounded-full ${
            ad.status === "Pending"
              ? "bg-orange-100"
              : ad.status === "Failed"
              ? "bg-red-100"
              : "bg-green-100"
          }`}
        >
          {ad.status}
        </span>
      </p>
 {/*
      <p className="text-xs text-gray-600 dark:text-gray-300">
        <button
          onClick={() => handleOpenContact(ad.userId)}
          className="bg-gray-100 border px-3 py-1 rounded hover:bg-[#e4ebeb]"
        >
          <QuestionAnswerOutlinedIcon /> Contact Client
        </button>
      </p>*/}
    </div>
  </div>

  {/* Section 3: Footer (e.g., Delete) */}
  <div className="p-2 flex justify-between w-full">
  <div className="flex items-center gap-2 mb-1 border-b py-1">
    <a href={`mailto:${ad.userId.email}`} className="flex items-center text-green-600 hover:underline">
      <Email className="w-4 h-4 mr-1" /> Email
    </a>
  </div>

  <div className="flex items-center gap-2 mb-1 border-b py-1">
    <a href={`tel:${ad.userId.phone}`} className="flex items-center text-green-600 hover:underline">
      <Phone className="w-4 h-4 mr-1" /> Call
    </a>
  </div>

  <div className="flex items-center gap-2 mb-1 border-b py-1">
    <div  onClick={() => handleOpenChatId(ad.userId)} className="flex cursor-pointer items-center text-green-600 hover:underline">
      <ChatBubbleOutlineOutlinedIcon className="w-4 h-4 mr-1" /> Chat
    </div>
  </div>
  </div>
</div>

    
    
    
    </>):(<>
      {!isDeleted && (
     <div
        className={`mb-2 w-full lg:min-w-[200px] rounded-lg border shadow-sm bg-white dark:bg-[#2D3236] overflow-hidden`}
      >
        {/* Image section with dynamic height */}

      <div className="relative rounded-t-lg w-full"
         style={
          ad.plan.name !== "Free"
            ? {
                border: "2px solid",
                borderColor: ad.plan.color, // Border color for non-free plans
              }
            : undefined
        }>
          {isLoadingsmall && (
                          <div 
                          onClick={() => {
                            handleAdView(ad);
                           }}
                           className="absolute inset-0 flex justify-center items-center bg-gray-100">
                            <Icon icon={threeDotsScale} className="w-6 h-6 text-gray-500" />
                          </div>
                        )}

          <Image
            onClick={() => {
              handleAdView(ad);
            }}
            src={`${ad.data.imageUrls[0]}`}
            alt={`${ad.data.title}`}
            width={400} // Set a width to control layout consistency
            height={0} // Proportional height
            style={{ minHeight: "200px" }} // Set the minimum height here
            className={`w-full h-auto rounded-t-lg object-cover cursor-pointer ${
              isLoadingsmall ? "opacity-0" : "opacity-100"
            } transition-opacity duration-300`}
            onLoadingComplete={() => setIsLoadingsmall(false)}
            placeholder="empty" // Optional: you can use "empty" if you want a placeholder before loading
          />

          {ad.plan.name !== "Free" && (
            <div
              style={{
                backgroundColor: ad.plan.color,
              }}
              className="absolute top-0 shadow-lg left-0 text-white text-[10px] py-1 px-1 lg:text-xs lg:py-1 lg:px-3 rounded-br-lg rounded-tl-sm"
            >
              <div
                onClick={() => {
                  handleOpenPlan();
                }}
              >
                <div className="flex gap-1 cursor-pointer">{ad.plan.name}</div>
              </div>
            </div>
          )}
          {ad.organizer.verified &&
            ad.organizer?.verified[0]?.accountverified === true && (
              <div className="absolute bg-green-100 top-0 right-0 dark:text-green-900 text-[10px] py-1 px-1 lg:text-xs lg:py-1 lg:px-3 rounded-bl-lg rounded-tr-lg">
                <div className="flex gap-1 cursor-pointer">
                  <VerifiedUserOutlinedIcon sx={{ fontSize: 16 }} />
                  Verified
                </div>
              </div>
            )}
          {isAdCreator && (
            <div className="absolute right-2 top-10 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
              <div
                onClick={() => {
                  handleAdEdit(ad);
                }}
                className="cursor-pointer"
              >
                <Image
                  src="/assets/icons/edit.svg"
                  alt="edit"
                  width={20}
                  height={20}
                />
              </div>
              <DeleteConfirmation adId={ad._id} imageUrls={ad.data.imageUrls} onDeleteSuccess={() => setIsDeleted(true)}/>
            </div>
          )}

          <div className="w-full flex justify-between absolute bottom-[15px] left-1/2 transform -translate-x-1/2 p-1 rounded-full">
            <div className="gap-1 cursor-pointer bg-[#000000] bg-opacity-70 text-[10px] text-white flex rounded-sm p-1 shadow-sm transition-all">
              <FilterOutlinedIcon
                sx={{ fontSize: 16, cursor: "pointer" }}
              />
              {ad.data.imageUrls.length}
            </div>
            {ad.data["youtube-link"] && (
              <div className="gap-1 cursor-pointer bg-[#000000] bg-opacity-70 text-[10px] text-white flex rounded-sm p-1 shadow-sm transition-all">
                <YouTubeIcon
                  sx={{ fontSize: 16, cursor: "pointer" }}
                 
                />
              </div>
            )}
              {ad.data["virtualTourLink"] && (
              <div className="gap-1 cursor-pointer bg-[#000000] bg-opacity-70 text-[10px] text-white flex rounded-sm p-1 shadow-sm transition-all">
                <ThreeDRotationOutlinedIcon
                  sx={{ fontSize: 16, cursor: "pointer" }}
                
                />
             
              </div>
            )}
            
        
          </div>
          {!isAdCreator && !popup && (
                      <>
                        <div className="w-full flex justify-end absolute bottom-[-19px] left-1/2 transform -translate-x-1/2 p-1 rounded-full">
                          <SignedIn>
                            <div
                              className="w-8 h-8 p-1 shadow flex items-center justify-center rounded-full bg-white hover:text-emerald-800 tooltip tooltip-bottom text-[#2BBF4E] hover:cursor-pointer"
                              data-tip="Bookmark"
                              onClick={() => handle(ad._id)}
                            >
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <BookmarkAddedOutlinedIcon sx={{ fontSize: 20 }} />
                                  </TooltipTrigger>
                                  <TooltipContent side="left">
                                    <p className="text-sm"> Save Ad</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </SignedIn>
          
                          <SignedOut>
                            <div
                              onClick={() => {
                               
                                router.push(`/sign-in`);
                              }}
                              className="cursor-pointer"
                            >
                              <div
                                className="w-8 h-8 p-1 shadow flex items-center justify-center rounded-full bg-white hover:text-emerald-800 tooltip tooltip-bottom text-[#2BBF4E] hover:cursor-pointer"
                                data-tip="Bookmark"
                              >
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <BookmarkAddedOutlinedIcon sx={{ fontSize: 20 }} />
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                      <p className="text-sm"> Save Ad</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </SignedOut>
                        </div>
                      </>
                    )}
                    {popup && (
                      <div className="w-full flex justify-end absolute bottom-[-19px] left-1/2 transform -translate-x-1/2 p-1 rounded-full">
                        <div
                          className="w-8 h-8 p-1 shadow-lg flex items-center justify-center rounded-full bg-red-100 text-emerald-500 tooltip tooltip-bottom hover:text-[#2BBF4E] hover:cursor-pointer"
                          data-tip="Bookmark"
                          onClick={() => handledeletebk(ad._id)}
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Image
                                  src="/assets/icons/delete.svg"
                                  alt="edit"
                                  width={20}
                                  height={20}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <p className="text-sm"> Remove Ad</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    )}
       
        </div>

        {/* Text section */}
        <div className="p-2 lg:p-4">
          <div
            onClick={() => {
             handleAdView(ad);
            }}
            className="font-semibold text-sm cursor-pointer lg:text-base"
          >
            <h2>{ad.data.title}</h2>
          </div>
         
          <p className="dark:text-gray-300 text-gray-700 text-[12px] hidden lg:inline">
        <span dangerouslySetInnerHTML={{ __html:  truncateDescription(ad.data.description, 180) }} />
        </p>
       
         {ad.data.propertyarea?.mapaddress && (
                  <div className="text-gray-500 flex gap-1 items-center dark:text-gray-500 text-[12px] lg:text-xs">
                  <LocationOnIcon sx={{ fontSize: 14 }} />
                  {truncateaddress(ad.data.propertyarea?.mapaddress, 25)}
                </div>
              )} 
        
          {ad.calcDistance && (
            <div className="flex text-sm mt-1 fount-bold bg-green-100 rounded-lg p-1 text-green-600">
              {Math.round(ad.calcDistance / 100) / 10} KM Away
            </div>
          )}
          <div
            onClick={() => {
              handleAdView(ad);
            }}
            className="flex gap-1 cursor-pointer items-center dark:text-green-500 text-emerald-700 no-underline"
          >
            {ad.data.contact && ad.data.contact === "contact" ? (
              <div className="text-sm lg:text-base font-bold">Contact for price</div>
            ) : (
              <>
               
                  <span className="text-sm lg:text-base font-bold">
              {ad.data.budget ? (<> Budget : Ksh {ad.data.budget.toLocaleString()}</>):(<>Ksh {ad.data.price.toLocaleString()}</>)}   
                </span>
              </>
            )}{" "}
            {ad.data.unit && ad.data.contact === "specify" && (
              <div className="text-xs dark:text-green-500">{ad.data.unit}</div>
            )}{" "}
            {ad.data.per && (
              <div className="text-xs dark:text-green-500">{ad.data.per}</div>
            )}
            {ad.data.period && (
              <div className="text-xs dark:text-green-500">
                {ad.data.period}
              </div>
            )}
          </div>

          <div className="flex gap-2 text-gray-500 text-sm mt-2">
          {ad.data.category?.toLowerCase().includes("rent") && ( 
  <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
    Rent
  </div>
)}
{ad.data.category?.toLowerCase().includes("sale") && ( 
  <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
    Sale
  </div>
)}
            {ad.data.condition && (
              <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
                {ad.data.condition}
              </div>
            )}
            {ad.data.transimmison && (
              <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
                {ad.data.transimmison}
              </div>
            )}
            {ad.data["engine-CC"] && (
              <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
                {ad.data["engine-CC"]}
              </div>
            )}
            {ad.data["land-Type"] && (
              <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
                {ad.data["land-Type"]}
              </div>
            )}


            {ad.data["land-Area(acres)"] && (
              <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
                {ad.data["land-Area(acres)"]}
              </div>
            )}
            {ad.data["bulkprice"] && (
              <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
                Bulk Price
              </div>
            )}
            {ad.data["delivery"] && (
              <div className="flex gap-2 text-[8px] lg:text-[10px] dark:bg-[#131B1E] dark:text-gray-300 bg-[#ebf2f7] rounded-lg p-1 justify-center border">
                Delivery
              </div>
            )}
          </div>
           {isAdCreator && shouldShowRenewButton(ad.updatedAt, ad.priority) && (<div className="flex mt-2 w-full text-xs justify-between items-center">
             <button
    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
    onClick={() => handleRenew(ad._id)}
  >
    Renew Ad
  </button>
  <button
  className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
  onClick={() => handleOpenPlan()}
>
  Top Ad
</button>
          </div>
 
)}
        </div>
      </div>)}
    
    </>)}
      <ContactUser isOpen={isOpenContact} user={selectUser} handleOpenChatId={handleOpenChatId} onClose={handleCloseContact}/>
          
    </>
  );
};

export default VerticalCard;
