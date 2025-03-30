"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { db } from "@/lib/firebase";
import UnreadmessagesPeruser from "./UnreadmessagesPeruser";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import { ScrollArea } from "../ui/scroll-area";
import { format, isToday, isYesterday } from "date-fns";
import ProgressPopup from "./ProgressPopup";
import { DeleteReview } from "./DeleteReview";
import Reviews from "./Reviews";
type sidebarProps = {
  recipientUid: string;
  uid:string;
};

interface Review {
  text: string;
  name: string;
  avatar: string;
  createdAt: Timestamp; // Assuming createdAt is a Firestore timestamp
  uid: string;
  recipientUid: string;
  starClicked: boolean[];
}
const SidebarmainReviews = ({ recipientUid, uid }: sidebarProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Review[]>([]);
    //const [recipientUid, setrecipientUid] = React.useState<string | null>(null);
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    useEffect(scrollToBottom, [messages]);
  
    const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true); // Ensure loading starts when fetching data

  try {
    const senderMessagesQuery = query(
      collection(db, "reviews"),
      where("recipientUid", "==", recipientUid),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      senderMessagesQuery,
      (snapshot) => {
        const senderMessages: Review[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Review), // Cast to the Review type
        }));

        // Sort messages by createdAt timestamp
        senderMessages.sort((a, b) => {
          const createdAtA = a.createdAt ? a.createdAt.toMillis() : 0;
          const createdAtB = b.createdAt ? b.createdAt.toMillis() : 0;
          return createdAtA - createdAtB;
        });

        setMessages(senderMessages);
        setLoading(false); // Set loading to false only after data is retrieved
      },
      (error) => {
        console.error("Error getting last messages:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  } catch (error) {
    console.error("Error setting up listener:", error);
    setLoading(false);
  }
}, [recipientUid]);

  
    useEffect(() => {
      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      };
      scrollToBottom();
    }, [messages]);

  return (
    <div>
      {loading ? (
        <div className="flex flex-col justify-center w-full">
          <div className="flex gap-2 justify-center mb-1">
            <Skeleton
              variant="rectangular"
              animation="wave"
              //  height={50}
              className="rounded-sm w-6 h-10 dark:bg-[#2D3236]"
            />
            <Skeleton
              variant="rectangular"
              animation="wave"
              //  height={50}
              className="rounded-sm w-full h-10 dark:bg-[#2D3236]"
            />
          </div>
          <div className="flex gap-2 justify-center mb-1">
            <Skeleton
              variant="rectangular"
              animation="wave"
              //  height={50}
              className="rounded-sm w-6 h-10 dark:bg-[#2D3236]"
            />
            <Skeleton
              variant="rectangular"
              animation="wave"
              //  height={50}
              className="rounded-sm w-full h-10 dark:bg-[#2D3236]"
            />
          </div>
          <div className="flex gap-2 justify-center mb-1">
            <Skeleton
              variant="rectangular"
              animation="wave"
              //  height={50}
              className="rounded-sm w-6 h-10 dark:bg-[#2D3236]"
            />
            <Skeleton
              variant="rectangular"
              animation="wave"
              //  height={50}
              className="rounded-sm w-full h-10 dark:bg-[#2D3236]"
            />
          </div>
          <div className="flex gap-2 justify-center mb-1">
            <Skeleton
              variant="rectangular"
              animation="wave"
              //  height={50}
              className="rounded-sm w-6 h-10 dark:bg-[#2D3236]"
            />
            <Skeleton
              variant="rectangular"
              animation="wave"
              //  height={50}
              className="rounded-sm w-full h-10 dark:bg-[#2D3236]"
            />
          </div>
        </div>
      ) : messages.length > 0 ? (
        <>
          <div className="w-full dark:bg-[#2D3236] dark:text-gray-100 bg-white rounded-lg">
            <ScrollArea className="h-full w-full p-2">
              <ul className="divide-y divide-gray-200 dark:divide-gray-600">
              {messages
              .slice()
              .reverse()
              .map((message: any) => (
                <Reviews
                  key={message.id}
                  message={message}
                  uid={uid}
                />
              ))}
              </ul>
            </ScrollArea>
          </div>
        </>
      ) : (
        <>
          <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] py-28 text-center">
            <h3 className="font-bold text-[16px] lg:text-[25px]">No Review</h3>
            <p className="text-sm dark:text-gray-500 lg:p-regular-14">
              Seller have (0) reviews
            </p>
          </div>
        </>
      )}
     
    </div>
  );
};

export default SidebarmainReviews;
