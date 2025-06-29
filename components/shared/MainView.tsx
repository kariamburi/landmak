"use client";
import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
//import * as ScrollArea from "@radix-ui/react-scroll-area";

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
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
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
import { DrawerDemo } from "./DrawerDemo";
import { MapIcon, ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { GoogleMap, InfoWindow, Marker, OverlayView, useLoadScript } from "@react-google-maps/api";
import { formatKsh } from "@/lib/help";
import Navbar from "./navbar";
import CardAuto from "./CardAuto";
import HorizontalCard from "./HorizontalCard";
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
  userprofile: any;
  userName: string;
  userImage: string;
  categoryList: any;
  subcategoryList: any;
  packagesList: any;
  AdsCountPerRegion: any;
  loans: any;
  myloans: any;
  collectionType?: "Ads_Organized" | "My_Tickets" | "All_Ads";
};
const options = [
  { value: 'both', label: 'Split View', icon: <Squares2X2Icon className="w-5 h-5" /> },
  { value: 'map', label: 'Map View', icon: <MapIcon className="w-5 h-5" /> },
  { value: 'list', label: 'List View', icon: <ListBulletIcon className="w-5 h-5" /> },
];

const defaultCenter = {
  lat: -1.286389, // Nairobi, Kenya
  lng: 36.817223,
};
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEAPIKEY as string;

