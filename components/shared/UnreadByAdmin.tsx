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

const UnreadByAdmin = ({ userId}: UnreadProp) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const messagesQuery = query(
      collection(db, "messages"),
      where("recipientUid", "==", AdminId ),
      where("uid", "==", userId),
      where("read", "==", "1") // Assuming "1" means unread
    );

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      setUnreadCount(querySnapshot.size); // Realtime count
    });

    return () => unsubscribe(); // Clean up listener
  }, [userId]);

  return (
    <div>
      {unreadCount !== 0 && (
        <div className="bg-rose-600 shadow-lg rounded-full w-4 h-4 flex items-center justify-center text-[10px] text-white">
          {unreadCount}
        </div>
      )}
    </div>
  );
};

export default UnreadByAdmin;
