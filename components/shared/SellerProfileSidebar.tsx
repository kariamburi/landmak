
import { format, isToday, isYesterday } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import QRCode from 'qrcode';
import { Phone, MessageCircle, MessageSquare, Mail } from 'lucide-react';
import {
    FaStar,
    FaLock,
    FaEdit,
    FaShareAlt,
    FaLink,
    FaQrcode,
    FaFacebook,
    FaInstagram,
    FaWhatsapp,
    FaTwitter,
    FaTiktok,
    FaPhoneAlt,      // Phone icon
    FaGlobe,         // Website/Internet icon
    FaBuilding,
    FaMapMarkerAlt
} from "react-icons/fa";
import Ratingsmobile from "./ratingsmobile";
import Verification from "./Verification";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import ProgressPopup from "./ProgressPopup";
import { VerificationPackId } from "@/constants";
import { createTransaction } from "@/lib/actions/transactions.actions";
import { v4 as uuidv4 } from "uuid";
type CollectionProps = {
    userId: string;
    loggedId: string;
    user: any;
    daysRemaining: number;
    pack: string;
    color: string;
    handleOpenReview: (value: any) => void;
    handleOpenChatId: (value: string) => void;
    handleOpenSettings: () => void;
    handleOpenPlan: () => void;
    handlePay: (id: string) => void;
};

