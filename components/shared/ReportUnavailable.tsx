"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { useMediaQuery } from "react-responsive"; // Detect mobile screens
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
interface ReportUnavailable {
    userId:string;
    userName:string;
    userImage:string;
    ad:any
  isOpen: boolean;
  onClose: () => void;
//  onSubmit: (reason: string, description: string) => void;
}

export const ReportUnavailable: React.FC<ReportUnavailable> = ({ ad, isOpen,userId, userImage, userName, onClose }) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile screens
 
 const handleSubmit = async () => {
    // Logic to handle report submission
    // For example, send data to the admin via an API call
    if (!reason) {
        alert("Please select a reason.");

        toast({
            variant: "destructive",
            title: "Failed!",
            description: "Please select a reason..",
            duration: 5000,
          });
        return;
      }
      if (description.length > 200) {
        alert("Description cannot exceed 200 characters.");
        toast({
            variant: "destructive",
            title: "Failed!",
            description: "Description cannot exceed 200 characters.",
            duration: 5000,
          });
        return;
      }
   
      // Logic to handle report submission, e.g., send the description to the admin
      const read = "1";
      const imageUrl = "";

      // Define the query to check if a similar message already exists
      const q = query(
        collection(db, "messages"),
        where("text", "==", description + ", REASON: "+reason+" Ad_ID:" + ad._id),
        where("uid", "==", userId),
        where("recipientUid", "==", AdminId)
      );

      // Execute the query
      const querySnapshot = await getDocs(q);

      // Check if any matching document exists
      if (querySnapshot.empty) {
        // No matching document, proceed with adding the new message
        await addDoc(collection(db, "messages"), {
          text: description + " AD REPORTED:" + ad._id,
          name: userName,
          avatar: userImage,
          createdAt: serverTimestamp(),
          uid: userId,
          recipientUid: "65d4a2ffec4c43cdc488ce0d",
          imageUrl,
          read,
        });
        const abused = (Number(ad.abused ?? "0") + 1).toString();
        const _id = ad._id;
        await updateabused({
          _id,
          abused,
          path: `/ads/${ad._id}`,
        });
        console.log("Message submitted successfully.");
        toast({
          title: "Alert",
          description: "Message submitted successfully.",
          duration: 5000,
          className: "bg-[#30AF5B] text-white",
        });
      } else {
        console.log("Message already exists. Skipping submission.");
        toast({
          variant: "destructive",
          title: "Failed!",
          description: "Message already exists. Skipping submission.",
          duration: 5000,
        });
        // Handle case where the message already exists
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

                               
                    
                  
                    
                     {/* Submit Button */}
                     <div className="flex mt-10 flex-col justify-center items-center">
                     <p className="font-bold mb-2">  Report for {ad.data.title}</p>
        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          Confirm Unavailable?
        </Button>
        </div>  
                    </div>):(
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md dark:bg-[#2D3236] dark:text-gray-300 bg-white rounded-lg shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="font-medium dark:text-gray-300 text-gray-800">
            Report for {ad.data.title}
          </DialogTitle>
        </DialogHeader>

    
        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          Confirm Unavailable?
        </Button>
      </DialogContent>
    </Dialog>)}
 </> );
};
