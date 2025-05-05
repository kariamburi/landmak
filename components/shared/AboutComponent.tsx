"use client"
import Navbar from "@/components/shared/navbar";
import SettingsEdit from "@/components/shared/SettingsEdit";
import { getUserById } from "@/lib/actions/user.actions";
import { Toaster } from "@/components/ui/toaster";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { auth } from "@clerk/nextjs/server";
import Verification from "@/components/shared/Verification";
import Image from "next/image";
import BottomNavigation from "@/components/shared/BottomNavigation";
import Footersub from "@/components/shared/Footersub";
import Head from "next/head";
import { useEffect, useState } from "react";
import { mode } from "@/constants";
import { ScrollArea } from "../ui/scroll-area";
interface Props {
  userId: string;
  user:any;
  handleOpenSell:() => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  onClose:() => void;
  handleOpenAbout:() => void;
  handleOpenTerms: () => void;
handleOpenPrivacy: () => void;
handleOpenSafety: () => void;
handleOpenPerfomance: () => void;
handleOpenSettings: () => void;
handleOpenShop: (shopId:any) => void;
}

const AboutComponent =  ({userId, user,onClose,
  handleOpenSell,
  handleOpenBook,
  handleOpenChat,
  handleOpenPerfomance,
  handleOpenSettings,
  handleOpenShop,
  handleOpenPlan, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety }:Props) => {
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
   

  return (
    <ScrollArea className="h-[100vh] bg-[#e4ebeb] dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
    
    <Head>
      <title>
        About mapa | Kenya&apos;s Leading Property & Marketplace
      </title>
      <meta
        name="description"
        content="Learn about mapa.co.ke, Kenya's premier platform for buying and selling properties and other products. From land and houses to general merchandise, we connect buyers and sellers nationwide."
      />
      <meta
        property="og:title"
        content="About mapa | Kenya's Leading Property & Marketplace"
      />
      <meta
        property="og:description"
        content="At mapa.co.ke, we offer a seamless, transparent, and secure platform to buy and sell properties and products across Kenya. Discover land, houses, and advanced property mapping for easy location."
      />
      <meta property="og:image" content="/assets/images/logo.png" />
      <meta property="og:url" content="https://mapa.co.ke/about" />
      <meta property="og:type" content="website" />
      <meta
        name="keywords"
        content="mapa, buy properties, sell land, houses, real estate, Kenya marketplace"
      />
      <meta name="author" content="mapa" />
    </Head>

     <div className="top-0 z-10 fixed w-full">
                        <Navbar user={user} userstatus={user.status} userId={userId} onClose={onClose} popup={"about"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}

        handleOpenPerfomance={handleOpenPerfomance}
        handleOpenSettings={handleOpenSettings}
        handleOpenAbout={handleOpenAbout}
        handleOpenTerms={handleOpenTerms}
        handleOpenPrivacy={handleOpenPrivacy}
        handleOpenSafety={handleOpenSafety} 
        handleOpenShop={handleOpenShop}/>
                       </div>

    <div className="max-w-3xl mx-auto flex mt-[60px] p-1">
      <div className="hidden lg:inline mr-5"></div>

      <div className="flex-1">
        <div className="border rounded-lg dark:bg-[#2D3236] bg-white max-w-6xl mx-auto lg:flex-row mt-0 p-1 justify-center">
          <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold dark:text-gray-400 text-gray-800 mb-6 text-center">
              About mapa.co.ke
            </h1>

            <div className="space-y-6 dark:text-gray-300 text-gray-700">
              <p className="text-lg">
                Welcome to <span className="font-semibold text-emerald-600">mapa.co.ke</span>, 
                Kenya&apos;s premier online marketplace for properties and other products. Whether you&apos;re looking for land, 
                houses, or general merchandise, we provide an advanced and user-friendly platform to connect buyers and sellers nationwide.
              </p>

              <div>
                <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">
                  Our Mission
                </h2>
                <p>
                  At mapa.co.ke, our mission is to simplify the process of buying and selling properties and products 
                  with advanced tools like <span className="font-semibold text-emerald-600">virtual tours, 3D modeling</span> and <span className="font-semibold text-emerald-600">Google property mapping</span>. Our goal is to offer a seamless, 
                  transparent, and secure marketplace for all users.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">
                  Why Choose mapa.co.ke?
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><span className="font-semibold">Advanced Property Mapping</span>: Use interactive maps to easily locate properties with high precision.</li>
                  <li><span className="font-semibold">Virtual Tours</span>: Experience properties online through immersive video and 3D modeling.</li>
                  <li><span className="font-semibold">Diverse Listings</span>: Find land, houses, and general products all in one marketplace.</li>
                  <li><span className="font-semibold">Secure Transactions</span>: We implement strict security measures for safe transactions.</li>
                  <li><span className="font-semibold">Direct Communication</span>: Contact buyers and sellers via chat, email, or phone.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">
                  Our Story
                </h2>
                <p>
                  mapa.co.ke was founded with a vision to revolutionize property sales and e-commerce in Kenya. We are dedicated to 
                  providing an innovative platform where users can list, search, and purchase properties with ease and confidence.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">
                  Join Our Community
                </h2>
                <p>
                  Whether you&apos;re a property developer, buyer, or seller, mapa.co.ke is your trusted partner. 
                  Join our community today and explore a smarter way to buy and sell properties and products.
                </p>
                <p>
                  Thank you for choosing <span className="font-semibold text-emerald-600">mapa.co.ke</span>. 
                  We look forward to serving you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer>
      <div>
        <Footersub 
        handleOpenAbout={handleOpenAbout}
        handleOpenTerms={handleOpenTerms}
         handleOpenPrivacy={handleOpenPrivacy}
         handleOpenSafety={handleOpenSafety}/> 
      </div>
    </footer>

</ScrollArea>

  );
};
export default AboutComponent;
