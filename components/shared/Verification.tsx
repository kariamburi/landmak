"use client";
import React, { useEffect, useState } from "react";
import ShowPopup from "./ShowPopup"; // Adjust the import path accordingly
import { v4 as uuidv4 } from "uuid";
import { createTransaction } from "@/lib/actions/transactions.actions";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { format, isToday, isYesterday } from "date-fns";
import { IUser } from "@/lib/database/models/user.model";
import { getVerfiesfee } from "@/lib/actions/verifies.actions";
import { useRouter } from "next/navigation";
import { VerificationPackId } from "@/constants";

interface SettingsProp {
  user: any;
  fee:string;
  userId: string;
  isAdCreator: boolean;
  handlePayNow: (id:string) => void;
}

const Verification: React.FC<SettingsProp> = ({
  user,
  userId,
  fee,
  isAdCreator,
  handlePayNow}:
  SettingsProp) => {

  //const _id = "662b9ab6dd4398a447257e59";
  const router = useRouter();
  //const [activationfee, setActivationFee] = useState(user.fee);

  const handlePay = async (
    packIdInput: string,
    packNameInput: string,
    periodInput: string,
    priceInput: string
  ) => {
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
     // router.push(`/pay/${response.orderTrackingId}`);
     handlePayNow(response.orderTrackingId)
    }
  };

  let formattedCreatedAt = "";
  try {
    const createdAtDate = new Date(user?.verified[0]?.verifieddate);
    if (isToday(createdAtDate)) {
      formattedCreatedAt = "Today " + format(createdAtDate, "HH:mm");
    } else if (isYesterday(createdAtDate)) {
      formattedCreatedAt = "Yesterday " + format(createdAtDate, "HH:mm");
    } else {
      formattedCreatedAt = format(createdAtDate, "dd-MM-yyyy");
      formattedCreatedAt += " " + format(createdAtDate, "HH:mm");
    }
  } catch {
    // Handle error when formatting date
  }

  const verifiedContent = (
    <div className="flex justify-between dark:bg-[#233338] dark:text-gray-300 bg-white">
      <svg
  xmlns="http://www.w3.org/2000/svg"
  className="w-4 h-4 text-blue-500 inline-block"
  viewBox="0 0 24 24"
  fill="currentColor"
>
  <path d="M12 0L15.09 8H24L17.455 13.09L20.545 21.09L12 16L3.455 21.09L6.545 13.09L0 8H8.91L12 0Z" />
</svg>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-emerald-600">
        Verified Seller
        </h4>
        <p className="text-sm">
          This seller account has been fully verified and is genuine.
        </p>
        <div className="flex items-center pt-2">
          <span className="text-[10px] text-muted-foreground">
            Verified since {formattedCreatedAt}
          </span>
        </div>
      </div>
    </div>
  );

  const unverifiedContentAdCreator = (
    <div className="flex dark:bg-[#233338] rounded-sm dark:text-gray-300 bg-white justify-between">
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2"
          viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M16.88 3.549a9 9 0 11-9.76 0M12 7v5l3 3" />
        </svg>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-[#ff0000]">
        Unverified Seller
        </h4>
        <p className="text-sm">
          This seller account is currently unverified. Request verification to enhance
          client confidence and attract more clients.
        </p>
        <div className="flex items-center pt-2">
          <button
            onClick={() => handlePay(VerificationPackId, "Verification", "0", fee)}
            className="flex gap-1 items-center hover:bg-black bg-[#30AF5B] text-white text-sm mt-2 p-1 rounded-lg shadow"
          >
            <CheckCircleIcon sx={{ marginRight: "5px" }} />
            Request Verification
          </button>
        </div>
      </div>
    </div>
  );

  const unverifiedContent = (
    <div className="flex gap-1 items-center dark:bg-[#233338] rounded-sm dark:text-gray-300 bg-white justify-between">
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2"
          viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M16.88 3.549a9 9 0 11-9.76 0M12 7v5l3 3" />
        </svg>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-gray-600">
          Unverified Seller
        </h4>
        <p className="text-sm">
          The seller&apos;s account has not been verified.
        </p>
      </div>
    </div>
  );

  return (
    <div className="items-center dark:bg-[#233338] rounded-sm dark:text-gray-300 bg-white justify-center">
      {user.verified && user?.verified[0]?.accountverified === true ? (
        <ShowPopup
          trigger={
            <p className="flex items-center gap-1 text-white p-1 bg-[#30AF5B] rounded-sm text-sm cursor-pointer hover:underline">
             <svg
  xmlns="http://www.w3.org/2000/svg"
  className="w-4 h-4 text-blue-500 inline-block"
  viewBox="0 0 24 24"
  fill="currentColor"
 
>
  <path d="M12 0L15.09 8H24L17.455 13.09L20.545 21.09L12 16L3.455 21.09L6.545 13.09L0 8H8.91L12 0Z" />
</svg>
              Verified Seller
            </p>
          }
          content={verifiedContent}
        />
      ) : (
        <>
          {isAdCreator ? (
            <ShowPopup
              trigger={
                <p className="flex gap-1 items-center text-gray-600 p-1 dark:text-gray-400 dark:bg-[#131B1E] bg-white rounded-sm text-sm cursor-pointer hover:underline">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2"
          viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M16.88 3.549a9 9 0 11-9.76 0M12 7v5l3 3" />
        </svg>
                  Unverified Seller
                </p>
              }
              content={unverifiedContentAdCreator}
            />
          ) : (
            <ShowPopup
              trigger={
                <p className="flex gap-1 items-center text-gray-600 p-1 dark:text-gray-400 dark:bg-[#131B1E] bg-white rounded-sm text-sm cursor-pointer hover:underline">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2"
          viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M16.88 3.549a9 9 0 11-9.76 0M12 7v5l3 3" />
        </svg>
                  Unverified Seller
                </p>
              }
              content={unverifiedContent}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Verification;
