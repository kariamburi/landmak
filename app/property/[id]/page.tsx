import { getAdById } from '@/lib/actions/dynamicAd.actions';
import { notFound } from 'next/navigation';
import Head from 'next/head';
import EnhancedaAdView from '@/components/shared/EnhancedaAdView';
import { Toaster } from '@/components/ui/toaster';
import { auth } from "@clerk/nextjs/server";
import { getUserById } from '@/lib/actions/user.actions';
import EnhancedaAdViewSeo from '@/components/shared/EnhancedaAdViewSeo';
type Props = {
    params: {
        id: string;
    };
};

export default async function PropertyPage({ params: { id } }: Props) {
    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;
    const userName = sessionClaims?.userName as string;
    const userImage = sessionClaims?.userImage as string;
    let user: any = [];
    let myloans: any = [];

    if (userId) {
        [user] = await Promise.all([
            getUserById(userId)
        ]);
    }
    const ad = await getAdById(id);

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

    const {
        data: {
            title,
            description,
            price,
            imageUrl = [],
            propertyadrea = {},
        } = {},
        category = 'Real Estate',
        _id,
    } = ad;

    const displayImage = imageUrl[0] || '/fallback.jpg';
    const displayTitle = title || 'Property Details';
    const location = propertyadrea.myaddress || 'Kenya';

    return (
        <>
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

            <main className="px-0 py-0">

                <EnhancedaAdViewSeo
                    ad={ad}
                    user={user}
                    userId={userId}
                    userName={userName}
                    userImage={userImage}
                    id={ad._id}
                />

                <Toaster />
            </main>

        </>
    );
}
