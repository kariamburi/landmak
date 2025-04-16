"use client";
import { db } from "@/lib/firebase";
import Message from "./Message";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { UpdateUserParams } from "@/types";
//import { ScrollArea } from "@/components/ui/scroll-area";
import * as ScrollArea from "@radix-ui/react-scroll-area";
type sidebarProps = {
  displayName: string;
  uid: string;
  recipientUid: string;
  photoURL: string;
  recipient: UpdateUserParams;
  client: boolean;
  handleAdEdit:(id:string)=> void;
  handleAdView:(id:string)=> void;
  handleCategory:(category:string)=> void;
  handleOpenSell:()=> void;
 handleOpenPlan:()=> void;
};
type propmess = {
  messageId: string;
};
const ChatBoxSupport = ({
  uid,
  photoURL,
  displayName,
  recipientUid,
  recipient,
  client,
  handleAdEdit,
  handleAdView,
  handleCategory,
  handleOpenSell,
 handleOpenPlan,
}: sidebarProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<any[]>([]);
  //const [recipientUid, setrecipientUid] = React.useState<string | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // console.log("chatbox:" + recipientUid);
    const fetchMessages = () => {
      const senderMessagesQuery = query(
        collection(db, "messages"),
        where("uid", "==", uid),
        where("recipientUid", "==", recipientUid),
        limit(50)
      );

      const recipientMessagesQuery = query(
        collection(db, "messages"),
        where("uid", "==", recipientUid),
        where("recipientUid", "==", uid),
        limit(50)
      );

      const unsubscribeSender = onSnapshot(senderMessagesQuery, (snapshot) => {
        const senderMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages((prevMessages) =>
          [
            ...prevMessages.filter((msg) => msg.uid !== uid), // Filter out previous messages from current user
            ...senderMessages,
          ].sort((a, b) => a.createdAt - b.createdAt)
        );
      });

      const unsubscribeRecipient = onSnapshot(
        recipientMessagesQuery,
        (snapshot) => {
          const recipientMessages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages((prevMessages) =>
            [
              ...prevMessages.filter((msg) => msg.uid !== recipientUid), // Filter out previous messages from recipient user
              ...recipientMessages,
            ].sort((a, b) => a.createdAt - b.createdAt)
          );
        }
      );

      return () => {
        unsubscribeSender();
        unsubscribeRecipient();
      };
    };

    fetchMessages();
  }, [uid, recipientUid]);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    };
    scrollToBottom();
  }, [messages]);

  // Function to update the read status of a message

  const updateMessageReadStatus = async ({ messageId }: propmess) => {
    try {
      // Get a reference to the message document
      const messageRef = doc(db, "messages", messageId);

      // Update the read field to 1 (indicating read status)
      await updateDoc(messageRef, {
        read: 0,
      });

      console.log("Message read status updated successfully.");
    } catch (error) {
      console.error("Error updating message read status: ", error);
    }
  };

  // Call the function to update the read status of the message
  useEffect(() => {
    const unreadMessages = messages.filter(
      (message) => message.uid !== uid && message.read === 1
    );
    unreadMessages.forEach((message) => {
      updateMessageReadStatus({ messageId: message.id });
    });
  }, [messages, uid]);

  return (
    
    <ScrollArea.Root className="h-full overflow-hidden">
    <ScrollArea.Viewport  className="h-[calc(100vh-160px)] lg:h-[335px] dark:bg-[#2D3236] bg-white border">
  
    
        {messages.map((message: any) => (
          <div key={message.id}>
            <Message
              message={message}
              displayName={displayName}
              uid={uid}
              recipientUid={recipientUid}
              photoURL={photoURL}
              recipient={recipient}
              handleAdEdit={handleAdEdit}
              handleAdView={handleAdView} 
              handleCategory={handleCategory}
              handleOpenSell={handleOpenSell}
             handleOpenPlan={handleOpenPlan}
            />
          </div>
        ))}
        <div ref={messagesEndRef}></div>
        </ScrollArea.Viewport>
         <ScrollArea.Scrollbar orientation="vertical" />
      <ScrollArea.Corner />
    </ScrollArea.Root>
   
  );
};

export default ChatBoxSupport;
