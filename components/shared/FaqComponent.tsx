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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

const FaqComponent =  ({ userId, user,onClose, handleOpenPerfomance,
  handleOpenSettings,
  handleOpenShop, handleOpenSell,handleOpenBook,handleOpenChat,handleOpenPlan, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety}:Props) => {
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
    <ScrollArea className="h-[100vh] bg-white dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]">
      <Head>
        <title>Frequently Asked Questions | mapa.co.ke</title>
        <meta
          name="description"
          content="Find answers to common questions about using mapa.co.ke, including how to post a property, contact sellers, and more."
        />
        <meta
          name="keywords"
          content="mapa, FAQ, frequently asked questions, property marketplace, property sales, post a property, contact seller"
        />
        <meta
          property="og:title"
          content="Frequently Asked Questions | mapa.co.ke"
        />
        <meta
          property="og:description"
          content="Get help with common questions about posting property, contacting sellers, and managing your listings on mapa.co.ke."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mapa.co.ke/faq" />
        <meta
          property="og:image"
          content="https://www.mapa.co.ke/assets/images/faq-cover.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Frequently Asked Questions | mapa.co.ke"
        />
        <meta
          name="twitter:description"
          content="Find answers to your questions about posting vehicles and using mapa.co.ke. Learn more about our marketplace."
        />
        <meta
          name="twitter:image"
          content="https://www.mapa.co.ke/assets/images/faq-cover.jpg"
        />
        <link rel="canonical" href="https://www.mapa.co.ke/faq" />
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
      <div className="max-w-3xl mx-auto flex mt-20 p-1">
        <div className="hidden lg:inline mr-5"></div>

        <div className="flex-1">
          <div className="rounded-[20px] bg-white max-w-6xl mx-auto lg:flex-row mt-0 p-1 justify-center">
            <div className="max-w-3xl mx-auto p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Frequently Asked Questions
              </h2>

              <div className="space-y-8">
            
<Accordion type="single" collapsible className="w-full">
  <AccordionItem key="faq-1" value="item-1">
    <AccordionTrigger>
      <div className="w-full">
        <h3>1. How do I post a product or property on mapa.co.ke?</h3>
      </div>
    </AccordionTrigger>
    <AccordionContent>
      <p>
        To post a product or property, create an account, navigate to the
        &quot;Post Ad&quot; section, select your category, and fill out the required
        information including images, price, and description. Then submit
        your listing for approval.
      </p>
    </AccordionContent>
  </AccordionItem>

  <AccordionItem key="faq-2" value="item-2">
    <AccordionTrigger>
      <h3>2. Is there a fee for posting a listing?</h3>
    </AccordionTrigger>
    <AccordionContent>
      <p>
        Posting a basic listing on mapa.co.ke is free. However, we
        offer premium packages to boost your listing for more visibility at
        an affordable fee.
      </p>
    </AccordionContent>
  </AccordionItem>

  <AccordionItem key="faq-3" value="item-3">
    <AccordionTrigger>
      <h3>3. How can I contact a seller?</h3>
    </AccordionTrigger>
    <AccordionContent>
      <p>
        You can contact sellers directly through the chat feature on the
        listing page or by using the provided phone number or email address.
      </p>
    </AccordionContent>
  </AccordionItem>

  <AccordionItem key="faq-4" value="item-4">
    <AccordionTrigger>
      <h3>4. How do I report a suspicious listing?</h3>
    </AccordionTrigger>
    <AccordionContent>
      <p>
        If you come across a suspicious listing, please click the
        &quot;Report Abuse&quot; button on the ad page. Our team will review and take
        necessary action.
      </p>
    </AccordionContent>
  </AccordionItem>

  <AccordionItem key="faq-5" value="item-5">
    <AccordionTrigger>
      <h3>5. How can I edit or delete my listing?</h3>
    </AccordionTrigger>
    <AccordionContent>
      <p>
        You can edit or delete your listing by logging into your account,
        going to &quot;My Listings&quot; section, and selecting the desired ad to
        edit or delete.
      </p>
    </AccordionContent>
  </AccordionItem>

  <AccordionItem key="faq-6" value="item-6">
    <AccordionTrigger>
      <h3>6. How long does it take for my listing to be approved?</h3>
    </AccordionTrigger>
    <AccordionContent>
      <p>
        Listings are typically approved within 24 hours. However, it may
        take longer during peak periods.
      </p>
    </AccordionContent>
  </AccordionItem>

  <AccordionItem key="faq-7" value="item-7">
    <AccordionTrigger>
      <h3>7. Can I get a refund for a premium listing?</h3>
    </AccordionTrigger>
    <AccordionContent>
      <p>
        Refunds are only applicable if your listing was not approved or if
        there was a technical issue. Please contact our support team for
        further assistance.
      </p>
    </AccordionContent>
  </AccordionItem>
</Accordion>
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
export default FaqComponent;
