'use client';

import { useState } from 'react';
import axios from 'axios';
import { createSitevisit } from '@/lib/actions/sitevisit.actions';
import { useToast } from '../ui/use-toast';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from "react-responsive"; // Detect mobile screens
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  
  };
const FormContent = (
    <>
     <div className="p-4 border rounded">
      <h3>Schedule Now</h3>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2" />
      <div className="flex gap-2 mt-2">
        <input type="time" value={slot} onChange={(e) => setSlot(e.target.value)} className="border p-2" />
        <button onClick={handleAddSlot} className="bg-blue-500 text-white px-4">Add Slot</button>
      </div>
      <div className="mt-2">
        {timeSlots.map((t) => (
          <div key={t}>{t}</div>
        ))}
      </div>
      <button onClick={handleSubmit} className="mt-4 bg-green-500 text-white px-4 py-2">Save Schedule</button>
    </div>
    </>
  );
  return (<>
      {isMobile && isOpen ? (
               
                  // Fullscreen Popover for Mobile
                  <div className="fixed inset-0 z-20 bg-[#e4ebeb] dark:bg-[#222528] dark:text-gray-100 p-4 flex flex-col">
                    <div className="flex w-full gap-2 items-center dark:bg-[#131B1E] border-b pb-2">
              
    <div className="p-4 border rounded">
      <h3>Set Available Site Visit Times</h3>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2" />
      <div className="flex gap-2 mt-2">
        <input type="time" value={slot} onChange={(e) => setSlot(e.target.value)} className="border p-2" />
        <button onClick={handleAddSlot} className="bg-blue-500 text-white px-4">Add Slot</button>
      </div>
      <div className="mt-2">
        {timeSlots.map((t) => (
          <div key={t}>{t}</div>
        ))}
      </div>
      <button onClick={handleSubmit} className="mt-4 bg-green-500 text-white px-4 py-2">Save Schedule</button>
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
