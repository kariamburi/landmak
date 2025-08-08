// app/google-home/page.tsx

import { Metadata } from 'next';
import Head from 'next/head';

export const metadata: Metadata = {
    title: 'Mapa.co.ke | Buy & Sell Property and Products in Kenya',
    description:
        "Explore mapa.co.ke, Kenya's top online marketplace for land, houses, and general products. Enjoy features like virtual tours, 3D property views, and advanced mapping.",
    keywords: [
        'Kenya real estate',
        'Buy land Kenya',
        'Sell property online Kenya',
        'Virtual tours Kenya',
        '3D property modeling',
        'Property mapping Kenya',
        'Mapa Kenya',
        'Mapa marketplace',
        'Online property sales Kenya',
        'Mapa.co.ke properties',
        'Kenya e-commerce',
        'Map-based real estate'
    ],
    openGraph: {
        title: "Mapa.co.ke | Kenya's Smart Property and Product Marketplace",
        description:
            "Buy and sell land, houses, and general products on mapa.co.ke. Experience immersive virtual tours and advanced property mapping.",
        url: 'https://mapa.co.ke',
        siteName: 'Mapa.co.ke',
        type: 'website',
        images: [
            {
                url: 'https://mapa.co.ke/assets/images/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Mapa.co.ke - Real Estate and Products in Kenya',
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Mapa.co.ke | Kenya's Smart Property and Product Marketplace",
        description:
            'Discover the future of property and product listings in Kenya. Buy, sell, and connect on mapa.co.ke.',
        images: ['https://mapa.co.ke/assets/images/og-image.png'],
    },
    alternates: {
        canonical: 'https://mapa.co.ke',
    }
};

export default function GoogleHomePage() {
    return (
        <>
            <Head>
                <link rel="canonical" href="https://mapa.co.ke" />

                {/* Structured Data: Organization */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: "Mapa.co.ke",
                            url: "https://mapa.co.ke",
                            logo: "https://mapa.co.ke/logo.png",
                            sameAs: [
                                "https://www.facebook.com/profile.php?id=100069565115237",
                                "https://www.instagram.com/mapa.appkenya",
                                "https://www.tiktok.com/@mapakenya"
                            ],
                            contactPoint: {
                                "@type": "ContactPoint",
                                telephone: "+254769722932",
                                contactType: "customer service",
                                areaServed: "KE",
                                availableLanguage: ["English", "Swahili"]
                            }
                        })
                    }}
                />

                {/* Structured Data: Website */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            name: "Mapa.co.ke",
                            url: "https://mapa.co.ke",
                            potentialAction: {
                                "@type": "SearchAction",
                                target: "https://mapa.co.ke/search?q={search_term_string}",
                                "query-input": "required name=search_term_string"
                            }
                        })
                    }}
                />
            </Head>

            <main className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-center mb-6">Welcome to mapa.co.ke</h1>

                <p className="text-lg mb-4">
                    mapa.co.ke is Kenya&apos;s premier online marketplace for properties and general products.
                    Whether you&apos;re looking to buy land, a house, or merchandise, our platform connects buyers and sellers across the country with ease.
                </p>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
                    <p>
                        To simplify buying and selling using smart tools like virtual tours, 3D modeling, and Google property mapping. We ensure a seamless, transparent, and secure experience for all.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Why Choose Us?</h2>
                    <ul className="list-disc list-inside space-y-1">
                        <li>📍 Advanced Property Mapping</li>
                        <li>🏠 Immersive Virtual Tours & 3D Modeling</li>
                        <li>🛒 Diverse Listings of Properties & Products</li>
                        <li>🔒 Secure, Trusted Transactions</li>
                        <li>💬 Direct Communication Between Buyers & Sellers</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Our Story</h2>
                    <p>
                        Founded to revolutionize the Kenyan real estate and e-commerce space, mapa.co.ke empowers users with technology to make informed and confident buying or selling decisions.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Join Our Community</h2>
                    <p>
                        Whether you&apos;re a property developer, agent, or buyer, mapa.co.ke is your ideal platform.
                        Sign up today and discover a smarter way to buy and sell in Kenya.
                    </p>
                </section>

                <p className="text-center mt-10 text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} mapa.co.ke. All rights reserved.
                </p>
            </main>
        </>
    );
}
