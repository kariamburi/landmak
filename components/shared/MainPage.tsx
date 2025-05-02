"use client";
import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
//import { ScrollArea } from "../ui/scroll-area";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { AdminId, mode } from "@/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IdynamicAd } from "@/lib/database/models/dynamicAd.model";
import { getAlldynamicAd } from "@/lib/actions/dynamicAd.actions";
import CategoryMenuMain from "./CategoryMenuMain";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MessageIcon from "@mui/icons-material/Message";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DiamondIcon from "@mui/icons-material/Diamond";
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  formUrlQuery,
  formUrlQuerymultiple,
  removeKeysFromQuery,
} from "@/lib/utils";
import ProgressPopup from "./ProgressPopup";
import MenuSubmobileMain from "./MenuSubmobileMain";
import Masonry from "react-masonry-css";
import CardAutoHeight from "./CardAutoHeight";
import AppPopup from "./AppPopup ";
import HeaderMain from "./HeaderMain";
import MobileNav from "./MobileNav";
import Unreadmessages from "./Unreadmessages";
import Footer from "./Footer";
import Footersub from "./Footersub";
import FloatingChatIcon from "./FloatingChatIcon";
import ChatWindow from "./ChatWindow";
import Skeleton from "@mui/material/Skeleton";
import PopupSell from "./PopupSell";
import PopupCategory from "./PopupCategory";
import PopupAdView from "./PopupAdView";
import VerticalCard from "./VerticalCard";
import PopupAdEdit from "./PopupAdEdit";
import PopupPay from "./PopupPay";
import PopupAbout from "./PopupAbout";
import PopupTerms from "./PopupTerms";
import PopupSafety from "./PopupSafety";
import PopupPrivacy from "./PopupPrivacy";
import PopupBookmark from "./PopupBookmark";
import PopupPlan from "./PopupPlan";
import PopupChat from "./PopupChat";
import PopupReviews from "./PopupReviews";
import PopupChatId from "./PopupChatId";
import PopupShop from "./PopupShop";
import PopupSettings from "./PopupSettings";
import BottomNavigation from "./BottomNavigation";
import PopupPerfomance from "./PopupPerfomance";
import { useToast } from "../ui/use-toast";
import SearchTabWindow from "./SearchTabWindow";
import StyledBrandName from "./StyledBrandName";
import { getAdById } from "@/lib/actions/dynamicAd.actions";
import { getUserById } from "@/lib/actions/user.actions";
import Head from "next/head";
import SearchByTitle from "./SearchByTitle";
import PopupAccount from "./PopupAccount";
import PopupFaq from "./PopupFaq";
import PropertyMap from "./PropertyMap";
import InitialAvatar from "./InitialAvatar";
type Ad = {
  data?: {
    subcategory?: string;
    [key: string]: any;
  };
};

export function countAdsBySubcategoryAndType(
  allAds: Ad[],
  subcategory: string,
  typeFieldName: string,
  typeValue: string
): number {
  const adCountLookup: Record<string, Record<string, number>> = {};

  allAds.forEach((ad) => {
    const adSubcategory = ad.data?.subcategory;
    const adType = ad.data?.[typeFieldName];

    if (adSubcategory && adType) {
      if (!adCountLookup[adSubcategory]) {
        adCountLookup[adSubcategory] = {};
      }
      if (!adCountLookup[adSubcategory][adType]) {
        adCountLookup[adSubcategory][adType] = 0;
      }
      adCountLookup[adSubcategory][adType]++;
    }
  });

  return adCountLookup?.[subcategory]?.[typeValue] || 0;
}

type CollectionProps = {
  limit: number;
  userId: string;
  emptyTitle: string;
  emptyStateSubtext: string;
  queryObject: any;
  urlParamName?: string;
  user: any;
  userName: string;
  userImage: string;
  categoryList: any;
  subcategoryList: any;
  AdsCountPerRegion:any;
  collectionType?: "Ads_Organized" | "My_Tickets" | "All_Ads";
};

