"use client";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import Navbar from "./navbar";
import { mode } from "@/constants";

type payProps = {
  userId: string;
  recipientUid:string;
  alltrans: any;
  user:any;
  onClose: () => void;
  handleOpenSell: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenShop: (shopId:any) => void;
  handleOpenChatId: (value:string) => void;
  handleOpenSettings: () => void;
  handleOpenPerfomance: () => void;
};
const DashboardHistory = ({ userId, alltrans,user,recipientUid ,handleOpenPerfomance, handleOpenSettings,
  handleOpenShop, onClose, handleOpenSell,handleOpenChat, handleOpenBook, handleOpenPlan, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety}: payProps) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
    
        useEffect(() => {
           const savedTheme = localStorage.getItem("theme") || mode; // Default to "dark"
           const isDark = savedTheme === mode;
           
           setIsDarkMode(isDark);
           document.documentElement.classList.toggle(mode, isDark);
         }, []);
       
         useEffect(() => {
           if (isDarkMode === null) return; // Prevent running on initial mount
       
           document.documentElement.classList.toggle(mode, isDarkMode);
           localStorage.setItem("theme", isDarkMode ? "dark" : "light");
         }, [isDarkMode]);
       
         if (isDarkMode === null) return null; // Avoid flickering before state is set
       
  if (alltrans.length === 0) {
    return (
      <div className="dark:bg-[#131B1E] h-screen text-black dark:text-[#F1F3F3] bg-white">
      <div className="fixed z-10 top-0 w-full">
         <Navbar user={user} userstatus={user.status} userId={userId} onClose={onClose} popup={"pay"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                                handleOpenPerfomance={handleOpenPerfomance}
                                handleOpenSettings={handleOpenSettings}
                                handleOpenAbout={handleOpenAbout}
                                handleOpenTerms={handleOpenTerms}
                                handleOpenPrivacy={handleOpenPrivacy}
                                handleOpenSafety={handleOpenSafety} 
                                handleOpenShop={handleOpenShop}/>
      </div>
      <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] py-28 text-center">
        <h3 className="p-bold-20 md:h5-bold">No order found!</h3>
        <p className="p-regular-14">No data</p>
      </div> </div>
    );
  }
  return (
    <div className="min-h-screen dark:bg-[#131B1E] h-screen  text-black dark:text-[#F1F3F3] bg-white">
      <div className="fixed z-0 top-0 w-full">
         <Navbar user={user} userstatus={user.status} userId={userId} onClose={onClose} popup={"pay"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                                handleOpenPerfomance={handleOpenPerfomance}
                                handleOpenSettings={handleOpenSettings}
                                handleOpenAbout={handleOpenAbout}
                                handleOpenTerms={handleOpenTerms}
                                handleOpenPrivacy={handleOpenPrivacy}
                                handleOpenSafety={handleOpenSafety} 
                                handleOpenShop={handleOpenShop}/>
      </div>
      <div className="max-w-8xl mx-auto flex mt-[60px] mb-0 p-1">
    <div className="fixed w-full h-screen">
      <div className="p-1">
        <div className="p-1 max-w-3xl mx-auto mb-2">
          <div className="p-0 w-full items-center">
            <div className="flex flex-col items-center w-full">
              <div className="gap-1 h-[450px] mt-2 items-center w-full">
                <div className="">
                  <div className="flex flex-col items-center">
                    <div className="flex flex-col border shadow-lg rounded-lg dark:bg-[#2D3236] bg-gray-100 p-2 mb-2 w-full">
                      <p className="font-bold text-[25px] text-center ">
                        History
                      </p>
                      <div className="grid grid-cols-6 text-gray-600 text-xs bg-grey-500 rounded-t-lg p-1 text-white">
                        <div className="justify-center items-center flex flex-col">
                          Status
                        </div>

                        <div className="justify-center items-center flex flex-col">
                          Order Tracking Id
                        </div>
                        <div className="justify-center items-center flex flex-col">
                          Plan
                        </div>
                        <div className="justify-center items-center flex flex-col">
                          Period
                        </div>
                        <div className="justify-center items-center flex flex-col">
                          Amount KES
                        </div>
                        <div className="justify-center items-center flex flex-col">
                          Date
                        </div>
                      </div>
                      <ScrollArea className="h-[350px]">
                        <ul className="w-full">
                          {alltrans.map((trans: any, index: any) => {
                            return (
                              <li className="w-full text-gray-600" key={index}>
                                <div
                                  className={`p-1 mt-1 rounded-sm grid grid-cols-6 gap-1 w-full text-xs`}
                                >
                                  <div className="flex">
                                    <div
                                      className={`flex flex-col p-1 text-white justify-center items-center w-[70px] rounded-full ${
                                        trans.status === "Pending"
                                          ? "bg-yellow-600"
                                          : trans.status === "Failed"
                                          ? "bg-red-600 "
                                          : "bg-green-600"
                                      }`}
                                    >
                                      {trans.status}
                                    </div>
                                  </div>

                                  <div className="justify-center items-center flex flex-col">
                                    {trans.orderTrackingId}
                                  </div>
                                  <div className="justify-center items-center flex flex-col">
                                    {trans.planId.name}
                                  </div>
                                  <div className="justify-center items-center flex flex-col">
                                    {trans.period}
                                  </div>
                                  <div className="justify-center items-center flex flex-col">
                                    KES {trans.amount.toFixed(2)}
                                  </div>
                                  <div className="justify-center items-center flex flex-col">
                                    {trans.createdAt}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default DashboardHistory;
