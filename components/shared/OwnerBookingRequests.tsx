// components/OwnerBookingRequests.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { getBookingByOwnerId, updateBookingStatus } from '@/lib/actions/booking.actions';
import { sendEmail } from '@/lib/actions/sendEmail';
import SendChat from './SendChat';
import { debounce } from 'lodash';
import { Icon } from '@iconify/react';
import Barsscale from '@iconify-icons/svg-spinners/bars-scale';
import { Email, Phone } from '@mui/icons-material';
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import Image from "next/image";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import threeDotsScale from "@iconify-icons/svg-spinners/3-dots-scale"; // Correct import
import { DeleteBookings } from './DeleteBooking';
interface Props {
  userId: string;
  userImage: string;
  userName: string;
  handleOpenChatId:(value:any)=>void;
  handleAdView:(value:any)=>void;
  upbooking:(id:string, status?:string)=>void;
   bookings:any;
  loading:boolean;
}

export default function OwnerBookingRequests({ userId, userImage, bookings, loading,userName, upbooking, handleAdView, handleOpenChatId }: Props) {
 
  const { NotifyUser } = SendChat();
 

  
  const updateStatus = async (id: string, status: 'confirmed' | 'rejected') => {
    await updateBookingStatus(id, status);

    const updatedBooking = bookings.find((b:any) => b._id === id);
    if (!updatedBooking) return;

    const smsContent =
      status === 'confirmed'
        ? `Your booking for ${updatedBooking.date} at ${updatedBooking.time} has been confirmed.`
        : `Your booking for ${updatedBooking.date} at ${updatedBooking.time} has been rejected.`;

    // FCM notification
    if (updatedBooking.userId?.token && updatedBooking.userId?.notifications?.fcm) {
      debounce(() => {
        NotifyUser(
          updatedBooking.propertyId?._id,
          userId,
          userName,
          smsContent
        );
      }, 1000)();
    }

    // Email notification
    if (updatedBooking.userId?.notifications?.email) {
      const adTitle = updatedBooking.propertyId?.data?.title || 'Your Ad';
      const adUrl = `https://mapa.co.ke/?Ad=${updatedBooking.propertyId?._id}`;
      const recipientEmail = updatedBooking.userId?.email;

      await sendEmail(
        recipientEmail,
        smsContent,
        adTitle,
        adUrl,
        userName,
        userImage
      );
    }
    upbooking(id,status);
  };

 const updatigBooking = async (id: string) => {
   // await deleteBooking(id);
    upbooking(id);
 }
  return (
    <div>
 {loading ? (
             <p>Loading booking requests...</p>
            ) : (
              <> {bookings.length === 0 && <div className="flex items-center justify-center w-full flex-col gap-3 rounded-[14px] bg-gray-50 py-10 lg:py-28 text-center min-h-[100px]">
  <h3 className="font-bold text-lg lg:text-2xl text-gray-800">
    No Booking
  </h3>
  <p className="text-sm text-gray-600">
    No booking requests found.
  </p>
</div>
}
      {bookings.map((booking:any) => (
        <div key={booking._id} className="border p-1 lg:p-4 rounded mb-3 bg-white shadow-sm">
         
  <div className='w-full flex justify-between items-center'>
  <div className='flex gap-2 items-center'><strong>Property:</strong><p className='underline cursor-pointer hover:text-green-600'  onClick={() => {
                       handleAdView(booking.propertyId);
                      }}>{booking.propertyId.data.title}</p> </div>
 
             <DeleteBookings _id={booking._id} updatigBooking={updatigBooking}/> 
              
            </div>



          <p><strong>Location:</strong> {booking.propertyId.data.propertyarea.mapaddress}</p>
          <p><strong>Message:</strong> {booking.message}</p>
          <p><strong>Date:</strong> {format(new Date(booking.date), 'PPP')}</p>
          <p><strong>Time:</strong> {booking.time}</p>
          <p className='flex gap-2 items-center'><strong>Status:</strong> <span
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

          {booking.status === 'pending' && (
            <div className="flex gap-2 mt-2">
              <Button
                onClick={() => updateStatus(booking._id, 'confirmed')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Confirm
              </Button>
              <Button
                onClick={() => updateStatus(booking._id, 'rejected')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Reject
              </Button>
            </div>
          )}
           <p><strong>Client:</strong> {booking.userId.firstName} {booking.userId.lastName}</p>
          <div className="p-2 flex justify-between w-full">
            <div className="flex items-center gap-2 mb-1 border-b py-1">
              <a href={`mailto:${booking.userId.email}`} className="flex items-center text-green-600 hover:underline">
                <Email className="w-4 h-4 mr-1" /> Email
              </a>
            </div>
          
            <div className="flex items-center gap-2 mb-1 border-b py-1">
              <a href={`tel:${booking.userId.phone}`} className="flex items-center text-green-600 hover:underline">
                <Phone className="w-4 h-4 mr-1" /> Call
              </a>
            </div>
          
            <div className="flex items-center gap-2 mb-1 border-b py-1">
              <div  onClick={() => handleOpenChatId(booking.userId)} className="flex cursor-pointer items-center text-green-600 hover:underline">
                <ChatBubbleOutlineOutlinedIcon className="w-4 h-4 mr-1" /> Chat
              </div>
            </div>
            </div>
        </div>
      ))}</>
            )}
     
    </div>
  );
}