const MainPage = ({
  user,
  emptyTitle,
  emptyStateSubtext,
  collectionType,
  urlParamName,
  queryObject,
  userId,
  userName,
  userImage,
  categoryList,
  subcategoryList,
  AdsCountPerRegion,
  
}: CollectionProps) => {
 // const isAdCreator = pathname === "/ads/";
 const [newpage, setnewpage] = useState(false);
 const observer = useRef<IntersectionObserver | null>(null);
 const [data, setAds] = useState<IdynamicAd[]>([]); // Initialize with an empty array
 const [page, setPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
 const [adId, setadId] = useState<any>([]);
 const [loading, setLoading] = useState(true);
 const [isInitialLoading, setIsInitialLoading] = useState(true);
 const [showPopup, setShowPopup] = useState(false);

 const [newqueryObject, setNewqueryObject] = useState<any>(queryObject);
 const [isOpenCategory, setIsOpenCategory] = useState(false);
 const [isOpenSell, setIsOpenSell] = useState(false);
 const [isOpenAdView, setIsOpenAdView] = useState(false);
 const [isOpenAdEdit, setIsOpenAdEdit] = useState(false);
 const [isOpenPay, setIsOpenPay] = useState(false);
 const [txtId, setTxtId] = useState('');
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
 const [isOpenProfile, setIsOpenProfile] = useState(false);
 const [isOpenPerfomance, setIsOpenPerfomance] = useState(false);
 const [isOpenSearchTab, setIsOpenSearchTab] = useState(false);
 const [isOpenSearchByTitle, setIsOpenSearchByTitle] = useState(false);
 const [showPopupMap, setShowPopupMap] = useState(false);
 const [coordinates, setCoordinates] = useState('');
 const [CategorySelect, setCategorySelect] = useState('');
 const { toast } = useToast()
 
  const router = useRouter();
  const [isOpenP, setIsOpenP] = useState(false);
  
  const handleClosePopupMap = () => {
    setShowPopupMap(false);
  };
  const handleCloseP = () => {
    setIsOpenP(false);
  };
  const handleOpenP = () => {
    setIsOpenP(true);
  };
  
 
  const handleClose = () => {
    setIsOpenAbout(false);
    setIsOpenTerms(false);
    setIsOpenPrivacy(false);
    setIsOpenSafety(false);
    setIsOpenBook(false);
    setIsOpenPlan(false);
    setIsOpenChat(false);
    setIsOpenChatId(false);
    setIsOpenReview(false);
    setIsOpenShop(false);
    setIsOpenSettings(false);
    setIsOpenPerfomance(false);
    setIsOpenSell(false);
    setIsOpenProfile(false);
    setIsOpenAdView(false);
    setIsOpenAdEdit(false);
    setIsOpenPay(false);
    setIsOpenSearchTab(false);
    setIsOpenFaq(false);
   
  };

 
  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("Ad");
      const Profile = params.get("Profile");
      const action = params.get("action");
      const coordinates = params.get("coordinates");
  
      if (id) {
        const ad = await getAdById(id);
        setadId(ad);
        setIsOpenAdView(true);
      } else {
        setIsOpenAdView(false);
      }
  
      if (Profile) {
        const shopAcc = await getUserById(Profile);
        setadId(shopAcc);
        setshopId(Profile);
        setIsOpenShop(true);
      } else {
        setIsOpenShop(false);
      }

      if (action) {
        setIsOpenChat(true);
      } else {
        setIsOpenChat(false);
      }

      if (coordinates) {
       
        setCoordinates(coordinates)
        setShowPopupMap(true);
      } else {
        setShowPopupMap(false);
      }
    };
  
    fetchData();
  }, []);
  


  const [showSidebar, setShowSidebar] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowSidebar(false); // Disable sidebar on mobile
      } else {
        setShowSidebar(true); // Enable sidebar on desktop
      }
    };

    // Initial check
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const SCROLL_THRESHOLD = 150; // pixels
  let scrollTimeout: NodeJS.Timeout;
  
  const [showBottomNav, setShowBottomNav] = useState(true);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTop = useRef(0);
  
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
  
    const handleScroll = () => {
      const currentScrollTop = viewport.scrollTop;
      const scrollDiff = currentScrollTop - lastScrollTop.current;
  
      clearTimeout(scrollTimeout);
  
      // Ignore small scrolls
      if (Math.abs(scrollDiff) < SCROLL_THRESHOLD) return;
  
      if (scrollDiff > 0) {
        // Scrolling down
        setShowBottomNav(false);
      } else {
        // Scrolling up
        setShowBottomNav(true);
      }
  
      lastScrollTop.current = currentScrollTop;
  
      // Optional: show nav again if user stops scrolling
      scrollTimeout = setTimeout(() => {
        setShowBottomNav(true);
      }, 200);
    };
  
    viewport.addEventListener("scroll", handleScroll);
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showSidebar && window.innerWidth < 768) {
        setShowSidebar(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [showSidebar]);

  const handleSidebarToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSidebar(!showSidebar);
  };
  const [isChatOpen, setChatOpen] = useState(false);
  const toggleChat = () => {
    setChatOpen(!isChatOpen);
  };
 
  const handleOpenSearchTab = (value:string) => {
    handleClose()
    setIsOpenCategory(false);
    setCategorySelect(value);
    setIsOpenSearchTab(true);
   
  };
  const handleHoverCategory = (value:string) => {
    setHoveredCategory(value);
    }
  const handleCloseSearchTab = () => {
    setIsOpenSearchTab(false);
  };
  const handleCloseSearchByTitle = () => {
    setIsOpenSearchByTitle(false);
  };
  const handleOpenSearchByTitle = () => {
    setIsOpenSearchByTitle(true);
  };
  const handleClosePerfomance = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
   
    setIsOpenPerfomance(false);
  };
  const handleOpenPerfomance = () => {
   handleClose();
    setIsOpenPerfomance(true);
    };

  const handleCloseSettings = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
   
    setIsOpenSettings(false);
  };
  const handleOpenSettings = () => {
    handleClose();
    setIsOpenSettings(true);
    };

    const handleOpenProfile = () => {
    
      handleClose();
      setIsOpenProfile(true);
      
    
    };
    const handleCloseProfile = () => {
        handleClose();
        setIsOpenProfile(false);
    };
      
  const handleCloseChatId = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
    setrecipientUid('')
    setIsOpenChatId(false);
  };
  const handleOpenChatId = (value:any) => {
   // handleClose();
    setrecipientUid(value)
    setIsOpenChatId(true);
   
    };

  const handleCloseShop = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
  
    setshopId([])
    setIsOpenShop(false);
  };
 
  const handleOpenShop = (shopId:any) => {
    handleClose();
    setshopId(shopId)
    setIsOpenShop(true);
    };
  const handleCloseReview = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
    setrecipient([])
    setIsOpenReview(false);
  };
  const handleOpenReview = (value:any) => {
    handleClose();
    setrecipient(value)
    setIsOpenReview(true);
    };

  const handleCloseChat = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
    setIsOpenChat(false);
  };
  const handleOpenChat = () => {
    handleClose();
    setIsOpenChat(true);
    };

  const handleClosePlan = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([]);
    }
   
    setIsOpenPlan(false);
  };
  const handleOpenPlan = () => {
    handleClose();
    setIsOpenPlan(true);
    };
  const handleCloseBook = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
   
    setIsOpenBook(false);
  };
  const handleOpenBook = () => {
    handleClose();
    setIsOpenBook(true);
    };

  const handleCloseTerms = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
    setIsOpenTerms(false);
  };
  const handleOpenTerms = () => {
    handleClose();
    setIsOpenTerms(true);
    };
    const handleClosePrivacy = () => {
      const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
      setIsOpenPrivacy(false);
    };
    const handleOpenPrivacy = () => {
      handleClose();
      setIsOpenPrivacy(true);
      };
      const handleCloseSafety = () => {
        const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
  
        setIsOpenSafety(false);
      };
      const handleOpenSafety = () => {
        handleClose();
        setIsOpenSafety(true);
        };

        const handleCloseFaq = () => {
          const params = new URLSearchParams(window.location.search);
      const Profile = params.get("Profile");
      const Ad = params.get("Ad");
      const action = params.get("action");
      if(Profile || Ad || action){
        router.push("/", { scroll: false });
        setNewqueryObject([])
      }
    
          setIsOpenFaq(false);
        };
        const handleOpenFaq = () => {
          handleClose();
          setIsOpenFaq(true);
          };



  const handleCloseAbout = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
    
    setIsOpenAbout(false);
  };
  const handleOpenAbout = () => {
    handleClose();
    setIsOpenAbout(true);
    };
  
