"use server";

import HomeDashboard from "@/components/shared/HomeDashboard";
import Navbar from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/toaster";
import {
  getAllCategories,
  getselectedCategories,
} from "@/lib/actions/category.actions";
import { getTotalProducts } from "@/lib/actions/dynamicAd.actions";
import { getallReported } from "@/lib/actions/report.actions";
import {
  getallcategories,
  getselectedsubcategories,
} from "@/lib/actions/subcategory.actions";
import {
  getallTransactions,
  getStatusTrans,
} from "@/lib/actions/transactions.actions";
import { getAllUsers } from "@/lib/actions/user.actions";
import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";

const Home = async ({ searchParams }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const userName = sessionClaims?.userName as string;
  const userImage = sessionClaims?.userImage as string;
  const transactionId = (searchParams?.transactionId as string) || "";
  const end = (searchParams?.end as string) || "";
  const start = (searchParams?.start as string) || "";
  const category = (searchParams?.category as string) || "";
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 50;
  const users = await getAllUsers(limit, page);
  const reported = await getallReported(limit, page);
  const transactions = await getallTransactions(
    transactionId,
    start,
    end,
    limit,
    page
  );
  const adSum = await getTotalProducts();
  const transactionSum = await getStatusTrans();
  const categories = await getAllCategories();
  const subcategories = await getselectedsubcategories(category);
  const catList = await getselectedCategories();
  const fee = await getVerifyfee();
//console.log(reported);
  return (
   
        <HomeDashboard
          userId={userId}
          userName={userName}
          userImage={userImage}
          users={users}
          limit={limit}
          page={page}
          transactions={transactions}
          adSum={adSum}
          transactionSum={transactionSum}
          categories={categories}
          subcategories={subcategories}
          catList={catList}
          reported={reported}
          vfee={fee}
        />
      
  );
};

export default Home;
