"use client"
import ProgressPopup from "@/components/shared/ProgressPopup";
import StyledBrandName from "@/components/shared/StyledBrandName";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function About() {
    const router = useRouter();
    const [isOpenP, setIsOpenP] = useState(false);
    const handleCloseP = () => {
        setIsOpenP(false);
    };
    return (
        <>
            <Head>
                <title>
                    About mapa | Kenya&apos;s Leading Property & Marketplace
                </title>
                <meta
                    name="description"
                    content="Learn about mapa.co.ke, Kenya's premier platform for buying and selling properties and other products. From land and houses to general merchandise, we connect buyers and sellers nationwide."
                />
                <meta
                    property="og:title"
                    content="About mapa | Kenya's Leading Property & Marketplace"
                />
                <meta
                    property="og:description"
                    content="At mapa.co.ke, we offer a seamless, transparent, and secure platform to buy and sell properties and products across Kenya. Discover land, houses, and advanced property mapping for easy location."
                />
                <meta property="og:image" content="/logo.png" />
                <meta property="og:url" content="https://mapa.co.ke/about" />
                <meta property="og:type" content="website" />
                <meta
                    name="keywords"
                    content="mapa, buy properties, sell land, houses, real estate, Kenya marketplace"
                />
                <meta name="author" content="mapa" />
                <link rel="canonical" href="https://www.mapa.co.ke/about" />
            </Head>

            <main> <div className="flex-1">
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

                                 <ArrowBackOutlinedIcon /> <p>Home</p>

                            </div>

                            <div className="flex items-center gap-2">

                                <img src="/logo_white.png" alt="Logo" className="w-8 h-8 lg:hidden rounded-full" />
                                <img src="/logo.png" alt="Logo" className="w-8 h-8 hidden lg:inline rounded-full" />
                                <StyledBrandName />
                            </div>

                        </div>

                    </div>
                </div>
                <div className="border rounded-lg dark:bg-[#2D3236] bg-white max-w-6xl mx-auto lg:flex-row mt-0 p-1 justify-center">
                    <div className="max-w-4xl mx-auto p-8">
                        <h1 className="text-3xl font-bold dark:text-gray-400 text-gray-800 mb-6 text-center">
                            About mapa.co.ke
                        </h1>

                        <div className="space-y-6 dark:text-gray-300 text-gray-700">
                            <p className="text-lg">
                                Welcome to <span className="font-semibold text-emerald-600">mapa.co.ke</span>,
                                Kenya&apos;s premier online marketplace for properties and other products. Whether you&apos;re looking for land,
                                houses, or general merchandise, we provide an advanced and user-friendly platform to connect buyers and sellers nationwide.
                            </p>

                            <div>
                                <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">
                                    Our Mission
                                </h2>
                                <p>
                                    At mapa.co.ke, our mission is to simplify the process of buying and selling properties and products
                                    with advanced tools like <span className="font-semibold text-emerald-600">virtual tours, 3D modeling</span> and <span className="font-semibold text-emerald-600">Google property mapping</span>. Our goal is to offer a seamless,
                                    transparent, and secure marketplace for all users.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">
                                    Why Choose mapa.co.ke?
                                </h2>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><span className="font-semibold">Advanced Property Mapping</span>: Use interactive maps to easily locate properties with high precision.</li>
                                    <li><span className="font-semibold">Virtual Tours</span>: Experience properties online through immersive video and 3D modeling.</li>
                                    <li><span className="font-semibold">Diverse Listings</span>: Find land, houses, and general products all in one marketplace.</li>
                                    <li><span className="font-semibold">Secure Transactions</span>: We implement strict security measures for safe transactions.</li>
                                    <li><span className="font-semibold">Direct Communication</span>: Contact buyers and sellers via chat, email, or phone.</li>
                                </ul>
                            </div>
                            {/* 👇 Explainer Video Here */}
                            <div className="mb-10">
                                <h2 className="text-2xl font-semibold mb-4 dark:text-gray-400 text-gray-800">
                                    Watch How It Works
                                </h2>

                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">
                                    Our Story
                                </h2>
                                <p>
                                    mapa.co.ke was founded with a vision to revolutionize property sales and e-commerce in Kenya. We are dedicated to
                                    providing an innovative platform where users can list, search, and purchase properties with ease and confidence.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">
                                    Join Our Community
                                </h2>
                                <p>
                                    Whether you&apos;re a property developer, buyer, or seller, mapa.co.ke is your trusted partner.
                                    Join our community today and explore a smarter way to buy and sell properties and products.
                                </p>
                                <p>
                                    Thank you for choosing <span className="font-semibold text-emerald-600">mapa.co.ke</span>.
                                    We look forward to serving you.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
            </main>
        </>
    );
}
