'use client';

import { useState } from 'react';
import axios from 'axios';
import { createSitevisit } from '@/lib/actions/sitevisit.actions';
import { useToast } from '../ui/use-toast';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from "react-responsive"; // Detect mobile screens
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CircularProgress from '@mui/material/CircularProgress';
interface Props {
  ad: any;
   userName:string;
  userImage:string;
  userId:string;
  isOpen:boolean;
  onClose:()=> void;
}
export default function ScheduleVisitForm({ ad, isOpen, onClose }: Props) {
  const [date, setDate] = useState('');
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [slot, setSlot] = useState('');
  const { toast } = useToast();
  const pathname = usePathname();
   const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile screens
  const [isSending, setIsSending] = useState(false);
  const handleAddSlot = () => {
    if (slot && !timeSlots.includes(slot)) {
      setTimeSlots([...timeSlots, slot]);
      setSlot('');
    }
  };

  const handleSubmit = async () => {

     if (!date) {
         
            toast({
                variant: "destructive",
                title: "Failed!",
                description: "Select date..",
                duration: 5000,
              });
            return;
          }
          if (timeSlots.length === 0) {

            toast({
                variant: "destructive",
                title: "Failed!",
                description: "Select timeSlots.",
                duration: 5000,
              });
            return;
          }
        try{
    setIsSending(true);
          const newResponse = await createSitevisit({
            sitevisit: {
              ownerId: ad.organizer._id,
              propertyId: ad._id,
              date,
              timeSlots,
            },
            path: pathname,
          });
            toast({
              title: "Alert",
              description: newResponse,
              duration: 5000,
              className: "bg-black text-white",
            });

          setTimeSlots([]);
          setDate("");
          setSlot("")
          onClose();
   } catch (error) {
      console.error("Error sending message: ", error);
    } finally {
      setIsSending(false); // Re-enable the button and hide progress
    }
  
  };
const FormContent = (
    <>
     <div className="p-4 border rounded">
      <h3>Schedule Now</h3>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2" />
      <div className="flex gap-2 mt-2">
        <input type="time" value={slot} onChange={(e) => setSlot(e.target.value)} className="border p-2" />
        <button onClick={handleAddSlot} className="bg-black hover:gray-900 rounded-sm gap-2 text-white px-4"><AddOutlinedIcon sx={{ fontSize: 16 }} />Add Slot</button>
      </div>
      <div className="mt-2">
        {timeSlots.map((t) => (
          <div key={t}>{t}</div>
        ))}
      </div>
    <button
                            onClick={handleSubmit}
                            className={`"mt-4 px-4 py-2 text-white rounded hover:bg-green-600 focus:outline-none mr-2  ${
                              isSending ? "bg-green-200" : "bg-green-600"
                            }`}
                            disabled={isSending} // Disable button while sending
                          >
                            <div className="flex gap-1 gap-2 items-center">
                              {isSending && (
                                <CircularProgress sx={{ color: "white" }} size={30} />
                              )}
                              {isSending ? "Booking..." : (<><SaveAltOutlinedIcon sx={{ fontSize: 16 }} />Save Schedule</>)}
                            </div>
                          </button>
    </div>
    </>
  );
  return (<>
      {isMobile && isOpen ? (
               
                  // Fullscreen Popover for Mobile
                  <div className="fixed inset-0 z-20 bg-[#e4ebeb] dark:bg-[#222528] dark:text-gray-100 p-4 flex flex-col">
                    <div className="flex flex-col w-full gap-2 items-center dark:bg-[#131B1E] border-b pb-2">
              <div className="flex w-full gap-2 items-center dark:bg-[#131B1E] border-b pb-2">
  <button
    onClick={onClose}
    className="flex justify-center p-2 items-center text-gray-600 dark:text-[#e4ebeb] dark:hover:bg-gray-700 hover:text-green-600 rounded-full"
  >
    <ArrowBackOutlinedIcon />
  </button>
</div>

    <div className="p-4 border rounded">
      <h3>Set Available Site Visit Times</h3>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2" />
      <div className="flex gap-2 mt-2">
        <input type="time" value={slot} onChange={(e) => setSlot(e.target.value)} className="border p-2" />
        <button onClick={handleAddSlot} className="bg-black hover:gray-900 gap-2 rounded-sm text-white px-4"><AddOutlinedIcon sx={{ fontSize: 16 }} /> Add Slot</button>
      </div>
      <div className="mt-2">
        {timeSlots.map((t) => (
          <div key={t}>{t}</div>
        ))}
      </div>
       <button
                            onClick={handleSubmit}
                            className={`"mt-4 px-4 py-2 text-white rounded hover:bg-green-600 focus:outline-none mr-2  ${
                              isSending ? "bg-green-200" : "bg-green-600"
                            }`}
                            disabled={isSending} // Disable button while sending
                          >
                            <div className="flex gap-1 gap-2 items-center">
                              {isSending && (
                                <CircularProgress sx={{ color: "white" }} size={30} />
                              )}
                              {isSending ? "Booking..." : (<><SaveAltOutlinedIcon sx={{ fontSize: 16 }} />Save Schedule</>)}
                            </div>
                          </button>
     
    </div>
    </div>
    </div>
    ):(<>
     <Dialog open={isOpen} onOpenChange={onClose}>
              <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Set Available Site Visit Times</DialogTitle>
                </DialogHeader>
                <div className="mt-2 flex flex-col gap-3">{FormContent}</div>
              </DialogContent>
            </Dialog>
            </>)}

 </> );
}
