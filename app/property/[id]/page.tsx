import { getAdById } from '@/lib/actions/dynamicAd.actions';
import Head from 'next/head';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

type Props = {
    params: {
        id: string;
    };
};

export default async function PropertyPage({ params: { id } }: Props) {
    const userAgent = headers().get('user-agent') || '';
    const isBot = /googlebot|bingbot|yandex|duckduckbot/i.test(userAgent);

    let ad: any = null;

    try {
        ad = await getAdById(id);
    } catch (error) {
        console.error('Failed to fetch ad:', error);
    }

    if (!ad) {
        return (
            <>
                <Head>
                    <title>Property Not Found | mapa.co.ke</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Head>
                <main className="p-6 text-center">
                    <h1 className="text-2xl font-bold">Property not found</h1>
                    <p>Please check the URL or search again.</p>
                </main>
            </>
        );
    }

    const { data = {}, category = 'Real Estate', _id } = ad;
    const {
        title,
        description,
        price,
        imageUrl = [],
        propertyadrea = {},
    } = data;

    const displayImage = imageUrl[0] || '/fallback.jpg';
    const displayTitle = title || 'Property Details';
    const location = propertyadrea.myaddress || 'Kenya';
    const url = `https://mapa.co.ke/?Ad=${_id}`;

    const sharedHead = (
        <Head>
            <title>{displayTitle} - {category} | mapa.co.ke</title>
            <meta name="description" content={description || 'Find properties for sale or rent in Kenya on mapa.co.ke'} />
            <meta name="keywords" content={`${category}, ${location}, mapa.co.ke`} />
            <meta property="og:title" content={displayTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={displayImage} />
            <meta property="og:url" content={url} />
            <link rel="canonical" href={url} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Residence",
                        name: displayTitle,
                        description,
                        image: displayImage,
                        address: {
                            "@type": "PostalAddress",
                            addressLocality: location,
                        },
                        offers: {
                            "@type": "Offer",
                            priceCurrency: "KES",
                            price,
                            availability: "https://schema.org/InStock",
                        },
                    }),
                }}
            />
        </Head>
    );

    // Bot-friendly minimal HTML
    if (isBot) {
        return (
            <>
                {sharedHead}
                <main>
                    <h1>{displayTitle}</h1>
                    <p>{description}</p>
                    <img src={displayImage} alt={displayTitle} />
                    <p>Price: {price}</p>
                    <p>Location: {location}</p>
                    <p>Posted by: {ad.organizer?.firstName || 'Seller'}</p>
                </main>
            </>
        );
    }

    // Human users should be redirected to /
    if (!isBot) {
        if (typeof window !== 'undefined') {
            window.location.href = `/?Ad=${_id}`;
        }

        return (
            <>
                {sharedHead}
                <main className="p-6 text-center">
                    <h1 className="text-2xl font-bold">Redirecting...</h1>
                    <p>If not redirected, <a href={`/?Ad=${_id}`} className="text-green-600 underline">click here</a>.</p>
                </main>
            </>
        );
    }
}
