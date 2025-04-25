// components/FCMTokenProvider.tsx
"use client";

import { useEffect, useState } from "react";
import { updateUserToken } from "@/lib/actions/user.actions";
import { getMessaging, getToken } from "firebase/messaging";

export default function FCMTokenProvider({ userId }: { userId: string }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Register the service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered", registration);
        })
        .catch((err) => {
          console.error("❌ Service Worker registration failed", err);
        });
         //clear notification when app open
        navigator.serviceWorker.ready.then((registration) => {
          registration.getNotifications().then((notifications) => {
            notifications.forEach((notification) => notification.close());
          });
        });
    }
   
  
  }, []);

  useEffect(() => {
    if (!userId) return;

    const getFCMToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("❌ Notification permission not granted");
          return;
        }

       // Get registration token. Initially this makes a network call, once retrieved
       // subsequent calls to getToken will return from cache.
       const messaging = getMessaging();
       getToken(messaging, { vapidKey: 'BBab8QI55Whtv0jCdfCjcW1Wc5l6XjIFrIG8UukzfKFw98r0WANBMvGErDTRM-h-XoaYZoAloyabD1m45lJ2TjY'}).then(async (currentToken) => {
         if (currentToken) {
           // Send the token to your server and update the UI if necessary
           console.log("🎯 FCM Token:", currentToken);
           setToken(currentToken);
 
           // Store token in the database
           await updateUserToken(userId, currentToken);

           //const res = await fetch("/api/send-push", {
          //  method: "POST",
            //headers: {
            //"Content-Type": "application/json",
            //    },
            //    body: JSON.stringify({
            //token: currentToken,
             //title: "New Message",
            //     body: "You've got a new notification!",
           //   }),
           // });
        
         // const data = await res.json();
         // console.log("Push Response:", data);
         } else {
           // Show permission request UI
           console.log('No registration token available. Request permission to generate one.');
           // ...
         }
       }).catch((err) => {
         console.log('An error occurred while retrieving token. ', err);
         // ...
       });

      } catch (error) {
        console.error("❌ Error getting FCM token PAUL:", error);
      }
    };

    getFCMToken();
  }, [userId]);

  return null;
}
