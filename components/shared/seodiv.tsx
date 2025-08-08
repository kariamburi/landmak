"use client"
import React, { useState } from "react";
import { FaShareAlt, FaFacebook, FaWhatsapp, FaTwitter } from "react-icons/fa";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { FacebookIcon, WhatsappIcon } from "next-share";
import { useRouter } from "next/navigation";

interface Props {
    ad: any;
}

const Seodiv: React.FC<Props> = ({ ad }) => {
    const router = useRouter();
    return (
        <main className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold mb-2">{ad.data.title}</h1>
            <p className="text-gray-700 mb-4">{ad.data.description}</p>

            <img
                src={ad.data.imageUrls[0]}
                alt={ad.data.title}
                className="w-full h-auto rounded-md mb-4 object-cover max-h-[400px]"
            />

            <div className="text-lg font-medium mb-2">Price: <span className="font-normal">{ad.data.price}</span></div>
            <div className="text-lg font-medium mb-2">Location: <span className="font-normal">{ad.data?.propertyadrea?.myaddress || 'Kenya'}</span></div>
            <div className="text-lg font-medium mb-6">Posted by: <span className="font-normal">{ad.organizer?.firstName || 'Seller'}</span></div>
            <button onClick={() => {
                router.push(`/?Ad=${ad.id}`);
            }}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded">
                View Full Listing
            </button>

        </main>
    );
};

export default Seodiv;
