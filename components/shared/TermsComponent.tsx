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

const TermsComponent =  ({userId,user, handleOpenPerfomance,
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
    <ScrollArea className="h-[100vh] bg-[#e4ebeb] dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
    <Head>
      <title>Terms and Conditions | mapa.co.ke</title>
      <meta
        name="description"
        content="Read the terms and conditions for using mapa.co.ke, our trusted property marketplace. By accessing the site, you agree to be bound by these terms."
      />
      <meta
        name="keywords"
        content="mapa, terms and conditions, property marketplace, real estate, mapa terms"
      />
      <meta
        property="og:title"
        content="Terms and Conditions | mapa.co.ke"
      />
      <meta
        property="og:description"
        content="Understand the terms and conditions for using mapa.co.ke, your trusted real estate marketplace in Kenya."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.mapa.co.ke/terms" />
      <meta
        property="og:image"
        content="https://www.mapa.co.ke/assets/images/terms-and-conditions-cover.jpg"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Terms and Conditions | mapa.co.ke"
      />
      <meta
        name="twitter:description"
        content="Review the terms and conditions for using mapa.co.ke. Learn more about our policies, user obligations, and legal guidelines."
      />
      <meta
        name="twitter:image"
        content="https://www.mapa.co.ke/assets/images/terms-and-conditions-cover.jpg"
      />
      <link rel="canonical" href="https://www.mapa.co.ke/terms" />
    </Head>

    <div className="top-0 z-10 fixed w-full">
                            <Navbar user={user} userstatus="User" userId={userId} onClose={onClose} popup={"terms"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
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
          <div className="terms-and-conditions p-6 dark:text-gray-300 text-gray-800">
            <h1 className="text-2xl font-bold mb-4 dark:text-gray-400">
              Terms and Conditions
            </h1>

            <p className="mb-4">
              Welcome to mapa.co.ke! By using our website, you agree to
              comply with and be bound by the following terms and conditions.
              Please review them carefully. If you do not agree to these
              terms, you should not use this website.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using mapa.co.ke, you accept and agree to
              be bound by these terms. Additional guidelines or rules may be
              posted and modified from time to time.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">2. User Obligations</h2>
            <p className="mb-4">
              Users must provide accurate property details and refrain from
              posting misleading or false information. Illegal activities on
              mapa.co.ke are strictly prohibited.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">3. Listing Guidelines</h2>
            <p className="mb-4">
              Property listings must be accurate and categorized correctly.
              Fraudulent or inappropriate listings will be removed without notice.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">4. Payment and Fees</h2>
            <p className="mb-4">
              mapa.co.ke may charge fees for premium property listings.
              Fees will be communicated clearly before a paid service is used.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">5. No Guarantee of Sale</h2>
            <p className="mb-4">
              mapa.co.ke does not guarantee the sale of listed properties
              or mediate transactions between buyers and sellers.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">6. User Conduct</h2>
            <p className="mb-4">
              Users must not post fraudulent content, harass others, or attempt to
              disrupt the website&apos;s operation.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">7. Intellectual Property</h2>
            <p className="mb-4">
              Content on mapa.co.ke is protected by intellectual property laws.
              Unauthorized copying or distribution is prohibited.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">8. Limitation of Liability</h2>
            <p className="mb-4">
              mapa.co.ke is not responsible for any damages arising from the use
              of this website.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">9. Modifications to Terms</h2>
            <p className="mb-4">
              mapa.co.ke reserves the right to modify these terms at any time.
              Continued use of the site constitutes acceptance of the changes.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">10. Termination of Use</h2>
            <p className="mb-4">
              mapa.co.ke may suspend or terminate user access if terms are violated.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">11. Governing Law</h2>
            <p className="mb-4">
              These terms are governed by the laws of Kenya.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">12. Contact Information</h2>
            <p className="mb-4">
              For questions, contact us at:
              <a href="mailto:support@mapa.co.ke" className="text-emerald-600 hover:underline">
                support@mapa.co.ke
              </a>
            </p>
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
export default TermsComponent;
