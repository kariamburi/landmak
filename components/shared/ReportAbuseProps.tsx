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
interface ReportAbuseProps {
    userId:string;
    userName:string;
    userImage:string;
    ad:any
  isOpen: boolean;
  onClose: () => void;
//  onSubmit: (reason: string, description: string) => void;
}

export const ReportAbuse: React.FC<ReportAbuseProps> = ({ ad, isOpen,userId, userImage, userName, onClose }) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const pathname = usePathname();
   const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile screens
  
 const handleSubmit = async () => {
    // Logic to handle report submission
    // For example, send data to the admin via an API call
    if (!reason) {
       // alert("Please select a reason.");

        toast({
            variant: "destructive",
            title: "Failed!",
            description: "Please select a reason..",
            duration: 5000,
          });
        return;
      }
      if (description.length > 200) {
       // alert("Description cannot exceed 200 characters.");
        toast({
            variant: "destructive",
            title: "Failed!",
            description: "Description cannot exceed 200 characters.",
            duration: 5000,
          });
        return;
      }
   
      const newResponse = await createReport({
        report: {
          userId: userId,
          adId: ad._id,
          reason:reason,
          description:description,
        },
        path: pathname,
      });
      if (newResponse === "Ad Reported") {
        const abused = (Number(ad.abused ?? "0") + 1).toString();
        const _id = ad._id;
        await updateabused({
          _id,
          abused,
          path: `/ads/${ad._id}`,
        });
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
      setReason("");
      setDescription("");
      onClose();
    
  };
  return (<>
     {isMobile && isOpen ? (
               
                  // Fullscreen Popover for Mobile
                  <div className="fixed inset-0 z-20 bg-[#e4ebeb] dark:bg-[#222528] dark:text-gray-100 p-4 flex flex-col">
                    <div className="flex w-full gap-2 items-center dark:bg-[#131B1E] border-b pb-2">
                                                                                         
                                                                                          <button
                                                                                           onClick={onClose}
                                                                                            className="flex justify-center p-2 items-center text-gray-600 dark:text-[#e4ebeb] dark:hover:bg-gray-700 hover:text-green-600 rounded-full"
                                                                                          >
                                                                                            <ArrowBackOutlinedIcon />
                                                                                          </button>
                                                                                        
                                                                                        </div>

                  
                      {/* Report Reason Select */}
                      <div className="flex mt-10 flex-col justify-center items-center">
                      <p className="font-bold mb-2"> Report for {ad.data.title}</p>
        <Select onValueChange={setReason}>
          <SelectTrigger className="w-full text-base border p-2 rounded-md dark:text-gray-300 text-gray-700">
            <SelectValue placeholder="Report reason" />
          </SelectTrigger>
          <SelectContent className="text-base">
            <SelectItem value="spam">Spam or misleading</SelectItem>
            <SelectItem value="fraud">Fraud or scam</SelectItem>
            <SelectItem value="wrong_category">Wrong category</SelectItem>
            <SelectItem value="it_is_sold"> It is sold</SelectItem>
            <SelectItem value="wrong_price">The price is wrong</SelectItem>
            <SelectItem value="seller_asked_for_prepayment">Seller asked for prepayment</SelectItem>
            <SelectItem value="user_is_unreachable">User is unreachable</SelectItem>
            <SelectItem value="other">Other</SelectItem>

          </SelectContent>
        </Select>

        {/* Description Textarea */}
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please describe your issue"
          maxLength={300}
          className="w-full mt-2 text-base dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-2"
        />

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
        >
          Send report
        </Button>
        </div>
                    </div>
     ):(
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md dark:bg-[#2D3236] dark:text-gray-300 bg-white rounded-lg shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="font-medium dark:text-gray-300 text-gray-800">
            Report for {ad.data.title}
          </DialogTitle>
        </DialogHeader>

        {/* Report Reason Select */}
        <Select onValueChange={setReason}>
          <SelectTrigger className="w-full border p-2 rounded-md dark:text-gray-300 text-gray-700">
            <SelectValue placeholder="Report reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="spam">Spam or misleading</SelectItem>
            <SelectItem value="fraud">Fraud or scam</SelectItem>
            <SelectItem value="wrong_category">Wrong category</SelectItem>
            <SelectItem value="it_is_sold"> It is sold</SelectItem>
            <SelectItem value="wrong_price">The price is wrong</SelectItem>
            <SelectItem value="seller_asked_for_prepayment">Seller asked for prepayment</SelectItem>
            <SelectItem value="user_is_unreachable">User is unreachable</SelectItem>
            <SelectItem value="other">Other</SelectItem>

          </SelectContent>
        </Select>

        {/* Description Textarea */}
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please describe your issue"
          maxLength={200}
          className="w-full dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-2"
        />

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
        >
          Send report
        </Button>
      </DialogContent>
    </Dialog>)}
    </>);
};
