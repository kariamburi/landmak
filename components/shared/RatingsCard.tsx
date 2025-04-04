import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  where,
  limit,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
type Ratingsprop = {
  recipientUid: string;
  user:any;
  handleOpenReview: (value:any) => void;
};

interface Review {
  id: string;
  text: string;
  name: string;
  avatar: string;
  createdAt: Timestamp; // Assuming createdAt is a Firestore timestamp
  uid: string;
  recipientUid: string;
  starClicked: boolean[];
}

const RatingsCard = ({ recipientUid, user, handleOpenReview }: Ratingsprop) => {
  const [clickedStarsCount, setClickedStarsCount] = useState<number>(0);
  const [messagesCount, setMessagesCount] = useState<number>(0);
  const [averangestar, setaverangestar] = useState<number>(0);
  const pathname = usePathname();
  useEffect(() => {
    if (!recipientUid) return; // Ensure recipientUid is defined before running the query
  
    const fetchMessages = () => {
      const messagesQuery = query(
        collection(db, "reviews"),
        where("recipientUid", "==", recipientUid),
        limit(100)
      );
  
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        let totalClickedStars = 0;
        let totalMessages = snapshot.size;
        
        snapshot.forEach((doc) => {
          const reviewData = doc.data() as Review;
          totalClickedStars += reviewData.starClicked
            ? reviewData.starClicked.filter((clicked: boolean) => clicked).length
            : 0;
        });
  
        setClickedStarsCount(totalClickedStars);
        setMessagesCount(totalMessages);
        setaverangestar(totalMessages === 0 ? 0 : totalClickedStars / totalMessages);
      });
  
      return unsubscribe;
    };
  
    fetchMessages();
  }, [recipientUid]);
  
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-full">
     
      <div
        onClick={() => {
          handleOpenReview(user);
        
        }}
        className="flex cursor-pointer flex-col  dark:hover:text-green-600 p-1 items-center w-[130px]"
      >
        <h1 className="mt-2 p-0 font-bold dark:text-emerald-600 text-emerald-950">
          {averangestar.toFixed(1)}
        </h1>

        <p className="dark:text-gray-300 text-gray-600 underline hover:font-bold dark:hover:font-bold text-sm">Ratings</p>

        {averangestar < 1 && (
        <div className="w-[70px] items-center justify-center">
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
        </div>
      )}
      {averangestar >= 1 && averangestar < 1.5 && (
        <div className="w-[70px] items-center justify-center">
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
        </div>
      )}
      {averangestar >= 1.5 && averangestar < 2 && (
        <div className="w-[70px] items-center justify-center">
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarHalfIcon className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
        </div>
      )}
      {averangestar >= 2 && averangestar < 2.5 && (
        <div className="w-[70px] items-center justify-center">
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
        </div>
      )}
      {averangestar >= 2.5 && averangestar < 3 && (
        <div className="w-[70px] items-center justify-center">
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarHalfIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
        </div>
      )}
      {averangestar >= 3 && averangestar < 3.5 && (
        <div className="w-[70px] items-center justify-center">
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
        </div>
      )}
      {averangestar >= 3.5 && averangestar < 4 && (
        <div className="w-[70px] items-center justify-center">
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarHalfIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
        </div>
      )}
      {averangestar >= 4 && averangestar < 4.5 && (
        <div className="w-[70px] items-center justify-center">
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-gray-400" />
        </div>
      )}
      {averangestar >= 4.5 && averangestar < 5 && (
        <div className="w-[70px] items-center justify-center">
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarHalfIcon sx={{ fontSize: 14 }} className="text-amber-400" />
        </div>
      )}
      {averangestar >= 5 && (
        <div className="w-[70px] items-center justify-center">
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
          <StarIcon sx={{ fontSize: 14 }} className="text-amber-400" />
        </div>
      )}

      </div>
      <div
        onClick={() => {
          handleOpenReview(user);
          //if (pathname !== `/reviews/${recipientUid}`) {
          //  openLoading();
          //  router.push(`/reviews/${recipientUid}`);
          //}
        }}
        className="flex flex-col cursor-pointer dark:hover:text-green-600 hover:text-green-600 p-1 items-center w-[130px]"
      >
        <h1 className="mt-2 p-0 font-bold dark:text-emerald-600 text-emerald-950">
          {messagesCount}
        </h1>

        <p className="dark:text-gray-300 text-gray-600 hover:underline underline hover:font-bold dark:hover:font-bold text-sm">Reviews</p>
      </div>

    </div>
  );
};

export default RatingsCard;
