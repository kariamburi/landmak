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
type Ratingsprop = {
  recipientUid: string;
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

const Ratings = ({ recipientUid }: Ratingsprop) => {
  const [clickedStarsCount, setClickedStarsCount] = useState<number>(0);
  const [messagesCount, setMessagesCount] = useState<number>(0);
  const [averangestar, setaverangestar] = useState<number>(0);
  useEffect(() => {
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
            ? reviewData.starClicked.filter((clicked: boolean) => clicked)
                .length
            : 0;
        });

        setClickedStarsCount(totalClickedStars);
        setMessagesCount(totalMessages);
        if (totalMessages === 0) {
          setaverangestar(0);
        } else {
          setaverangestar(totalClickedStars / totalMessages);
        }
      });

      return unsubscribe;
    };

    fetchMessages();
  }, [recipientUid]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="mt-2 p-0 text-base font-bold text-emerald-950">
        {" "}
        Ratings: {averangestar.toFixed(1)}
      </h1>
      <Link
        href={`/reviews/${recipientUid}`}
        className="text-gray-600 text-sm no-underline font-boldm-1 hover:underline"
      >
        <p className="items-center">{messagesCount} reviews</p>
      </Link>

      {averangestar < 1 && (
        <div className="items-center">
          <StarIcon className="text-gray-400" />
          <StarIcon className="text-gray-400" />
          <StarIcon className="text-gray-400" />
          <StarIcon className="text-gray-400" />
          <StarIcon className="text-gray-400" />
        </div>
      )}
      {averangestar >= 1 && averangestar < 1.5 && (
        <div className="items-center">
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-gray-400" />
          <StarIcon className="text-gray-400" />
          <StarIcon className="text-gray-400" />
          <StarIcon className="text-gray-400" />
        </div>
      )}
      {averangestar >= 1.5 && averangestar < 2 && (
        <div className="items-center">
          <StarIcon className="text-amber-400" />
          <StarHalfIcon className="text-amber-400" />
          <StarIcon className="text-gray-400" />
          <StarIcon className="text-gray-400" />
          <StarIcon className="text-gray-400" />
        </div>
      )}
      {averangestar >= 2 && averangestar < 2.5 && (
        <div className="items-center">
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-gray-400" />
          <StarIcon className="text-gray-400" />
          <StarIcon className="text-gray-400" />
        </div>
      )}
      {averangestar >= 2.5 && averangestar < 3 && (
        <div className="items-center">
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-amber-400" />
          <StarHalfIcon className="text-amber-400" />
          <StarIcon className="text-gray-400" />
          <StarIcon className="text-gray-400" />
        </div>
      )}
      {averangestar >= 3 && averangestar < 3.5 && (
        <div className="items-center">
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-gray-400" />
          <StarIcon className="text-gray-400" />
        </div>
      )}
      {averangestar >= 3.5 && averangestar < 4 && (
        <div className="items-center">
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-amber-400" />
          <StarHalfIcon className="text-amber-400" />
          <StarIcon className="text-gray-400" />
        </div>
      )}
      {averangestar >= 4 && averangestar < 4.5 && (
        <div className="items-center">
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-gray-400" />
        </div>
      )}
      {averangestar >= 4.5 && averangestar < 5 && (
        <div className="items-center">
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-amber-400" />
          <StarHalfIcon className="text-amber-400" />
        </div>
      )}
      {averangestar >= 5 && (
        <div className="items-center">
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-amber-400" />
          <StarIcon className="text-amber-400" />
        </div>
      )}
    </div>
  );
};

export default Ratings;
