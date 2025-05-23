"use client";

import React, { useState } from "react";
//import { deleteOrder } from "@/lib/actions/order.actions";
import { usePathname } from "next/navigation";
import { useToast } from "../ui/use-toast";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Pagination from "./Pagination";
import Link from "next/link";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import { deleteBookingsByPropertyId } from "@/lib/actions/sitevisit.actions";

type CollectionProps = {
  data: any[];
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  page: number | string;
  totalPages: number;
  urlParamName?: string;
  userId: string;
  handleOpenChatId:(valu:string)=> void;
};
interface Client {
  name: string;
  phone: string;
}

interface Slot {
  time: string;
  count: number;
  clients: Client[];
}
interface Summary {
  propertyTitle: string;
  date: string;
  slots: Slot[];
}
const CollectionBookings = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages,
  urlParamName,
  userId,
  handleOpenChatId,
}: CollectionProps) => {
  

 const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({}); // Track expanded slots
const [summaries, setSummaries] = useState<Summary[]>(data);
  const toggleExpanded = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };
   const deleteBookings = async (propertyId: string) => {
   await deleteBookingsByPropertyId(propertyId);
  
   setSummaries((prev: any[]) => prev.filter(b => b.propertyId !== propertyId));
  
  
  };

            
  return (
    <div className="dark:bg-[#2D3236]">
      {summaries.length > 0 ? (<>
         
     <div className="space-y-6">
           {summaries.map((summary:any, idx:number) => (
             <div key={idx} className="border p-4 rounded-lg shadow-sm bg-white">
            <div className='w-full flex justify-between items-center'>
               <h3
                 className="text-lg font-semibold mb-2"
                // onClick={() => handleAdView(summary.propertyId)}
               >
                 {summary.propertyTitle}
               </h3>
      
                   <div onClick={() => deleteBookings(summary.propertyId)} className="rounded-lg p-2 text-xs text-red-600 bg-red-100 cursor-pointer items-center"><DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }}/>Delete</div>
                   
                 </div>
     
               <p className="text-sm text-gray-600 flex gap-2 items-center mb-3">
                 <CalendarMonthOutlinedIcon sx={{ fontSize: 16 }} />
                 Date: {summary.date}
               </p>
     
               <ul className="space-y-2">
                 {summary.slots.map((slot:any, i:number) => {
                   const slotKey = `${summary.date}-${slot.time}-${idx}-${i}`;
                   return (
                     <li key={i} className="text-sm">
                       <div
                         className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
                         onClick={() => toggleExpanded(slotKey)}
                       >
                         <span className="flex gap-2 items-center">
                           <QueryBuilderOutlinedIcon sx={{ fontSize: 16 }} />
                           {slot.time}
                         </span>
                         <span className="flex gap-2 items-center text-green-600">
                           <PeopleOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                           {slot.count} client{slot.count !== 1 ? 's' : ''}
                         </span>
                       </div>
     
                       {expanded[slotKey] && slot.clients.length > 0 && (
                         <ul className="pl-5 mt-2 space-y-1 text-gray-700">
                           {slot.clients.map((client:any, ci:number) => (
                             <li key={ci}>
                               • {client.name} - {client.phone}
                             </li>
                           ))}
                         </ul>
                       )}
                     </li>
                   );
                 })}
               </ul>
             </div>
           ))}
         </div>

           {totalPages > 1 && (
            <Pagination
              urlParamName={urlParamName}
              page={page}
              totalPages={totalPages}
            />
          )}
          </>) : (
        <div className="text-center text-gray-600 p-4">
        No upcoming site visits scheduled.
      </div>
      )}
    
    </div>
  );
};

export default CollectionBookings;
