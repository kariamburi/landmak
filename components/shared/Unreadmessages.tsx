import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
type unreadprop = {
  userId: string;
  popup:string;
};
const Unreadmessages = ({ userId, popup }: unreadprop) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  useEffect(() => {
    const getLastMessagesInConversations = async () => {
      try {
        //  const unreadMessages: any = {};
        const messagesQuery = query(
          collection(db, "messages"),
          where("recipientUid", "==", userId),
          where("read", "==", "1")
        );
        const querySnapshot = await getDocs(messagesQuery);
        let k: number = 0;
        querySnapshot.forEach((doc) => {
          const message = doc.data();
          // unreadMessages[message.id] = message;
          k = k + 1;
        });
        // alert(k);
        return k;
      } catch (error) {
        console.error("Error getting last messages:", error);
        return 0;
      }
    };

    getLastMessagesInConversations()
      .then((k) => {
        console.log("Number of unread messages:", k);
        setUnreadCount(k);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [userId, popup]); // Dependency array including userId

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

export default Unreadmessages;
