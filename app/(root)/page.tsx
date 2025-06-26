// /app/page.tsx or /app/home/page.tsx

import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.actions";
import { getByUserIdLaons, getallPendingLaons } from "@/lib/actions/loan.actions";
import { Toaster } from "@/components/ui/toaster";
import MainPage from "@/components/shared/MainPage";

import {
  getAllCategoriesCached,
  getAllSubCategoriesCached,
  getAllPackagesCached,
  getAdsCountAllRegionCached
} from "@/lib/actions/cached.actions";
import EnhancedPropertySearch from "@/components/shared/EnhancedPropertySearch";
import MainView from "@/components/shared/MainView";

// ✅ ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function Home({ searchParams }: SearchParamProps) {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const userName = sessionClaims?.userName as string;
  const userImage = sessionClaims?.userImage as string;

  const queryObject = searchParams
    ? Object.fromEntries(
      Object.entries(searchParams).filter(([_, v]) => v !== undefined)
    )
    : {};

  let user: any = [];
  let myloans: any = [];

  if (userId) {
    [user, myloans] = await Promise.all([
      getUserById(userId),
      getByUserIdLaons(userId)
    ]);
  }

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
    getallPendingLaons() // not cached because it's dynamic
  ]);

  return (
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
  );
}
