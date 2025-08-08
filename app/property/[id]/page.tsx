import { getAdById } from '@/lib/actions/dynamicAd.actions';
import { notFound } from 'next/navigation';
import Head from 'next/head';
import EnhancedaAdViewSeo from '@/components/shared/EnhancedaAdViewSeo';
import { Toaster } from '@/components/ui/toaster';
import { headers } from 'next/headers';

type Props = {
    params: {
        id: string;
    };
};

export default async function PropertyPage({ params: { id } }: Props) {
    const userAgent = headers().get('user-agent') || '';
    const isHuman = !/bot|crawler|spider|crawl|slurp|facebookexternalhit|embed|preview/i.test(userAgent);

    let ad: any = [];
    let user: any = [];

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

    const sharedHead = (
        <Head>
            <title>{displayTitle} - {category} | mapa.co.ke</title>
            <meta name="description" content={description || 'Find properties for sale or rent in Kenya on mapa.co.ke'} />
            <meta name="keywords" content={`${category}, ${location}, mapa.co.ke`} />
            <meta property="og:title" content={displayTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={displayImage} />
            <meta property="og:url" content={`https://mapa.co.ke/property/${_id}`} />
            <link rel="canonical" href={`https://mapa.co.ke/property/${_id}`} />
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

    if (!isHuman) {
        return (
            <>
                {sharedHead}
                <main>
                    <h1>{ad.title}</h1>
                    <p>{ad.description}</p>
                    <img src={ad.images?.[0] || displayImage} alt={ad.title} />
                    <p>Price: {ad.price}</p>
                    <p>Location: {ad.location}</p>
                    <p>Posted by: {ad.organizer?.firstName || 'Seller'}</p>
                </main>
            </>
        );
    }

    // 👇 Human version: Render EnhancedaAdViewSeo with try-catch
    let enhancedContent = null;
    try {
        enhancedContent = (
            <EnhancedaAdViewSeo
                ad={ad}
                user={user}
                userId={user?.id || ''}
                userName={user?.name || ''}
                userImage={user?.image || ''}
                id={_id}
            />
        );
    } catch (err) {
        console.error('Failed to render EnhancedaAdViewSeo:', err);
    }

    return (
        <>
            {sharedHead}
            <main className="px-0 py-0">
                {enhancedContent || (
                    <div className="p-4 text-red-600">
                        Failed to load property view.
                    </div>
                )}
                <Toaster />
            </main>
        </>
    );
}
