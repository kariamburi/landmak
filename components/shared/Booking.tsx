'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import { debounce } from 'lodash';
import { Icon } from '@iconify/react';
import Barsscale from '@iconify-icons/svg-spinners/bars-scale';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
//import '@fullcalendar/daygrid/main.css'; // ✅ Correct CSS for dayGrid
import { useToast } from '../ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import SendChat from './SendChat';
import { sendEmail } from '@/lib/actions/sendEmail';
import { createBooking } from '@/lib/actions/booking.actions';
import { getSitevisitByPropertyId } from '@/lib/actions/sitevisit.actions';
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CircularProgress from '@mui/material/CircularProgress';
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
import { updateUserPhone } from '@/lib/actions/user.actions';
interface Props {
  ad: any;
  user:any;
  userId: string;
  userName: string;
  userImage: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingForm({ ad, user, userId, userName, userImage, isOpen, onClose }: Props) {
  const [slots, setSlots] = useState<{ date: string; timeSlots: string[] }[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [phonenumber, setPhone] = useState(user.phone ?? '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
 const [isSending, setIsSending] = useState(false);
  const { NotifyUser } = SendChat();
  const { toast } = useToast();
  const pathname = usePathname();
  const isMobile = useMediaQuery({ maxWidth: 768 });
const [isValid, setIsValid] = useState(true);
const normalizePhoneNumber = (input: string): string | null => {
  // Remove non-digit characters
  const digits = input.replace(/\D/g, '');

  if (digits.startsWith('0') && digits.length === 10) {
    // e.g., 0728820092 => +254728820092
    return '+254' + digits.substring(1);
  }

  if (digits.startsWith('254') && digits.length === 12) {
    // e.g., 254728820092 => +254728820092
    return '+' + digits;
  }

  if (digits.startsWith('7') && digits.length === 9) {
    // e.g., 728820092 => +254728820092
    return '+254' + digits;
  }

  if (digits.startsWith('1') && digits.length === 9) {
    // e.g., 112345678 => +254112345678 (for Safaricom's 011... numbers)
    return '+254' + digits;
  }

  if (digits.startsWith('254') && digits.length === 13) {
    // e.g., mistakenly added an extra digit: 2547288200920
    return null;
  }

  if (digits.startsWith('254') && digits.length === 9) {
    // Too short
    return null;
  }

  return null; // Not valid
};

const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setPhone(value);

  const phoneRegex = /^(?:254|\+254|0)?(7\d{8}|1\d{8})$/;
  setIsValid(phoneRegex.test(value));
};
function isValidKenyanPhoneNumber(phone: string): boolean {
    const kenyanPhoneRegex = /^(?:\+254|254|0)?(7\d{8})$/;
    return kenyanPhoneRegex.test(phone.trim());
  }
  useEffect(() => {
    const getSlots = async () => {
      try {
        setLoading(true);
        const result = await getSitevisitByPropertyId(ad._id);
        const normalized = Array.isArray(result) ? result : [result];
        setSlots(normalized);
        setAvailableTimes(
          normalized.find((s) => s.date === selectedDate)?.timeSlots || []
        );
      } catch (error) {
        console.error('Failed to fetch slots:', error);
      } finally {
        setLoading(false);
      }
    };
    getSlots();
  }, [ad]);

  useEffect(() => {
    const selectedSlot = slots.find((s) => s.date === selectedDate);
    setAvailableTimes(selectedSlot?.timeSlots || []);
  }, [selectedDate, slots]);

  const handleSubmit = async () => {
      if (!selectedDate) {

            toast({
                variant: "destructive",
                title: "Failed!",
                description: "Select Date.",
                duration: 5000,
              });
            return;
          }
           if (!selectedTime) {

            toast({
                variant: "destructive",
                title: "Failed!",
                description: "Select Time.",
                duration: 5000,
              });
            return;
          }
      

    if (!isValidKenyanPhoneNumber(phonenumber)) {
      toast({
        variant: "destructive",
        title: "Invalid Phone",
        description: "Invalid Phone Number.",
        duration: 5000,
      });
    
      return;
    }
    try{
    setIsSending(true);
          const phone = normalizePhoneNumber(phonenumber);
          if (!user.phone && phone) {
              await updateUserPhone(userId, phone);
            }
         
    const newResponse = await createBooking({
      booking: {
        propertyId: ad._id,
        userId,
        date: selectedDate,
        time: selectedTime,
        message,
      },
      path: pathname,
    });

    const emailContent = `
      <h3>New Site Visit Booking</h3>
      <p><strong>From:</strong> ${userName}</p>
      <p><strong>Date:</strong> ${selectedDate}</p>
      <p><strong>Time:</strong> ${selectedTime}</p>
      <p><strong>Message:</strong> ${message || 'N/A'}</p>
    `;

    const smsContent = `New site visit booked by ${userName} on ${selectedDate} at ${selectedTime}.`;

    if (ad.organizer.token && ad.organizer.notifications.fcm) {
      debounce(() => NotifyUser(ad, userId, userName, smsContent), 1000)();
    }

    if (ad.organizer.notifications.email) {
      const adTitle = ad.data.title;
      const adUrl = `https://mapa.co.ke/?Ad=${ad._id}`;
      const recipientEmail = ad?.organizer?.email;
      await sendEmail(
        recipientEmail,
        emailContent,
        adTitle,
        adUrl,
        userName,
        userImage
      );
    }

    toast({
      title: 'Alert',
      description: newResponse,
      duration: 5000,
      className: 'bg-black text-white',
    });

    setMessage('');
    setSelectedDate('');
    setSelectedTime('');
    onClose();
      } catch (error) {
      console.error("Error sending message: ", error);
    } finally {
      setIsSending(false); // Re-enable the button and hide progress
    }
  };

  const handleDateClick = (arg: any) => {
    const dateStr = arg.dateStr;
    const matchingSlot = slots.find((s) => s.date === dateStr);
    if (matchingSlot) {
      setSelectedDate(dateStr);
    } else {
      toast({
        title: 'No Time Slots',
        description: 'No available time slots on this date.',
        className: 'bg-red-500 text-white',
      });
    }
  };
 
  const FormContent = (
    <div className="p-4 border rounded mt-4">
     {/*  <h3 className="text-lg font-semibold mb-2">Book Site Visit</h3>*/}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        height="auto"
        selectable
        events={slots.map((slot) => ({
          title: 'Available',
          start: slot.date,
          allDay: true,
          backgroundColor: '#3b82f6',
        }))}
      />
      {selectedDate && (
        <>
          <p className="mt-4 font-medium">Selected Date: {selectedDate}</p>
          <select
            onChange={(e) => setSelectedTime(e.target.value)}
            className="border p-2 w-full mt-2"
          >
            <option value="">Select Time</option>
            {availableTimes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </>
      )}
      <input
  placeholder="Phone"
  className={`border p-2 w-full mt-2 ${!isValid ? 'border-red-500' : ''}`}
  value={phonenumber}
  onChange={handlePhoneChange}
/>
{!isValid && <p className="text-red-500 text-sm mt-1">Invalid phone number</p>}
      <textarea
        placeholder="Optional message"
        className="border p-2 w-full mt-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
       <button
                      onClick={handleSubmit}
                      className={`"mt-4 px-4 py-2 text-white rounded hover:bg-green-600 focus:outline-none mr-2  ${
                        isSending ? "bg-green-200" : "bg-green-600"
                      }`}
                      disabled={isSending} // Disable button while sending
                    >
                      <div className="flex gap-1 items-center">
                        {isSending && (
                          <CircularProgress sx={{ color: "white" }} size={30} />
                        )}
                        {isSending ? "Booking..." : (<><DirectionsWalkOutlinedIcon sx={{ fontSize: 16 }} />Book Visit</>)}
                      </div>
                    </button>
     
    </div>
  );

  return (
    <>
      {isMobile && isOpen ? (
        <div className="fixed inset-0 z-20 bg-[#e4ebeb] dark:bg-[#222528] dark:text-gray-100 p-4 flex flex-col overflow-auto">
          <div className="flex flex-col w-full gap-2 items-center dark:bg-[#131B1E] border-b pb-2">
          <div className="flex w-full gap-2 items-center dark:bg-[#131B1E] border-b pb-2">
  <button
    onClick={onClose}
    className="flex justify-center p-2 items-center text-gray-600 dark:text-[#e4ebeb] dark:hover:bg-gray-700 hover:text-green-600 rounded-full"
  >
    <ArrowBackOutlinedIcon />
  </button>
</div>

            {loading ? (
              <div className="w-full h-[50px] flex justify-center items-center">
                <Icon icon={Barsscale} className="w-10 h-10 text-gray-500" />
              </div>
            ) : (
              FormContent
            )}
          </div>
        </div>
      ) : (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Book Site Visit</DialogTitle>
            </DialogHeader>
            <div className="mt-2 flex flex-col gap-3">
              {loading ? (
                <div className="w-full h-[50px] flex justify-center items-center">
                  <Icon icon={Barsscale} className="w-10 h-10 text-gray-500" />
                </div>
              ) : (
                FormContent
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
