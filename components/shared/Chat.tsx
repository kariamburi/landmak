"use client";
import React, { useEffect, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import UnreadmessagesPeruser from "./UnreadmessagesPeruser";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { usePathname } from "next/navigation";
import ChatBox from "./ChatBox";
import SendMessage from "./SendMessage";
import { db } from "@/lib/firebase";
type sidebarProps = {
  senderName: string;
  senderId: string;
  senderImage: string;

  handleAdEdit:(id:string)=> void;
  handleAdView:(id:string)=> void;
  handleCategory:(category:string)=> void;
  handleOpenSell:()=> void;
 handleOpenPlan:()=> void;
};

const Chat = ({ senderName, senderId, senderImage, handleAdEdit,
  handleAdView,
  handleCategory,
  handleOpenSell,
 handleOpenPlan, }: sidebarProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [recipientUid, setRecipientUid] = useState<string>("");
  const [recipientUidName, setRecipientUidName] = useState<string>("");
  const [recipientUidImage, setrecipientUidImage] = useState<string>("");
  useEffect(() => {
    const getLastMessagesInConversations = async () => {
      try {
        const lastMessages: any = {};
        const messagesQuery = query(
          collection(db, "messages"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(messagesQuery);
        querySnapshot.forEach((doc) => {
          const message = doc.data();
          if (message.recipientUid === senderId) {
            if (
              !lastMessages[message.uid] ||
              message.createdAt.seconds >
                lastMessages[message.uid].createdAt.seconds
            ) {
              lastMessages[message.uid] = message;
            }
          }
        });
        return Object.values(lastMessages);
      } catch (error) {
        console.error("Error getting last messages:", error);
        return [];
      }
    };

    getLastMessagesInConversations().then((lastMessages) => {
      setMessages(lastMessages);
    });
  }, [senderId]);

  const pathname = usePathname();
  const truncateTitle = (title: string, maxLength: number) => {
    return title.length > maxLength
      ? title.substring(0, maxLength) + "..."
      : title;
  };

  const handleClick = (id: string, name: string, url: string) => {
    setRecipientUid(id);
    setRecipientUidName(name);
    setrecipientUidImage(url);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex p-1 mb-20">
        <div className="hidden lg:inline mr-5">
          <div className="w-full bg-[#e4ebeb] w-[300px] rounded-lg p-0">
            <div className="max-h-[500px] w-full rounded-md p-2 overflow-y-auto">
              <div className="w-full flex flex-col items-center">
                <span className="logo font-bold text-orange-600">Chat</span>
                <p className="text-center sm:text-left">Latest chats</p>
              </div>
              <ul>
                {messages.map((message) => {
                  const isActive = pathname === "/chat/" + message.uid;
                  let formattedCreatedAt = "";
                  try {
                    const createdAtDate = new Date(
                      message.createdAt.seconds * 1000
                    );
                    if (isToday(createdAtDate)) {
                      formattedCreatedAt =
                        "Today " + format(createdAtDate, "HH:mm");
                    } else if (isYesterday(createdAtDate)) {
                      formattedCreatedAt =
                        "Yesterday " + format(createdAtDate, "HH:mm");
                    } else {
                      formattedCreatedAt = format(
                        createdAtDate,
                        "dd-MM-yyyy HH:mm"
                      );
                    }
                  } catch {}

                  return (
                    <li
                      key={message.uid}
                      className={`${
                        isActive &&
                        "bg-gradient-to-b from-emerald-900 to-emerald-950 text-white"
                      } rounded-sm`}
                    >
                      <div
                        onClick={() =>
                          handleClick(message.uid, message.name, message.avatar)
                        }
                        className="bg-green-700 rounded-lg text-[#e4ebeb] hover:bg-gray-400 hover:text-black p-3 mb-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            className="w-8 h-8 rounded-full object-cover"
                            src={message.avatar ?? "/sender.png"}
                            alt="avatar"
                          />
                          <div className="text-sm font-bold">
                            {message.name}
                          </div>
                        </div>
                        <div className="text-xs flex justify-between w-full">
                          <div className="flex gap-1 font-normal">
                            {truncateTitle(message.text, 15)}
                            <UnreadmessagesPeruser
                              uid={message.uid}
                              recipientUid={senderId}
                            />
                          </div>
                          <div className="text-xs">{formattedCreatedAt}</div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="lg:hidden">
            <div className="max-h-[500px] w-full bg-[#e4ebeb] rounded-md p-4 mb-2 mt-10 lg:mt-0 overflow-y-auto">
              <div className="w-full flex flex-col items-center">
                <span className="logo font-bold text-orange-600">Chat</span>
                <p className="text-center sm:text-left">Latest chats</p>
              </div>
              <ul>
                {messages.map((message) => {
                  const isActive = pathname === "/chat/" + message.uid;
                  let formattedCreatedAt = "";
                  try {
                    const createdAtDate = new Date(
                      message.createdAt.seconds * 1000
                    );
                    if (isToday(createdAtDate)) {
                      formattedCreatedAt =
                        "Today " + format(createdAtDate, "HH:mm");
                    } else if (isYesterday(createdAtDate)) {
                      formattedCreatedAt =
                        "Yesterday " + format(createdAtDate, "HH:mm");
                    } else {
                      formattedCreatedAt = format(
                        createdAtDate,
                        "dd-MM-yyyy HH:mm"
                      );
                    }
                  } catch {}

                  return (
                    <li
                      key={message.uid}
                      className={`${
                        isActive &&
                        "bg-gradient-to-b from-emerald-900 to-emerald-950 text-white"
                      } rounded-sm`}
                    >
                      <div
                        onClick={() =>
                          handleClick(message.uid, message.name, message.avatar)
                        }
                        className="bg-green-700 rounded-lg text-[#e4ebeb] hover:bg-gray-400 hover:text-black p-3 mb-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            className="w-8 h-8 rounded-full object-cover"
                            src={message.avatar ?? "/sender.png"}
                            alt="avatar"
                          />
                          <div className="text-sm font-bold">
                            {message.name}
                          </div>
                        </div>
                        <div className="text-xs flex justify-between w-full">
                          <div className="flex gap-1 font-normal">
                            {truncateTitle(message.text, 15)}
                            <UnreadmessagesPeruser
                              uid={message.uid}
                              recipientUid={senderId}
                            />
                          </div>
                          <div className="text-xs">{formattedCreatedAt}</div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="p-1">
            <div className="flex justify-between bg-emerald-800 text-white p-2 rounded-t-lg">
              <div className="flex items-center gap-2">
                {recipientUidImage && (
                  <>
                    <img
                      className="w-8 h-8 rounded-full object-cover"
                      src={recipientUidImage}
                      alt="avatar"
                    />
                  </>
                )}
                <h3 className="font-bold text-lg">{recipientUidName}</h3>
              </div>
            </div>

            <ChatBox
              displayName={senderName}
              uid={senderId}
              recipientUid={recipientUid}
              client={false}
              photoURL={senderImage}
              recipient={{
                status: "User",
                firstName: recipientUidName,
                lastName: "",
                // username: "",
                photo: recipientUidImage,
              }}
              handleAdEdit={handleAdEdit}
              handleAdView={handleAdView} 
              handleCategory={handleCategory}
              handleOpenSell={handleOpenSell}
             handleOpenPlan={handleOpenPlan}
            />
            <SendMessage
              displayName={senderName}
              uid={senderId}
              recipientUid={recipientUid}
              client={false}
              photoURL={senderImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
