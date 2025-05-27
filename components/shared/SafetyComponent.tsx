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

const SafetyComponent =  ({userId,user, handleOpenPerfomance,
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
  <div className="h-[100vh] bg-[#e4ebeb] p-0 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] overflow-hidden">
    <div className="h-full overflow-y-auto bg-[#e4ebeb] border">
       <style jsx>{`
    @media (max-width: 1024px) {
      div::-webkit-scrollbar {
        display: none;
      }
    }
  `}</style>  <Head>
  <title>Safety Tips | mapa.co.ke</title>
  <meta
    name="description"
    content="Stay safe while buying or selling property on mapa.co.ke. Follow our safety tips to protect yourself and ensure a secure transaction."
  />
  <meta
    name="keywords"
    content="mapa, safety tips, property buying, property selling, secure transactions, online marketplace safety, mapa safety"
  />
  <meta property="og:title" content="Safety Tips | mapa.co.ke" />
  <meta
    property="og:description"
    content="Follow these important safety tips to protect yourself when buying or selling property on mapa.co.ke."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.mapa.co.ke/safety" />
  <meta
    property="og:image"
    content="https://www.mapa.co.ke/assets/images/safety-tips-cover.jpg"
  />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Safety Tips | mapa.co.ke" />
  <meta
    name="twitter:description"
    content="Learn how to stay safe while buying or selling property on mapa.co.ke with our safety guidelines."
  />
  <meta
    name="twitter:image"
    content="https://www.mapa.co.ke/assets/images/safety-tips-cover.jpg"
  />
  <link rel="canonical" href="https://www.mapa.co.ke/safety" />
</Head>

   <div className="top-0 z-10 fixed w-full">
                           <Navbar user={user} userstatus="User" userId={userId} onClose={onClose} popup={"saftey"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
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
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">
        Safety Tips for mapa.co.ke
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-orange-600 mb-2">
            For Sellers:
          </h3>
          <ul className="list-disc pl-6 space-y-2 dark:text-gray-300 text-gray-700">
            <li>
              Verify Buyer Information: Always confirm the buyer&apos;s identity before sharing personal details or arranging meetings. Request a phone number and verify it.
            </li>
            <li>
              Meet in Public Places: Arrange to meet potential buyers in well-populated, public areas, preferably during daylight hours.
            </li>
            <li>
              Bring a Friend: If possible, bring a friend or family member when meeting buyers. Never go alone, especially to unfamiliar locations.
            </li>
            <li>
              Avoid Sharing Personal Information: Do not disclose sensitive details like your home address or financial information. Communicate through mapa.co.ke&apos;s secure messaging system.
            </li>
            <li>
              Secure Payment: Be cautious of checks or money orders. Prefer cash or verified electronic transfers. Ensure payment is completed and verified before handing over property documents.
            </li>
            <li>
              Document Everything: Keep records of all communication with the buyer, including emails, messages, and agreements.
            </li>
            <li>
              Trust Your Instincts: If something feels suspicious or too good to be true, trust your gut and reconsider the deal.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-green-600 mb-2">
            For Buyers:
          </h3>
          <ul className="list-disc pl-6 space-y-2 dark:text-gray-300 text-gray-700">
            <li>
              Research the Seller: Check the seller&apos;s profile and reviews if available. Be cautious of sellers with little to no history on mapa.co.ke.
            </li>
            <li>
              Inspect the Property: Always visit the property in person before making a purchase. Ensure it matches the listing description.
            </li>
            <li>
              Meet in Safe Locations: Arrange to meet the seller in a public place. Avoid secluded areas and always choose a safe location.
            </li>
            <li>
              Avoid Sending Money in Advance: Never send money before seeing the property in person. Scammers often ask for payments upfront and then disappear.
            </li>
            <li>
              Verify Property Documents: Ensure the seller has legitimate ownership documents. Cross-check with relevant authorities to confirm authenticity.
            </li>
            <li>
              Bring a Professional: If possible, bring a property expert or legal advisor to help inspect the documents and property conditions.
            </li>
            <li>
              Use Secure Payment Methods: Prefer secure payment options like escrow services or verified bank transfers. Avoid untraceable cash transactions.
            </li>
            <li>
              Stay Vigilant: Be cautious of unrealistic offers, rushed deals, or unusual payment requests. If something seems off, it probably is.
            </li>
          </ul>
        </div>

          {/* New Section - How Property Mapping Reduces Land Fraud */}
    <div>
      <h3 className="text-xl font-semibold text-blue-600 mb-2">
        How Property Mapping Reduces Land Fraud
      </h3>
      <ul className="list-disc pl-6 space-y-2 dark:text-gray-300 text-gray-700">
        <li><strong>Prevents Fake Listings:</strong> Fraudsters cannot fake property location or size since buyers can verify it on the map.</li>
        <li><strong>Buyers Can Independently Visit the Site:</strong> The exact location is available, allowing buyers to verify details with neighbors.</li>
        <li><strong>Proof of Ownership & Boundaries:</strong> Clearly drawn boundaries prevent fraudsters from misrepresenting land size or ownership.</li>
        <li><strong>Comparison with Official Records:</strong> Buyers can cross-check mapped property details with government land records.</li>
        <li><strong>Detects Overlapping Claims:</strong> If two sellers list the same property, discrepancies in mapping will expose fraud.</li>
        <li><strong>Publicly Visible Infrastructure:</strong> Buyers can see actual roads, power lines, and water sources instead of relying on verbal claims.</li>
        <li><strong>Encourages Due Diligence:</strong> Buyers can check with local authorities and community members before purchasing.</li>
        <li><strong>Reduces Middlemen Scams:</strong> Publicly available property coordinates allow buyers to verify details directly with real owners.</li>
      </ul>
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
                handleOpenSafety={handleOpenSafety} />
      </div>
    </footer>
  </div></div>
  );
};
export default SafetyComponent;
