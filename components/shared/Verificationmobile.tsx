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
import ShowPopupmobile from "./ShowPopupmobile";
import { VerificationPackId } from "@/constants";

interface SettingsProp {
  user: any;
  userId: string;
  fee:string;
  isAdCreator: boolean;
  handlePayNow: (id:string) => void;
}

const Verificationmobile: React.FC<SettingsProp> = ({
  user,
  userId,
  fee,
  isAdCreator,
  handlePayNow,
}) => {
  
  const router = useRouter();
  const [activationfee, setActivationFee] = useState(500);

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
      //router.push(`/pay/${response.orderTrackingId}`);
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
    <div className="flex justify-between space-x-4">
      <VerifiedUserOutlinedIcon
        sx={{ fontSize: 24 }}
        className="text-emerald-600"
      />
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
    <div className="flex justify-between space-x-4">
      <ShieldOutlinedIcon sx={{ fontSize: 24 }} className="text-[#ff0000]" />
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
            className="flex gap-1 items-center hover:bg-black bg-[#30AF5B] text-white text-xs mt-2 p-1 rounded-lg shadow"
          >
            <CheckCircleIcon sx={{ marginRight: "5px" }} />
            Request Verification
          </button>
        </div>
      </div>
    </div>
  );

  const unverifiedContent = (
    <div className="flex justify-between space-x-4">
      <ShieldOutlinedIcon sx={{ fontSize: 24 }} className="text-[#ff0000]" />
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-[#ff0000]">
        Unverified Seller
        </h4>
        <p className="text-sm">
          The seller&apos;s account has not been verified.
        </p>
      </div>
    </div>
  );

  return (
    <div className="items-center justify-center">
      {user.verified && user?.verified[0]?.accountverified === true ? (
        <ShowPopupmobile
          trigger={
            <p className="text-white p-1 bg-[#30AF5B] rounded-sm text-sm cursor-pointer hover:underline">
              <VerifiedUserOutlinedIcon sx={{ fontSize: 14 }} />
              Verified Seller
            </p>
          }
          content={verifiedContent}
        />
      ) : (
        <>
          {isAdCreator ? (
            <ShowPopupmobile
              trigger={
                <p className="text-gray-600 p-1 dark:text-gray-400 dark:bg-[#131B1E] bg-white rounded-sm text-sm cursor-pointer hover:underline">
                  <ShieldOutlinedIcon sx={{ fontSize: 14 }} />
                  Unverified Seller
                </p>
              }
              content={unverifiedContentAdCreator}
            />
          ) : (
            <ShowPopupmobile
              trigger={
                <p className="text-gray-600 p-1 dark:text-gray-400 dark:bg-[#131B1E] bg-white rounded-sm text-sm cursor-pointer hover:underline">
                  <ShieldOutlinedIcon sx={{ fontSize: 14 }} />
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

export default Verificationmobile;
