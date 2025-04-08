"use client";

import { useEffect } from "react";
import { getDatabase, ref, onDisconnect, set, serverTimestamp, onValue ,off} from "firebase/database";
import { app } from "@/lib/firebase"; // Your Firebase config
import { useUser } from "@clerk/nextjs";

const PresenceProvider = ({ userId }: { userId: string }) => {
 
  useEffect(() => {
    if (!userId) return;
  //console.log(userId)
    const uid = userId;
    const db = getDatabase(app);
    const userStatusRef = ref(db, `/status/${uid}`);
    const connectedRef = ref(db, ".info/connected");
  
    const isOnline = {
      state: "online",
      last_changed: serverTimestamp(),
    };
  
    const isOffline = {
      state: "offline",
      last_changed: serverTimestamp(),
    };
  
    const handleConnectionChange = (snapshot: any) => {
      if (snapshot.val() === false) return;
  
      onDisconnect(userStatusRef).set(isOffline).then(() => {
        set(userStatusRef, isOnline);
        console.log(isOnline)
      });
    };
  
    onValue(connectedRef, handleConnectionChange);
  
    return () => {
      // Clean up the listener
      off(connectedRef, "value", handleConnectionChange);
      set(userStatusRef, isOffline); // Mark offline on unmount
      console.log(isOffline)
    };
  }, [userId]);
  
  return null;
};

export default PresenceProvider;
