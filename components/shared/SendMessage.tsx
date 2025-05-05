"use client";
import { app, db, storage } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import React, { useCallback, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import LatLngPickerAndShare from "./LatLngPickerAndShare";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import MenuComponent from "./MenuComponent";
import {
  get,
  getDatabase,
  onValue,
  ref as databaseRef,
} from "firebase/database";
import SendChat from "./SendChat";
import { getUserById } from "@/lib/actions/user.actions";
import { debounce } from "lodash";

type sidebarProps = {
  displayName: string;
  uid: string;
  photoURL: string;
  recipientUid: string;
  client: boolean;
};

const SendMessage = ({
  uid,
  photoURL,
  displayName,
  recipientUid,
  client,
}: sidebarProps) => {
  const [value, setValue] = useState<string>("");
  const [image, setImg] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const { sendNotify } = SendChat();
  const { toast } = useToast();
  const [showPopupGps, setShowPopupGps] = useState(false);

  const handleSendMessage = async () => {
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
        const imageRef = storageRef(storage, `${uid + date}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const read = "1";
      const messageData = {
        text: value,
        name: displayName,
        avatar: photoURL,
        createdAt: serverTimestamp(),
        uid,
        recipientUid,
        imageUrl,
        read,
      };

      await addDoc(collection(db, "messages"), messageData);

      const rtdb = getDatabase(app);
      const statusRef = databaseRef(rtdb, `/status/${recipientUid}`);
      let recipientStatus = "offline";

      try {
        const snapshot = await get(statusRef);
        const data = snapshot.val();
        recipientStatus = data?.state || "offline";
      } catch (error) {
        console.error("Error fetching online status:", error);
      }

      if (recipientStatus === "offline") {
        const user = await getUserById(recipientUid);
       if(user.token && user.notifications.fcm){
          const token = user.token;
         // sendNotify(token, `You've got a new message from ${displayName}!`);
          const debouncedNotifyUser = debounce(sendNotify, 1000); // only allow once every second
          // Then call
          debouncedNotifyUser(token, `You've got a new message from ${displayName}!`);
        }
      }

      setValue("");
      setImg(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleOpenPopupGps = () => {
    setShowPopupGps(true);
  };

  const handleClosePopupGps = () => {
    setShowPopupGps(false);
  };

  const handleSaveGps = () => {
    setShowPopupGps(false);
  };

  const handleInputOnChange = async (field: string, value: any) => {
    try {
      let imageUrl: string = "";
      const read = "1";
      await addDoc(collection(db, "messages"), {
        text: `PropertyLocation&coordinates=${value}`,
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
    <div className="border-t gap-1 p-1 dark:bg-[#2D3236] dark:text-[#F1F3F3] text-black rounded-b-md right-0 bg-gray-100 dark:bg-[#131B1E] h-[60px] z-10 flex justify-end items-center">
      {recipientUid ? (
        <>
           {image && (
  <div className="absolute bottom-[70px] right-4 z-30 bg-white dark:bg-[#2D3236] shadow-lg rounded-md p-2 w-32">
    <div className="flex justify-end">
      <button onClick={() => setImg(null)} className="text-gray-500 hover:text-red-500">
        <CloseIcon fontSize="small" />
      </button>
    </div>
    <Zoom>
      <Image
        src={URL.createObjectURL(image)}
        alt="image"
        width={100}
        height={100}
        className="w-full h-auto object-cover rounded"
      />
    </Zoom>
  </div>
)}
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // prevent newline
                handleSendMessage(); // trigger message send
              }
            }}
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            }}
            className="input border dark:bg-[#2D3236] dark:text-[#F1F3F3] text-black w-full text-sm lg:text-base p-3 focus:outline-none bg-white rounded-r-none rounded-l-lg"
            placeholder="Enter your message..."
            rows={1}
            style={{ height: "auto" }}
          />
          <button
            onClick={handleSendMessage}
            className="text-sm p-3 lg:text-base bg-gradient-to-b from-emerald-800 to-emerald-900 text-white rounded-r-lg"
          >
            Send
          </button>
          <MenuComponent setImg={setImg} handleOpenPopupGps={handleOpenPopupGps} />
        </>
      ) : (
        <>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // prevent newline
                handleSendMessage(); // trigger message send
              }
            }}
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
            }}
            className="input dark:bg-[#2D3236] dark:text-[#F1F3F3] text-black w-full text-sm lg:text-base p-3 focus:outline-none bg-white rounded-r-none rounded-l-lg"
            placeholder="Enter your message..."
            rows={1}
            style={{ height: "auto" }}
          />
          <button
            onClick={handleSendMessage}
            className="text-sm p-3 lg:text-base bg-gradient-to-b from-emerald-800 to-emerald-900 text-white rounded-r-lg"
          >
            Send
          </button>
          <MenuComponent setImg={setImg} handleOpenPopupGps={handleOpenPopupGps} />
        </>
      )}

      {showPopupGps && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#e4ebeb] z-50">
                              <LatLngPickerAndShare
              name={"gps"}
              onChange={handleInputOnChange}
              onClose={handleSaveGps}
            />
                           </div>
          
        
      )}
    </div>
  );
};

export default SendMessage;