const handlePay = (id:string) => {
  handleClose();
  setTxtId(id);
  setIsOpenPay(true);
  };

  const handleClosePay = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
   
    setIsOpenPay(false);
  };
const handleCloseAdEdit = () => {
  const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
   
  setadId([]);
  setIsOpenAdEdit(false);
};

const handleAdEdit = (id:string) => {
  handleClose();
  setadId(id);
  setIsOpenAdEdit(true);
  };

const handleCloseAdView = () => {
  const params = new URLSearchParams(window.location.search);
  const ad = params.get("Ad");
  if(ad){
    router.push("/", { scroll: false });
    setNewqueryObject([])
  }
 
  setadId([]);
  setIsOpenAdView(false);
};

  const handleCloseCategory = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
    }
    setNewqueryObject([])
    setIsOpenCategory(false);
  };

  const handleOpenSell = () => {
    handleClose();
    setIsOpenSell(true);
 };

  const handleCloseSell = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    if(Profile || Ad || action){
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
   
    setIsOpenSell(false);
  };
  const handleAdView = (ad:any) => {
    handleClose();
    setadId(ad);
    setIsOpenAdView(true);
    };
 
   const handleFilter = (value:any) => {
    
    setNewqueryObject({
      ...queryObject, // Preserve existing properties
      ...value,
    });
    };
  
  const fetchAds = async () => {
    setLoading(true);
    try {
      const Ads = await getAlldynamicAd({
        queryObject: newqueryObject,
        page,
        limit: 20,
      });

      if (newpage) {
        setnewpage(false);
        setAds((prevAds: IdynamicAd[]) => {
          const existingAdIds = new Set(prevAds.map((ad) => ad._id));

          // Filter out ads that are already in prevAds
          const newAds = Ads?.data.filter(
            (ad: IdynamicAd) => !existingAdIds.has(ad._id)
          );

          return [...prevAds, ...newAds]; // Return updated ads
        });
      } else {
        setnewpage(false);
        setAds(Ads?.data);
      }

      setTotalPages(Ads?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching ads", error);
    } finally {
      setLoading(false);
      setIsOpenP(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    if (!newpage) {
      setPage(1);
    }
    fetchAds();
  }, [page, newqueryObject]);

  const lastAdRef = (node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page < totalPages) {
        setnewpage(true);
        setPage((prevPage: any) => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  };
  const breakpointColumns = {
    default: 4, // 3 columns on large screens
    1100: 3, // 2 columns for screens <= 1100px
    700: 2, // 1 column for screens <= 700px
  };
 
  

  const footerRef = useRef<HTMLDivElement | null>(null);
 const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || mode; // Default to "dark"
    const isDark = savedTheme === mode;
    
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle(mode, isDark);
  }, []);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  //const searchParams = useSearchParams();
  const HoveredCategoryReset = () => {
    setHoveredCategory(null)
  }
  const handleCategory = (query: string) => {
   
  
   // let newUrl = "";
    if (query) {
      handleClose();
      setNewqueryObject({
        ...queryObject, // Preserve existing properties
        category: query.toString(),
        });
        setHoveredCategory(null);
        setIsOpenCategory(true);
        //setIsOpenAdView(false);
        //setIsOpenSell(false);
  
  };
};
  const handleSubCategory = (category: string, subcategory: string) => {
    
    if (category && subcategory) {
      handleClose();
   setNewqueryObject({
    ...queryObject, // Preserve existing properties
    category: category.toString(),
    subcategory: subcategory.toString(),});
    setHoveredCategory(null);
    setIsOpenCategory(true);
    setIsOpenAdView(false);
    setIsOpenSell(false);
    }else{
      if (category) {
        setNewqueryObject({
         ...queryObject, // Preserve existing properties
         category: category.toString(),});
         setHoveredCategory(null);
         setIsOpenCategory(true);
         setIsOpenAdView(false);
         setIsOpenSell(false);
    }
    
  }
  };

  const viewportRef_ = useRef<HTMLDivElement | null>(null);
  const [showScrollUp, setShowScrollUp] = useState(false);

  // Scroll listener to toggle scroll up/down buttons
  useEffect(() => {
    const viewport = viewportRef_.current;
    if (!viewport) return;

    const handleScroll = () => {
      setShowScrollUp(viewport.scrollTop > 10); // show top button after slight scroll
    };

    viewport.addEventListener("scroll", handleScroll);
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll up/down function
  const scrollBy = (amount: number) => {
    if (viewportRef_.current) {
      viewportRef_.current.scrollBy({ top: amount, behavior: "smooth" });
    }
  };



  return (
    <div className="relative flex w-full h-screen">
      <Head>
  <title>mapa | Buy, Sell & Rent Properties and More in Kenya</title>
  <meta
    name="description"
    content="mapa.co.ke is Kenya's trusted online marketplace for buying, selling, and renting properties. Explore land, homes, apartments, and a wide range of other products and services."
  />
  <meta
    property="og:title"
    content="mapa | Buy, Sell & Rent Properties and More in Kenya"
  />
  <meta
    property="og:description"
    content="Discover the easiest way to buy, sell, or rent properties on mapa.co.ke. From land and homes to vehicles and electronics, find everything you need across Kenya."
  />
  <meta property="og:image" content="/logo.png" />
  <meta property="og:url" content="https://mapa.co.ke" />
  <meta property="og:type" content="website" />
  <meta
    name="keywords"
    content="mapa, buy properties Kenya, sell land, rent house Kenya, marketplace Kenya, online shopping Kenya, real estate Kenya"
  />
  <meta name="author" content="mapa" />
  <link rel="manifest" href="/manifest.json" />
  <link rel="canonical" href="https://mapa.co.ke" />
</Head>

      {/* Sidebar */}
      <div
        onClick={(e) => e.stopPropagation()} // Prevent sidebar from closing on itself click
        className={`bg-white shadow-lg transition-transform duration-300 ease-in-out fixed md:relative z-10 ${
          showSidebar
            ? "w-full md:w-1/4 p-3 transform translate-x-0"
            : "-translate-x-full md:w-0 md:translate-x-0"
        }`}
      >
        <Button onClick={handleSidebarToggle} className="mb-4 md:hidden">
          {showSidebar ? "Hide" : "Show"} Sidebar
        </Button>

        {showSidebar && (
         
          <div className="flex flex-col space-y-4 h-full">
             {/* <div className="flex flex-col space-y-4 h-full overflow-y-auto">*/}
            <div className="flex justify-between items-center w-full">
              <p className="p-1">CATEGORIES</p>
              <SignedIn>

<Button onClick={() => {
   handleOpenSell();
  
}} variant="outline" className="flex items-center gap-2">
<AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL
</Button>

</SignedIn>

<SignedOut>
<Button  onClick={() => {
      setIsOpenP(true);
      router.push("/sign-in");
    }} variant="outline" className="flex items-center gap-2">
<AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL
</Button>

  
</SignedOut>
              <Button onClick={handleSidebarToggle} className="md:hidden">
                <X />
              </Button>
            </div>
              {/* Scroll Buttons */}
              <div className="relative flex-1 overflow-hidden">
      <div className="absolute top-1 left-1/2 z-50 flex flex-col gap-2">

      {showScrollUp && (
          <button
            onClick={() => scrollBy(-300)}
            className="bg-gray-100 text-black h-10 w-10 p-0 rounded-full shadow"
          >
             <KeyboardArrowUpOutlinedIcon/>
          </button>
        )} 
       
       
      </div>
        <ScrollArea.Root 
         className="h-full">
      <ScrollArea.Viewport 
         ref={viewportRef_}
         className="h-full overflow-y-auto text-sm lg:text-base w-full dark:bg-[#2D3236] bg-white rounded-t-md border p-4">
      
      <div className="relative flex z-20">
        
      <div className="w-full p-0">
        <div
          className={`flex flex-col items-center`}
        >
          <div className="w-full">
          
              
             {categoryList.map((category: any, index: number) => (
                <div
                  key={index}
                  onClick={() => {
                    if (category.adCount > 0) {
                      handleCategory(category.name);
                    } else {
                      toast({
                        title: "0 Ads",
                        description: (
                          <>
                            No ads in <strong>{category.name}</strong> category
                          </>
                        ),
                        //action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
                      });
                    }
                  }}
                  onMouseEnter={() => setHoveredCategory(category.name)}
                  className={`relative text-black dark:text-[#F1F3F3] flex flex-col items-center justify-center cursor-pointer p-2 border-b dark:border-gray-600 dark:hover:bg-[#131B1E] hover:bg-green-100 ${
                    hoveredCategory === category.name
                      ? "bg-green-100 dark:bg-[#131B1E]"
                      : "dark:bg-[#2D3236] bg-white"
                  } `}
                >
                  <div className={`flex gap-1 items-center mb-1 h-full w-full`}>
                    <span>
                      <div className="rounded-full dark:bg-[#131B1E] bg-gray-200 p-2">
                        <Image
                          className="w-6 h-6 object-cover"
                          src={category.imageUrl[0]}
                          alt={category.name}
                          width={60}
                          height={60}
                        />
                      </div>
                    </span>
                    <span className="flex-1 text-sm hover:no-underline my-auto">
                      <div className="flex flex-col">
                        <h2
                          className={`text-xs font-bold ${
                            category.adCount > 0
                              ? ""
                              : "text-gray-500 dark:text-gray-500"
                          } `}
                        >
                          {category.name}
                        </h2>
                        <p
                          className={`text-xs text-gray-500 dark:text-gray-500`}
                        >
                          {category.adCount} ads
                        </p>
                      </div>
                    </span>
                    <span
                      className={`text-right my-auto ${
                        category.adCount > 0
                          ? ""
                          : "text-gray-500 dark:text-gray-500"
                      } `}
                    >
                      <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                    </span>
                  </div>
                 
                </div>
              ))}



           
          </div>
        </div>
      </div>
     
      
    </div>
    </ScrollArea.Viewport>
     <ScrollArea.Scrollbar orientation="vertical" />
      <ScrollArea.Corner />
    </ScrollArea.Root>
    <div className="absolute bottom-1 left-1/2 z-50 flex flex-col gap-2">
    {!showScrollUp && (
          <button
            onClick={() => scrollBy(300)}
            className="bg-gray-100 text-black p-0 h-10 w-10 rounded-full shadow"
          >
           <KeyboardArrowDownOutlinedIcon/>
          </button>
        )}
       
      </div>
      </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {showSidebar && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      {/* Ads Section */}
      <div
        className={`flex-1 flex-col transition-all duration-300 h-screen ${
          showSidebar ? "hidden md:block" : "block"
        }`}
      >
       
       {hoveredCategory && (
        <div
          className={`absolute w-64 top-20 z-20 dark:bg-[#2D3236] bg-white p-2 shadow-lg transition-all duration-300`}
          onMouseEnter={() => setHoveredCategory(hoveredCategory)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <ScrollArea.Root>
      <ScrollArea.Viewport className="h-[450px] w-full">
            {subcategoryList
              .filter((cat: any) => cat.category.name === hoveredCategory)
              .map((sub: any, index: number) => (
                <div
                  key={index}
                  className="relative dark:bg-[#2D3236] text-black dark:text-[#F1F3F3] bg-white flex flex-col items-center justify-center cursor-pointer p-1 border-b dark:hover:dark:bg-[#131B1E] hover:bg-emerald-100 border-b dark:border-gray-600"
                  onClick={() => {
                    if (sub.adCount > 0) {
                      handleSubCategory(hoveredCategory, sub.subcategory);
                    } else {
                      toast({
                        title: "0 Ads",
                        description: (
                          <>
                            No ads in <strong>{sub.subcategory}</strong> subcategory
                          </>
                        ),
                        //action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
                      });
                    }
                  }}
                >
                  <div className="flex gap-1 items-center mb-1 w-full">
                    <span>
                      <div className="rounded-full dark:bg-[#131B1E] bg-gray-200 p-2">
                        <Image
                          className="h-6 w-6 object-cover"
                          src={sub.imageUrl[0] || ""}
                          alt={sub.subcategory}
                          width={60}
                          height={60}
                        />
                      </div>
                    </span>
                    <span className="flex-1 text-sm hover:no-underline my-auto">
                      <div className="flex flex-col">
                        <h2
                          className={`text-xs font-bold ${
                            sub.adCount > 0
                              ? ""
                              : "text-gray-500 dark:text-gray-500"
                          } `}
                        >
                          {sub.subcategory}
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {sub.adCount} ads
                        </p>
                      </div>
                    </span>
                  </div>
                
                </div>
              ))}
        </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical" />
      <ScrollArea.Corner />
    </ScrollArea.Root>
        </div>
      )}
        <div onMouseEnter={() => setHoveredCategory(null)} className="relative p-0 lg:p-2 h-screen flex flex-col">
        <Button
          onClick={handleSidebarToggle}
          className="hidden lg:inline absolute bottom-5 left-4 z-10 md:block bg-green-600 text-white shadow-lg hover:bg-green-700"
        >
        {showSidebar ? (<><KeyboardArrowLeftOutlinedIcon/> Hide Categories</>) : (<><KeyboardArrowRightOutlinedIcon/> Show Categories</>)} 
        </Button>
        
          {/* Header Section */}
          <div className="flex flex-col gap-0 top-0 left-0 w-full bg-gradient-to-b from-gray-200 to-gray-200 lg:from-white lg:to-white p-0 lg:shadow-md z-10 md:relative md:w-auto md:shadow-none">
          <div
  className={`bg-gradient-to-b from-white to-gray-200 lg:from-white lg:to-white transition-all duration-300 overflow-hidden p-2 w-full flex flex-col items-center ${
    showBottomNav ? "max-h-[50px] opacity-100" : "max-h-0 opacity-0"
  }`}
>
  <div className="w-full justify-between flex items-center">
              <div className="flex items-center gap-1">
                
                <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
                <StyledBrandName/>
              </div>

              <div className="flex gap-2 items-center"><div className="hidden lg:inline">
            <div className="flex items-center gap-2">
            <SignedIn>
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-gray-200 hover:bg-gray-300 emerald-500 tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Messages"
              onClick={() => {
                handleOpenBook();
              }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <BookmarkIcon sx={{ fontSize: 16 }} className="hover:text-green-600"/>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bookmark</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            </SignedIn>
            <SignedOut>
                     <div
                        className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-gray-200 hover:bg-gray-300 tooltip tooltip-bottom hover:cursor-pointer"
                        data-tip="Messages"
                        onClick={() => {
                          setIsOpenP(true);
                           router.push("/sign-in");
                         }} 
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <BookmarkIcon sx={{ fontSize: 16 }} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Bookmark</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
            </SignedOut>
            <SignedIn>
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-gray-200 hover:bg-gray-300 tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Messages"
              onClick={() => {
                handleOpenChat();
              }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative flex items-center justify-center">
                      <MessageIcon sx={{ fontSize: 16 }} className="absolute hover:text-green-600" />
                      <div className="absolute z-10">
                        <Unreadmessages userId={userId} popup={"home"} />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div
                      onClick={() => {
                        handleOpenChat();
                      }}
                      className="flex gap-1"
                    >
                      Chats
                      <Unreadmessages userId={userId} popup={"home"}/>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
</SignedIn>
 <SignedOut>
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Messages"
              onClick={() => {
                setIsOpenP(true);
                 router.push("/sign-in");
               }} 
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <MessageIcon sx={{ fontSize: 16 }} className="absolute" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Message</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            </SignedOut>


            <div
              className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-gray-200 hover:bg-gray-300 tooltip tooltip-bottom hover:cursor-pointer"
              data-tip="Messages"
              onClick={() => {
                handleOpenPlan();
              }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DiamondIcon sx={{ fontSize: 16 }} className="hover:text-green-600"/>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Premium Services</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div>
            <SignedIn>

<Button onClick={() => {
   handleOpenSell();
}} variant="default" className="flex bg-green-600 hover:bg-green-700 items-center gap-2">
<AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL
</Button>

</SignedIn>


            </div>
            <div>
            <SignedOut>
<Button  onClick={() => {
      setIsOpenP(true);
      router.push("/sign-in");
    }} variant="default" className="flex bg-green-600 hover:bg-green-700 items-center gap-2">
<AddOutlinedIcon sx={{ fontSize: 16 }} /> SELL
</Button>

  
</SignedOut>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <SignedIn>
            <div className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white tooltip tooltip-bottom hover:cursor-pointer">
              <UserButton afterSignOutUrl="/" />
            </div>
        </SignedIn>
  
          <MobileNav userstatus={user.status} userId={userId} user={user}
                  popup={"home"}
                  handleOpenSell={handleOpenSell}
                  handleOpenBook={handleOpenBook}
                  handleOpenPlan={handleOpenPlan}
                  handleOpenChat={handleOpenChat}
                  handleOpenShop={handleOpenShop}
                  handleOpenPerfomance={handleOpenPerfomance}
                  handleOpenSettings={handleOpenSettings}
                  handleOpenAbout={handleOpenAbout}
                  handleOpenTerms={handleOpenTerms}
                  handleOpenPrivacy={handleOpenPrivacy}
                  handleOpenSafety={handleOpenSafety} 
                  onClose={handleClose} />
        </div>
        
        </div>
            </div>
            </div>
           
            



        <HeaderMain handleFilter={handleFilter} handleOpenPlan={handleOpenPlan} AdsCountPerRegion={AdsCountPerRegion} queryObject={newqueryObject}
         handleAdEdit={handleAdEdit}
         handleAdView={handleAdView}
         handleCategory={handleCategory}
         handleOpenSell={handleOpenSell}
         handleOpenSearchByTitle={handleOpenSearchByTitle}
         />
        <AppPopup />
       
         
          
          </div>



        
     <ScrollArea.Root className="flex-1 overflow-hidden">
      <ScrollArea.Viewport ref={viewportRef}  className="h-full overflow-y-auto bg-gray-200 lg:rounded-t-0 border">
    
  <div className="lg:hidden px-1">
    <MenuSubmobileMain
      categoryList={categoryList}
      subcategoryList={subcategoryList}
      handleSubCategory={handleSubCategory}
      handleOpenSell={handleOpenSell}
      handleCategory={handleCategory}
      handleOpenChat={handleOpenChat}
      handleOpenSearchTab={handleOpenSearchTab}
      handleOpenSettings={handleOpenSettings}
      userId={userId}
     
    />
  </div>

  {data.length > 0 ? (
   
     <Masonry
        breakpointCols={breakpointColumns}
        className="p-1 mt-4 mb-20 lg:mb-0 lg:mt-0 w-full flex gap-2 lg:gap-4 overflow-hidden"
        columnClassName="bg-clip-padding"
      >
        {data.map((ad: any, index: number) => {
          const hasOrderLink = collectionType === "Ads_Organized";
          const hidePrice = collectionType === "My_Tickets";

          return (
            <div
              ref={data.length === index + 1 ? lastAdRef : null}
              key={ad._id}
              className="flex justify-center w-full"
            >
              <CardAutoHeight
                ad={ad}
                hasOrderLink={hasOrderLink}
                hidePrice={hidePrice}
                userId={userId}
                handleAdEdit={handleAdEdit}
                handleAdView={handleAdView}
                handleOpenPlan={handleOpenPlan}
              
              />
            </div>
          );
        })}
     </Masonry> 
  
  ) : (
    !loading && (
      <div className="flex items-center justify-center min-h-[400px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
        <h3 className="font-bold text-[16px] lg:text-[25px]">{emptyTitle}</h3>
        <p className="text-sm lg:p-regular-14">{emptyStateSubtext}</p>
        
        <SignedIn>
          <Button onClick={handleOpenSell} variant="default" className="flex items-center gap-2">
            <AddOutlinedIcon sx={{ fontSize: 16 }} /> Create Ad
          </Button>
        </SignedIn>

        <SignedOut>
          <Button onClick={() => { setIsOpenP(true); router.push("/sign-in"); }} variant="outline" className="flex items-center gap-2">
            <AddOutlinedIcon sx={{ fontSize: 16 }} /> Create Ad
          </Button>
        </SignedOut>
      </div>
    )
  )}

  {userId && (
    <>
      <FloatingChatIcon onClick={toggleChat} isOpen={isChatOpen} />
      <ChatWindow
        isOpen={isChatOpen}
        onClose={toggleChat}
        senderId={userId}
        senderName={userName}
        senderImage={userImage}
        recipientUid={AdminId}
        handleAdEdit={handleAdEdit}
        handleAdView={handleAdView} 
        handleCategory={handleCategory}
        handleOpenSell={handleOpenSell}
        handleOpenPlan={handleOpenPlan}
      />
    </>
  )}

  {loading && (
    <div>
      {isInitialLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="bg-gray-200 dark:bg-[#2D3236] p-4 rounded-lg shadow-md w-full">
              <Skeleton variant="rectangular" width="100%" height={140} />
              <Skeleton variant="text" width="80%" height={30} className="mt-2" />
              <Skeleton variant="text" width="60%" height={25} />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full min-h-[400px] h-full flex flex-col items-center justify-center">
          <Image src="/assets/icons/loading2.gif" alt="loading" width={40} height={40} unoptimized />
        </div>
      )}
    </div>
  )}
  
  <div className="hidden lg:inline">
    <Footersub
      handleOpenAbout={handleOpenAbout}
      handleOpenTerms={handleOpenTerms}
      handleOpenPrivacy={handleOpenPrivacy}
      handleOpenSafety={handleOpenSafety}
    />
  </div>
  
</ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical" />
      <ScrollArea.Corner />
    </ScrollArea.Root>




           <footer>
                  
                
                  <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 transition-transform duration-300 ${
          showBottomNav ? "translate-y-0" : "translate-y-full"
        }`}
      >
       <BottomNavigation 
                 userId={userId} 
                 popup={"home"}
                 onClose={handleClose} 
                handleOpenSell={handleOpenSell}
                handleOpenChat={handleOpenChat}
                handleOpenSettings={handleOpenSettings}
                handleOpenSearchTab={handleOpenSearchTab}
                handleOpenP={handleOpenP} />
      </div>
                </footer>
        </div>
      </div>
      <PopupCategory isOpen={isOpenCategory} onClose={handleCloseCategory} userId={userId} userName={userName} userImage={userImage} queryObject={newqueryObject} handleOpenSell={handleOpenSell} handleAdView={handleAdView} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
      handleOpenShop={handleOpenShop}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenSettings={handleOpenSettings}
      handleAdEdit={handleAdEdit}
      handleCategory={handleCategory}
      handleOpenSearchTab={handleOpenSearchTab} 
      handleOpenSearchByTitle={handleOpenSearchByTitle}
      categoryList={categoryList} 
      subcategoryList={subcategoryList}
      user={user}
     />

      <PopupShop isOpen={isOpenShop} handleOpenReview={handleOpenReview} onClose={handleCloseShop} userId={userId} shopAcc={shopId} userName={userName} userImage={userImage} queryObject={newqueryObject} handleOpenSell={handleOpenSell} handleAdView={handleAdView} handleAdEdit={handleAdEdit} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat} handleOpenChatId={handleOpenChatId} handleOpenSettings={handleOpenSettings}
      handleOpenShop={handleOpenShop}
      handleOpenPerfomance={handleOpenPerfomance}
      handlePay={handlePay} user={user}/>

      <PopupSell isOpen={isOpenSell} onClose={handleCloseSell} type={"Create"} userId={userId} userName={userName} handleOpenSell={handleOpenSell} handlePay={handlePay} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat} handleCategory={handleCategory}
            handleOpenShop={handleOpenShop}
            handleOpenPerfomance={handleOpenPerfomance} 
            handleOpenSettings={handleOpenSettings}
            handleOpenSearchTab={handleOpenSearchTab}
            handleAdView={handleAdView}
            subcategoryList={subcategoryList}
            user={user} />

      <PopupAdEdit isOpen={isOpenAdEdit} onClose={handleCloseAdEdit} type={"Update"} userId={userId} userName={userName} ad={adId} handleOpenSell={handleOpenSell} handleAdView={handleAdView} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
      handleOpenShop={handleOpenShop}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenSettings={handleOpenSettings} 
      handleCategory={handleCategory} 
      subcategoryList={subcategoryList}
      user={user} />
 
      <PopupAdView isOpen={isOpenAdView} onClose={handleCloseAdView} userId={userId} userName={userName} userImage={userImage} ad={adId} handleOpenSell={handleOpenSell} handleAdView={handleAdView} handleAdEdit={handleAdEdit} handleSubCategory={handleSubCategory} type={"Create"} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat} handleOpenReview={handleOpenReview} handleOpenShop={handleOpenShop} handleOpenChatId={handleOpenChatId}
      handleOpenSettings={handleOpenSettings}
      handleOpenPerfomance={handleOpenPerfomance}
      handleCategory={handleCategory} 
      handlePay={handlePay}
      user={user} />

      <PopupBookmark
      isOpen={isOpenBook}
      onClose={handleCloseBook}
      userId={userId}
      handleOpenSell={handleOpenSell}
      handleAdEdit={handleAdEdit}
      handleAdView={handleAdView}
      handleOpenAbout={handleOpenAbout}
      handleOpenTerms={handleOpenTerms}
      handleOpenPrivacy={handleOpenPrivacy}
      handleOpenSafety={handleOpenSafety}
      handleOpenBook={handleOpenBook}
      handleOpenPlan={handleOpenPlan}
      handleOpenChat={handleOpenChat}
      handleOpenPerfomance={handleOpenPerfomance}
      handleCategory={handleCategory} 
      handleOpenShop={handleOpenShop} 
      handleOpenChatId={handleOpenChatId} 
      handleOpenSettings={handleOpenSettings}
      user={user}/>

      <PopupPerfomance isOpen={isOpenPerfomance} onClose={handleClosePerfomance} userId={userId} handleOpenSell={handleOpenSell} handleAdEdit={handleAdEdit} handleAdView={handleAdView} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat} userName={userName} userImage={userImage}
      handleOpenPerfomance={handleOpenPerfomance}
      handleCategory={handleCategory}
      handleOpenShop={handleOpenShop}
      handleOpenChatId={handleOpenChatId}
      handleOpenSettings={handleOpenSettings}
      handlePay={handlePay} 
      handleOpenReview={handleOpenReview}
      user={user}/>

      <PopupPlan isOpen={isOpenPlan} onClose={handleClosePlan} userId={userId} handleOpenPlan={handleOpenPlan} handleOpenBook={handleOpenBook} handleOpenSell={handleOpenSell} handleOpenChat={handleOpenChat}
      handleOpenPerfomance={handleOpenPerfomance}
      handleCategory={handleCategory}
      handleOpenShop={handleOpenShop}
      handleOpenSettings={handleOpenSettings}
      handlePay={handlePay} 
      handleOpenAbout={handleOpenAbout} 
      handleOpenTerms={handleOpenTerms} 
      handleOpenPrivacy={handleOpenPrivacy} 
      handleOpenSafety={handleOpenSafety}
      user={user}/>

      <PopupChat isOpen={isOpenChat} onClose={handleCloseChat} handleOpenChatId={handleOpenChatId} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} userImage={userImage} userName={userName} handleOpenChat={handleOpenChat} handleOpenSettings={handleOpenSettings} handleCategory={handleCategory} handleOpenReview={handleOpenReview}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenShop={handleOpenShop}
      handlePay={handlePay} handleOpenSearchTab={handleOpenSearchTab}
      user={user}/>

      <PopupChatId isOpen={isOpenChatId} onClose={handleCloseChatId} recipientUid={recipientUid} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} userImage={userImage} userName={userName} handleOpenChat={handleOpenChat} handleOpenShop={handleOpenShop} handleOpenChatId={handleOpenChatId}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenSettings={handleOpenSettings}
      handleCategory={handleCategory} 
      handleAdEdit={handleAdEdit} 
      handleAdView={handleAdView}
      handleOpenSearchTab={handleOpenSearchTab}
      user={user}/>
      
      <PopupReviews isOpen={isOpenReview} onClose={handleCloseReview} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} userImage={userImage} userName={userName} handleOpenChat={handleOpenChat} recipient={recipient} handleOpenSettings={handleOpenSettings} handleOpenChatId={handleOpenChatId} handleOpenReview={handleOpenReview}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenShop={handleOpenShop}
      handleCategory={handleCategory}
      handlePay={handlePay}
      user={user}/>


      <PopupSettings isOpen={isOpenProfile} onClose={handleCloseProfile} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenSettings={handleOpenSettings}
      handleCategory={handleCategory}
      handlePay={handlePay}
      handleOpenShop={handleOpenShop}
      user={user}
      handleOpenSearchTab={handleOpenSearchTab}/>

     <PopupAccount isOpen={isOpenSettings} onClose={handleCloseSettings} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenSettings={handleOpenSettings}
      handleCategory={handleCategory}
      handlePay={handlePay}
      handleOpenShop={handleOpenShop}
      user={user}
      handleOpenSearchTab={handleOpenSearchTab}
      handleOpenProfile={handleOpenProfile}
      handleOpenFaq={handleOpenFaq}
      userImage={userImage}
      userName={userName}
      handleAdEdit={handleAdEdit}
      handleAdView={handleAdView}
      handleOpenReview={handleOpenReview}/>
     
      <PopupPay txtId={txtId} isOpen={isOpenPay} onClose={handleClosePay} userId={userId} userName={userName} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenSettings={handleOpenSettings}
      handleCategory={handleCategory}
      handleOpenShop={handleOpenShop} 
      handleOpenChatId={handleOpenChatId}
      user={user} />
       
      <PopupAbout isOpen={isOpenAbout} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} onClose={handleCloseAbout} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenSettings={handleOpenSettings}
      handleOpenShop={handleOpenShop}
      user={user} />

      <PopupTerms isOpen={isOpenTerms} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} onClose={handleCloseTerms} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
       handleOpenPerfomance={handleOpenPerfomance}
       handleOpenSettings={handleOpenSettings}
       handleOpenShop={handleOpenShop}
       user={user} 
       />

      <PopupPrivacy isOpen={isOpenPrivacy} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} onClose={handleClosePrivacy} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
       handleOpenPerfomance={handleOpenPerfomance}
       handleOpenSettings={handleOpenSettings}
       handleOpenShop={handleOpenShop}
       user={user}  
       />

      <PopupSafety isOpen={isOpenSafety} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} onClose={handleCloseSafety} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
       handleOpenShop={handleOpenShop}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenSettings={handleOpenSettings}
      user={user}  
     />

<PopupFaq isOpen={isOpenFaq} onClose={handleCloseFaq} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
       handleOpenShop={handleOpenShop}
      handleOpenPerfomance={handleOpenPerfomance}
      handleOpenSettings={handleOpenSettings}
      user={user}  
     />

 {showPopupMap && (
                                  <div className="fixed inset-0 flex items-center justify-center bg-gray-200 z-50">
                                    <div className="dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 bg-gray-200 p-2 w-full items-center justify-center relative">
                           
                                      <div className="flex flex-col items-center justify-center dark:bg-[#2D3236] bg-gray-200">
                                  
              <PropertyMap queryObject={queryObject} onClose={handleClosePopupMap} coordinates={coordinates}
              handleAdEdit={handleAdEdit}
               handleAdView={handleAdView} 
               handleCategory={handleCategory}
               handleOpenSell={handleOpenSell}
              handleOpenPlan={handleOpenPlan}/>
                                      </div>
                                      
                                    </div>
                                  </div>
                                   
                                )}


   <SearchTabWindow 
                isOpen={isOpenSearchTab}
                handleSubCategory={handleSubCategory}
                onClose={handleCloseSearchTab}
                categoryList={categoryList}
                subcategoryList={subcategoryList}
                hoveredCategory={hoveredCategory} 
                handleCategory={handleCategory} 
                handleHoverCategory={handleHoverCategory}/>
      <SearchByTitle 
        isOpen={isOpenSearchByTitle}
        userId={userId}
        handleOpenSearchByTitle={handleOpenSearchByTitle}
        onClose={handleCloseSearchByTitle}
        handleAdEdit={handleAdEdit}
        handleAdView={handleAdView}
        handleOpenPlan={handleOpenPlan}
        queryObject={queryObject} />
           <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
      </div>
  );
};

export default MainPage;