const getParcelsFromURL = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const parcels: any[] = [];

  // Loop through all query parameters
  searchParams.forEach((value, key) => {
    if (key.startsWith("parcel")) {
      try {
        const decoded = JSON.parse(decodeURIComponent(value));
        parcels.push(decoded); // Add coordinates array or GeoJSON geometry
      } catch (error) {
        console.error(`Failed to parse ${key}:`, error);
      }
    }
  });

  return parcels;
};
export default function MainView({
  userprofile,
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
  packagesList,
  AdsCountPerRegion,
  loans,
  myloans,

}: CollectionProps) {

  const [newpage, setnewpage] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const [data, setAds] = useState<IdynamicAd[]>([]); // Initialize with an empty array
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [adId, setadId] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showWantedPopup, setShowWantedPopup] = useState(false);
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
  const [coordinates, setCoordinates] = useState<any>([]);
  const [CategorySelect, setCategorySelect] = useState('');
  const [wantedsubcategory, setWantedsubcategory] = useState('');
  const [wantedcategory, setWantedcategory] = useState('');
  const [showCategories, setShowCategories] = useState(true);
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
    setShowWantedPopup(false);
    setIsOpenAbout(false);
    setIsOpenTerms(false);
    setIsOpenPrivacy(false);
    setIsOpenSafety(false);
    setIsOpenBook(false);
    setIsOpenPlan(false);
    setIsOpenChat(false);
    setIsOpenChatId(false);
    setIsOpenReview(false);
    // setIsOpenShop(false);
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
      const coordinates = params.get("parcel1");
      const PrivacyPolicy = params.get("PrivacyPolicy");
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
        const loadedParcels = getParcelsFromURL();

        setCoordinates(loadedParcels)
        setShowPopupMap(true);
      } else {
        setShowPopupMap(false);
      }
      if (PrivacyPolicy) {
        setIsOpenPrivacy(true);
      } else {
        setIsOpenPrivacy(false);
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
    setShowCategories(false);
    setHoveredCategory(null);
    // setShowList(true);
    //setShowMap(false);
  };
  const [isChatOpen, setChatOpen] = useState(false);
  const toggleChat = () => {
    setChatOpen(!isChatOpen);
  };

  const handleOpenSearchTab = (value: string) => {
    handleClose()
    setIsOpenCategory(false);
    setCategorySelect(value);
    setIsOpenSearchTab(true);

  };
  const handleHoverCategory = (value: string) => {
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
    const coordinates = params.get("parcel1");
    const PrivacyPolicy = params.get("PrivacyPolicy");
    if (Profile || Ad || action || coordinates || PrivacyPolicy) {
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
    const coordinates = params.get("parcel1");
    const PrivacyPolicy = params.get("PrivacyPolicy");
    if (Profile || Ad || action || coordinates || PrivacyPolicy) {
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
    const coordinates = params.get("parcel1");
    const PrivacyPolicy = params.get("PrivacyPolicy");
    if (Profile || Ad || action || coordinates || PrivacyPolicy) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
    setrecipientUid('')
    setIsOpenChatId(false);
  };
  const handleOpenChatId = (value: any) => {
    // handleClose();
    setrecipientUid(value)
    setIsOpenChatId(true);

  };

  const handleCloseShop = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const coordinates = params.get("parcel1");
    const PrivacyPolicy = params.get("PrivacyPolicy");
    if (Profile || Ad || action || coordinates || PrivacyPolicy) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }

    setshopId([])
    setIsOpenShop(false);
  };

  const handleOpenShop = (shopId: any) => {
    handleClose();
    console.log(shopId);
    setshopId(shopId)
    setIsOpenShop(true);
  };
  const handleCloseReview = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const coordinates = params.get("parcel1");
    const PrivacyPolicy = params.get("PrivacyPolicy");
    if (Profile || Ad || action || coordinates || PrivacyPolicy) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }
    setrecipient([])
    setIsOpenReview(false);
  };
  const handleOpenReview = (value: any) => {
    handleClose();
    setrecipient(value)
    setIsOpenReview(true);
  };

  const handleCloseChat = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const coordinates = params.get("parcel1");
    const PrivacyPolicy = params.get("PrivacyPolicy");
    if (Profile || Ad || action || coordinates || PrivacyPolicy) {
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
    const coordinates = params.get("parcel1");
    const PrivacyPolicy = params.get("PrivacyPolicy");
    if (Profile || Ad || action || coordinates || PrivacyPolicy) {
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
    const coordinates = params.get("parcel1");
    const PrivacyPolicy = params.get("PrivacyPolicy");
    if (Profile || Ad || action || coordinates || PrivacyPolicy) {
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
    const coordinates = params.get("parcel1");
    const PrivacyPolicy = params.get("PrivacyPolicy");
    if (Profile || Ad || action || coordinates || PrivacyPolicy) {
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
    const coordinates = params.get("parcel1");
    const PrivacyPolicy = params.get("PrivacyPolicy");
    if (Profile || Ad || action || coordinates || PrivacyPolicy) {
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
    const coordinates = params.get("parcel1");
    const PrivacyPolicy = params.get("PrivacyPolicy");
    if (Profile || Ad || action || coordinates || PrivacyPolicy) {
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
    const coordinates = params.get("parcel1");
    const PrivacyPolicy = params.get("PrivacyPolicy");
    if (Profile || Ad || action || coordinates || PrivacyPolicy) {
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
    const coordinates = params.get("parcel1");
    const PrivacyPolicy = params.get("PrivacyPolicy");
    if (Profile || Ad || action || coordinates || PrivacyPolicy) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }

    setIsOpenAbout(false);
  };
  const handleOpenAbout = () => {
    handleClose();
    setIsOpenAbout(true);
  };

  const handlePay = (id: string) => {
    handleClose();
    setTxtId(id);
    setTimeout(() => {
      setIsOpenPay(true);
    }, 500); // Delay in milliseconds (adjust as needed)

  };

  const handleClosePay = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const coordinates = params.get("parcel1");
    const PrivacyPolicy = params.get("PrivacyPolicy");
    if (Profile || Ad || action || coordinates || PrivacyPolicy) {
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
    const coordinates = params.get("parcel1");
    const PrivacyPolicy = params.get("PrivacyPolicy");
    if (Profile || Ad || action || coordinates || PrivacyPolicy) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }

    setadId([]);
    setIsOpenAdEdit(false);
  };

  const handleAdEdit = (id: string) => {
    handleClose();
    setadId(id);
    setIsOpenAdEdit(true);
  };

  const handleCloseAdView = () => {
    const params = new URLSearchParams(window.location.search);
    const ad = params.get("Ad");
    if (ad) {
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
    const coordinates = params.get("parcel1");
    const PrivacyPolicy = params.get("PrivacyPolicy");
    if (Profile || Ad || action || coordinates || PrivacyPolicy) {
      router.push("/", { scroll: false });
    }
    setNewqueryObject([])
    setIsOpenCategory(false);
  };

  const handleOpenSell = (category?: string, subcategory?: string) => {
    handleClose();

    if (category && subcategory) {
      setWantedcategory(category);
      setWantedsubcategory(subcategory);
    }

    setTimeout(() => {
      setIsOpenSell(true);
    }, 500); // Delay in milliseconds (adjust as needed)
  };
  const handleCloseSell = () => {
    const params = new URLSearchParams(window.location.search);
    const Profile = params.get("Profile");
    const Ad = params.get("Ad");
    const action = params.get("action");
    const coordinates = params.get("parcel1");
    const PrivacyPolicy = params.get("PrivacyPolicy");
    if (Profile || Ad || action || coordinates || PrivacyPolicy) {
      router.push("/", { scroll: false });
      setNewqueryObject([])
    }

    setIsOpenSell(false);
  };
  const handleAdView = (ad: any) => {
    handleClose();
    setadId(ad);
    setIsOpenAdView(true);
  };

  const handleFilter = (value: any) => {

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
        subcategory: subcategory.toString(),
      });
      setHoveredCategory(null);
      setIsOpenCategory(true);
      setIsOpenAdView(false);
      setIsOpenSell(false);
    } else {
      if (category) {
        setNewqueryObject({
          ...queryObject, // Preserve existing properties
          category: category.toString(),
        });
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







  const [selectedCategory, setSelectedCategory] = useState(queryObject.subcategory);
  const [distance, setDistance] = useState(200);
  const [showList, setShowList] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");

  const [selectedLandUse, setSelectedLandUse] = useState([]);
  const [ownership, setOwnership] = useState("");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [postedWithin, setPostedWithin] = useState("");
  const [clearQuery, setclearQuery] = useState(false);

  // Toggle property list
  useEffect(() => {
    const isMobile = window.innerWidth < 640; // Tailwind's sm breakpoint

    if (isMobile) {
      setShowCategories(false);
      setShowList(true);
      setShowMap(false); // Show only list on mobile
    } else {
      setShowCategories(true);
      setShowList(true);
      setShowMap(true); // Show both on desktop
    }
  }, []);
  const toggleMap = () => {
    if (!showMap && !showList) setShowList(true); // always show at least one
    setShowMap(!showMap);
  };

  const toggleList = () => {
    if (!showMap && !showList) setShowMap(true);
    setShowList(!showList);
  };


  const toggleMapCommit = () => {
    setShowList(false);
    setShowMap(true);
  };
  const toggleListCommit = () => {
    setShowList(true);
    setShowMap(false);
  };

  //const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const [allAds, setAllAds] = useState<any[]>([]); // All ads fetched from backend
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [selectedAd, setSelectedAd] = useState<any | null>(null);

  const [zoom, setZoom] = useState<number>(12);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places", "geometry", "drawing"],
  });
  const [hasFetched, setHasFetched] = useState(false);
  // Before mount

  // Fetch ads on component mount or when newqueryObject changes
  useEffect(() => {
    fetchAds();
  }, [newqueryObject]); // 🚫 remove radius from dependencies





  const [breakpointColumns, setBreakpointColumns] = useState(1); // Default to 1
  //const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        if (width < 340) {
          setBreakpointColumns(1);
        }
        else if (width < 640) {
          setBreakpointColumns(2);
        } else if (width < 1024) {
          setBreakpointColumns(4);
        } else if (width < 1280) {
          setBreakpointColumns(5);
        } else {
          setBreakpointColumns(6);
        }
      }
    });

    if (viewportRef.current) {
      observer.observe(viewportRef.current);
    }

    return () => {
      if (viewportRef.current) {
        observer.unobserve(viewportRef.current);
      }
    };
  }, []);

  const mapRef = useRef<google.maps.Map | null>(null);
  //const circleRef = useRef<google.maps.Circle | null>(null);

  // Handle circle creation and bounds fit
  useEffect(() => {
    if (!mapRef.current || !mapCenter) return;

    // Remove old circle
    // if (circleRef.current) {
    // circleRef.current.setMap(null);
    //}

    // Create new circle
    //const newCircle = new google.maps.Circle({
    //  center: mapCenter,
    //  radius: distance * 1000, // km to meters
    //  map: mapRef.current,
    //  fillColor: "#4285F4",
    //  fillOpacity: 0.2,
    //  strokeColor: "#4285F4",
    //  strokeOpacity: 1,
    //  strokeWeight: 1,
    //});

    //circleRef.current = newCircle;

    // Fit bounds logic
    const bounds = new google.maps.LatLngBounds();

    if (data.length > 0) {
      // Extend bounds to each marker
      data.forEach((property: any) => {
        bounds.extend(
          new google.maps.LatLng(
            property.data.propertyarea.location.coordinates[1],
            property.data.propertyarea.location.coordinates[0]
          )
        );
      });

      // Also extend to center in case ads are offset
      bounds.extend(new google.maps.LatLng(mapCenter.lat, mapCenter.lng));

      mapRef.current.fitBounds(bounds);
    } else {
      // If no data, fit to the circle's bounds
      //const circleBounds = newCircle.getBounds();
      // if (circleBounds) {
      //  mapRef.current.fitBounds(circleBounds);
      //}
    }
  }, [mapCenter, distance, data]);
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    if (!mapRef.current || !mapCenter) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: mapCenter }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        const components = results[0].address_components;

        let town = "";
        let country = "";

        components.forEach((comp) => {
          if (comp.types.includes("locality")) {
            town = comp.long_name;
          }
          if (comp.types.includes("country")) {
            country = comp.long_name;
          }
        });

        if (town && country) {
          setSelectedAddress(`${town}, ${country}`);
        } else {
          // fallback to formatted_address
          setSelectedAddress(results[0].formatted_address);
        }
      } else {
        setSelectedAddress("Unknown location");
      }
    });

  }, [mapCenter, mapRef.current]);



  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  const handleSelectOpt = (opt: typeof options[number]) => {
    setSelected(opt);
    setOpen(false);
    setShowMap(opt.value === 'map' || opt.value === 'both');
    setShowList(opt.value === 'list' || opt.value === 'both');
  };
  const [priceRange, setPriceRange] = useState<[number, number]>([500000, 20000000]);

  const minPrice = 0;
  const maxPrice = 100_000_000;
  const getRangeGradient = (min: number, max: number) => {
    const startPercent = ((min - minPrice) / (maxPrice - minPrice)) * 100;
    const endPercent = ((max - minPrice) / (maxPrice - minPrice)) * 100;

    return `linear-gradient(to right, #d1d5db ${startPercent}%, #16a34a ${startPercent}%, #16a34a ${endPercent}%, #d1d5db ${endPercent}%)`;
  };






  const [adsCount, setAdsCount] = useState<any>([]);
  const [AdsCountPerVerifiedTrue, setAdsCountPerVerifiedTrue] = useState<any>([]);
  const [AdsCountPerVerifiedFalse, setAdsCountPerVerifiedFalse] = useState<any>([]);
  const [loadingCount, setLoadingCount] = useState<boolean>(true);


  const [landSize, setLandSize] = useState([0, 10000]);
  const now = new Date();
  const [filteredProperties, setFilteredProperties] = useState<IdynamicAd[]>([]);
  const [averagePricePerAcre, setAveragePricePerAcre] = useState(0);
  const [activeButton, setActiveButton] = useState(0);
  const handleButtonClick = (index: number) => {
    setActiveButton(index);

  };

  return (
    <div className="flex bg-[#e4ebeb] flex-col lg:flex-row w-full h-screen overflow-hidden">
      <Head>
        <title>mapa | Buy, Sell & Rent Properties and More in Kenya</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
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
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#e4ebeb] p-0 border-b flex items-center justify-between">
        {showCategories && (
          <div className="w-[360px] hidden lg:inline">

          </div>)}

        <div
          //className={`bg-gradient-to-b from-green-600 to-green-600 lg:from-[#e4ebeb] justify-center pl-2 pr-2 h-[60px] lg:to-[#e4ebeb] transition-all duration-300 overflow-hidden w-full flex flex-col items-center ${showBottomNav ? "max-h-[60px] opacity-100" : "max-h-0 opacity-0"
          //  }`}
          className={`bg-gradient-to-b from-green-600 to-green-600 lg:from-[#e4ebeb] justify-center pl-2 pr-2 h-[60px] lg:to-[#e4ebeb] transition-all duration-300 overflow-hidden w-full flex flex-col items-center`}
        >
          <div className="w-full h-full justify-between flex items-center">
            <div className="flex items-center gap-1">
              <img src="/logo_white.png" alt="Logo" className="w-8 h-8 lg:hidden rounded-full" />
              <img src="/logo.png" alt="Logo" className="w-8 h-8 hidden lg:inline rounded-full" />
              <StyledBrandName />
            </div>

            <div className="flex gap-2 items-center"><div className="hidden lg:inline">
              <div className="flex items-center gap-2">
                <SignedIn>
                  <div
                    className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white hover:bg-gray-100 emerald-500 tooltip tooltip-bottom hover:cursor-pointer"
                    data-tip="Messages"
                    onClick={() => {
                      handleOpenBook();
                    }}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <BookmarkIcon sx={{ fontSize: 16 }} className="" />
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
                    className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white hover:bg-gray-100 tooltip tooltip-bottom hover:cursor-pointer"
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
                    className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white hover:bg-gray-100 tooltip tooltip-bottom hover:cursor-pointer"
                    data-tip="Messages"
                    onClick={() => {
                      handleOpenChat();
                    }}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="relative flex items-center justify-center">
                            <MessageIcon sx={{ fontSize: 16 }} className="absolute " />
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
                            <Unreadmessages userId={userId} popup={"home"} />
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
                  className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-[#131B1E] dark:hover:bg-[#2D3236] bg-white hover:bg-gray-100 tooltip tooltip-bottom hover:cursor-pointer"
                  data-tip="Messages"
                  onClick={() => {
                    handleOpenPlan();
                  }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DiamondIcon sx={{ fontSize: 16 }} className="" />
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
                    <Button onClick={() => {
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

                <MobileNav userstatus={userprofile?.user?.status ?? "User"} userId={userId ?? null} user={userprofile?.user ?? []}
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
        <AppPopup />
      </div>

      {/* Sidebar */}
      {showCategories && (
        <aside className="fixed lg:static top-14 left-0 z-50 bg-white w-[300px] lg:w-[280px] h-[calc(100vh-4rem)] lg:h-[calc(100vh-0rem)] overflow-y-auto p-1 border-r shadow-md lg:shadow-none transform transition-transform duration-300 lg:translate-x-0 translate-x-0 lg:flex flex-col">
          <div className="flex flex-col space-y-0 h-full">
            <div className="flex justify-between items-center w-full">
              <p className="p-4 text-gray-500 font-bold">CATEGORIES</p>


              <button
                onClick={handleSidebarToggle}
                title="Hide Categories"
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-l-full bg-[#e4ebeb] border shadow text-black hover:bg-white transition"
              >
                <KeyboardArrowLeftOutlinedIcon />

              </button>
            </div>
            {/* Scroll Buttons */}
            <div className="relative flex-1 overflow-hidden">

              <ScrollArea
                ref={viewportRef_}
                className="h-full overflow-y-auto text-sm lg:text-base w-full dark:bg-[#2D3236] bg-white rounded-md border p-4">

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
                              if (category.name === "Wanted Ads" ? (category.adCount + loans.adCount) > 0 : category.adCount > 0) {
                                if (category.name !== "Wanted Ads") {
                                  handleCategory(category.name);
                                }

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
                            className={`relative text-black dark:text-[#F1F3F3] flex flex-col items-center justify-center cursor-pointer p-2 border-b dark:border-gray-600 dark:hover:bg-[#131B1E] hover:bg-green-100 ${hoveredCategory === category.name
                              ? "bg-green-100 dark:bg-[#131B1E]"
                              : "dark:bg-[#2D3236] bg-white"
                              } `}
                          >
                            <div className={`flex gap-1 items-center mb-1 h-full w-full`}>
                              <span>
                                <div className="rounded-full dark:bg-[#131B1E] bg-[#e4ebeb] p-2">
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
                                    className={`text-xs font-bold ${category.name === "Wanted Ads" ? (category.adCount + loans.adCount) > 0 : category.adCount > 0
                                      ? ""
                                      : "text-gray-500 dark:text-gray-500"
                                      } `}
                                  >
                                    {category.name}
                                  </h2>
                                  <p
                                    className={`text-xs text-gray-500 dark:text-gray-500`}
                                  >
                                    {category.name === "Wanted Ads" ? (category.adCount + loans.adCount) : category.adCount} ads
                                  </p>
                                </div>
                              </span>
                              <span
                                className={`text-right my-auto ${category.adCount > 0
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
              </ScrollArea>
            </div>
          </div>
        </aside>
      )}
      {/* Main Content */}
      <main className="flex-1 bg-[#e4ebeb] flex flex-col p-2 h-full overflow-hidden pt-[60px]">
        {/* Header */}
        {hoveredCategory && (
          <div
            className={`flex flex-col absolute w-[290px] top-20 z-20 dark:bg-[#2D3236] bg-white p-2 shadow-lg transition-all duration-300`}
            onMouseEnter={() => setHoveredCategory(hoveredCategory)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="text-sm font-bold w-full p-2 text-gray-600">{hoveredCategory}</div>

            <ScrollArea className="h-[450px] w-full">
              {subcategoryList
                .filter((cat: any) => cat.category.name === hoveredCategory)
                .map((sub: any, index: number) => (

                  <div
                    key={index}
                    className="relative dark:bg-[#2D3236] text-black dark:text-[#F1F3F3] bg-white flex flex-col items-center justify-center cursor-pointer p-1 border-b dark:hover:dark:bg-[#131B1E] hover:bg-emerald-100 border-b dark:border-gray-600"
                    onClick={() => {
                      if (hoveredCategory.toString() === "Wanted Ads" ? (sub.adCount + loans.adCount + 1) > 0 : sub.adCount > 0) {


                        if (hoveredCategory.toString() === "Wanted Ads") {
                          setWantedcategory(hoveredCategory);
                          setWantedsubcategory(sub.subcategory);
                          setShowWantedPopup(true); // Show the popup instead
                        } else {
                          handleSubCategory(hoveredCategory, sub.subcategory);
                        }




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
                        <div className="rounded-full dark:bg-[#131B1E] bg-[#e4ebeb] p-2">
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
                            className={`text-xs font-bold ${sub.subcategory?.trim().toLowerCase() === "Property Financing Requests".toLowerCase() ? (sub.adCount + loans.adCount) > 0 : sub.adCount > 0
                              ? ""
                              : "text-gray-500 dark:text-gray-500"
                              } `}
                          >
                            {sub.subcategory}
                          </h2>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {sub.subcategory?.trim().toLowerCase() === "Property Financing Requests".toLowerCase() ? (sub.adCount + loans.adCount) : sub.adCount} ads
                          </p>
                        </div>
                      </span>
                    </div>

                  </div>

                ))}
            </ScrollArea>

          </div>
        )}
        <div className="flex justify-between items-center gap-1 m-1">
          {!showCategories && (<button
            onClick={() => setShowCategories(true)}
            title="Show Categories"
            className="flex hidden lg:inline items-center gap-1 px-3 py-1.5 text-sm rounded-r-full bg-white border shadow text-black hover:bg-gray-100 transition"
          >
            <KeyboardArrowRightOutlinedIcon />

          </button>)}
          <div className="flex hidden lg:inline items-center gap-1 flex-wrap justify-start items-center mb-0">

            {showList &&
              (<div className="flex items-center gap-1">
                <div
                  className={`flex gap-1 items-center text-xs dark:bg-[#2D3236] bg-white rounded-sm p-1 cursor-pointer ${activeButton === 0 ? "text-[#30AF5B]" : "text-gray-500"
                    }`}
                  onClick={() => handleButtonClick(0)}
                >
                  <ViewModuleIcon />

                </div>
                <div
                  className={`flex gap-1 items-center text-xs dark:bg-[#2D3236] bg-white rounded-sm p-1 cursor-pointer ${activeButton === 1 ? "text-[#30AF5B]" : "text-gray-500"
                    }`}
                  onClick={() => handleButtonClick(1)}
                >
                  <ViewListIcon />

                </div>
              </div>)
            }


          </div>
          <HeaderMain handleFilter={handleFilter} handleOpenPlan={handleOpenPlan} AdsCountPerRegion={AdsCountPerRegion} queryObject={newqueryObject}
            handleAdEdit={handleAdEdit}
            handleAdView={handleAdView}
            handleCategory={handleCategory}
            handleOpenSell={handleOpenSell}
            handleOpenSearchByTitle={handleOpenSearchByTitle}
            userName={userName}
            userImage={userImage}
          />
          <div className="relative hidden lg:inline w-48 text-sm">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-between w-full px-4 py-2 border rounded bg-white shadow-sm"
            >
              <span className="flex items-center gap-2">
                {selected.icon}
                {selected.label}
              </span>
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {open && (
              <ul className="absolute mt-1 w-full bg-white border rounded shadow z-50">
                {options.map((opt) => (
                  <li
                    key={opt.value}
                    onClick={() => handleSelectOpt(opt)}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    {opt.icon}
                    {opt.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>


        <div className="relative flex-1 overflow-hidden">
          {/* Toggle Button */}

          {/* Dynamic Layout */}
          <div
            className="grid gap-4 h-full transition-all duration-300 relative"
            style={{
              gridTemplateColumns:
                showList && showMap
                  ? '1fr 1fr'
                  : showList || showMap
                    ? '1fr'
                    : '0fr',
            }}
          >
            {/* Property List */}
            <div
              ref={viewportRef}
              className={`relative transition-all b-white rounded-sm lg:p-1 duration-300 overflow-y-auto ${showList ? 'block' : 'hidden'
                }`}
            >
              <style jsx>{`
    @media (max-width: 1024px) {
      div::-webkit-scrollbar {
        display: none;
      }
    }
  `}</style>
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
                  handlePayNow={handlePay}
                  userId={userId}
                  loans={loans}
                  user={userprofile}
                  packagesList={packagesList}
                />
              </div>
              <div className="flex w-full lg:hidden justify-between items-center p-1">

                <div className="flex items-center gap-1">
                  <div
                    className={`flex gap-1 items-center text-xs dark:bg-[#2D3236] bg-white rounded-sm p-1 cursor-pointer ${activeButton === 0 ? "text-[#30AF5B]" : "text-gray-500"
                      }`}
                    onClick={() => handleButtonClick(0)}
                  >
                    <ViewModuleIcon />

                  </div>
                  <div
                    className={`flex gap-1 items-center text-xs dark:bg-[#2D3236] bg-white rounded-sm p-1 cursor-pointer ${activeButton === 1 ? "text-[#30AF5B]" : "text-gray-500"
                      }`}
                    onClick={() => handleButtonClick(1)}
                  >
                    <ViewListIcon />

                  </div>

                </div>



                <div className="font-bold text-xl text-gray-700">Featured Properties</div>
              </div>

              {data?.length > 0 ? (<>

                <Masonry
                  breakpointCols={activeButton === 0 ? breakpointColumns : 1}
                  className="flex mt-2 lg:mt-0 gap-1 lg:gap-4 min-h-screen"
                  columnClassName="bg-clip-padding"
                >
                  {data.map((ad: any, index: number) => {
                    let isAdCreator;
                    if (ad.loanterm) {
                      isAdCreator = userId === ad.userId._id.toString();
                    } else {
                      isAdCreator = userId === ad.organizer._id.toString();
                    }

                    if (data.length === index + 1) {
                      return (
                        <div

                          key={ad._id}
                          className="flex justify-center"
                        >
                          {/* Render Ad */}
                          {activeButton === 1 ? (
                            <HorizontalCard
                              ad={ad}
                              userId={userId}
                              isAdCreator={isAdCreator}
                              handleAdEdit={handleAdEdit}
                              handleAdView={handleAdView}
                              handleOpenPlan={handleOpenPlan}
                              handleOpenChatId={handleOpenChatId}
                              userName={userName}
                              fullview={breakpointColumns}
                              userImage={userImage}
                            />) : (<CardAuto
                              ad={ad}
                              hasOrderLink={true}
                              hidePrice={true}
                              userId={userId}
                              userName={userName}
                              userImage={userImage}
                              handleAdEdit={handleAdEdit}
                              handleAdView={handleAdView}
                              handleOpenPlan={handleOpenPlan}
                              handleOpenChatId={handleOpenChatId}
                            />)}
                        </div>
                      );
                    } else {
                      return (
                        <div key={ad._id} className="flex justify-center">
                          {/* Render Ad */}
                          {activeButton === 1 ? (

                            <HorizontalCard
                              ad={ad}
                              userId={userId}
                              isAdCreator={isAdCreator}
                              handleAdEdit={handleAdEdit}
                              handleAdView={handleAdView}
                              handleOpenPlan={handleOpenPlan}
                              handleOpenChatId={handleOpenChatId}
                              userName={userName}
                              userImage={userImage}
                              fullview={breakpointColumns}
                            />) : (
                            <CardAuto
                              ad={ad}
                              hasOrderLink={true}
                              hidePrice={true}
                              userId={userId}
                              userName={userName}
                              userImage={userImage}
                              handleAdEdit={handleAdEdit}
                              handleAdView={handleAdView}
                              handleOpenPlan={handleOpenPlan}
                              handleOpenChatId={handleOpenChatId}
                            />)}
                        </div>
                      );
                    }
                  })}
                </Masonry>

              </>) : (
                loading === false && (
                  <>
                    <div className="flex items-center h-full w-full flex-col gap-1 rounded-sm bg-white py-28 text-center">
                      <h3 className="font-semibold mb-2">{newqueryObject.category === 'Property services' ? (<>Service Providers</>) : (<>Properties</>)} within Kenya</h3>
                      <p className="text-sm text-gray-500">No {newqueryObject.category === 'Property services' ? (<>Service Providers</>) : (<>Properties</>)} found.</p>
                      <SignedIn>

                        <Button onClick={() => {

                          handleOpenSell();
                          //router.push("/ads/create");

                        }} variant="default">
                          <AddOutlinedIcon sx={{ fontSize: 16 }} /> Create Ad
                        </Button>

                      </SignedIn>

                      <SignedOut>
                        <Button onClick={() => {
                          // setIsOpenP(true);
                          router.push("/sign-in");
                        }} variant="outline">
                          <AddOutlinedIcon sx={{ fontSize: 16 }} /> Create Ad
                        </Button>


                      </SignedOut>
                    </div>
                  </>
                )
              )}

              <FloatingChatIcon onClick={toggleChat} isOpen={isChatOpen} />
              <ChatWindow
                isOpen={isChatOpen}
                onClose={toggleChat}
                senderId={userId || ''}
                senderName={userName || ''}
                senderImage={userImage || ''}
                recipientUid={AdminId}
                handleAdEdit={handleAdEdit}
                handleAdView={handleAdView}
                handleCategory={handleCategory}
                handleOpenSell={handleOpenSell}
                handleOpenPlan={handleOpenPlan}
              />


              {loading && (
                <div>
                  {isInitialLoading ? (
                    <div className={`grid grid-cols-${breakpointColumns} gap-2`}>
                      {Array.from({ length: 12 }).map((_, index) => (
                        <div key={index} className="bg-white dark:bg-[#2D3236] p-4 rounded-md shadow-md w-full">
                          <Skeleton variant="rectangular" width="100%" height={140} />
                          <Skeleton variant="text" width="80%" height={30} className="mt-2" />
                          <Skeleton variant="text" width="60%" height={25} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full rounded-sm bg-white h-full flex flex-col items-center justify-center">
                      <h3 className="font-semibold mb-2">{newqueryObject.category === 'Property services' ? (<>Service Providers</>) : (<>Properties</>)} within Kenya</h3>
                      <Image
                        src="/assets/icons/loading2.gif"
                        alt="loading"
                        width={40}
                        height={40}
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              )}
              {/* Floating Map Button - Only on mobile */}
              {showList && !showMap && (
                <button
                  className="fixed items-center flex gap-1 bottom-[60px] right-4 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg sm:hidden"
                  onClick={() => toggleMapCommit()}
                >
                  <MapIcon className="w-5 h-5" /> View Map
                </button>
              )}
              <div className="hidden lg:inline">
                <Footersub
                  handleOpenAbout={handleOpenAbout}
                  handleOpenTerms={handleOpenTerms}
                  handleOpenPrivacy={handleOpenPrivacy}
                  handleOpenSafety={handleOpenSafety}
                />
              </div>
            </div>

            {/* Map View */}
            <div
              className={`relative ${showBottomNav ? "mb-10 lg:mb-0" : "mb-0"} transition-all lg:rounded-xl shadow-md border duration-300 overflow-hidden ${showMap ? 'block' : 'hidden'
                }`}
            >
              {isLoaded ? (<><GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={mapCenter}
                zoom={zoom}
                onLoad={(map) => {
                  mapRef.current = map;
                }}
                options={{
                  zoomControl: true, // Enable zoom controls
                  mapTypeControl: true, // Enable map type switch
                  streetViewControl: false, // Enable Street View control
                  fullscreenControl: true, // Enable Fullscreen button
                  mapTypeId: "hybrid", // Hybrid = Satellite + Labels
                  zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_CENTER, // Places zoom control at the bottom-right
                  },
                  // streetViewControlOptions: {
                  //  position: google.maps.ControlPosition.LEFT_CENTER,
                  // },
                }}
                onClick={(e) => {
                  setMapCenter({ lat: e.latLng?.lat() || 0, lng: e.latLng?.lng() || 0 });
                }
                }
              >


                {data.map((property: any) => (
                  <Marker
                    key={property.id}
                    onClick={() => setSelectedAd(property)}
                    position={{
                      lat: property.data.propertyarea.location.coordinates[1], // Latitude should be at index 1
                      lng: property.data.propertyarea.location.coordinates[0], // Longitude should be at index 0
                    }}
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png", // Green marker
                    }}
                  />

                ))}


                {/* InfoWindow for selected ad */}
                {selectedAd && (
                  <InfoWindow
                    position={{
                      lat: selectedAd.data.propertyarea.location.coordinates[1], // Latitude should be at index 1
                      lng: selectedAd.data.propertyarea.location.coordinates[0], // Longitude should be at index 0
                    }}
                    onCloseClick={() => setSelectedAd(null)}
                  >
                    <div
                      onClick={() => {

                        handleAdView(selectedAd);
                      }}
                      className="relative bg-green-600 flex cursor-pointer items-center justify-center p-0 w-[150px] h-[100px] rounded-lg bg-cover bg-center text-white"
                      style={{ backgroundImage: `url(${selectedAd.data.imageUrls[0]})` }}
                    >
                      <div
                        onClick={() => {

                          handleAdView(selectedAd);
                        }}
                        className="absolute cursor-pointer inset-0 bg-black/50 rounded-lg"
                      ></div>
                      <div className="relative cursor-pointer z-10 flex flex-col items-start p-2">
                        <div
                          onClick={() => {

                            handleAdView(selectedAd);
                          }}
                          className=" text-xs text-white">
                          {selectedAd.data.title}
                        </div>
                        <b className="text-xs font-semibold text-white">
                          {formatKsh(selectedAd.data.price)}
                        </b>
                      </div>
                    </div>
                  </InfoWindow>
                )}


              </GoogleMap>
              </>) : (<> <div className="absolute inset-0 z-5 flex items-center justify-center bg-white/70">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-800" />
                <span className="ml-2 text-gray-700 font-medium">Loading map...</span>
              </div></>)}

              {/* Back to List Button */}
              {showMap && !showList && (
                <button
                  className="flex items-center gap-1 absolute bottom-5 left-4 bg-white text-black px-3 py-1 rounded shadow"
                  onClick={() => toggleListCommit()}
                >
                  ← Back to List <ListBulletIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>


      </main>
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
        user={userprofile?.user ?? []}
        loans={loans}
        handleOpenChatId={handleOpenChatId}
      />

      <PopupShop isOpen={isOpenShop} handleOpenReview={handleOpenReview} onClose={handleCloseShop} userId={userId} shopAcc={shopId} userName={userName} userImage={userImage} queryObject={newqueryObject} handleOpenSell={handleOpenSell} handleAdView={handleAdView} handleAdEdit={handleAdEdit} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat} handleOpenChatId={handleOpenChatId} handleOpenSettings={handleOpenSettings}
        handleOpenShop={handleOpenShop}
        handleOpenPerfomance={handleOpenPerfomance}
        handlePay={handlePay} user={userprofile}
        loans={myloans} />

      <PopupSell isOpen={isOpenSell} onClose={handleCloseSell} category={wantedcategory} subcategory={wantedsubcategory} type={"Create"} userId={userId} userName={userName} handleOpenSell={handleOpenSell} handlePay={handlePay} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat} handleCategory={handleCategory}
        handleOpenShop={handleOpenShop}
        handleOpenPerfomance={handleOpenPerfomance}
        handleOpenSettings={handleOpenSettings}
        handleOpenSearchTab={handleOpenSearchTab}
        handleAdView={handleAdView}
        packagesList={packagesList}
        subcategoryList={subcategoryList}
        user={userprofile}
        userImage={userImage}
      />

      <PopupAdEdit isOpen={isOpenAdEdit} onClose={handleCloseAdEdit} type={"Update"} userId={userId} userName={userName} ad={adId} handleOpenSell={handleOpenSell} handleAdView={handleAdView} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
        handleOpenShop={handleOpenShop}
        handleOpenPerfomance={handleOpenPerfomance}
        handleOpenSettings={handleOpenSettings}
        handleCategory={handleCategory}
        subcategoryList={subcategoryList}
        user={userprofile}
        packagesList={packagesList}
        userImage={userImage} />

      <PopupAdView isOpen={isOpenAdView} onClose={handleCloseAdView} userId={userId} userName={userName} userImage={userImage} ad={adId} handleOpenSell={handleOpenSell} handleAdView={handleAdView} handleAdEdit={handleAdEdit} handleSubCategory={handleSubCategory} type={"Create"} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat} handleOpenReview={handleOpenReview} handleOpenShop={handleOpenShop} handleOpenChatId={handleOpenChatId}
        handleOpenSettings={handleOpenSettings}
        handleOpenPerfomance={handleOpenPerfomance}
        handleCategory={handleCategory}
        handlePay={handlePay}
        user={userprofile?.user ?? []} />

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
        user={userprofile?.user ?? []}
        userName={userName}
        userImage={userImage} />

      <PopupPerfomance isOpen={isOpenPerfomance} onClose={handleClosePerfomance} userId={userId} handleOpenSell={handleOpenSell} handleAdEdit={handleAdEdit} handleAdView={handleAdView} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat} userName={userName} userImage={userImage}
        handleOpenPerfomance={handleOpenPerfomance}
        handleCategory={handleCategory}
        handleOpenShop={handleOpenShop}
        handleOpenChatId={handleOpenChatId}
        handleOpenSettings={handleOpenSettings}
        handlePay={handlePay}
        handleOpenReview={handleOpenReview}
        user={userprofile} />

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
        packagesList={packagesList}
        user={userprofile} />

      <PopupChat isOpen={isOpenChat} onClose={handleCloseChat} handleOpenChatId={handleOpenChatId} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} userImage={userImage} userName={userName} handleOpenChat={handleOpenChat} handleOpenSettings={handleOpenSettings} handleCategory={handleCategory} handleOpenReview={handleOpenReview}
        handleOpenPerfomance={handleOpenPerfomance}
        handleOpenShop={handleOpenShop}
        handlePay={handlePay} handleOpenSearchTab={handleOpenSearchTab}
        user={userprofile?.user ?? []} />

      <PopupChatId isOpen={isOpenChatId} onClose={handleCloseChatId} recipientUid={recipientUid} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} userImage={userImage} userName={userName} handleOpenChat={handleOpenChat} handleOpenShop={handleOpenShop} handleOpenChatId={handleOpenChatId}
        handleOpenPerfomance={handleOpenPerfomance}
        handleOpenSettings={handleOpenSettings}
        handleCategory={handleCategory}
        handleAdEdit={handleAdEdit}
        handleAdView={handleAdView}
        handleOpenSearchTab={handleOpenSearchTab}
        user={userprofile?.user ?? []} />

      <PopupReviews isOpen={isOpenReview} onClose={handleCloseReview} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} userImage={userImage} userName={userName} handleOpenChat={handleOpenChat} recipient={recipient} handleOpenSettings={handleOpenSettings} handleOpenChatId={handleOpenChatId} handleOpenReview={handleOpenReview}
        handleOpenPerfomance={handleOpenPerfomance}
        handleOpenShop={handleOpenShop}
        handleCategory={handleCategory}
        handlePay={handlePay}
        user={userprofile?.user ?? []} />


      <PopupSettings isOpen={isOpenProfile} onClose={handleCloseProfile} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
        handleOpenPerfomance={handleOpenPerfomance}
        handleOpenSettings={handleOpenSettings}
        handleCategory={handleCategory}
        handlePay={handlePay}
        handleOpenShop={handleOpenShop}
        user={userprofile?.user ?? []}
        handleOpenSearchTab={handleOpenSearchTab} />

      <PopupAccount isOpen={isOpenSettings} onClose={handleCloseSettings} userId={userId} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
        handleOpenPerfomance={handleOpenPerfomance}
        handleOpenSettings={handleOpenSettings}
        handleCategory={handleCategory}
        handlePay={handlePay}
        handleOpenShop={handleOpenShop}
        user={userprofile?.user ?? []}
        handleOpenSearchTab={handleOpenSearchTab}
        handleOpenProfile={handleOpenProfile}
        handleOpenFaq={handleOpenFaq}
        userImage={userImage}
        userName={userName}
        handleAdEdit={handleAdEdit}
        handleAdView={handleAdView}
        handleOpenReview={handleOpenReview} />

      <PopupPay txtId={txtId} isOpen={isOpenPay} onClose={handleClosePay} userId={userId} userName={userName} handleOpenSell={handleOpenSell} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
        handleOpenPerfomance={handleOpenPerfomance}
        handleOpenSettings={handleOpenSettings}
        handleCategory={handleCategory}
        handleOpenShop={handleOpenShop}
        handleOpenChatId={handleOpenChatId}
        user={userprofile?.user ?? []} />

      <PopupAbout isOpen={isOpenAbout} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} onClose={handleCloseAbout} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
        handleOpenPerfomance={handleOpenPerfomance}
        handleOpenSettings={handleOpenSettings}
        handleOpenShop={handleOpenShop}
        user={userprofile?.user ?? []} />

      <PopupTerms isOpen={isOpenTerms} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} onClose={handleCloseTerms} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
        handleOpenPerfomance={handleOpenPerfomance}
        handleOpenSettings={handleOpenSettings}
        handleOpenShop={handleOpenShop}
        user={userprofile?.user ?? []}
      />

      <PopupPrivacy isOpen={isOpenPrivacy} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} onClose={handleClosePrivacy} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
        handleOpenPerfomance={handleOpenPerfomance}
        handleOpenSettings={handleOpenSettings}
        handleOpenShop={handleOpenShop}
        user={userprofile?.user ?? []}
      />

      <PopupSafety isOpen={isOpenSafety} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} onClose={handleCloseSafety} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
        handleOpenShop={handleOpenShop}
        handleOpenPerfomance={handleOpenPerfomance}
        handleOpenSettings={handleOpenSettings}
        user={userprofile?.user ?? []}
      />

      <PopupFaq isOpen={isOpenFaq} onClose={handleCloseFaq} handleOpenAbout={handleOpenAbout} handleOpenTerms={handleOpenTerms} handleOpenPrivacy={handleOpenPrivacy} handleOpenSafety={handleOpenSafety} userId={userId} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
        handleOpenShop={handleOpenShop}
        handleOpenPerfomance={handleOpenPerfomance}
        handleOpenSettings={handleOpenSettings}
        user={userprofile?.user ?? []}
      />

      {showPopupMap && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#e4ebeb] z-50">
          <div className="dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 bg-[#e4ebeb] p-2 w-full items-center justify-center relative">

            <div className="flex flex-col items-center justify-center dark:bg-[#2D3236] bg-[#e4ebeb]">

              <PropertyMap queryObject={queryObject} onClose={handleClosePopupMap} Parcels={coordinates}
                handleAdEdit={handleAdEdit}
                handleAdView={handleAdView}
                userName={userName}
                userImage={userImage}
                handleCategory={handleCategory}
                handleOpenSell={handleOpenSell}
                handleOpenPlan={handleOpenPlan}
              />
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
        handleHoverCategory={handleHoverCategory} />
      <SearchByTitle
        isOpen={isOpenSearchByTitle}
        userId={userId}
        handleOpenSearchByTitle={handleOpenSearchByTitle}
        onClose={handleCloseSearchByTitle}
        handleAdEdit={handleAdEdit}
        handleAdView={handleAdView}
        handleOpenPlan={handleOpenPlan}
        handleOpenChatId={handleOpenChatId}
        queryObject={queryObject}
        userName={userName}
        userImage={userImage} />
      <DrawerDemo
        handleOpenSell={handleOpenSell}
        handlePayNow={handlePay}
        userId={userId}
        category={wantedcategory}
        subcategory={wantedsubcategory}
        user={userprofile}
        isOpen={showWantedPopup}
        packagesList={packagesList}
        onClose={handleClose}
        handleSubCategory={handleSubCategory} />
      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
      <footer>


        <div
          className={`lg:hidden fixed bottom-0 left-0 right-0 transition-transform duration-300 ${showBottomNav ? "translate-y-0" : "translate-y-full"
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

  );
}

























































































































































