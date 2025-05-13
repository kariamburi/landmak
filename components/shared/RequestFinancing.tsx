"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import {
    addDoc,
    collection,
    getDocs,
    query,
    serverTimestamp,
    where,
  } from "firebase/firestore";
  import { db } from "@/lib/firebase";
import { useToast } from "../ui/use-toast";
import { AdminId } from "@/constants";
import { updateabused } from "@/lib/actions/dynamicAd.actions";
import { createReport } from "@/lib/actions/report.actions";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive"; // Detect mobile screens
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { formatKsh } from "@/lib/help";
import Image from "next/image";
import { Input } from "../ui/input";
import sanitizeHtml from "sanitize-html";
import { createLoan } from "@/lib/actions/loan.actions";
import CircularProgress from "@mui/material/CircularProgress";
interface loanProps {
    userId:string;
    userName:string;
    userImage:string;
    ad:any
  isOpen: boolean;
  onClose: () => void;

}

export const RequestFinancing: React.FC<loanProps> = ({ ad, isOpen,userId, userImage, userName, onClose }) => {
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [loanterm, setLoanterm] = useState("");
  const [loanType, setLoanType] = useState("Property Financing");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [messageComments, setMessageComments] = useState("");
  const [isSending, setIsSending] = useState(false); // New state for sending status
  const { toast } = useToast();
  const pathname = usePathname();
   const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile screens
  const truncateDescription = (description: string, charLimit: number) => {
        const safeMessage = sanitizeHtml(description); 
        const truncatedMessage =
        safeMessage.length > charLimit
          ? `${safeMessage.slice(0, charLimit)}...`
          : safeMessage;
        return truncatedMessage;
      };
 const handleSubmit = async () => {
    // Logic to handle report submission
    // For example, send data to the admin via an API call
    if (!monthlyIncome) {
       // alert("Please select a reason.");

        toast({
            variant: "destructive",
            title: "Failed!",
            description: "Please enter Monthly Income..",
            duration: 5000,
          });
        return;
      }
        if (!deposit) {
        toast({
            variant: "destructive",
            title: "Failed!",
            description: "Please enter Deposit Amount.",
            duration: 5000,
          });
        return;
      }
        if (!loanterm) {
        toast({
            variant: "destructive",
            title: "Failed!",
            description: "Please select Preffered Loan Terms.",
            duration: 5000,
          });
        return;
      }
    
    if (!employmentStatus) {

        toast({
            variant: "destructive",
            title: "Failed!",
            description: "Please enter your Employment Status.",
            duration: 5000,
          });
        return;
      }
      try{
     setIsSending(true); // Disable the button and show progress

      const newResponse = await createLoan({
        loan: {
          userId: userId,
          adId: ad._id,
           loanType,
         monthlyIncome,
    deposit,
    loanterm,
    employmentStatus,
    messageComments,
    status: "Pending",
        },
        path: pathname,
      });
      if (newResponse === "Property Financing Requested submitted") {
       
        toast({
          title: "Alert",
          description: newResponse,
          duration: 5000,
          className: "bg-[#30AF5B] text-white",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed!",
          description: newResponse,
          duration: 5000,
        });
      }
  
      // Reset and close the popup after submission
      setDeposit(0);
      setMonthlyIncome(0);
      setEmploymentStatus("");
      setMessageComments("");
       setLoanterm("");
      onClose();
     } catch (error) {
      console.error("Error submitting: ", error);
    } finally {
      setIsSending(false); // Re-enable the button and hide progress
    }
  };
  const formatToCurrency = (value: string | number) => {
    if (!value) return "0";
    const numberValue =
      typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numberValue);
  };
   const parseCurrencyToNumber = (value: string): number => {
    // Remove any commas from the string and convert to number
    return Number(value.replace(/,/g, ""));
  };
  return (<>
     {isMobile && isOpen ? (
               
                  // Fullscreen Popover for Mobile
                  <div className="fixed inset-0 z-20 bg-[#e4ebeb] dark:bg-[#222528] dark:text-gray-100 p-4 flex flex-col">
                    <div className="flex w-full gap-2 items-center dark:bg-[#131B1E] border-b pb-2">
                                                                                         
                                    <button
                                  onClick={onClose}
                                  className="flex justify-center p-2 items-center text-gray-600 dark:text-[#e4ebeb] dark:hover:bg-gray-700 hover:text-green-600 rounded-full">
                                                                                            <ArrowBackOutlinedIcon />
                                                                                          </button>
                                                                                         <p className="font-bold"> Financing Request Form</p>
                                                                                        </div>

                      {/* Report Reason Select */}
                      <div className="flex gap-1 flex-col justify-center items-center">
                        
                     <div className="flex gap-4 w-full items-start"> {/* Changed items-center to items-start for top alignment */}
  <Image
    src={ad.data.imageUrls[0]}
    alt={ad.data.title}
    className="w-[150px] h-[100px] object-cover rounded"
    width={150}
    height={100}
  />
  <div className="flex flex-col justify-between h-full"> {/* Ensures vertical spacing if needed */}
    <p className="font-semibold mb-1">
      {ad.data.title.length > 50
        ? `${ad.data.title.substring(0, 50)}...`
        : ad.data.title}
    </p>
    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
      <span
        dangerouslySetInnerHTML={{
          __html: truncateDescription(ad.data.description ?? "", 65),
        }}
      />
    </p>
    <span className="font-bold text-green-600 dark:text-green-600 mt-1">
      {formatKsh(ad.data.price)}
    </span>
  </div>
</div>


        <div className="flex gap-2 items-center w-full">
          <label className="text-sm w-[200px]">Monthly Income: KES</label>
          <input
            type="text"
            value={formatToCurrency(monthlyIncome ?? 0)}
            onChange={(e) =>
              setMonthlyIncome(parseCurrencyToNumber(e.target.value))
            }
            placeholder="Monthly income"
            className="px-4 py-2 w-full border border-gray-800 rounded-md dark:bg-[#131B1E] dark:text-gray-100"
          />
        </div>

         <div className="flex gap-2 items-center w-full">
          <label className="text-sm w-[200px]">Deposit Amount: KES</label>
          <input
            type="text"
            value={formatToCurrency(deposit ?? 0)}
            onChange={(e) =>
              setDeposit(parseCurrencyToNumber(e.target.value))
            }
            placeholder="Deposit"
            className="px-4 py-2 w-full border border-gray-800 rounded-md dark:bg-[#131B1E] dark:text-gray-100"
          />
        </div>

      <div className="flex gap-2 items-center w-full">
          <label className="text-sm w-[200px]">Employment Status:</label>
           <Select onValueChange={setEmploymentStatus}>
          <SelectTrigger className="w-full text-base border p-2 rounded-md dark:text-gray-300 text-gray-700">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent className="text-base">
            <SelectItem value="Employed">Employed</SelectItem>
            <SelectItem value="Self-employed">Self-employed</SelectItem>
            <SelectItem value="Business Owner">Business Owner</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
            
          </SelectContent>
        </Select>
        </div>
      <div className="flex gap-2 items-center w-full">
          <label className="text-sm w-[200px]">Preferred Loan Term:</label>
          <Select onValueChange={setLoanterm}>
          <SelectTrigger className="w-full text-base border p-2 rounded-md dark:text-gray-300 text-gray-700">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent className="text-base">
            <SelectItem value="12 months">12 months</SelectItem>
            <SelectItem value="24 months">24 months</SelectItem>
            <SelectItem value="36 months">36 months</SelectItem>
            <SelectItem value="48 months">48 months</SelectItem>
            <SelectItem value="60 months">60 months</SelectItem>
           

          </SelectContent>
        </Select>
        </div>
       
       
       
       

        {/* Description Textarea */}
        <Textarea
          value={messageComments}
          onChange={(e) => setMessageComments(e.target.value)}
          placeholder="Any comment (optional)"
          maxLength={300}
          className="w-full text-base dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-2"
        />

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
           disabled={isSending}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
        >
         <div className="flex gap-1 items-center">
                          {isSending && (
                            <CircularProgress sx={{ color: "white" }} size={30} />
                          )}
                          {isSending ? "Submitting..." : " Submit request"}
                        </div>
        </Button>
        </div>
                    </div>
     ):(
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md bg-[#e4ebeb] dark:bg-[#2D3236] dark:text-gray-300 rounded-lg shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="font-medium dark:text-gray-300 text-gray-800">
           Financing Request Form
          </DialogTitle>
        </DialogHeader>

<div className="flex gap-2 w-full items-center">
        <Image
                                      src={ad.data.imageUrls[0]}
                                      alt={ad.data.title}
                                      className="w-[150px] h-[100px] object-cover mb-2 rounded"
                                      width={700} // Adjust width as needed
                                      height={400} // Adjust height as needed
                                    />
         <div className="flex flex-col"> 
                                  <p className="font-semibold mb-2">{ad.data.title.length > 50
                                        ? `${ad.data.title.substring(0, 50)}...`
                                        : ad.data.title}</p>
                        
                       
                      
                                   
                        
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                    <span dangerouslySetInnerHTML={{ __html:  truncateDescription(ad.data.description ?? "", 65) }} />
                                    
                                    </p>
                                    <span className="font-bold w-min rounded-full mt-1 dark:text-green-600 text-green-600">
                                      {formatKsh(ad.data.price)}
                                    </span>
                                      </div>
                                    </div>
       
     <div className="flex gap-2 items-center w-full">
          <label className="text-sm w-[200px]">Monthly Income: KES</label>
          <input
            type="text"
            value={formatToCurrency(monthlyIncome ?? 0)}
            onChange={(e) =>
              setMonthlyIncome(parseCurrencyToNumber(e.target.value))
            }
            placeholder="Enter price per piece"
            className="px-4 py-2 w-full border border-gray-800 rounded-md dark:bg-[#131B1E] dark:text-gray-100"
          />
        </div>

         <div className="flex gap-2 items-center w-full">
          <label className="text-sm w-[200px]">Deposit Amount: KES</label>
          <input
            type="text"
            value={formatToCurrency(deposit ?? 0)}
            onChange={(e) =>
              setDeposit(parseCurrencyToNumber(e.target.value))
            }
            placeholder="Enter price per piece"
            className="px-4 py-2 w-full border border-gray-800 rounded-md dark:bg-[#131B1E] dark:text-gray-100"
          />
        </div>

      <div className="flex gap-2 items-center w-full">
          <label className="text-sm w-[200px]">Employment Status:</label>
           <Select onValueChange={setEmploymentStatus}>
          <SelectTrigger className="w-full text-base border p-2 rounded-md dark:text-gray-300 text-gray-700">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent className="text-base">
            <SelectItem value="Employed">Employed</SelectItem>
            <SelectItem value="Self-employed">Self-employed</SelectItem>
            <SelectItem value="Business Owner">Business Owner</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
            
          </SelectContent>
        </Select>
        </div>
      <div className="flex gap-2 items-center w-full">
          <label className="text-sm w-[200px]">Preferred Loan Term:</label>
          <Select onValueChange={setLoanterm}>
          <SelectTrigger className="w-full text-base border p-2 rounded-md dark:text-gray-300 text-gray-700">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent className="text-base">
            <SelectItem value="12 months">12 months</SelectItem>
            <SelectItem value="24 months">24 months</SelectItem>
            <SelectItem value="36 months">36 months</SelectItem>
            <SelectItem value="48 months">48 months</SelectItem>
            <SelectItem value="60 months">60 months</SelectItem>
           

          </SelectContent>
        </Select>
        </div>
       

        {/* Description Textarea */}
        <Textarea
          value={messageComments}
          onChange={(e) => setMessageComments(e.target.value)}
          placeholder="Any comment (optional)"
          maxLength={300}
          className="w-full text-base dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-2"
        />
        {/* Submit Button */}
       
        <Button
          onClick={handleSubmit}
           disabled={isSending}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
        >
         <div className="flex gap-1 items-center">
                          {isSending && (
                            <CircularProgress sx={{ color: "white" }} size={30} />
                          )}
                          {isSending ? "Submitting..." : " Submit request"}
                        </div>
        </Button>
      </DialogContent>
    </Dialog>)}
    </>);
};