export default function SellerProfileSidebar({ userId, loggedId, user, daysRemaining, color, pack, handlePay, handleOpenPlan, handleOpenReview, handleOpenChatId, handleOpenSettings }: CollectionProps) {

    const [activationfee, setactivationfee] = useState(500);
    const [showphone, setshowphone] = useState(false);
    const pathname = usePathname();
    const [showPhone, setShowPhone] = useState(false);
    const router = useRouter();
    const isAdCreator = userId === loggedId;
    const handlewhatsappClick = () => {

        window.location.href = `https://wa.me/${user.whatsapp}/`;
    };
    const handleShowPhoneClick = (e: any) => {
        setshowphone(true);
        window.location.href = `tel:${user.phone}`;
    };
    // console.log(user);
    const handleDirectionClick = () => {
        // Perform navigation or other actions when direction button is clicked
        // Example: Open a new tab with Google Maps directions
        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${user.latitude},${user.longitude}`,
            "_blank"
        );
    };

    let formattedCreatedAt = "";
    try {
        const createdAtDate = new Date(user?.verified[0]?.verifieddate); // Convert seconds to milliseconds

        // Get today's date
        const today = new Date();

        // Check if the message was sent today
        if (isToday(createdAtDate)) {
            formattedCreatedAt = "Today " + format(createdAtDate, "HH:mm"); // Set as "Today"
        } else if (isYesterday(createdAtDate)) {
            // Check if the message was sent yesterday
            formattedCreatedAt = "Yesterday " + format(createdAtDate, "HH:mm"); // Set as "Yesterday"
        } else {
            // Format the createdAt date with day, month, and year
            formattedCreatedAt = format(createdAtDate, "dd-MM-yyyy"); // Format as 'day/month/year'
        }

        // Append hours and minutes if the message is not from today or yesterday
        if (!isToday(createdAtDate) && !isYesterday(createdAtDate)) {
            formattedCreatedAt += " " + format(createdAtDate, "HH:mm"); // Append hours and minutes
        }
    } catch {
        // Handle error when formatting date
    }
    const [isLoading, setIsLoading] = useState(true);

    const [isOpenP, setIsOpenP] = useState(false);
    const handleOpenP = () => {
        setIsOpenP(true);
    };

    const handleCloseP = () => {
        setIsOpenP(false);
    };

    const [copied, setCopied] = useState(false);

    const adUrl = process.env.NEXT_PUBLIC_DOMAIN_URL + "?Profile=" + user._id;
    const handleCopy = () => {
        navigator.clipboard.writeText(adUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Check out this Profile!",
                    url: adUrl,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            alert("Sharing is not supported on this device.");
        }
    };
    const saveQRcode = async () => {

        try {
            const qrDataURL = await QRCode.toDataURL(adUrl);

            // Create download link
            const link = document.createElement('a');
            link.href = qrDataURL;
            link.download = 'mapa-qr-code.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error('Failed to generate QR code', err);
        }

    }
    const getInitials = (firstName?: string, lastName?: string) => {
        const first = firstName?.[0]?.toUpperCase() || '';
        const last = lastName?.[0]?.toUpperCase() || '';
        return `${first}${last}`;
    };
    function isDefaultClerkAvatar(imageUrl: string): boolean {
        try {
            const base64 = imageUrl.split("/").pop();
            if (!base64) return false;

            const json = atob(base64); // decode Base64
            const data = JSON.parse(json);

            return data.type === "default";
        } catch (e) {
            return false;
        }
    }
    const handlePayNow = async (
        packIdInput: string,
        packNameInput: string,
        periodInput: string,
        priceInput: string
    ) => {
        setIsOpenP(true);
        const customerId = uuidv4();

        const trans = {
            orderTrackingId: customerId,
            amount: Number(priceInput),
            plan: packNameInput,
            planId: packIdInput,
            period: periodInput,
            buyerId: userId,
            merchantId: userId,
            status: "Pending",
            createdAt: new Date(),
        };
        const response = await createTransaction(trans);
        if (response.status === "Pending") {
            handlePay(response.orderTrackingId)
        }
        setIsOpenP(false);
    };

    return (
        <aside className="w-full bg-white shadow-sm rounded-0 lg:rounded-xl p-4 space-y-4 w-full lg:w-[350px]">
            <div className="text-center">

                {user?.photo && !isDefaultClerkAvatar(user.photo) ? (<div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-green-700">
                    <img
                        src={user.photo}
                        alt="Organizer avatar"
                        className="w-16 h-16 rounded-full object-cover"
                    />
                </div>

                ) : (
                    <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center text-xl font-bold text-white">
                        {getInitials(user?.firstName, user?.lastName)}
                    </div>
                )}
                <h2 className="text-lg font-semibold mt-2">{user.firstName} {user.lastName}</h2>
                <div className="text-sm text-gray-600 flex justify-center items-center gap-1">
                    <Ratingsmobile
                        user={user}
                        recipientUid={user._id}
                        handleOpenReview={handleOpenReview} />
                </div>
                <div className="flex items-center justify-center gap-1">
                    <Verification
                        fee={user.fee}
                        user={user}
                        userId={userId}
                        isAdCreator={isAdCreator}
                        handlePayNow={handlePay}
                    />
                </div>
                {user?.businessaddress && (<><div className="flex gap-1 w-full justify-center items-center text-sm text-gray-500 mt-1"><FaMapMarkerAlt /> {user?.businessaddress}</div></>)}
            </div>

            {userId === loggedId && (
                <div className="flex gap-2 justify-center">
                    {user.verified && user?.verified[0]?.accountverified === false && (<button onClick={() => handlePayNow(VerificationPackId, "Verification", "0", user.fee)} className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-md">Verify Now</button>)}
                    <button onClick={() => handleOpenSettings()} className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-xs px-3 py-1 rounded-md flex items-center gap-1">
                        <FaEdit /> Edit Profile
                    </button>
                </div>)}

            <div className="text-sm text-gray-700 space-y-1 border-t p-1">
                <p className="flex items-center gap-1"><FaBuilding /> Business: <span className="text-gray-500">{user?.businessname ? (<>{user?.businessname}</>) : (<>Not Provided</>)}</span></p>
                <p className="flex items-center gap-1">
                    <FaGlobe /> Website:{" "}
                    <span className="text-gray-500">
                        {user?.website ? (
                            <a
                                href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:underline"
                            >
                                {user.website}
                            </a>
                        ) : (
                            <>Not Provided</>
                        )}
                    </span>
                </p>
                <p className="flex items-center gap-1">
                    <FaPhoneAlt /> Phone:{" "}
                    {user?.phone ? (
                        showPhone ? (
                            <>
                                <span className="text-green-700 font-medium">{user.phone}</span>

                            </>
                        ) : (
                            <button
                                onClick={() => setShowPhone(true)}
                                className="text-green-600 hover:underline text-sm"
                            >
                                Click to show number
                            </button>
                        )
                    ) : (
                        <span className="text-gray-500">Not Provided</span>
                    )}
                </p>
                {showPhone && (
                    <>
                        <p className="text-xs bg-gray-100 text-gray-500 mt-1 border rounded-sm p-1">
                            ⚠️ Never pay before meeting the seller and verifying the property. mapa.co.ke doesn&apos;t offer payment protection. Report fraud: <a href="mailto:support@mapa.co.ke" className="underline">support@mapa.co.ke</a>
                        </p>
                    </>
                )}
            </div>

            <div className="text-sm text-gray-700 space-y-2">
                <p className="font-semibold mt-3">🔗 Social Media</p>
                <div className="flex flex-wrap gap-3 text-xl text-gray-600">

                    {user?.facebook && (
                        <a href={`${user?.facebook}`} target="_blank" rel="noopener noreferrer">
                            <FaFacebook className="hover:text-green-600" />
                        </a>
                    )}
                    {user?.instagram && (
                        <a href={`${user?.instagram}`} target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="hover:text-pink-500" />
                        </a>
                    )}

                    {user?.whatsapp && (
                        <a href={`https://wa.me/${user.whatsapp}/`} target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp className="hover:text-green-600" />
                        </a>
                    )}
                    {user?.twitter && (
                        <a href={`${user?.twitter}`} target="_blank" rel="noopener noreferrer">
                            <FaTwitter className="hover:text-green-400" />
                        </a>
                    )}
                    {user?.tiktok && (
                        <a href={`${user?.tiktok}`} target="_blank" rel="noopener noreferrer">
                            <FaTiktok className="hover:text-black" />
                        </a>
                    )}


                </div>
            </div>
            <div className="flex justify-around text-sm text-gray-600 pt-3 border-t">
                <button onClick={handleCopy} className="flex items-center gap-1 hover:text-green-600">
                    <FaLink /> {copied ? "Copied!" : "Copy Link"}
                </button>
                <button onClick={saveQRcode} className="flex items-center gap-1 hover:text-green-600">
                    <FaQrcode /> QR Code
                </button>
                <button onClick={handleShare} className="flex items-center gap-1 hover:text-green-600">
                    <FaShareAlt /> Share
                </button>
            </div>

            <div className="flex gap-1 text-center pt-3 border-t text-sm">

                {isAdCreator && (<>

                    {isAdCreator &&
                        pack !== "Free" &&
                        daysRemaining &&
                        daysRemaining > 0 ? (
                        <>
                            📈 Plan: <span className="font-semibold">{pack} | {daysRemaining} Days Left</span> | <div onClick={() => handleOpenPlan()} className="cursor-pointer text-green-600 hover:underline">Upgrade Plan</div>
                        </>
                    ) : (
                        <>
                            📈 Plan: <span className="font-semibold">{pack}</span> | <div onClick={() => handleOpenPlan()} className="cursor-pointer text-green-600 hover:underline">Upgrade Plan</div>
                        </>
                    )}
                </>)}

            </div>
            <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
        </aside>
    );
}
