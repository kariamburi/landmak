"use client";
import { useEffect, useState } from "react";
import Image from "next/image"; // Import Image component from Next.js
import { useRouter, useSearchParams } from "next/navigation";
import { getsourceCookie, setsourceCookie } from "./cookies";
const AppPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    // Check if accessing from Android custom tab with your app user-agent
    //const isAutoyardApp = userAgent.includes("AutoyardApp");

    // Check if accessing from mobile (iOS/Android)
    const isMobile = /android|iphone|ipad|ipod/i.test(userAgent);
    const source = searchParams.get("source");
    // Show popup if not accessing from AutoyardApp and using a mobile device
    const sourceCookie = getsourceCookie();
    if (source) {
      setsourceCookie(source);
    }
    // Check if the referrer is available in the document
    if (!sourceCookie && !source && isMobile) {
      setShowPopup(true);
    }
  }, []);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Download the mapa App
        </h2>
        <p className="text-gray-600 mb-4">
          Get a better experience by using the mapa mobile app!
        </p>

        <a
          href="https://play.google.com/store/apps/details?id=ke.co.mapa.twa"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors duration-300 inline-block mb-4 flex items-center justify-center"
        >
          {/* Google Play Store Icon */}
          <Image
            src="/google-play-badge.png" // Ensure the image is placed in the public folder
            alt="Google Play Store"
            width={24} // Width of the image in pixels
            height={24} // Height of the image in pixels
            className="mr-2" // Add margin to the right for spacing
          />
          Install from Google Play
        </a>

        <button
          onClick={() => setShowPopup(false)}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-400 transition-colors duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AppPopup;
