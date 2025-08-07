import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import Head from "next/head";

import { getUserById } from "@/lib/actions/user.actions";
import { getByUserIdLaons, getallPendingLaons } from "@/lib/actions/loan.actions";
import { getAllCategoriesCached, getAllSubCategoriesCached, getAllPackagesCached, getAdsCountAllRegionCached } from "@/lib/actions/cached.actions";

import MainView from "@/components/shared/MainView";
import { Toaster } from "@/components/ui/toaster";

// ✅ ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function Home({ searchParams }: SearchParamProps) {
  // Correctly detect Googlebot and other crawlers using the User-Agent header
  const userAgent = headers().get('user-agent') || '';
  const isBot = /googlebot|bingbot|yandex|duckduckbot/i.test(userAgent);


  let user: any = [];
  let myloans: any = [];
  let userId = "";
  let userName = "";
  let userImage = "";

  if (!isBot) {
    try {
      const sessionClaims = auth().sessionClaims;
      userId = sessionClaims?.userId as string;
      userName = sessionClaims?.userName as string;
      userImage = sessionClaims?.userImage as string;

      [user, myloans] = await Promise.all([
        getUserById(userId),
        getByUserIdLaons(userId)
      ]);
    } catch (error) {
      console.error("Auth/user fetch failed:", error);
    }
  }

  const queryObject = searchParams
    ? Object.fromEntries(
      Object.entries(searchParams).filter(([_, v]) => v !== undefined)
    )
    : {};

  const [
    categoryList,
    subcategoryList,
    packagesList,
    AdsCountPerRegion,
    loans
  ] = await Promise.all([
    getAllCategoriesCached(),
    getAllSubCategoriesCached(),
    getAllPackagesCached(),
    getAdsCountAllRegionCached(),
    getallPendingLaons()
  ]);

  if (isBot) {
    return (
      <>
        <Head>
          <title>Buy or Rent Properties in Kenya | mapa.co.ke</title>
          <meta name="description" content="Discover properties for sale and rent across Kenya. mapa.co.ke offers homes, land, rentals, and more!" />
          <meta name="robots" content="index, follow" />
          <meta property="og:title" content="Properties in Kenya - mapa.co.ke" />
          <meta property="og:description" content="Explore homes, land, rentals, and commercial properties in Kenya." />
          <meta property="og:image" content="/og-image.jpg" />
          <meta property="og:url" content="https://mapa.co.ke/" />
          <link rel="canonical" href="https://mapa.co.ke/" />
        </Head>
        <main className="p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Find Properties in Kenya</h1>
          <p className="mb-4">Browse real estate listings for rent or sale on mapa.co.ke.</p>
          <ul className="list-disc mx-auto max-w-lg text-left">
            {categoryList?.slice(0, 6).map((cat: any) => (
              <li key={cat._id}>{cat.name}</li>
            ))}
          </ul>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Buy or Rent Properties in Kenya | mapa.co.ke</title>
        <meta name="description" content="Discover properties for sale and rent across Kenya. mapa.co.ke offers homes, land, rentals, and more!" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Properties in Kenya - mapa.co.ke" />
        <meta property="og:description" content="Explore homes, land, rentals, and commercial properties in Kenya." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://mapa.co.ke/" />
        <link rel="canonical" href="https://mapa.co.ke/" />
      </Head>
      <main>
        <MainView
          emptyTitle="No Ads Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Ads"
          limit={20}
          userprofile={user}
          userId={userId}
          userName={userName}
          userImage={userImage}
          queryObject={queryObject}
          categoryList={categoryList}
          subcategoryList={subcategoryList}
          packagesList={packagesList}
          AdsCountPerRegion={AdsCountPerRegion}
          loans={loans}
          myloans={myloans}
        />
        <Toaster />
      </main>
    </>
  );
}
