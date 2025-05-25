// components/OwnerBookingRequests.tsx
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { getBookingByuserId, updateBookingStatus } from '@/lib/actions/booking.actions';
import { Icon } from '@iconify/react';
import Barsscale from '@iconify-icons/svg-spinners/bars-scale';
import { Email, Phone } from '@mui/icons-material';
import Image from "next/image";
import threeDotsScale from "@iconify-icons/svg-spinners/3-dots-scale"; // Correct import
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {DeleteBookings } from './DeleteBooking';
interface Props {
  userId: string;
  handleAdView:(value:any)=>void;
  updatebooking:(id:string)=>void;
  bookings:any;
  loading:boolean;
}
export default function ClientBookingRequests({userId, updatebooking, bookings, loading, handleAdView}:Props) {
 
 
 const updatigBooking = async (id: string) => {
  //  await deleteBooking(id);
     updatebooking(id);
   
 }
 
  return (
    <div>
       {loading ? (
                     <p>Loading my booking...</p>
                  ) : (
                    <>
                     {bookings.length > 0 ? (<>
      {bookings.map((booking:any) => (
       
       <div key={booking._id} className="border p-1 lg:p-4 rounded mb-3">

         

 <div className='w-full flex justify-between items-center'>
  <div className='flex gap-2 items-center'><strong>Property:</strong><p className='underline cursor-pointer hover:text-green-600'  onClick={() => {
                       handleAdView(booking.propertyId);
                      }}>{booking.propertyId.data.title}</p> </div>
 
               <DeleteBookings _id={booking._id} updatigBooking={updatigBooking}/> 
            </div>


          <p><strong>Location:</strong> {booking.propertyId.data.propertyarea.mapaddress}</p>
          <p><strong>Date:</strong> {format(new Date(booking.date), 'PPP')}</p>
          <p><strong>Time:</strong> {booking.time}</p>
          <p className='flex gap-2 items-center'><strong>Status:</strong>  <span
          className={`flex py-1 px-2 justify-center items-center rounded-sm ${
           booking.status === "pending"
              ? "bg-orange-100 text-orange-600"
              : booking.status === "rejected"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {booking.status}
        </span></p>
       
        
        
        </div>


      ))}</>):(<>
  <div className="flex items-center justify-center w-full flex-col gap-3 rounded-[14px] bg-gray-100 py-8 lg:py-28 text-center min-h-[100px]">
  <h3 className="font-bold text-lg lg:text-2xl text-gray-800">
    No Bookings Yet
  </h3>
  <p className="text-sm text-gray-600">
    You have not made any bookings.
  </p>
</div>
      </>)}</>
                  )}
  
    </div>
  );
}
