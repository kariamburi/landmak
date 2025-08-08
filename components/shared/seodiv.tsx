"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import ProgressPopup from "./ProgressPopup";
import StyledBrandName from "./StyledBrandName";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
interface Props {
    ad: any;
}

const Seodiv: React.FC<Props> = ({ ad }) => {
    const router = useRouter();
    const [isOpenP, setIsOpenP] = useState(false);
    const handleCloseP = () => {
        setIsOpenP(false);
    };
    const truncateDescription = (description: string, charLimit: number) => {
        const safeMessage = sanitizeHtml(description);
        const truncatedMessage =
            safeMessage.length > charLimit
                ? `${safeMessage.slice(0, charLimit)}...`
                : safeMessage;
        return truncatedMessage;
    };
    return (
        <main className="bg-gray-200">

            <div
                className={`bg-gradient-to-b from-green-600 to-green-600 lg:from-[#e4ebeb] justify-center pl-2 pr-2 h-[60px] lg:to-[#e4ebeb] transition-all duration-300 overflow-visible w-full flex flex-col items-center`}
            >
                <div className="w-full h-full justify-between flex items-center">
                    <div className="flex items-center gap-1">

                        <div
                            className="mr-2 w-5 h-8 flex text-white lg:text-gray-700 items-center justify-center rounded-sm tooltip tooltip-bottom hover:cursor-pointer lg:hover:text-green-600"
                            data-tip="Back"
                            onClick={() => {
                                setIsOpenP(true);
                                router.push("/");
                            }}
                        >

                            <ArrowBackOutlinedIcon />

                        </div>

                        <div className="flex items-center gap-2">

                            <img src="/logo_white.png" alt="Logo" className="w-8 h-8 lg:hidden rounded-full" />
                            <img src="/logo.png" alt="Logo" className="w-8 h-8 hidden lg:inline rounded-full" />
                            <StyledBrandName />
                        </div>

                    </div>

                </div>
            </div>
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden mt-0">
                <div className="p-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{ad.data.title}</h1>
                    <p className="text-gray-600 text-lg mb-6">
                        <span
                            dangerouslySetInnerHTML={{
                                __html: truncateDescription(ad.data.description ?? "", 200),
                            }}
                        />
                    </p>

                    <div className="rounded-lg overflow-hidden mb-6">
                        <img
                            src={ad.data.imageUrls[0] || 'fallback.jpg'}
                            alt={ad.data.title}
                            className="w-full h-auto object-cover max-h-[400px] transition-transform duration-300 hover:scale-105"
                        />
                    </div>

                    <div className="space-y-3 text-gray-700 text-base">
                        <div>
                            {ad.data.price && (<span className="font-semibold text-gray-800 text-lg">Price: Ksh {ad.data.price.toLocaleString()}</span>)}
                        </div>
                        <div>
                            <span className="font-semibold text-gray-800">Location:</span> {ad.data?.propertyadrea?.myaddress || 'Kenya'}
                        </div>
                        <div>
                            <span className="font-semibold text-gray-800">Posted by:</span> {ad.organizer?.firstName || 'Seller'}
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={() => { setIsOpenP(true); router.push(`/?Ad=${ad._id}`); }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
                        >
                            View Full Details
                        </button>
                    </div>
                </div>
                <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
            </div>
        </main>
    );
};

export default Seodiv;
