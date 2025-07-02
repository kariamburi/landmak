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
import { useRouter } from "next/navigation";
type Ratingsprop = {
  recipientUid: string;
  user: any;
  handleOpenReview: (value: any) => void;
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

const Ratingsmobile = ({ recipientUid, user, handleOpenReview }: Ratingsprop) => {
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
  const router = useRouter();
  return (
    <>
      <div onClick={() => {
        handleOpenReview(user);
      }} className="flex gap-2 mt-1 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
        ⭐ {averangestar.toFixed(1)} <div className="underline cursor-pointer">{"("}{messagesCount} Reviews{")"}</div>
      </div>

    </>);
};

export default Ratingsmobile;
