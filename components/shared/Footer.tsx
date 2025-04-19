"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProgressPopup from "./ProgressPopup";
import { usePathname, useRouter } from "next/navigation";
//import Termspopup from "./termspopup";

const Footer = () => {
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
    <div
    
      className="mt-5 border-t dark:border-gray-700 border-gray-300 bg-white dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] p-5 max-w-6xl mx-auto"
    >
      <div className="">
        <div className="flex">
          <div className="flex-1">
            <p className="mb-3 dark:text-gray-500 text-slate-950 font-bold">
              About us
            </p>
            <div className="divider"></div>
            <ul className="space-y-4">
              <li className="transition-colors text-sm hover:text-emerald-600 hover:cursor-pointer">
                <div
                  onClick={() => {
                    if (pathname !== "/about/") {
                      setIsOpenP(true);
                      router.push("/about/");
                    }
                  }}
                  className="cursor-pointer hover:text-emerald-500 "
                >
                  About mapa
                </div>
              </li>

              <li className="transition-colors text-sm hover:text-emerald-600 hover:cursor-pointer">
                <div
                  onClick={() => {
                    if (pathname !== "/terms/") {
                      setIsOpenP(true);
                      router.push("/terms/");
                    }
                  }}
                  className="cursor-pointer hover:text-emerald-500 "
                >
                  <div>Terms & Conditions</div>
                </div>
              </li>
              <li className="transition-colors text-sm hover:text-emerald-600 hover:cursor-pointer">
                <div
                  onClick={() => {
                    if (pathname !== "/privacy/") {
                      setIsOpenP(true);
                      router.push("/privacy/");
                    }
                  }}
                  className="cursor-pointer hover:text-emerald-500 "
                >
                  Privacy Policy
                </div>
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <p className="mb-3 dark:text-gray-500 text-slate-950 font-bold">
              Support
            </p>
            <ul className="space-y-4">
              <li className="transition-colors text-sm hover:text-emerald-600 hover:cursor-pointer">
                <Link
                  href="mailto:support@mapa.co.ke"
                  className="no-underline hover:text-emerald-500 "
                >
                  support@mapa.co.ke
                </Link>
              </li>
              <li className="transition-colors text-sm hover:text-emerald-600 hover:cursor-pointer">
                <div
                  onClick={() => {
                    if (pathname !== "/safety/") {
                      setIsOpenP(true);
                      router.push("/safety/");
                    }
                  }}
                  className="cursor-pointer hover:text-emerald-500 "
                >
                  Safety tips
                </div>
              </li>

              <li className="transition-colors text-sm hover:text-emerald-600 hover:cursor-pointer">
                <div
                  onClick={() => {
                    if (pathname !== "/faq/") {
                      setIsOpenP(true);
                      router.push("/faq/");
                    }
                  }}
                  className="cursor-pointer hover:text-emerald-500 "
                >
                  FAQ
                </div>
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <p className="mb-3 dark:text-gray-500 text-slate-950 font-bold">
              Our Apps
            </p>
            <ul className="space-y-4">
              <li>
                <Link
                  href=" https://play.google.com/store/apps/details?id=ke.mapa.app"
                  className="no-underline hover:text-emerald-500 "
                >
                  <Image
                    src="/assets/images/google-play.svg"
                    alt="Google Play"
                    className="w-20 md:w-40"
                    width={20}
                    height={40}
                  />
                </Link>
              </li>
              <li>
                <Image
                  src="/assets/images/app-store.svg"
                  alt="App Store"
                  className="w-20 md:w-40"
                  width={20}
                  height={40}
                />
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <p className="mb-3 dark:text-gray-500 text-slate-950 font-bold">
              Our resources
            </p>
            <ul className="space-y-4">
              <li className="transition-colors text-sm hover:text-emerald-600 hover:cursor-pointer">
                Our FB
              </li>
              <li className="transition-colors text-sm  hover:text-emerald-600 hover:cursor-pointer">
                Our Instagram
              </li>
              <li className="transition-colors text-sm hover:text-emerald-600 hover:cursor-pointer">
                Our Youtube
              </li>

              <li className="transition-colors text-sm hover:text-emerald-600 hover:cursor-pointer">
                Our Twitter
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t dark:border-gray-700 border-gray-300 p-2 mt-3"></div>
      <div className="flex flex-col items-center justify-center">
        <p className="text-xs dark:text-gray-400 font-bold">
          {currentYear} mapa. All Rights reserved.
        </p>
        <p className="text-[8px] dark:text-gray-400 lg:text-xs">
          Powered by{" "}
          <Link
            href="https://craftinventors.co.ke"
            className="no-underline hover:text-emerald-500 "
          >
            Craft Inventors
          </Link>
        </p>
      </div>
      <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
    </div>
  );
};

export default Footer;
