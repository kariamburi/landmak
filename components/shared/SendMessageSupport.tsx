"use client";
import { db, storage } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useToast } from "@/components/ui/use-toast";
import { AdminId } from "@/constants";
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
type sidebarProps = {
  displayName: string;
  uid: string;
  photoURL: string;
  recipientUid: string;
  client: boolean;
};
const SendMessageSupport = ({
  uid,
  photoURL,
  displayName,
  recipientUid,
  client,
}: sidebarProps) => {
  const [value, setValue] = useState<string>("");
  const [image, setImg] = useState<File | null>(null);
  // const [recipientUid, setrecipientUid] = React.useState<string | null>(null);
  const { toast } = useToast();
  const [check, setCheck] = useState(false);

  const sendWelcomeMessage = useCallback(async () => {
    const read = "1";
    const imageUrl = "";
    const welcomeText =
      "Hello! Thank you for reaching out to our support team. We're here to assist you. Please feel free to ask any questions or let us know how we can help you today.";

    try {
      const userQuery = query(
        collection(db, "messages"),
        where("uid", "==", AdminId),
        where("recipientUid", "==", uid),
        where("text", "==", welcomeText)
      );

      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        await addDoc(collection(db, "messages"), {
          text: welcomeText,
          name: "Support Team",
          avatar: "/customer.jpg",
          createdAt: serverTimestamp(),
          uid: AdminId,
          recipientUid: uid,
          imageUrl,
          read,
        });
      }
    } catch (error) {
      console.error("Error sending welcome message: ", error);
    }
  }, [recipientUid, uid]);
  useEffect(() => {
    if (client && recipientUid && uid && !check) {
      const timer = setTimeout(() => {
        setCheck(true);
        sendWelcomeMessage();
      }, 1000); // 3 seconds delay

      // Clean up the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (value.trim() === "") {
      toast({
        variant: "destructive",
        title: "Failed!",
        description: "Enter your message!",
        duration: 5000,
      });
      return;
    }

    try {
      let imageUrl: string = "";
      if (image) {
        const date = new Date().getTime();
        const imageRef = ref(storage, `${uid + date}`);

        // Upload the image
        await uploadBytes(imageRef, image);

        // Get the download URL
        imageUrl = await getDownloadURL(imageRef);
      }
      const read = "1";
      await addDoc(collection(db, "messages"), {
        text: value,
        name: displayName,
        avatar: photoURL,
        createdAt: serverTimestamp(),
        uid,
        recipientUid,
        imageUrl,
        read,
      });
      setValue("");
      setImg(null);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="h-[50px] border w-full bg-white dark:bg-[#2D3236] items-center mb-1">
     <form onSubmit={handleSendMessage} className="flex items-center gap-2 ">
        {recipientUid ? (
          <>
           
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="input flex-1 lg:w-full text-sm lg:text-base dark:bg-[#131B1E] dark:text-[#F1F3F3] text-black p-3 focus:outline-none bg-white rounded-lg"
              placeholder="Enter your message..."
              rows={1}
              style={{ height: "auto" }}
            />

            <button
              type="submit"
              className="bg-gradient-to-b from-green-600 to-green-700 text-white rounded-lg py-2 px-4"
            >
              Send
            </button>
          </>
        ) : (
          <>
            <input
              value={value}
              disabled
              className="input w-full p-2 text-black focus:outline-none bg-white rounded-lg"
              type="text"
              placeholder="Enter your message..."
            />
            <button
              type="submit"
              disabled
              className="bg-gradient-to-b from-green-600 to-green-700 text-white rounded-lg px-4"
            >
              Send
            </button>
          </>
        )}

      </form>
    </div>
  );
};

export default SendMessageSupport;
