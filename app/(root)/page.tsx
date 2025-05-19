import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.actions";
import { Toaster } from "@/components/ui/toaster";
import { getAllCategories, seedCategories } from "@/lib/actions/category.actions";
import { duplicateSubcategories, getAllSubCategories, migrateFieldOptions, removenegotiable, reverseFieldOptions, syncSubcategoryImages, updateSub, updatethisCategory } from "@/lib/actions/subcategory.actions";
import { getAdsCountAllRegion, getAllAds } from "@/lib/actions/dynamicAd.actions";
import MainPage from "@/components/shared/MainPage";
import { getallPendingLaons, getByUserIdLaons, getLoanById } from "@/lib/actions/loan.actions";
import { getAllPackages } from "@/lib/actions/packages.actions";

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
    user = await getUserById(userId);
    myloans = await getByUserIdLaons(userId);
  }
  const categoryList = await getAllCategories();
  const subcategoryList = await getAllSubCategories();
  const packagesList = await getAllPackages();
  const AdsCountPerRegion = await getAdsCountAllRegion();
  const loans = await getallPendingLaons();
 
  //const migration = await syncSubcategoryImages("68144b998d7305e3676767a0");
  //console.log(subcategoryList);
 
//const categoryList:any = [];
//const subcategoryList:any = [];
//const AdsCountPerRegion:any = [];
  return (
   <main>
    
     <MainPage 
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