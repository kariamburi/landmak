"use client";

import { headerLinks } from "@/constants";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import StackedLineChartOutlinedIcon from "@mui/icons-material/StackedLineChartOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DiamondIcon from "@mui/icons-material/Diamond";
import SettingsIcon from "@mui/icons-material/Settings";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import HomeIcon from "@mui/icons-material/Home";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import ProgressPopup from "./ProgressPopup";
type NavItemsProps = {
  userstatus: string;
  userId: string;
  popup: string;
  onClose: () => void;
  handleOpenSell: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenShop: (shopId:string) => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handleclicklink:() => void;
};
const NavItems = ({ userstatus, userId, popup, onClose, handleclicklink, handleOpenSettings, handleOpenPlan, handleOpenBook, handleOpenPerfomance, handleOpenChat, handleOpenSell,handleOpenShop }: NavItemsProps) => {
  const pathname = usePathname();
  const [isOpenP, setIsOpenP] = useState(false);
  const router = useRouter();
  const handleCloseP = () => {
    setIsOpenP(false);
  };
  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return (
    <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white w-full">
      <ul>
        {headerLinks
          .filter((link) => !(userstatus === "User" && link.label === "Admin"))
          .map((link) => {
            const isActive = capitalizeFirstLetter(popup) === link.label;
            let linki = link.route;
          //  if (link.label === "My Shop") {
          //    linki = link.route + "/" + userId;
          //  }

            return (
              <>
                <SignedIn>
                  <li key={link.route}>
                    <div
                     // onClick={() => {
                     //   if (!isActive) {
                      //    setIsOpenP(true);
                     //     router.push(userId ? linki : "/sign-in");
                     //   } else {
                      //    onClose();
                      //  }
                     // }}
                    >
                    
                        {link.label === "Home" && (  <div
                        onClick={()=>  {onClose(); handleclicklink();} }
                        className={`${
                          isActive &&
                          "dark:bg-green-600 dark:text-white bg-green-600 text-white rounded-full"
                        } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-slate-100 rounded-sm hover:text-green-600 p-3 mb-1 hover:cursor-pointer`}
                      >
                          <span>
                          <HomeIcon className="w-10 p-1" />
                          </span>
                          <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                          {link.label}
                        </span>
                        <span className="text-right my-auto">
                        <ArrowForwardIosIcon className="w-10 p-1" />
                        </span></div>
                        )}
                        {link.label === "Sell" && (  <div
                        onClick={()=>  {handleOpenSell(); handleclicklink()}}
                        className={`${
                          isActive &&
                          "dark:bg-green-600 dark:text-white bg-green-600 text-white rounded-full"
                        } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-slate-100 rounded-sm hover:text-green-600 p-3 mb-1 hover:cursor-pointer`}
                      >
                          <span>
                          <SellOutlinedIcon className="w-10 p-1" />
                        
                          </span> <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                          {link.label}
                        </span>
                        <span className="text-right my-auto">
                        <ArrowForwardIosIcon className="w-10 p-1" />
                        
                      
                        </span>
                        </div>
                        )}
                        {link.label === "My Shop" && (
                          <div
                          onClick={()=>  {handleOpenShop(userId); handleclicklink();}}
                          className={`${
                            isActive &&
                            "dark:bg-green-600 dark:text-white bg-green-600 text-white rounded-full"
                          } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-slate-100 rounded-sm hover:text-green-600 p-3 mb-1 hover:cursor-pointer`}
                        > <span> 
                          <FormatListBulletedOutlinedIcon className="w-10 p-1" />
                          </span> <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                          {link.label}
                        </span>
                        <span className="text-right my-auto">
                        <ArrowForwardIosIcon className="w-10 p-1" />
                         
                        </span>
                        </div>
                        )}
                        {link.label === "Chat" && (  <div
                        onClick={()=>  {handleOpenChat(); handleclicklink();}}
                        className={`${
                          isActive &&
                          "dark:bg-green-600 dark:text-white bg-green-600 text-white rounded-full"
                        } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-slate-100 rounded-sm hover:text-green-600 p-3 mb-1 hover:cursor-pointer`}
                      >
                          <span>
                            
                            <CommentOutlinedIcon className="w-10 p-1 " />
                          </span> <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                          {link.label}
                        </span>
                        <span className="text-right my-auto">
                          <ArrowForwardIosIcon className="w-10 p-1 " />
                        </span>
                        </div>
                        )}
                        {link.label === "Performance" && (  <div
                        onClick={()=> { handleOpenPerfomance(); handleclicklink();}}
                        className={`${
                          isActive &&
                          "dark:bg-green-600 dark:text-white bg-green-600 text-white rounded-full"
                        } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-slate-100 rounded-sm hover:text-green-600 p-3 mb-1 hover:cursor-pointer`}
                      >
                          <span>
                            <StackedLineChartOutlinedIcon className="w-10 p-1 " />
                          </span>
                          <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                          {link.label}
                        </span>
                        <span className="text-right my-auto">
                          <ArrowForwardIosIcon className="w-10 p-1 " />
                        </span>
                        </div>)}
                        {link.label === "Bookmark" && (  <div
                        onClick={()=> {handleOpenBook(); handleclicklink();}}
                        className={`${
                          isActive &&
                          "dark:bg-green-600 dark:text-white bg-green-600 text-white rounded-full"
                        } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-slate-100 rounded-sm hover:text-green-600 p-3 mb-1 hover:cursor-pointer`}
                      >
                          <span>
                            <BookmarkIcon className="w-10 p-1 " />
                          </span> <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                          {link.label}
                        </span>
                        <span className="text-right my-auto">
                          <ArrowForwardIosIcon className="w-10 p-1 " />
                        </span>
                        
                        </div>
                        )}
                        {link.label === "Plan" && (  <div
                        onClick={()=>  {handleOpenPlan(); handleclicklink();}}
                        className={`${
                          isActive &&
                          "dark:bg-green-600 dark:text-white bg-green-600 text-white rounded-full"
                        } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-slate-100 rounded-sm hover:text-green-600 p-3 mb-1 hover:cursor-pointer`}
                      >
                          <span>
                            <DiamondIcon className="w-10 p-1 " />
                          </span>
                          <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                          {link.label}
                        </span>
                        <span className="text-right my-auto">
                          <ArrowForwardIosIcon className="w-10 p-1 " />
                        </span>
                        </div>
                        )}
                        {link.label === "Settings" && (  <div
                         onClick={()=>  {handleOpenSettings(); handleclicklink();}}
                        className={`${
                          isActive &&
                          "dark:bg-green-600 dark:text-white bg-green-600 text-white rounded-full"
                        } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-slate-100 rounded-sm hover:text-green-600 p-3 mb-1 hover:cursor-pointer`}
                      >
                          <span>
                            <SettingsIcon className="w-10 p-1 " />
                          </span>
                          <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                          {link.label}
                        </span>
                        <span className="text-right my-auto">
                          <ArrowForwardIosIcon className="w-10 p-1 " />
                        </span>
                        </div>)}

                        {link.label === "Admin" && (  <div
                          onClick={()=>  {setIsOpenP(true);
                            //handleclicklink();
                            router.push("/home");}}
                        className={`${
                          isActive &&
                          "dark:bg-green-600 dark:text-white bg-green-600 text-white rounded-full"
                        } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-slate-100 rounded-sm hover:text-green-600 p-3 mb-1 hover:cursor-pointer`}
                      >
                          <span>
                            <ManageAccountsOutlinedIcon className="w-10 p-1 " />
                          </span>
                          <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                          {link.label}
                        </span>
                        <span className="text-right my-auto">
                          <ArrowForwardIosIcon className="w-10 p-1 " />
                        </span>
                        </div>)}
                       
                     
                    </div>
                  </li>
                </SignedIn>

                <SignedOut>
                  <li key={link.route}>
                    <div
                      onClick={() => {
                        //if (!isActive) {
                          setIsOpenP(true);
                         // handleclicklink();
                          router.push("/sign-in");
                       // } else {
                        //  onClose();
                        //}
                      }}
                    >
                      <div
                        className={`${
                          isActive &&
                          "dark:bg-green-600 dark:text-white bg-green-600 text-white rounded-full"
                        } flex dark:bg-[#2D3236]  dark:hover:bg-gray-800 hover:bg-slate-100 rounded-sm hover:text-green-600 p-3 mb-1 hover:cursor-pointer`}
                      >
                        {link.label === "Home" && (
                          <span>
                            <HomeIcon className="w-10 p-1 " />
                          </span>
                        )}
                        {link.label === "Sell" && (
                          <span>
                            <SellOutlinedIcon className="w-10 p-1 " />
                          </span>
                        )}
                        {link.label === "My Shop" && (
                          <span>
                            <FormatListBulletedOutlinedIcon className="w-10 p-1 " />
                          </span>
                        )}
                        {link.label === "Chat" && (
                          <span>
                            <CommentOutlinedIcon className="w-10 p-1 " />
                          </span>
                        )}
                        {link.label === "Performance" && (
                          <span>
                            <StackedLineChartOutlinedIcon className="w-10 p-1 " />
                          </span>
                        )}
                        {link.label === "Bookmark" && (
                          <span>
                            <BookmarkIcon className="w-10 p-1 " />
                          </span>
                        )}
                        {link.label === "Plan" && (
                          <span>
                            <DiamondIcon className="w-10 p-1 " />
                          </span>
                        )}
                        {link.label === "Settings" && (
                          <span>
                            <SettingsIcon className="w-10 p-1 " />
                          </span>
                        )}

                        {link.label === "Admin" && (
                          <span>
                            <ManageAccountsOutlinedIcon className="w-10 p-1 " />
                          </span>
                        )}
                        <span className="flex-1 text-sm mr-5 hover:no-underline my-auto">
                          {link.label}
                        </span>
                        <span className="text-right my-auto">
                          <ArrowForwardIosIcon className="w-10 p-1 " />
                        </span>
                      </div>
                    </div>
                  </li>
                </SignedOut>
              </>
            );
          })}
      </ul>
      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
    </div>
  );
};

export default NavItems;
