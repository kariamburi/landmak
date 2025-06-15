// components/ChatWindow.js
"use client";
import React, { useEffect, useState } from "react";
import ChatBoxSupport from "./ChatBoxSupport";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import SendMessageSupport from "./SendMessageSupport";
import HelpBox from "./HelpBox";
import { useMediaQuery } from "react-responsive"; // Detect mobile screens
import { Button } from "../ui/button";
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import ChatBot from "./ChatBotIA";
import ChatBotIA from "./ChatBotIA";
import ChatBotComp from "./ChatBotComp";
interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  recipientUid: string;
  senderId: string;
  senderName: string;
  senderImage: string;
  handleAdEdit:(id:string)=> void;
  handleAdView:(id:string)=> void;
  handleCategory:(category:string)=> void;
  handleOpenSell:()=> void;
 handleOpenPlan:()=> void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  recipientUid,
  senderId,
  senderName,
  senderImage,
  onClose,
  handleAdEdit,
  handleAdView,
  handleCategory,
  handleOpenSell,
 handleOpenPlan,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [title, settitle] = useState("Home");
   const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile screens
  
  const tab = [
    { title: "Home", content: "Home" },
    { title: "Message", content: "Message" },
    { title: "Help", content: "Help" },
    { title: "Call" , content: "Call"  },
   
  ];
  const handle = async (index: number) => {
    setActiveTab(index);
    if (index == 0) {
      settitle("Home");
    } else if (index == 1) {
      settitle("Message");
    } else if (index == 2) {
      settitle("Help");
    }
    else if (index == 3) {
      settitle("Call");
    }
  };

  if (!isOpen) return null;

  return (<><ChatBotComp onClose={onClose} displayName={senderName} uid={senderId} recipientUid={recipientUid} photoURL={senderImage} handleAdEdit={handleAdEdit} handleAdView={handleAdView} handleCategory={handleCategory} handleOpenSell={handleOpenSell} handleOpenPlan={handleOpenPlan}/>
      {/*{isMobile  ? (
              // Fullscreen Popover for Mobile
      <div className="fixed h-screen inset-0 z-50 bg-white dark:bg-[#222528] dark:text-gray-100 p-0 flex flex-col">
        <div className="h-screen flex flex-col">
        
        <div className="h-[50px] bg-gradient-to-r from-green-700 to-green-700 text-white p-2">
        <div className="flex justify-between w-full">
          <h3 className="font-semibold text-white">{title !=="Home" && (<>{title}</>)}</h3>
          <div onClick={onClose} className="cursor-pointer text-white">
            <CloseOutlinedIcon />
          </div>
        </div>
      </div>
      <div className="flex-1 w-full">
        {activeTab === 0 && (
          <>
            <div className="bg-gradient-to-b from-green-700 to-green-700 h-full w-full flex flex-col p-0 mt-0">
              <div className="mt-5 w-full">
                <div className="flex items-center justify-center w-full gap-1 mt-5 mb-5">
                  <div className="w-24 h-24">
                    <Image
                      className="w-full h-full object-cover"
                      src={"/support.webp"}
                      alt="Profile Image"
                      width={120}
                      height={120}
                    />
                  </div>
                  
                </div>
                <div className="gap-2 justify-center flex w-full items-center">
                  <h3 className="font-bold text-green-100 text-sm lg:text-lg">
                    Hi {senderName}
                  </h3>
                  <div className="h-10 w-10">
                    <Image src="/hello.png" alt="logo" width={40} height={40} />
                  </div>
                </div>
                <div className="gap-2 justify-center flex w-full items-center">
                  <h3 className="font-semibold text-2xl lg:text-3xl text-white">
                    How can we help?
                  </h3>
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab === 1 && (
          <>
            <div className="rounded-t-sm w-full h-[calc(100vh-100px)] bg-white flex flex-col p-0 mt-0">
           <div className="flex-1 w-full">
            <ChatBoxSupport
                  displayName={senderName}
                  uid={senderId}
                  recipientUid={recipientUid}
                  client={true}
                  photoURL={senderImage}
                  recipient={{
                    status: "",
                    firstName: "",
                    lastName: "",
                    //username: "",
                    photo: "",
                  }}
              handleAdEdit={handleAdEdit}
               handleAdView={handleAdView} 
               handleCategory={handleCategory}
               handleOpenSell={handleOpenSell}
              handleOpenPlan={handleOpenPlan}
                /></div>
           <div className="flex h-[60px] w-full">
            <SendMessageSupport
                  displayName={senderName}
                  uid={senderId}
                  recipientUid={recipientUid}
                  client={true}
                  photoURL={senderImage}
                /></div>
            
            </div>
          </>
        )}
        {activeTab === 2 && (
          <>
            <div className="rounded-t-sm h-full w-full bg-white flex flex-col p-0 mt-0">
              <div className="lg:flex-1 p-0 ml-0 mr-0">
                <HelpBox
                  displayName={senderName}
                  uid={senderId}
                  recipientUid={recipientUid}
                  client={true}
                  photoURL={senderImage}
                  recipient={{
                    status: "",
                    firstName: "",
                    lastName: "",
                    //username: "",
                    photo: "",
                  }}
                />
              </div>
            </div>
          </>
        )}
           {activeTab === 3 && (
          <>
          <div className="bg-gradient-to-b from-green-700 to-green-700 h-full w-full flex flex-col p-0 mt-0">
              <div className="mt-5 w-full">
                <div className="flex items-center justify-center w-full gap-1 mt-5 mb-5">
                  <div className="w-24 h-24">
                    <Image
                      className="w-full h-full object-cover"
                      src={"/support.webp"}
                      alt="Profile Image"
                      width={120}
                      height={120}
                    />
                  </div>
                  
                </div>
                <div className="gap-2 justify-center flex w-full items-center">
                <h3 className="font-semibold text-2xl lg:text-lg text-green-100 mb-4">
                  Call Support
                </h3>
                 
                </div>
                <div className="gap-2 justify-center flex w-full items-center">
                  <a href="tel:+254769722932" className="font-semibold text-2xl lg:text-3xl text-white">
                  +254 769 722 932
                  </a>
                </div>
              </div>
            </div>

          </>
        )}
        </div>
      
   <div className="h-[50px] flex bg-white w-full rounded-b-lg p-1">
     {tab.map((tab, index) => (
       <button
         key={index}
         className={`flex-1 text-sm py-2 rounded-t-lg text-center ${
           activeTab === index ? "text-green-700 font-bold" : "text-gray-700"
         }`}
         onClick={() => handle(index)}
       >
         <div className="flex items-center justify-center gap-1">
           {tab.title === "Home" && <OtherHousesOutlinedIcon sx={{ fontSize: 16 }} />}
           {tab.title === "Message" && <ChatOutlinedIcon sx={{ fontSize: 16 }} />}
           {tab.title === "Help" && <ContactSupportOutlinedIcon sx={{ fontSize: 16 }} />}
           {tab.title === "Call" && <CallOutlinedIcon sx={{ fontSize: 16 }} />}
           {tab.title}
         </div>
       </button>
     ))}
   </div>
   </div>
   </div>
    ):(
   <div className="fixed h-[500px] bottom-20 right-5 bg-green-700 rounded-lg shadow-xl w-[460px] z-30">
 
 
   <div className="h-[50px] bg-green-700 text-white p-2 rounded-t-lg flex justify-between items-center">
     <h3 className="font-semibold text-white">{title}</h3>
     <div onClick={onClose} className="cursor-pointer text-white">
       <CloseOutlinedIcon />
     </div>
   </div>
 
   <div className="flex-1 w-full overflow-y-auto">
     {activeTab === 0 && (
       <div className="bg-gradient-to-b from-green-700 to-green-700 h-[400px] flex flex-col items-center justify-center p-0">
         <div className="w-24 h-24">
           <Image
             className="w-full h-full object-cover rounded-full"
             src="/support.webp"
             alt="Profile Image"
             width={120}
             height={120}
           />
         </div>
         <h3 className="font-bold text-green-100 text-lg mt-3">Hi {senderName}</h3>
         <Image src="/hello.png" alt="logo" width={40} height={40} />
         <h3 className="font-semibold text-2xl text-white mt-2">How can we help?</h3>
       </div>
     )}
 
     {activeTab === 1 && (
       <div className="rounded-t-sm h-[400px] bg-gradient-to-b from-green-700 to-green-700 flex flex-col p-1">
        <div className="flex-1 w-full">
         <ChatBoxSupport
                  displayName={senderName}
                  uid={senderId}
                  recipientUid={recipientUid}
                  client={true}
                  photoURL={senderImage}
                  recipient={{
                    status: "",
                    firstName: "",
                    lastName: "",
                    //username: "",
                    photo: "",
                  }}
              handleAdEdit={handleAdEdit}
               handleAdView={handleAdView} 
               handleCategory={handleCategory}
               handleOpenSell={handleOpenSell}
              handleOpenPlan={handleOpenPlan}
                />
                </div>
                  <div className="flex h-[60px] w-full">
         <SendMessageSupport
           displayName={senderName}
           uid={senderId}
           recipientUid={recipientUid}
           client={true}
           photoURL={senderImage}
         /></div>
       </div>
     )}
 
     {activeTab === 2 && (
       <div className="rounded-t-sm h-[400px] bg-gradient-to-b from-green-700 to-green-700 flex flex-col p-1">
         <HelpBox
                  displayName={senderName}
                  uid={senderId}
                  recipientUid={recipientUid}
                  client={true}
                  photoURL={senderImage}
                  recipient={{
                    status: "",
                    firstName: "",
                    lastName: "",
                    //username: "",
                    photo: "",
                  }}
                />
       </div>
     )}
      {activeTab === 3 && (
          <>
           <div className="bg-gradient-to-b from-green-700 to-green-700 h-[400px] w-full flex flex-col p-0 mt-0">
              <div className="mt-5 w-full">
                <div className="flex items-center justify-center w-full gap-1 mt-5 mb-5">
                  <div className="w-24 h-24">
                    <Image
                      className="w-full h-full object-cover"
                      src={"/support.webp"}
                      alt="Profile Image"
                      width={120}
                      height={120}
                    />
                  </div>
                  
                </div>
                <div className="gap-2 justify-center flex w-full items-center">
                <h3 className="font-semibold text-2xl lg:text-lg text-green-100 mb-4">
                  Call Support
                </h3>
                 
                </div>
                <div className="gap-2 justify-center flex w-full items-center">
                  <a href="tel:+254769722932" className="font-semibold text-2xl lg:text-3xl text-white">
                  +254 769 722 932
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
   </div>
 
  
   <div className="h-[50px] flex bg-white w-full rounded-b-lg p-1">
     {tab.map((tab, index) => (
       <button
         key={index}
         className={`flex-1 text-sm py-2 rounded-t-lg text-center ${
           activeTab === index ? "text-green-700 font-bold" : "text-gray-700"
         }`}
         onClick={() => handle(index)}
       >
         <div className="flex text-sm items-center justify-center gap-1">
           {tab.title === "Home" && <OtherHousesOutlinedIcon sx={{ fontSize: 16 }} />}
           {tab.title === "Message" && <ChatOutlinedIcon sx={{ fontSize: 16 }} />}
           {tab.title === "Help" && <ContactSupportOutlinedIcon sx={{ fontSize: 16 }} />}
           {tab.title === "Call" && <CallOutlinedIcon sx={{ fontSize: 16 }} />}
           {tab.title}
         </div>
       </button>
     ))}
   </div>
 </div>
 
  )}*/}
    </>
  );
};

export default ChatWindow;
