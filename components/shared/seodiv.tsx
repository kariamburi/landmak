"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface Props {
    ad: any;
}

const Seodiv: React.FC<Props> = ({ ad }) => {
    const router = useRouter();

    return (
        <main className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden mt-10">
            <div className="p-6">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{ad.data.title}</h1>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {ad.data.description}
                </p>

                <div className="rounded-lg overflow-hidden mb-6">
                    <img
                        src={ad.data.imageUrls[0]}
                        alt={ad.data.title}
                        className="w-full h-auto object-cover max-h-[400px] transition-transform duration-300 hover:scale-105"
                    />
                </div>

                <div className="space-y-3 text-gray-700 text-base">
                    <div>
                        <span className="font-semibold text-gray-800">Price:</span> {ad.data.price}
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
                        onClick={() => router.push(`/?Ad=${ad.id}`)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
                    >
                        View Full Listing
                    </button>
                </div>
            </div>
        </main>
    );
};

export default Seodiv;
