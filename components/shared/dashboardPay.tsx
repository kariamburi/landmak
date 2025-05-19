"use client";
import { requeststkpush } from "@/lib/actions/requeststkpush";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { Requestcheckpayment } from "@/lib/actions/checkpayment";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { formatKsh } from "@/lib/help";
import { Toaster } from "../ui/toaster";
import Navbar from "./navbar";
import { mode } from "@/constants";
import { Button } from "../ui/button";
import Footersub from "./Footersub";

type payProps = {
  userId: string;
  recipientUid:string;
  trans: any;
  user:any;
  onClose: () => void;
  handleOpenSell: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenShop: (shopId:any) => void;
  handleOpenChatId: (value:string) => void;
  handleOpenSettings: () => void;
  handleOpenPerfomance: () => void;
  
};
const DashboardPay = ({ userId, trans,user, recipientUid, handleOpenPerfomance, handleOpenSettings,
  handleOpenShop, onClose, handleOpenSell,handleOpenChat, handleOpenBook, handleOpenPlan, handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety }: payProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(0);
  const [adsData, setAdsData] = useState(trans);

  const [deposit, setdeposit] = useState(
    trans.length > 0 ? trans[0].amount : 0
  );
  const [stkresponse, setstkresponse] = useState("");
  const [errorstkresponse, errorsetstkresponse] = useState("");
  const [payphone, setpayphone] = useState("");
  const [errordeposit, seterrordeposit] = useState("");
  const [errormpesaphone, seterrormpesaphone] = useState("");
  const [isSubmitting, setisSubmitting] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<any>([]);
  const [pay, setpay] = useState(
    trans.length > 0 ? trans[0].status : "Pending"
  );
  const [countryCode, setCountryCode] = useState("254"); // Default country code

  const tabs = [
    { title: "Pay", content: "Pay" },
    { title: "History", content: "History" },
  ];

  const [activeTabW, setActiveTabW] = useState(0);
  const tabW = [
    { title: "Withdraw", content: "withdraw" },
    { title: "History", content: "history" },
  ];
  const formatPhoneNumber = (input: any) => {
    // Remove all non-digit characters
    const cleaned = input.replace(/\D/g, "");

    // Apply formatting based on length
    if (cleaned.length < 4) {
      return cleaned;
    } else if (cleaned.length < 7) {
      return `${cleaned.slice(0, 3)}${cleaned.slice(3)}`;
    } else if (cleaned.length < 11) {
      return `${cleaned.slice(0, 3)}${cleaned.slice(3, 6)}${cleaned.slice(6)}`;
    } else {
      return `${cleaned.slice(0, 3)}${cleaned.slice(3, 6)}${cleaned.slice(
        6,
        10
      )}`;
    }
  };
  function removeLeadingZero(numberString: string) {
    // Check if the first character is '0'
    if (numberString.charAt(0) === "0") {
      // If yes, return the string without the first character
      return numberString.substring(1);
    } else {
      // If no, return the original string
      return numberString;
    }
  }
  function removeLeadingPlus(numberString: string) {
    // Check if the first character is '0'
    if (numberString.charAt(0) === "+") {
      // If yes, return the string without the first character
      return numberString.substring(1);
    } else {
      // If no, return the original string
      return numberString;
    }
  }
  const handleTopup = async (e: any) => {
    e.preventDefault();

    if (payphone.trim() === "") {
      seterrormpesaphone("Enter M-Pesa Phone Number");
      return;
    }
    try {
      setisSubmitting(true);
      const response = await requeststkpush(
        trans[0].orderTrackingId,
        removeLeadingPlus(countryCode) + removeLeadingZero(payphone),
        Number(deposit)
      );

      if (response === "success") {
        // console.log("RESPONSE    " + response);
        setstkresponse(
          "STK PUSH sent to your phone, Check Mpesa prompt, Enter your pin to complete deposit"
        );
        setdeposit("");
        setpayphone("");
        setisSubmitting(false);
        //  window.location.reload();
      } else {
        setisSubmitting(false);
        errorsetstkresponse("Error sending mpesa stk push");
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const orderTrackingId = trans[0].orderTrackingId; // Replace with your actual tracking ID

  const requestpaymentcheck = async (orderTrackingId: string) => {
    // Your function logic here
    const checkresponse = await Requestcheckpayment(orderTrackingId);
    // alert(checkresponse);
    if (checkresponse === "success") {
      setpay("Active");
      const receipt = {
        orderId: trans[0].orderTrackingId,
        //transactionId: paymentStatus.payment.transactionId,
        amount: deposit,
        date: new Date().toLocaleString(),
        phone: payphone,
      };
      setReceiptData(receipt);
      
// Optionally send email receipt
await fetch("/api/send-receipt", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
to: user.email,
subject: "Payment Receipt",
body: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f7f7f7; border-radius: 8px; color: #333;">
  <div style="text-align: center; margin-bottom: 30px;">
    <span style="display: inline-flex; align-items: center; gap: 6px;">
  <img src="https://mapa.co.ke/logo.png" alt="mapa Logo" style="height: 24px; width: auto; display: block;" />
  <span style="font-size: 16px; font-weight: bold; color: #16A34A;">mapa</span>
</span>
  </div>

  <h2 style="color: #16A34A;">Payment Receipt</h2>
  <p>Hello ${user.firstName || "Customer"},</p>
  <p>Thank you for your payment. Here are your receipt details:</p>

  <div style="margin: 20px 0; padding: 15px; background-color: #fff; border-left: 4px solid #16A34A; border-radius: 5px;">
    <p><strong>Order ID:</strong> ${receipt.orderId}</p>
    <p><strong>Amount:</strong> KES ${formatKsh(receipt.amount)}</p>
    <p><strong>Date:</strong> ${receipt.date}</p>
    <p><strong>Phone:</strong> ${receipt.phone}</p>
  </div>

  <p style="margin-top: 30px;">If you have any questions, please contact our support at <a href="mailto:support@mapa.co.ke">support@mapa.co.ke</a>.</p>

  <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />
  <p style="font-size: 12px; color: #999;">This email was sent by mapa (<a href="https://mapa.co.ke" style="color: #999;">mapa.co.ke</a>).</p>
</div>
`,
from: '"mapa" <support@mapa.co.ke>'
}),
});

      toast({
        title: "Order successful!",
        description: "Your subscription is successful",
        duration: 5000,
        className: "bg-black text-white",
      });
      // router.push(`/shop/${userId}`);
    }
    //console.log(`Requesting stk push for ${orderTrackingId}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      requestpaymentcheck(orderTrackingId);
      //  setpay(trans[0].status);
      // alert("check");
    }, 5000); // 1000 ms = 1 second

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [orderTrackingId, adsData]); // Dependency array to watch the orderTrackingId
const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
  
      useEffect(() => {
         const savedTheme = localStorage.getItem("theme") || mode; // Default to "dark"
         const isDark = savedTheme === mode;
         
         setIsDarkMode(isDark);
         document.documentElement.classList.toggle(mode, isDark);
       }, []);
     
       useEffect(() => {
         if (isDarkMode === null) return; // Prevent running on initial mount
     
         document.documentElement.classList.toggle(mode, isDarkMode);
         localStorage.setItem("theme", isDarkMode ? "dark" : "light");
       }, [isDarkMode]);
     
       if (isDarkMode === null) return null; // Avoid flickering before state is set
     
  if (trans.length === 0) {
    return (
      <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-lg border py-28 text-center">
        <h3 className="p-bold-20 md:h5-bold">No order found!</h3>
        <p className="p-regular-14">No data</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen dark:bg-[#131B1E] h-screen text-black dark:text-[#F1F3F3] bg-[#e4ebeb]">
     <div className="top-0 z-10 fixed w-full">
                        <Navbar user={user}  userstatus={user.status} userId={userId} onClose={onClose} popup={"pay"} handleOpenSell={handleOpenSell} handleOpenBook={handleOpenBook} handleOpenPlan={handleOpenPlan} handleOpenChat={handleOpenChat}
                         handleOpenPerfomance={handleOpenPerfomance}
                         handleOpenSettings={handleOpenSettings}
                         handleOpenAbout={handleOpenAbout}
                         handleOpenTerms={handleOpenTerms}
                         handleOpenPrivacy={handleOpenPrivacy}
                         handleOpenSafety={handleOpenSafety} 
                         handleOpenShop={handleOpenShop}/>
                        </div>
    <div className="max-w-6xl mx-auto flex mt-[60px] mb-0 p-1">
  <div className="fixed w-full h-screen">
      <div className="p-1">
        <div className="p-1 max-w-3xl bg-[#e4ebeb] lg:bg-white mx-auto mb-2 border rounded-lg">
          <div className="p-0 w-full items-center">
            <div className="flex flex-col items-center rounded-t-lg w-full p-1">
              <div className="gap-1 h-[450px] mt-2 items-center w-full rounded-lg">
                <div className="">
                  <div className="flex flex-col items-center">
                    <div className="flex flex-col rounded-lg dark:bg-[#2D3236] bg-[#e4ebeb] lg:bg-white p-2 mb-2 w-full">
                      <div className="flex justify-between w-full items-center">
                        <div className="flex gap-1 items-center">
                          <div className="font-bold text-grey-900 font-bold p-2">
                            Plan
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="font-bold p-2">{trans[0].plan}</div>
                        </div>
                      </div>

                      <div className="p-1">
                        <div className="flex justify-between w-full items-center">
                          <div className="flex gap-1 text-[12px] lg:text-xs items-center">
                            Order Tracking Id:
                          </div>
                          <div className="flex text-[12px] lg:text-xs font-bold items-center">
                            {trans[0].orderTrackingId}
                          </div>
                        </div>

                        {trans[0].plan === "Verification" ? (
                          <>
                            <div className="flex justify-between w-full items-center">
                              <div className="flex gap-1 text-[12px] lg:text-xs items-center">
                                Description:
                              </div>
                              <div className="flex text-[12px] lg:text-xs font-bold items-center">
                                One-time Account verification fee
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between w-full items-center">
                              <div className="flex gap-1 text-[12px] lg:text-xs items-center">
                                Period:
                              </div>
                              <div className="flex text-[12px] lg:text-xs font-bold items-center">
                                {trans[0].period}
                              </div>
                            </div>
                            <div className="flex justify-between w-full items-center">
                              <div className="flex text-[12px] lg:text-xs gap-1 items-center">
                                Allowable Ads:
                              </div>
                              <div className="flex text-[12px] lg:text-xs font-bold items-center">
                                {trans[0].planId.list}
                              </div>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between w-full items-center">
                          <div className="flex gap-1 text-[12px] lg:text-xs items-center">
                            Status:
                          </div>
                          <div className="flex items-center">
                            <div
                              className={`flex flex-col mt-1 text-[12px] lg:text-xs p-1 text-white justify-center items-center w-[70px] rounded-full ${
                                pay === "Pending"
                                  ? "bg-yellow-600"
                                  : pay === "Failed"
                                  ? "bg-red-600 "
                                  : "bg-green-600"
                              }`}
                            >
                              {pay}
                            </div>
                          </div>
                        </div>
                      </div>

                      {pay === "Pending" ? (
                        <>
                          <div className="flex justify-between w-full items-center">
                            <div className="flex gap-1 items-center">
                              <div className="dark:text-gray-300 text-grey-900 font-bold p-2">
                                Amount
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="dark:text-gray-300 text-black font-bold p-2">
                                {formatKsh(trans[0].amount)}
                              </div>
                            </div>
                          </div>
                          <div className="text-lg p-1 dark:text-gray-300 text-gray-900">
                            Pay via MPESA EXPRESS
                          </div>
                          <div className="flex flex-col gap-1 mb-4 w-full">
                            <TextField
                              id="outlined-password-input"
                              label="M-Pesa Phone Number"
                              type="text"
                              value={payphone}
                              onChange={(e) =>
                                setpayphone(formatPhoneNumber(e.target.value))
                              }
                              variant="outlined"
                              placeholder={`M-Pesa Phone Numbers`}
                              InputProps={{
                                classes: {
                                  root: "dark:bg-[#131B1E] dark:text-gray-100",
                                  notchedOutline:
                                    "border-gray-300 dark:border-gray-600",
                                  focused: "",
                                },
                              }}
                              InputLabelProps={{
                                classes: {
                                  root: "text-gray-500 dark:text-gray-400",
                                  focused: "text-green-500 dark:text-green-400",
                                },
                              }}
                              className="w-full"
                            />
                            <div className="text-red-400">
                              {errormpesaphone}
                            </div>
                          </div>
                          <Button
                            onClick={handleTopup}
                            variant="default"
                            disabled={isSubmitting}
                            className="w-full bg-green-600 text-white hover:bg-green-700 mt-2 shadow"
                          >
                            {isSubmitting ? "Sending request..." : `Pay Now`}
                          </Button>
                          {stkresponse && (
                            <div className="mt-2 text-green-700 text-sm bg-green-100 rounded-lg w-full p-2 items-center">
                              {stkresponse}
                            </div>
                          )}
                          {errorstkresponse && (
                            <div className="mt-1 text-red-800 text-sm bg-red-100 rounded-lg w-full p-2 items-center">
                              {errorstkresponse}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                           <div className="mt-10 p-4 border rounded-lg shadow-sm bg-white text-gray-800">
  {/* Receipt Header */}
  <div className="text-2xl font-bold mb-2">Payment Receipt</div>

  {/* Receipt Details */}
  <div className="space-y-1 text-sm">
 
    <div><span className="font-semibold">Receipt ID:</span> #{receiptData.orderId}</div>
    <div><span className="font-semibold">Amount Paid:</span> KES {formatKsh(receiptData.amount)}</div>
    <div><span className="font-semibold">Phone:</span> {receiptData.phone}</div>
    <div><span className="font-semibold">Date:</span> {receiptData.date}</div>
    <div><span className="font-semibold">Payment Method:</span> M-Pesa</div>
    <div><span className="font-semibold">Transaction Status:</span> <span className="text-green-600 font-medium">Successful</span></div>
  </div>

  {/* Paid & Navigation Buttons */}
  <div className="flex gap-1 mt-6 items-center">
    
    <div className="flex gap-2 w-full">
      <Button
        variant="outline"
        onClick={onClose}
      >
        Home
      </Button>
      <Button
        variant="outline"
        onClick={()=> handleOpenShop(user)}
      >
        My Shop
      </Button>
    </div>
  </div>
</div>

                        </>
                      )}
                    </div>
                    {/*<div className="flex flex-col rounded-lg bg-gray-100 w-full p-2 mb-2">
                          <div className="text-lg p-1 text-gray-900">
                            2. Deposit Via Paybill No
                          </div>
                          <div className="text-sm p-1 font-bold text-gray-900">
                            <ul className="w-full text-sm">
                              <li className="flex gap-2">
                                <div className="text-xl text-gray-600">
                                  Paybill:
                                </div>{" "}
                                <div className="font-bold text-xl text-green-600">
                                  {paybill}
                                </div>
                              </li>
                              <li className="flex gap-2">
                                <div className="text-xl text-gray-600">
                                  Account:
                                </div>{" "}
                                <div className="font-bold text-xl text-green-600">
                                  {userID}
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                        */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Toaster />
      </div>
      
    </div>
  );
};

export default DashboardPay;
