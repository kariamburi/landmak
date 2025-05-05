//import { UserAuth } from "../context/AuthContext";

import { UpdateUserParams } from "@/types";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { format, isToday, isYesterday } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import PropertyMap from "./PropertyMap";
import sanitizeHtml from "sanitize-html";
interface MessageProps {
  message: {
    uid: string;
    recipientUid: string;
    imageUrl: string;
    avatar: string;
    createdAt: {
      seconds: number;
      nanoseconds: number;
    }; // Assuming createdAt is a Timestamp object
    name: string;
    text: string;
    adUrl: string;
    adTitle: string;
    adDescription: string;
  };
  displayName: string;
  uid: string;
  photoURL: string;
  recipientUid: string | null;
  recipient: UpdateUserParams;
  handleAdEdit:(id:string)=> void;
  handleAdView:(id:string)=> void;
  handleCategory:(category:string)=> void;
  handleOpenSell:()=> void;
 handleOpenPlan:()=> void;
}

const Message = ({
  message,
  displayName,
  uid,
  recipientUid,
  photoURL,
  recipient,
  handleAdEdit,
  handleAdView,
  handleCategory,
  handleOpenSell,
 handleOpenPlan,
}: MessageProps) => {
  // Convert Timestamp to Date object
   const truncateDescription = (description: string, charLimit: number) => {
      const safeMessage = sanitizeHtml(description); 
      const truncatedMessage =
      safeMessage.length > charLimit
        ? `${safeMessage.slice(0, charLimit)}...`
        : safeMessage;
      return truncatedMessage;
    };
  const [isLoading, setIsLoading] = useState(true);
  let formattedCreatedAt = "";
  let queryObject:any=[];
  try {
    const createdAtDate = new Date(message.createdAt.seconds * 1000);
    if (isToday(createdAtDate)) {
      formattedCreatedAt = "Today " + format(createdAtDate, "HH:mm");
    } else if (isYesterday(createdAtDate)) {
      formattedCreatedAt = "Yesterday " + format(createdAtDate, "HH:mm");
    } else {
      formattedCreatedAt = format(createdAtDate, "dd-MM-yyyy HH:mm");
    }
  } catch {}
  
  const containsHttpOrHttps = (str: string) => {
    return str.includes("http://") || str.includes("https://");
  };
  const regex = /PropertyLocation&coordinates=([\d.,-]+)/;
const match = message.text.match(regex);
  const [showPopup, setShowPopup] = useState(false);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  return (
    <div className="text-gray-700">
      <div className="chatbox p-4">
        <div
          className={`flex items-start mb-4 ${
            message.uid === uid ? "justify-end" : "justify-start"
          }`}
        >
          <Image
            src={message.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full mr-3"
            height={200}
            width={200}
          />
          <div
            className={`message-content max-w-xs rounded-lg p-3 ${
              message.uid === uid
                ? "bg-green-100 text-left"
                : "bg-blue-100 text-left"
            }`}
          >
            <h4 className="font-semibold">{message.name}</h4>
            <div className="text-sm">
              { match ? (<> <div className="flex flex-col w-full gap-1">
                                <button
                                  onClick={handleOpenPopup}
                                  className="flex gap-2 items-center justify-center w-full p-2 border border-green-600 text-green-600 rounded-md bg-green-100"
                                >
                                  🗺️ Virtual Tour of Property Location
                                </button>
              
                                {showPopup && (
                                  <div className="fixed inset-0 flex items-center justify-center bg-[#e4ebeb] z-50">
                                    <div className="dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 bg-[#e4ebeb] p-2 w-full items-center justify-center relative">
                           
                                      <div className="flex flex-col items-center justify-center dark:bg-[#2D3236] bg-[#e4ebeb]">
                                  
              <PropertyMap queryObject={queryObject} onClose={handleClosePopup} coordinates={match[1]}
              handleAdEdit={handleAdEdit}
               handleAdView={handleAdView} 
               handleCategory={handleCategory}
               handleOpenSell={handleOpenSell}
              handleOpenPlan={handleOpenPlan}/>
                                      </div>
                                      
                                    </div>
                                  </div>
                                   
                                )}
                              </div></>):(<>  {containsHttpOrHttps(message.text) ? (<><a
              href={message.text}
              target="_blank"
              rel="noopener noreferrer"
              className="block  mt-2 text-blue-600 underline"
            >
             <span dangerouslySetInnerHTML={{ __html:  truncateDescription(message.text ?? "", 65) }} />
            
            </a></>):(<> <span dangerouslySetInnerHTML={{ __html:  truncateDescription(message.text ?? "", 65) }} /></>)} </>)}
          
            
            </div>
            <small className="text-gray-500">{formattedCreatedAt}</small>
            {message.imageUrl && (
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#000000] bg-opacity-50">
                    {/* Spinner or loading animation */}
                    <CircularProgress sx={{ color: "white" }} />
                  </div>
                )}
                <Zoom>
                  <Image
                    src={message.imageUrl} // Image URL coming from the message object
                    alt="ad image" // Alt text for accessibility
                    width={500} // Replace with actual width of the image
                    height={300} // Replace with actual height of the image
                    className={`mt-2 rounded-lg cursor-pointer ${
                      isLoading ? "opacity-0" : "opacity-100"
                    } transition-opacity duration-300`}
                    onLoadingComplete={() => setIsLoading(false)}
                    placeholder="empty" // Optional: you can use "empty" if you want a placeholder before loading
                  />
                </Zoom>
              </div>
            )}

            <a
              href={message.adUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 text-blue-600 underline"
            >
              {message.adTitle}
            </a>
            <p className="text-sm text-gray-700">
            <span dangerouslySetInnerHTML={{ __html:  truncateDescription(message.adDescription ?? "", 80) }} />
           
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
