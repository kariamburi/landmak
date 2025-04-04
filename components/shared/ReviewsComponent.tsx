// components/Chat.js
"use client"
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Image from "next/image";
import { getUserById } from "@/lib/actions/user.actions";
import Navbar from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SellerProfile from "@/components/shared/SellerProfile";
import { auth } from "@clerk/nextjs/server";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import Sidebar from "@/components/shared/Sidebar";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import Footersub from "@/components/shared/Footersub";
import BottomNavigation from "@/components/shared/BottomNavigation";
import Sidebarmain from "@/components/shared/Sidebarmain";
import { mode } from "@/constants";
import SellerProfileReviews from "./SellerProfileReviews";
import { IUser } from "@/lib/database/models/user.model";
import SidebarmainReviews from "./SidebarmainReviews";
import StarIcon from "@mui/icons-material/Star";
import { Star, Send, X, CheckCircle, Phone, Mail, Circle } from "lucide-react";
import { addDoc, collection, getDocs, limit, onSnapshot, query, serverTimestamp, Timestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Ratingsmobile from "./ratingsmobile";
import CircularProgress from "@mui/material/CircularProgress";
interface AdsProps {
 displayName: string;
  uid: string;
  photoURL:string;
  user: any;
  recipient: any;
  onClose: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenSell: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenSettings: () => void;
  handleOpenChatId: (value:string) => void;
  handleOpenReview: (value:string) => void;
 // handleCategory: (value:string) => void;
 // handleOpenSearchTab: (value:string) => void;
  handleOpenShop: (shopId:any) => void;
  handleOpenPerfomance: () => void;
  handlePay: (id:string) => void;
}

const ReviewsComponent =  ({displayName,uid,photoURL,user, recipient, onClose, handlePay, handleOpenShop,
  handleOpenPerfomance,handleOpenSettings,handleOpenReview,handleOpenChat,handleOpenChatId, handleOpenBook, handleOpenSell, handleOpenPlan, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety}:AdsProps) => {
 const [showForm, setShowForm] = useState(false);
  const [isSending, setIsSending] = useState(false); 
  // console.log(senderId);
  const [newReview, setNewReview] = useState({
      comment: "",
      rating: 0,
    });
  
  const [starClicked, setStarClicked] = useState([
      false,
      false,
      false,
      false,
      false,
    ]);
  
    const handleStarClick = (index: number) => {
      const updatedStarClicked = [...starClicked];
      updatedStarClicked[index] = !updatedStarClicked[index];
      setStarClicked(updatedStarClicked);
    };
  

  const handleReviewSubmit = async () => {
  
      if (newReview.comment && newReview.rating) {
       
        return;
      }
  
      try {
        setIsSending(true); // Disable the button and show progress
  
        // Check if a review already exists for the sender and recipient combination
        const reviewQuery = query(
          collection(db, "reviews"),
          where("uid", "==", uid), // Assuming senderUid is the UID of the current user
          where("recipientUid", "==", recipient._id)
        ); // Assuming recipientUid is the UID of the recipient
  
        const reviewSnapshot = await getDocs(reviewQuery);
  
        if (!reviewSnapshot.empty) {
         
          await addDoc(collection(db, "reviews"), {
            text: newReview.comment,
            name: displayName,
            avatar: photoURL,
            createdAt: serverTimestamp(),
            uid:uid,
            recipientUid:recipient._id,
            starClicked,
          });
        } else {
          // Allow the user to submit a new review
          await addDoc(collection(db, "reviews"), {
            text: newReview.comment,
            name: displayName,
            avatar: photoURL,
            createdAt: serverTimestamp(),
            uid:uid,
            recipientUid:recipient._id,
            starClicked,
          });
  
          console.log("Review submitted successfully.");
        }
      } catch (error) {
        console.error("Error sending review: ", error);
      } finally {
        setIsSending(false); // Re-enable the button and hide progress
      }
      setNewReview({ comment: "", rating: 0 });
      setShowForm(false);
    
    };
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
  
      useEffect(() => {
         const savedTheme = localStorage.getItem("theme") || mode; // Default to "dark"
         const isDark = savedTheme === mode;
         
         setIsDarkMode(isDark);
         document.documentElement.classList.toggle(mode, isDark);
       }, []);
     
       useEffect(() => {
         if (isDarkMode === null) return; // Prevent running on initial mount
     
         document.documentElement.classList.toggle(mode, isDarkMode);
         localStorage.setItem("theme", isDarkMode ? "dark" : "light");
       }, [isDarkMode]);
     
       if (isDarkMode === null) return null; // Avoid flickering before state is set
     
  return (
     <div className="h-[100vh] bg-white lg:bg-gray-200 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
       
      <div className="z-10 top-0 fixed w-full">
                 <Navbar user={user} userstatus={user.status} userId={uid} onClose={onClose} 
                 handleOpenSell={handleOpenSell} 
                 handleOpenPlan={handleOpenPlan} 
                 popup={"reviews"} 
                 handleOpenBook={handleOpenBook} 
                 handleOpenChat={handleOpenChat}
                  handleOpenShop={handleOpenShop} 
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings} 
                  handleOpenAbout={handleOpenAbout} 
                  handleOpenTerms={handleOpenTerms}
                  handleOpenPrivacy={handleOpenPrivacy}
                  handleOpenSafety={handleOpenSafety}/>
               </div>
      <div className="w-full max-w-6xl mx-auto h-full flex mt-[73px] lg:mt-[60px] mb-0 p-1">
        <div className="hidden lg:inline mr-5">
          <div className="w-full rounded-lg p-1">
            <SellerProfileReviews
              user={recipient}
              loggedId={uid}
              userId={recipient._id}
              handleOpenReview={handleOpenReview} 
              handleOpenChatId={handleOpenChatId} 
              handleOpenSettings={handleOpenSettings} 
              handlePay={handlePay}/>
          </div>
        </div>

        <div className="flex-1 h-screen">
        
          <div className="rounded-lg mb-20 h-full lg:mb-0 max-w-6xl mx-auto flex flex-col">
            <div className="lg:flex-1 h-screen p-1 w-full">
              <div className="flex w-full p-2 justify-between bg-white rounded-t-lg border-b dark:bg-[#2D3236] items-center">
              <div className="flex flex-col">
               
                <div className="text-xs lg:text-base flex gap-1 items-center">
                <Ratingsmobile recipientUid={recipient._id} user={recipient} handleOpenReview={handleOpenReview} />
                </div>
                </div>

 {/* Leave a Review Button (Fixed) */}
      <button
        className="text-sm lg:text-base bg-green-600 text-white py-1 px-2 lg:px-5 lg:py-2 rounded-full shadow-lg"
        onClick={() => setShowForm(true)}
      >
        Leave a Review
      </button>

      {/* Review Form Popup */}
      {showForm && (
        <div className="fixed z-20 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium dark:text-gray-300 text-gray-700">
                Leave a Review
              </h3>
              <button onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <textarea
              placeholder="Write a review..."
              className="w-full p-2 border rounded-md mb-2 dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 bg-white"
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })}
            />
            <div className="flex gap-2 items-center">
              <span className="dark:text-gray-300 text-gray-700">Rating:</span>

                 {starClicked.map((clicked, index) => (
                    <StarIcon
                      key={index}
                      sx={{ fontSize: 36, color: clicked ? "gold" : "gray" }} // Change color based on clicked state
                      onClick={() => handleStarClick(index)} // Call handleStarClick function on click
                      className="ml-1 lg:ml-0 cursor-pointer mb-1"
                    />
                  ))}
            </div>
            <button
              disabled={isSending}
              className="w-full mt-3 bg-green-600 text-white p-2 rounded-lg flex items-center justify-center gap-2"
              onClick={() => handleReviewSubmit()}
            >
                {isSending && (
                                  <CircularProgress sx={{ color: "white" }} size={30} />
                                )}
                                {isSending ? " Submitting..." : " Submit"}
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

              </div>
              <ScrollArea className="h-[75vh] p-1 bg-white rounded-b-lg dark:bg-[#2D3236]">
    
              <SidebarmainReviews recipientUid={recipient._id} uid={uid}/>
             </ScrollArea>
              <Toaster />
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div className="hidden lg:inline">
          <Footersub 
          handleOpenAbout={handleOpenAbout}
         handleOpenTerms={handleOpenTerms}
         handleOpenPrivacy={handleOpenPrivacy}
         handleOpenSafety={handleOpenSafety}/>
        </div>

      </footer>
    </div>
  );
};

export default ReviewsComponent;


