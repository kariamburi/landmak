'use client';

import { useState } from 'react';
import { CheckCircle as CheckCircleIcon, ExpandMore, ExpandLess } from '@mui/icons-material';

const SafetyTips = ({ handleOpenSafety }: { handleOpenSafety: () => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="mt-3 border dark:bg-[#2D3236] dark:text-gray-300 bg-white p-2 text-sm rounded-lg overflow-hidden">
            {/* Header with toggle */}
            <div
                className="font-bold text-lg text-center cursor-pointer flex justify-between items-center"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className="w-full text-center">Safety Tips for Buyers</span>
                <span>{isExpanded ? <ExpandLess /> : <ExpandMore />}</span>
            </div>

            {/* Tips section (collapsible) */}
            {isExpanded && (
                <>
                    <div className="border-t dark:border-gray-600 border-gray-300 mt-4 mb-4"></div>
                    <ol>
                        {[
                            {
                                title: "Verify the Seller",
                                description:
                                    "Always check the seller's profile, ID, and contact details. Be cautious of listings from unverified users or those without proper documentation.",
                            },
                            {
                                title: "Inspect the Property",
                                description:
                                    "Schedule a physical visit with the seller. Cross-check property beacons and boundaries, preferably with a licensed surveyor.",
                            },
                            {
                                title: "Confirm Land Ownership and Title",
                                description:
                                    "Perform a land search at the Ministry of Lands to confirm the true owner, title status, and any disputes or encumbrances.",
                            },
                            {
                                title: "Use a Licensed Lawyer or Advocate",
                                description:
                                    "Always involve a qualified legal professional when drafting or signing any property sale agreements or transfer documents.",
                            },
                            {
                                title: "Avoid Advance Payments",
                                description:
                                    "Never send money before verifying documents and visiting the property. Use escrow services or formal channels when possible.",
                            },
                            {
                                title: 'Beware of "Too Good to Be True" Deals',
                                description:
                                    'Extremely low prices may be a sign of fraud. Compare with market prices and avoid pressure tactics to make fast decisions.',
                            },
                            {
                                title: "Don't Share Personal Info Prematurely",
                                description:
                                    "Do not share your ID, KRA PIN, or financial information until you've verified the seller and begun formal legal procedures.",
                            },
                        ].map((tip, index) => (
                            <li key={index}>
                                <div className="mt-2 gap-2 text-sm">
                                    <p className="font-bold flex gap-2 text-sm">
                                        <CheckCircleIcon sx={{ fontSize: 14 }} />
                                        {tip.title}
                                    </p>
                                    <p>{tip.description}</p>
                                </div>
                            </li>
                        ))}

                        <li>
                            <div className="mt-2 font-bold text-green-600 hover:text-green-500 hover:cursor-pointer">
                                <div onClick={handleOpenSafety}>Read more...</div>
                            </div>
                        </li>
                    </ol>
                </>
            )}
        </div>
    );
};

export default SafetyTips;
