"use client";
import React, { useEffect, useState } from "react";
import Menulistcategory from "@/components/shared/menulistcategory";
import { getAllCategories } from "@/lib/actions/category.actions";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AdminNavItemsMobile from "@/components/shared/AdminNavItemsMobile";
import PieChart from "@/components/shared/PieChart";
import { adminLinks, mode, VerificationPackId } from "@/constants";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CoPresentOutlinedIcon from "@mui/icons-material/CoPresentOutlined";
import DiamondIcon from "@mui/icons-material/Diamond";
import Menulistpackages from "./menulistpackages";
import PackageForm from "./packageForm";
import { getAllPackages } from "@/lib/actions/packages.actions";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { getallTrans } from "@/lib/actions/transactions.actions";
import TotalRevenue from "./TotalRevenue";
import PropertyReferrals from "./PropertyReferrals";
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import Chat from "./Chat";
import CreateCategoryForm from "./CreateCategoryForm";
import DisplayCategories from "./DisplayCategories";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AddCategoryWindow from "./AddCategoryWindow";
import DisplaySubCategories from "./DisplaySubCategories";
import AddSubCategoryWindow from "./AddSubCategoryWindow";
import AddPackageWindow from "./AddPackageWindow";
import CollectionUsers from "./CollectionUsers";
import BroadcastMessage from "./BroadcastMessage";
import CollectionTransactions from "./CollectionTransactions";
import AssistantPhotoOutlinedIcon from '@mui/icons-material/AssistantPhotoOutlined';

