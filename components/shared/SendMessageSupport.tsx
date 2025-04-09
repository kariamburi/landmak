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
import React, { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AdminId } from "@/constants";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";

type SidebarProps = {
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
}: SidebarProps) => {
  const [value, setValue] = useState<string>("");
  const [image, setImg] = useState<File | null>(null);
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
          avatar: "/customer.jpg", // You can replace this with a constant or dynamic image
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
  }, [uid]);

  useEffect(() => {
    if (client && recipientUid && uid && !check) {
      const timer = setTimeout(() => {
        setCheck(true);
        sendWelcomeMessage();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [client, recipientUid, uid, check, sendWelcomeMessage]);

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
      let imageUrl = "";
      if (image) {
        const date = new Date().getTime();
        const imageRef = ref(storage, `${uid + date}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "messages"), {
        text: value,
        name: displayName,
        avatar: photoURL,
        createdAt: serverTimestamp(),
        uid,
        recipientUid,
        imageUrl,
        read: "1",
      });

      setValue("");
      setImg(null);
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div className="h-auto border w-full bg-white dark:bg-[#2D3236] items-center mb-1">
      <form
        onSubmit={handleSendMessage}
        id="send-message-form"
        className="flex items-center gap-2 p-2"
      >
        {recipientUid ? (
          <>
            <textarea
              value={value}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  const form = document.getElementById("send-message-form");
                  form?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                }
              }}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 text-sm lg:text-base dark:bg-[#131B1E] dark:text-[#F1F3F3] text-black p-3 focus:outline-none bg-white rounded-lg"
              placeholder="Enter your message..."
              rows={1}
              style={{ height: "auto" }}
            />

            {/* Attachment Icon */}
            <label className="cursor-pointer">
              <AttachFileOutlinedIcon className="text-gray-600 dark:text-gray-300" />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImg(e.target.files[0]);
                  }
                }}
              />
            </label>

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
              className="w-full p-2 text-black focus:outline-none bg-white rounded-lg"
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

      {image && (
        <div className="text-xs text-gray-500 px-2">
          Attached: {image.name}
        </div>
      )}
    </div>
  );
};

export default SendMessageSupport;
