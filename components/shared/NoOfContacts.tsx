import { AdminId } from "@/constants";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

type UnreadProp = {
  userId: string;
};

const NoOfContacts = ({ userId}: UnreadProp) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const messagesQuery = query(
      collection(db, "messages"),
      where("recipientUid", "==", userId),
      where("uid", "==", AdminId)
    );

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      setUnreadCount(querySnapshot.size); // Realtime count
    });

    return () => unsubscribe(); // Clean up listener
  }, [userId]);

  return (
    <div>
      {unreadCount !== 0 && (
        <div className="dark:bg-gray-900 dark:text-white bg-green-100 shadow-lg rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
          {unreadCount}
        </div>
      )}
    </div>
  );
};

export default NoOfContacts;
