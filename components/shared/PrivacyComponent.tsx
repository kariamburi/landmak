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

const PrivacyComponent =  ({userId,user, handleOpenPerfomance,
  handleOpenSettings,
  handleOpenShop, handleOpenSell, handleOpenBook,handleOpenChat,handleOpenPlan, onClose,handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety}:Props) => {
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
    <ScrollArea className="h-[100vh] bg-gray-200 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
    <Head>
      <title>Privacy Policy | mapa.co.ke</title>
      <meta
        name="description"
        content="Learn how mapa.co.ke collects, uses, and protects your personal information. Our Privacy Policy outlines your data protection rights and how we safeguard your privacy when using our website."
      />
      <meta property="og:title" content="Privacy Policy | mapa.co.ke" />
      <meta
        property="og:description"
        content="Read mapa.co.ke's Privacy Policy to understand how your personal information is handled. Your privacy and data protection are important to us."
      />
      <meta property="og:url" content="https://mapa.co.ke/privacy" />
      <meta property="og:type" content="article" />
      <meta
        name="keywords"
        content="privacy policy, mapa, data protection, personal information, cookies, Kenya real estate marketplace"
      />
      <meta name="author" content="mapa" />
      <link rel="canonical" href="https://mapa.co.ke/privacy" />
    </Head>
   <div className="top-0 z-10 fixed w-full">
                           <Navbar user={user} userstatus="User" userId={userId} onClose={onClose} popup={"privacy"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
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
          <div className="privacy-policy p-6 dark:text-gray-300 text-gray-800">
            <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
  
            <p className="mb-4">
              Your privacy is important to us at mapa.co.ke. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. By using our site, you agree to the terms outlined in this policy. If you do not agree with the terms, please do not use our website.
            </p>
  
            <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
            
            <p className="mb-4">
              <strong>Personal Data:</strong> When you create an account, post a listing, or contact us, we may collect personal information such as:
            </p>
            <ul className="list-disc list-inside ml-6 mb-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Location</li>
              <li>Property details (e.g., type, size, location)</li>
            </ul>
            
            <p className="mb-4">
              <strong>Usage Data:</strong> We may also collect information on how you access and use our website, including:
            </p>
            <ul className="list-disc list-inside ml-6 mb-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Pages you visit on our website</li>
              <li>Time and date of your visits</li>
              <li>Time spent on those pages</li>
              <li>Device information</li>
            </ul>
            
            <p className="mb-4">
              <strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar technologies to track your activity on our website and store certain information.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
  
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside ml-6 mb-4">
              <li>Create and manage your account</li>
              <li>Facilitate property listings and management</li>
              <li>Communicate with you regarding your account or listings</li>
              <li>Respond to inquiries and provide customer support</li>
              <li>Send updates, promotions, and marketing materials (with your consent)</li>
              <li>Monitor usage trends and improve our services</li>
              <li>Protect against fraud and unauthorized activities</li>
              <li>Comply with legal obligations</li>
            </ul>
  
            <h2 className="text-xl font-semibold mt-6 mb-2">3. Security of Your Information</h2>
  
            <p className="mb-4">We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet is 100% secure.</p>
  
            <h2 className="text-xl font-semibold mt-6 mb-2">4. Your Data Protection Rights</h2>
  
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside ml-6 mb-4">
              <li>Request access to the personal information we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Restrict or object to processing of your personal data</li>
              <li>Request data portability</li>
            </ul>
  
            <h2 className="text-xl font-semibold mt-6 mb-2">5. Changes to This Privacy Policy</h2>
  
            <p className="mb-4">We may update this Privacy Policy from time to time. Please review it periodically.</p>
  
            <h2 className="text-xl font-semibold mt-6 mb-2">
                6. Account Deletion Policy
              </h2>

              <p className="mb-4">
                If you choose to delete your account, please note the following:
              </p>
              <ul className="list-disc list-inside ml-6 mb-4">
                <li>
                  Your account information and data will be permanently deleted
                  and cannot be recovered.
                </li>
                <li>
                  You will no longer have access to any data or content
                  associated with your account.
                </li>
                <li>
                  Any property listings you have posted will be removed from the
                  website.
                </li>
                <li>
                  To delete your account: Go to &quot;Manage Account &quot; in
                  your account settings. Select the &quot;Security&quot; tab.
                  Click on the &quot;Delete Account&quot; button.
                </li>
                <li>
                  Please contact our support team if you need assistance with
                  account deletion.
                </li>
              </ul>
            <p className="mt-4">For any questions about this Privacy Policy, please contact us at <strong>support@mapa.co.ke</strong>.</p>
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
export default PrivacyComponent;
