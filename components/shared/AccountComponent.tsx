"use client"
import Navbar from "@/components/shared/navbar";
import { getUserById } from "@/lib/actions/user.actions";
import { Toaster } from "@/components/ui/toaster";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { auth } from "@clerk/nextjs/server";
import Verification from "@/components/shared/Verification";
import Image from "next/image";
import BottomNavigation from "@/components/shared/BottomNavigation";
import Footersub from "@/components/shared/Footersub";
import SettingsEdit from "./SettingsEdit";
import { FC, useEffect, useState } from "react";
import { AdminId, mode } from "@/constants";
import { ScrollArea } from "../ui/scroll-area";
import NotificationPreferences from "./NotificationPreferences";
import { Bell, HelpCircle, Gem , Users, BarChart, Settings, MessageCircle, Heart, PlusSquare, Home } from 'lucide-react';
import { getData } from "@/lib/actions/transactions.actions";
import { Icon } from "@iconify/react";
import Barsscale from "@iconify-icons/svg-spinners/bars-scale"; 
import { getAdByUser } from "@/lib/actions/dynamicAd.actions";
import { IdynamicAd } from "@/lib/database/models/dynamicAd.model";
import { collection, getDocs, onSnapshot, query, Timestamp, where } from "@firebase/firestore";
import { db } from "@/lib/firebase";
import ChatWindow from "./ChatWindow";
import ProgressPopup from "./ProgressPopup";
interface Review {
  text: string;
  name: string;
  avatar: string;
  createdAt: Timestamp; // Assuming createdAt is a Firestore timestamp
  uid: string;
  recipientUid: string;
  starClicked: boolean[];
}
type setingsProp = {
  userId: string;
  user: any;
  handleOpenSell:() => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  onClose:() => void;
  handleOpenAbout:() => void;
  handleOpenTerms: () => void;
handleOpenPrivacy: () => void;
handleOpenSafety: () => void;
handleOpenSettings: () => void;
handleOpenProfile: () => void;
  handleOpenShop: (shopId:any) => void;
  handlePay: (id:string) => void;
  handleCategory: (value:string) => void;
  handleOpenPerfomance: () => void;
  handleOpenFaq: () => void;
  handleOpenSearchTab: (value:string) => void;
  handleOpenReview: (value:any) => void;
  userName:string;
  userImage:string;
  handleAdEdit: (value:any) => void;
  handleAdView: (value:any) => void;
};

