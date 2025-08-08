"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import ProgressPopup from "./ProgressPopup";
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
        <main className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden mt-10">
            <div className="p-6">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{ad.data.title}</h1>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {truncateDescription(ad.data.description, 300)}
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
                        View Full Listing
                    </button>
                </div>
            </div>
            <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
        </main>
    );
};

export default Seodiv;
