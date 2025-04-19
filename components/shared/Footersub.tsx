"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ProgressPopup from "./ProgressPopup";
import { usePathname, useRouter } from "next/navigation";
//import Termspopup from "./termspopup";
interface footProps {
  
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  
 
}
const Footersub = ({handleOpenAbout,handleOpenTerms,handleOpenPrivacy, handleOpenSafety}:footProps) => {
  const currentYear = new Date().getFullYear();
  const [isOpenP, setIsOpenP] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const handleOpenP = () => {
    setIsOpenP(true);
  };

  const handleCloseP = () => {
    setIsOpenP(false);
  };
  return (
    <div className="mt-3 border-t dark:border-gray-700 border-gray-300 bg-white dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] p-5 w-full">
      <div className="mt-4 mb-4"></div>
      <div className="flex flex-col items-center justify-center">
        <p className="text-xs font-bold">
          {currentYear} mapa. All Rights reserved.
        </p>
        <div className="flex text-xs">
          <div className="flex gap-1 w-full text-gray-600">
            <div className="transition-colors text-[12px] hover:text-green-700 hover:cursor-pointer">
              <div
                onClick={() => {
                  handleOpenAbout()
                
                }}
                className="cursor-pointer dark:text-gray-400 hover:text-green-700 "
              >
                About
              </div>
            </div>
            <div>|</div>
            <div className="transition-colors dark:text-gray-400 text-[12px] hover:text-green-700 hover:cursor-pointer">
              <div
                onClick={() => {
                  handleOpenTerms()
                }}
                className="cursor-pointer dark:text-gray-400 hover:text-green-700 "
              >
                <div>Terms & Conditions</div>
              </div>
            </div>
            <div>|</div>
            <div className="transition-colors dark:text-gray-400 text-[12px] hover:text-green-700 hover:cursor-pointer">
              <div
                onClick={() => {
                  handleOpenPrivacy()
                }}
                className="cursor-pointer hover:text-green-700 "
              >
                Privacy Policy
              </div>
            </div>
            <div>|</div>
            <div className="transition-colors dark:text-gray-400 text-[12px] hover:text-emerald-600 hover:cursor-pointer">
              <div
                onClick={() => {
                  handleOpenSafety()
                }}
                className="cursor-pointer dark:text-gray-400 hover:text-green-700 "
              >
                Safety Tips
              </div>
            </div>
          </div>
        </div>
        <p className="dark:text-gray-500 text-xs">
          Powered by{" "}
          <Link
            href="https://craftinventors.co.ke"
            className="no-underline dark:text-gray-500 hover:underline "
          >
            Craft Inventors
          </Link>
        </p>
      </div>
    
    </div>
  );
};

export default Footersub;