const AccountComponent = ({userId, user, userName,
  userImage,
  handleAdEdit,
  handleAdView, onClose, handleOpenReview, handleOpenSearchTab,
  handleOpenShop,
  handleOpenPerfomance, 
  handleOpenSettings,
  handleOpenSell,
  handleOpenBook,
  handleOpenChat,
  handlePay,
  handleOpenProfile,
  handleCategory,
  handleOpenFaq,
  handleOpenPlan, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety}:setingsProp) => {
 
 
 
 
    const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
 const [daysRemaining, setDaysRemaining] = useState(0);
 const [remainingAds, setRemainingAds] = useState(0);
  const [planPackage, setPlanPackage] = useState("Free");
  const [color, setColor] = useState("#000000");
  const [loadingSub, setLoadingSub] = useState(false);
  const [loading, setLoading] = useState(false);
   const [data, setAds] = useState<IdynamicAd[]>([]); // Initialize with an empty array
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const isAdCreator = true;
    const [isChatOpen, setChatOpen] = useState(false);
    const [isOpenP, setIsOpenP] = useState(false);
      const handleCloseP = () => {
        setIsOpenP(false);
      };
      const handleOpenP = () => {
        setIsOpenP(true);
      };
      const toggleChat = () => {
        setChatOpen(!isChatOpen);
      };
  
  useEffect(() => {
   
      const fetchData = async () => {
        try {
          setLoadingSub(true);
          const subscriptionData = await getData(userId);
      
          if (subscriptionData) {
         
            const listedAds = subscriptionData.ads || 0;
            if (subscriptionData.currentpack && !Array.isArray(subscriptionData.currentpack)) {
              
              setRemainingAds(subscriptionData.currentpack.list - listedAds);
           
              setColor(subscriptionData.currentpack.color);
              setPlanPackage(subscriptionData.currentpack.name);
           
            const createdAtDate = new Date(subscriptionData.transaction?.createdAt || new Date());
            const periodDays = parseInt(subscriptionData.transaction?.period) || 0;
            const expiryDate = new Date(createdAtDate.getTime() + periodDays * 24 * 60 * 60 * 1000);
          
            const currentDate = new Date();
            const remainingDays = Math.ceil((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
            setDaysRemaining(remainingDays);
          
          } else {
            console.warn("No current package found for the user.");
          }
          }
        } catch (error) {
          console.error("Failed to fetch data", error);
        } finally {
       
          setLoadingSub(false);
        }
      };
      fetchData();
  
  }, []);

 
const fetchAds = async () => {
  setLoading(true);
    try {
      const organizedAds = await getAdByUser({
        userId,
        page,
        sortby:'recommeded',
        myshop: isAdCreator,
      });

      // Update ads state using the latest prevAds for filtering
      setAds((prevAds: IdynamicAd[]) => {
        const existingAdIds = new Set(prevAds.map((ad) => ad._id));

        // Filter out ads that are already in prevAds
        const newAds = organizedAds?.data.filter(
          (ad: IdynamicAd) => !existingAdIds.has(ad._id)
        );

        return [...prevAds, ...newAds]; // Return updated ads
      });
      setTotalPages(organizedAds?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching ads", error);
    } finally {
      setLoading(false);
     
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const [loadingNoti, setLoadingNoti] = useState(false);
 const [unreadCount, setUnreadCount] = useState<number>(0);
  useEffect(() => {
    const getLastMessagesInConversations = async () => {
      try {
        //  const unreadMessages: any = {};
        setLoadingNoti(true);
        const messagesQuery = query(
          collection(db, "messages"),
          where("recipientUid", "==", userId),
          where("read", "==", "1")
        );
        const querySnapshot = await getDocs(messagesQuery);
        let k: number = 0;
        querySnapshot.forEach((doc) => {
          const message = doc.data();
          // unreadMessages[message.id] = message;
          k = k + 1;
        });
        // alert(k);
        return k;
      } catch (error) {
        console.error("Error getting last messages:", error);
        return 0;
      }
    };

    getLastMessagesInConversations()
      .then((k) => {
        console.log("Number of unread messages:", k);
        setUnreadCount(k);
        setLoadingNoti(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoadingNoti(false);
      });
  }, [userId]); // Depen

  const [loadingMyclient, setLoadingMyclient] = useState(false);
  const [myclientCount, setMyclientCount] = useState<number>(0);
  useEffect(() => {
    const getUniqueUnreadSenders = async () => {
      try {
        setLoadingMyclient(true)
        const messagesQuery = query(
          collection(db, "messages"),
          where("recipientUid", "==", userId)
        );

        const querySnapshot = await getDocs(messagesQuery);

        const senderUids = new Set<string>();

        querySnapshot.forEach((doc) => {
          const message = doc.data();
          if (message.uid && !senderUids.has(message.uid)) {
            senderUids.add(message.uid);
          }
        });

        setMyclientCount(senderUids.size);
        setLoadingMyclient(false)
      } catch (error) {
        console.error("Error getting unique unread senders:", error);
        setMyclientCount(0); // fallback
        setLoadingMyclient(false)
      }
    };

    if (userId) {
      getUniqueUnreadSenders();
    }
  }, [userId]);


  const [loadingReview, setLoadingReview] = useState(true);
  const [reviewCount, setReviewCount] = useState(0); // Add this
  const [messages, setMessages] = useState<Review[]>([]);
useEffect(() => {
  setLoadingReview(true); // Ensure loading starts when fetching data

  try {
    const senderMessagesQuery = query(
      collection(db, "reviews"),
      where("recipientUid", "==", userId),
     // limit(100)
    );

    const unsubscribe = onSnapshot(
      senderMessagesQuery,
      (snapshot) => {
        const senderMessages: Review[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Review), // Cast to the Review type
        }));

        // Sort messages by createdAt timestamp
        senderMessages.sort((a, b) => {
          const createdAtA = a.createdAt ? a.createdAt.toMillis() : 0;
          const createdAtB = b.createdAt ? b.createdAt.toMillis() : 0;
          return createdAtA - createdAtB;
        });

        setReviewCount(senderMessages.length); // 👈 Update the count
        setLoadingReview(false); // Set loading to false only after data is retrieved
      },
      (error) => {
        console.error("Error getting last messages:", error);
        setLoadingReview(false);
      }
    );

    return () => unsubscribe();
  } catch (error) {
    console.error("Error setting up listener:", error);
    setLoadingReview(false);
  }
}, []);




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
    
  
  return (
      <ScrollArea className="h-[100vh] bg-gray-200 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
       
      <div className="top-0 z-10 fixed w-full">
                              <Navbar user={user} userstatus={user.status} userId={userId} onClose={onClose} popup={"settings"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                              handleOpenPerfomance={handleOpenPerfomance}
                              handleOpenSettings={handleOpenSettings}
                              handleOpenAbout={handleOpenAbout}
                              handleOpenTerms={handleOpenTerms}
                              handleOpenPrivacy={handleOpenPrivacy}
                              handleOpenSafety={handleOpenSafety} 
                              handleOpenShop={handleOpenShop}/>
                             </div>
      <div className="max-w-3xl mx-auto flex mt-[60px] p-1 min-h-screen">
        <div className="hidden lg:inline mr-5"></div>

        <div className="flex-1">
          <div className="w-full lg:max-w-6xl lg:mx-auto lg:mb-3  rounded-xl p-1 lg:p-3 mb-20 justify-center">
          <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center">
            {/* Placeholder avatar */}
           
              <Image
                className="w-full h-full rounded-full object-cover"
                src={user.photo ?? "/avator.png"}
                alt="Avator"
                width={100}
                height={100}
              />
          
          </div>
          <div className="flex flex-col">
          <span className="ml-2 font-semibold text-lg">{user.firstName} {user.lastName}</span>
      <div className="flex">
                        <Verification
                          user={user}
                          fee={user.fee}
                          userId={userId}
                          isAdCreator={isAdCreator}
                          handlePayNow={handlePay}
                        />
                      </div> </div>
        </div>
        <Settings onClick={()=> handleOpenProfile()} className="h-5 w-5 cursor-pointer hover:text-green-600" />
      </div>
         
<div className="p-1 lg:p-4 dark:bg-[#2D3236] bg-white mt-2 border rounded-sm shadow-sm w-full space-y-3">
     
             {/* Grid Menu */}
                 <div className="grid grid-cols-2 gap-4 p-4">
                   <Card icon={<MessageCircle />} loading={loading} label={`My ads • ${data.length > 0 ? data.length : 0}`}/>
                  {/* <Card icon={<Star />} label="Pro Sales" />*/} 
                   <Card icon={<Users />} loading={loadingMyclient} handleClick={handleOpenChat} label={`My clients • ${myclientCount > 0 ? myclientCount : 0}`}/>
                   <Card icon={<Gem />} label="Premium Services"  handleClick={handleOpenPlan} />
                   <Card icon={<BarChart />} label="Performance" handleClick={handleOpenPerfomance}/>
                   <Card icon={<HelpCircle />} label="Request help" handleClick={toggleChat}/>
                   <Card icon={<Bell />} label="Notifications" loading={loadingNoti} notificationCount={unreadCount} handleClick={handleOpenChat}/>
                   <Card icon={<MessageCircle />} label="Feedback" loading={loadingReview} notificationCount={reviewCount} handleClick={() => handleOpenReview(user)}/>
                  {/*  <Card icon={<Users />} label="Followers" />*/}
                   <Card icon={<HelpCircle />} label="FAQ"  handleClick={handleOpenFaq}/>
                  {/*  <Card icon={<HelpCircle />} label="Game centre" />*/}
                  </div>
                  <div className="grid grid-cols-1  pl-4 pr-4 pb-4">  
    <div  className="cursor-pointer bg-gray-100 dark:bg-gray-800 p-3 rounded-xl flex flex-col justify-between h-20 relative">
    {loadingSub ? (<><Icon icon={Barsscale} className="w-6 h-6 text-gray-500" /></>):(<>
    
      <div className="flex items-center space-x-2">
      <div className="hidden lg:inline"><Gem /></div>
      <div className="text-sm items-center flex gap-1"><div className="h-3 w-3 rounded-full bg-green-600"></div> <div className="hidden lg:inline">Active:</div> {planPackage} Plan</div>
   
    </div>
   {planPackage !=='Free' && (<><div className="text-xs text-gray-500">{daysRemaining} Days Left</div></>)} 
   <div className="text-xs text-gray-500">{remainingAds} Ads remaining</div>
   
   <span  onClick={()=> handleOpenPlan()} className="absolute underline hover:bg-green-700 top-1 right-1 text-xs bg-green-600 text-white px-1.5 py-0.5 rounded-sm"> Upgrade</span>
  
   </>)}
   
  </div>
  
  </div>
            
            
            </div>
            <Toaster />
             <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
          </div>
        </div>
      </div>
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
      <footer>
        <div className="hidden lg:inline">
          <Footersub 
                  handleOpenAbout={handleOpenAbout}
                  handleOpenTerms={handleOpenTerms}
                   handleOpenPrivacy={handleOpenPrivacy}
                   handleOpenSafety={handleOpenSafety}/> 
        </div>
        <div
                 className={`lg:hidden fixed bottom-0 left-0 right-0 transition-transform duration-300 translate-y-full}`}
               >
          <BottomNavigation userId={userId}
          popup={"settings"}
          onClose={onClose}
          handleOpenSettings={handleOpenSettings}
          handleOpenSell={handleOpenSell}
          handleOpenChat={handleOpenChat}
          handleOpenSearchTab={handleOpenSearchTab} 
          handleOpenP={handleOpenP} />
        </div>
      </footer>
    </ScrollArea>
  );
};
const Card: FC<{
  icon?: React.ReactNode;
  label: string;
  sub?: string;
  notification?: boolean;
  notificationCount?: number | undefined;
  loading?: boolean;
  handleClick?: (value: any | undefined)=>void;
}> = ({ icon, label, sub, notification, notificationCount, loading, handleClick }) => (
  <div onClick={handleClick} className="cursor-pointer bg-gray-100 dark:bg-gray-800 p-3 rounded-xl flex flex-col justify-between h-20 relative">
    {loading ? (<><Icon icon={Barsscale} className="w-6 h-6 text-gray-500" /></>):(<>
    <div className="flex items-center space-x-2">
      {icon && <div>{icon}</div>}
      <div className="text-sm">{label}</div>
    </div>
    {sub && <div className="text-xs text-gray-400">{sub}</div>}
    {notification && (
      <span className="absolute top-1 right-1 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full">+1</span>
    )}
   
   {(notificationCount ?? 0) > 0 && (
  <span className="absolute top-1 right-1 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full">+{notificationCount}</span>
)}
   
</>)}

  </div>
);

export default AccountComponent;