import {
  formUrlQuery,
  formUrlQuerymultiple,
  removeKeysFromQuery,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import TotalCard from "./TotalCard";
import TrendingAds from "./TrendingAds";
import SalesLineGraph from "./SalesLineGraph";
import TotalCardTransactions from "./TotalCardTransactions";
import CategoryFilterSearch from "./CategoryFilterSearch";
import CategoryIdFilterSearch from "./CategoryIdFilterSearch";
import Navbar from "./navbar";
import { Toaster } from "../ui/toaster";
import CollectionAbuse from "./CollectionAbuse";
import Navbardashboard from "./Navbardashboard";
import PopupChatId from "./PopupChatId";
import { updateVerifies, updateVerifiesFee } from "@/lib/actions/verifies.actions";
import { useToast } from "../ui/use-toast";
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
//import CollectionPayments from "./CollectionPayments";
import TopAdvertiser from "./TopAdvertiser";
import AdvertiserSubscriptions from "./AdvertiserSubscriptions";
type homeProps = {
  userId: string;
  userName: string;
  userImage: string;
  users: any;
  limit: number;
  page: number;
  transactions: any;
  payments: any;
  adSum: any;
  vfee:any;
  transactionSum: any;
  categories: any;
  subcategories: any;
  catList: any;
  reported:any;
  contacts:any;
  subscriptionsExpirely:any;
  topadvertiser:any;
};
const HomeDashboard = ({
  userId,
  userName,
  userImage,
  users,
  limit,
  page,
  payments,
  transactions,
  transactionSum,
  adSum,
  categories,
  subcategories,
  catList,
  reported,
  vfee,
  contacts,
  subscriptionsExpirely,
  topadvertiser,
}: homeProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("Home");
  const [categoryList, setcategoryList] = useState<any[]>([]);
  const [packList, setpackList] = useState<any[]>([]);
  const [alltrans, setalltrans] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [fee, setFee] = useState("500");

  const [recipient, setrecipient] = useState<any>([]);
    const [recipientUid, setrecipientUid] = useState('');
    const [shopId, setshopId] = useState<any>([]);
    const [isOpenAbout, setIsOpenAbout] = useState(false);
    const [isOpenTerms, setIsOpenTerms] = useState(false);
    const [isOpenPrivacy, setIsOpenPrivacy] = useState(false);
    const [isOpenSafety, setIsOpenSafety] = useState(false);
    const [isOpenFaq, setIsOpenFaq] = useState(false);
    const [isOpenBook, setIsOpenBook] = useState(false);
    const [isOpenPlan, setIsOpenPlan] = useState(false);
    const [isOpenChat, setIsOpenChat] = useState(false);
    const [isOpenChatId, setIsOpenChatId] = useState(false);
    const [isOpenReview, setIsOpenReview] = useState(false);
    const [isOpenShop, setIsOpenShop] = useState(false);
    const [isOpenSettings, setIsOpenSettings] = useState(false);
    const [isOpenPerfomance, setIsOpenPerfomance] = useState(false);
    const [isOpenSearchTab, setIsOpenSearchTab] = useState(false);
    const { toast } = useToast();
  const handle = async (title: string) => {
    setActiveTab(title);
    if (title === "Categories") {
      const Categories = async () => {
        const category = await getAllCategories();
        setcategoryList(category);
      };
      Categories();
    }
    if (title === "Packages") {
      const pack = async () => {
        const list = await getAllPackages();
        setpackList(list);
      };
      pack();
    }
  };
  useEffect(() => {
    setFee(vfee.fee);

    const transactions = async () => {
      const allt = await getallTrans();
      setalltrans(allt);
      console.log(allt);
      //  alert(allt);
    };
    transactions();
  }, []);

  const [isOpenPackage, setIsOpenPackage] = useState(false);
  const handleOpenPackage = () => {
    setIsOpenPackage(true);
  };

  const handleClosePackage = () => {
    setIsOpenPackage(false);
  };
  const handleFee = async () => {
  const res = await updateVerifiesFee(fee,VerificationPackId);
  console.log(res);
  toast({
    title: "Updated!",
    description: "Verification fee updated",
    duration: 5000,
    className: "bg-[#30AF5B] text-white",
  });
  };

  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const handleOpenCategory = () => {
    setIsOpenCategory(true);
  };

  const handleCloseCategory = () => {
    setIsOpenCategory(false);
  };
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  const handleSearchDates = () => {
    let newUrl = "";
    if (startDate || endDate) {
      newUrl = formUrlQuerymultiple({
        params: "",
        updates: {
          start: startDate ?? "",
          end: endDate ?? "",
        },
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["start", "end"],
      });
    }

    router.push(newUrl, { scroll: false });
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    //fetchOrders(search);
    let newUrl = "";

    if (search) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "transactionId",
        value: search,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["transactionId"],
      });
    }

    router.push(newUrl, { scroll: false });
  };
  const handleClear = () => {
    setSearch("");
    const newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: ["transactionId", "start", "end"],
    });

    router.push(newUrl, { scroll: false });
  };
  const handleCloseChatId = () => {
    setrecipientUid('')
    setIsOpenChatId(false);
  };
  const handleOpenChatId = (value:string) => {
    
    setrecipientUid(value)
   setIsOpenChatId(true);
   
    };
    const registerSafaricom = async () => {
      const res = await fetch('/api/safaricom/register', { method: 'POST' });
      const data = await res.json();
      console.log(data);
    };
    
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
      
       const handleOpenSell = () => {
       
        };
        const handleOpenAbout=() => {
       
        };
        const handleOpenTerms=() => {
       
        };
        const handleOpenPrivacy=() => {
       
        }; 
        const handleOpenSafety=() => {
       
        };
        const handleOpenBook=() => {
       
        };
        const handleOpenPlan=() => {
       
        };
       
        const handleOpenChat=() => {
       
        };
        const handleOpenShop=() => {
       
        };
       
        const handleOpenPerfomance=() => {
       
        };
        const handleOpenSettings=() => {
       
        };
        const handleCategory=() => {
       
        };
        const handleAdEdit=() => {
       
        };
        const handleAdView=() => {
       
        };
        const handleOpenSearchTab=() => {
       
        };
        
  return (
    <div className="min-h-screen dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] bg-white">
    <div className="fixed z-10 top-0 w-full">
      <Navbardashboard userstatus="User" userId={userId} />
    </div>
    <div className="w-full flex mt-[60px] mb-0 p-1">
    <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white w-full flex mt-3 p-1">
      <div className="hidden lg:inline mr-5">
        <div className="bg-gray-100 dark:bg-[#131B1E] w-full rounded-lg p-3">
          <ul className="">
            {adminLinks.map((link: any) => {
              //  const isActive = pathname === link.route;

              return (
                <li
                  key={link.route}
                  className={`${
                    activeTab === link.label &&
                    "dark:bg-[#064E3B] dark:text-white bg-[#064E3B] text-white rounded-xl"
                  } dark:bg-gray-800 dark:text-gray-300 dark:rounded-xl p-medium-16 whitespace-nowrap`}
                >
                  <div
                    onClick={() => handle(link.label)}
                    className="flex hover:bg-gray-200 hover:rounded-xl hover:text-gray-700 p-3 mb-1 hover:cursor-pointer"
                  >
                    <span className="text-right my-auto">
                      {link.label === "Home" && (
                        <span>
                          <CottageOutlinedIcon className="w-10 p-1" />
                        </span>
                      )}
                      {link.label === "Categories" && (
                        <span>
                          <ClassOutlinedIcon className="w-10 p-1" />
                        </span>
                      )}
                      {link.label === "Packages" && (
                        <span>
                          <DiamondIcon className="w-10 p-1" />
                        </span>
                      )}
                      {link.label === "Transactions" && (
                        <span>
                          <ChecklistOutlinedIcon className="w-10 p-1" />
                        </span>
                      )}
                     {/*  {link.label === "Payments" && (
                          <span>
                            <MonetizationOnOutlinedIcon className="w-10 p-1" />
                          </span>
                        )}*/} 
                      {link.label === "User Management" && (
                        <span>
                          <GroupsOutlinedIcon className="w-10 p-1" />
                        </span>
                      )}
                      {link.label === "Communication" && (
                        <span>
                          <ChatBubbleOutlineOutlinedIcon className="w-10 p-1" />
                        </span>
                      )}
                      {link.label === "Abuse" && (
                        <span>
                          <AssistantPhotoOutlinedIcon className="w-10 p-1" />
                        </span>
                      )}
                       {link.label === "Verification" && (
                        <span>
                          <GppGoodOutlinedIcon className="w-10 p-1" />
                        </span>
                      )}
                    </span>

                    <span className="flex-1 text-xs mr-5 hover:no-underline my-auto">
                      {link.label}
                    </span>

                    <span className="text-right my-auto">
                      <ArrowForwardIosIcon className="w-10 p-1" />
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="flex-1 rounded-lg">
        <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white rounded-lg lg:hidden">
          <div>
            <ul className="grid grid-cols-2 m-1 gap-1 p-1">
              {adminLinks.map((link: any) => {
                //  const isActive = pathname === link.route;

                return (
                  <li key={link.route}>
                    <div
                      onClick={() => handle(link.label)}
                      className={`${
                        activeTab === link.label
                          ? "items-center p-3 flex gap-1 bg-[#064E3B] text-white rounded-xl hover:cursor-pointers"
                          : "items-center p-3 flex gap-1 border rounded-xl dark:bg-gray-800 dark:text-gray-300 bg-white text-black hover:cursor-pointer hover:bg-gray-200"
                      }`}
                    >
                      <span className="text-right my-auto">
                        {link.label === "Home" && (
                          <span>
                            <CottageOutlinedIcon className="w-10 p-1" />
                          </span>
                        )}
                        {link.label === "Categories" && (
                          <span>
                            <ClassOutlinedIcon className="w-10 p-1" />
                          </span>
                        )}
                        {link.label === "Packages" && (
                          <span>
                            <DiamondIcon className="w-10 p-1" />
                          </span>
                        )}
                        {link.label === "Transactions" && (
                          <span>
                            <ChecklistOutlinedIcon className="w-10 p-1" />
                          </span>
                        )}
                       {/*   {link.label === "Payments" && (
                          <span>
                            <MonetizationOnOutlinedIcon className="w-10 p-1" />
                          </span>
                        )}*/}
                        {link.label === "User Management" && (
                          <span>
                            <GroupsOutlinedIcon className="w-10 p-1" />
                          </span>
                        )}
                        {link.label === "Communication" && (
                          <span>
                            <ChatBubbleOutlineOutlinedIcon className="w-10 p-1" />
                          </span>
                        )}
                         {link.label === "Abuse" && (
                        <span>
                          <AssistantPhotoOutlinedIcon className="w-10 p-1" />
                        </span>
                      )}
                        {link.label === "Verification" && (
                        <span>
                          <GppGoodOutlinedIcon className="w-10 p-1" />
                        </span>
                      )}
                      </span>

                      <span className="flex text-xs hover:no-underline">
                        {link.label}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {activeTab === "Home" && (
          <>
            <div className="container mx-auto p-1 lg:p-4 border rounded-xl">
              <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

              <Box>
                <Box mt="20px" display="flex" flexWrap="wrap" gap={2}>
                  <TotalCard title="Total Ads" value={adSum.totalProducts} />
                  <TotalCard title="Total Ads Worth" value={adSum.totalWorth} />
                  <TotalCard title="Total Users" value={users.data.length} />
                </Box>

                <Box mt="20px" display="flex" flexWrap="wrap" gap={2}>
                  {transactionSum.map((data: any, index: number) => (
                    <>
                      <TotalCardTransactions
                        title={data._id}
                        count={data.count}
                        value={data.totalWorth}
                      />
                    </>
                  ))}
                </Box>
               
                <Stack
                  mt="25px"
                  width="100%"
                  direction={{ xs: "column", lg: "row" }}
                  gap={4}
                >
                  <Box flex={1}>
                    <AdvertiserSubscriptions handleOpenChatId={handleOpenChatId} subscriptionsExpirely={subscriptionsExpirely}/>
                  </Box>
                 

                  
                </Stack>

                 <Stack
                  mt="25px"
                  width="100%"
                  direction={{ xs: "column", lg: "row" }}
                  gap={4}
                >
              
                  <Box flex={1}>
                    <TopAdvertiser handleOpenChatId={handleOpenChatId} topadvertiser={topadvertiser} />
                  </Box>

                  
                </Stack>
                 <Stack
                  mt="25px"
                  width="100%"
                  direction={{ xs: "column", lg: "row" }}
                  gap={4}
                >
                  {/* Make each child component flexible */}
                  <Box flex={1}>
                    <SalesLineGraph />
                  </Box>
                  <Box flex={1}>
                    <TrendingAds />
                  </Box>

                  
                </Stack>
              </Box>
            </div>
          </>
        )}
        {activeTab === "Categories" && (
          <>
            <div className="container mx-auto p-1 lg:p-4 border rounded-xl">
              <div className="flex flex-col dark:bg-[#2D3236] rounded-xl p-2">
                <div className="flex justify-between items-center w-full">
                  <h1 className="text-2xl font-bold">Categories</h1>{" "}
                  <button
                    onClick={handleOpenCategory}
                    className={`flex text-xs gap-1 items-center p-2 rounded-lg 
    bg-black text-white hover:bg-gray-600 
    hover:dark:bg-emerald-700 dark:bg-emerald-800`}
                  >
                    <AddOutlinedIcon /> Add Category
                  </button>
                </div>

                <div className="mt-2">
                  <ScrollArea className="w-full">
                    <DisplayCategories categories={categories} />
                  </ScrollArea>
                </div>
              </div>
              <div className="flex mt-2 flex-col dark:bg-[#2D3236] rounded-xl p-2">
                <div className="flex justify-between items-center gap-3 w-full">
                  <h1 className="text-2xl font-bold">SubCategories</h1>
                  <CategoryIdFilterSearch catList={catList} />
                  <button
                    onClick={handleOpen}
                    className={`flex w-full text-xs gap-1 items-center p-2 rounded-lg 
    bg-black text-white hover:bg-gray-600 
    hover:dark:bg-emerald-800 dark:bg-emerald-700`}
                  >
                    <AddOutlinedIcon /> Add SubCategory
                  </button>
                </div>

                <div className="mt-2">
                  <ScrollArea className="w-full">
                    <DisplaySubCategories subcategories={subcategories} />
                  </ScrollArea>
                </div>
              </div>
              <AddCategoryWindow
                isOpen={isOpenCategory}
                onClose={handleCloseCategory}
                type={"Create"}
              />
              <AddSubCategoryWindow
                isOpen={isOpen}
                onClose={handleClose}
                // userId={userId}
              />
            </div>
          </>
        )}
        {activeTab === "Packages" && (
          <>
            <div className="container mx-auto p-1 lg:p-4 border rounded-xl">
              <div className="flex flex-col w-full">
                <div className="flex justify-between w-full">
                  <h1 className="text-2xl font-bold mb-4">Packages</h1>
                  <button
                    onClick={handleOpenPackage}
                    className={`flex text-xs gap-1 items-center p-2 rounded-lg 
    bg-black text-white hover:bg-gray-600 
    hover:dark:bg-emerald-800 dark:bg-emerald-700`}
                  >
                    <AddOutlinedIcon /> Add Package
                  </button>
                </div>

                <Menulistpackages packagesList={packList} />
              </div>
              <AddPackageWindow
                isOpen={isOpenPackage}
                onClose={handleClosePackage}
                type={"Create"}
              />
            </div>
          </>
        )}
        {/*  {activeTab === "Communication" && (
          <>
            <div className="p-2 rounded-lg bg-white max-w-6xl mx-auto flex flex-col lg:flex-row mt-3">
              <Chat
                senderId={userId}
                senderName={userName}
                senderImage={userImage}
              />
            </div>
          </>
        )}*/}
        {activeTab === "User Management" && (
          <>
            <div className="container mx-auto p-1 lg:p-4 border rounded-xl">
              <h1 className="text-2xl font-bold mb-4">User Management</h1>
              <div className="flex flex-col lg:flex-row gap-3"></div>
              {/* Date Filter Section */}

              <ScrollArea className="w-[340px] lg:w-full">
                <CollectionUsers
                      data={users.data}
                      emptyTitle={`No User Found`}
                      emptyStateSubtext="Come back later"
                      limit={limit}
                      page={page}
                      userId={userId}
                      totalPages={users.totalPages} 
                      handleOpenChatId={handleOpenChatId}                />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </>
        )}
        
        {activeTab === "Communication" && (
          <>
            <div className="container mx-auto p-1 lg:p-4 border rounded-xl">
              <h1 className="text-2xl font-bold mb-4">
                Send Broadcast Message
              </h1>
              <div className="flex flex-col lg:flex-row gap-3"></div>
              <BroadcastMessage contacts={contacts}/>
            </div>
          </>
        )}
        {activeTab === "Transactions" && (
          <>
            <div className="container mx-auto p-1 lg:p-4 border rounded-xl">
              <h1 className="text-2xl font-bold mb-4">Transactions</h1>
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex flex-col lg:flex-row items-center gap-4 mb-4">
                  <div className="flex flex-col w-full">
                    <label
                      className="text-xs font-semibold mb-1"
                      htmlFor="startDate"
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate || ""}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="dark:bg-[#2D3236] bg-white text-xs border p-2 w-full rounded"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label
                      className="text-xs font-semibold mb-1"
                      htmlFor="endDate"
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate || ""}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="dark:bg-[#2D3236] bg-white text-xs border w-full p-2 rounded"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label
                      className="text-xs text-white font-semibold mb-1"
                      htmlFor="endDate"
                    ></label>
                    <button
                      onClick={handleSearchDates}
                      className="hover:dark:bg-emerald-800 dark:bg-emerald-700 lg:mt-5 text-xs bg-black text-white px-4 py-2 rounded"
                    >
                      Search
                    </button>
                {/*    <button
                      onClick={registerSafaricom}
                      className="hover:dark:bg-emerald-800 dark:bg-emerald-700 lg:mt-5 text-xs bg-black text-white px-4 py-2 rounded"
                    >
                      Register url Safaricom
                    </button>
                    */} 
                  </div>
                </div>

                {/* Search Form */}

                <div className="flex flex-col lg:flex-row gap-1">
                  <div className="flex flex-col">
                    <label
                      className="text-xs font-semibold mb-1"
                      htmlFor="endDate"
                    >
                      TransactionId
                    </label>
                    <div className="flex gap-1 flex-col lg:flex-row">
                      <input
                        type="text"
                        placeholder="Search by Order ID"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="dark:bg-[#2D3236] bg-white text-xs border p-2 flex rounded-md"
                      />
                      <button
                        type="submit"
                        onClick={handleSearch}
                        className="text-xs hover:dark:bg-emerald-800 dark:bg-emerald-700 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                      >
                        Search
                      </button>
                      <button
                        onClick={handleClear}
                        className="text-xs hover:dark:bg-emerald-800 dark:bg-emerald-700 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Date Filter Section */}

              <ScrollArea className="w-[340px] lg:w-full">
                <CollectionTransactions
                  data={transactions.data}
                  emptyTitle={`No Order Found`}
                  emptyStateSubtext="Come back later"
                  limit={limit}
                  page={page}
                  totalPages={transactions.totalPages}
                  handleOpenChatId={handleOpenChatId}
                />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </>
        )}
        {/*   {activeTab === "Payments" && (
          <>
            <div className="container mx-auto p-1 lg:p-4 border rounded-xl">
              <h1 className="text-2xl font-bold mb-4">Payments</h1>
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex flex-col lg:flex-row items-center gap-4 mb-4">
                  <div className="flex flex-col w-full">
                    <label
                      className="text-xs font-semibold mb-1"
                      htmlFor="startDate"
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate || ""}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="dark:bg-[#2D3236] bg-white text-xs border p-2 w-full rounded"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label
                      className="text-xs font-semibold mb-1"
                      htmlFor="endDate"
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate || ""}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="dark:bg-[#2D3236] bg-white text-xs border w-full p-2 rounded"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label
                      className="text-xs text-white font-semibold mb-1"
                      htmlFor="endDate"
                    ></label>
                    <button
                      onClick={handleSearchDates}
                      className="hover:dark:bg-emerald-800 dark:bg-emerald-700 lg:mt-5 text-xs bg-black text-white px-4 py-2 rounded"
                    >
                      Search
                    </button>
              
                  </div>
                </div>

            

                <div className="flex flex-col lg:flex-row gap-1">
                  <div className="flex flex-col">
                    <label
                      className="text-xs font-semibold mb-1"
                      htmlFor="endDate"
                    >
                      TransactionId
                    </label>
                    <div className="flex gap-1 flex-col lg:flex-row">
                      <input
                        type="text"
                        placeholder="Search by Order ID"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="dark:bg-[#2D3236] bg-white text-xs border p-2 flex rounded-md"
                      />
                      <button
                        type="submit"
                        onClick={handleSearch}
                        className="text-xs hover:dark:bg-emerald-800 dark:bg-emerald-700 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                      >
                        Search
                      </button>
                      <button
                        onClick={handleClear}
                        className="text-xs hover:dark:bg-emerald-800 dark:bg-emerald-700 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            
              <ScrollArea className="w-[340px] lg:w-full">
                <CollectionPayments
                  data={payments.data}
                  emptyTitle={`No Payment Found`}
                  emptyStateSubtext="Come back later"
                  limit={limit}
                  page={page}
                  totalPages={payments.totalPages}
                />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </>
        )}*/}
          {activeTab === "Verification" && (
          <>
            <div className="container mx-auto p-1 lg:p-4 border rounded-xl">
              <h1 className="text-2xl font-bold mb-4">
               Verification fee
              </h1>
              <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex gap-1 flex-col lg:flex-row">
                      <input
                        type="text"
                        placeholder="Fee"
                        value={fee}
                        onChange={(e) => setFee(e.target.value)}
                        className="dark:bg-[#2D3236] bg-white text-xs border p-2 flex rounded-md"
                      />
                      <button
                        type="submit"
                        onClick={handleFee}
                        className="text-xs hover:dark:bg-emerald-800 dark:bg-emerald-700 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                      >
                        Update
                      </button>
                      
                    </div>
              </div>
            
            </div>
          </>
        )}
          {activeTab === "Abuse" && (
          <>
            <div className="container mx-auto p-1 lg:p-4 border rounded-xl">
              <h1 className="text-2xl font-bold mb-4">Abuse</h1>
              <div className="flex flex-col lg:flex-row gap-3"></div>
              {/* Date Filter Section */}

              <ScrollArea className="w-[340px] lg:w-full">
                <CollectionAbuse
                  data={reported.data}
                  emptyTitle={`No Abuse`}
                  emptyStateSubtext="Come back later"
                  limit={limit}
                  page={page}
                  userId={userId}
                  totalPages={reported.totalPages}
                  handleOpenChatId={handleOpenChatId}
                />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </>
        )}
      </div>
    </div>
    <Toaster />
      </div>
        <PopupChatId 
           isOpen={isOpenChatId} 
           onClose={handleCloseChatId} 
           recipientUid={recipientUid} 
           userId={userId} 
           handleOpenSell={handleOpenSell} 
           handleOpenAbout={handleOpenAbout} 
           handleOpenTerms={handleOpenTerms} 
           handleOpenPrivacy={handleOpenPrivacy} 
           handleOpenSafety={handleOpenSafety} 
           handleOpenBook={handleOpenBook} 
           handleOpenPlan={handleOpenPlan} 
           userImage={userImage} 
           userName={userName} 
           handleOpenChat={handleOpenChat} 
           handleOpenShop={handleOpenShop} 
           handleOpenChatId={handleOpenChatId}
            handleOpenPerfomance={handleOpenPerfomance}
            handleOpenSettings={handleOpenSettings}
            handleCategory={handleCategory} 
            handleAdEdit={handleAdEdit} 
            handleAdView={handleAdView}
            handleOpenSearchTab={handleOpenSearchTab}
            user={users}/>
    </div>
  );
};

export default HomeDashboard;
