'use client';

import { getSiteVisitSummary } from '@/lib/actions/booking.actions';
import { useEffect, useState } from 'react';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import { deleteBookingsByPropertyId } from '@/lib/actions/sitevisit.actions';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useToast } from '../ui/use-toast';
import { DeleteVisitSite } from './DeleteVisitSite';

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

export default function SiteVisitSummary({
  handleAdView,
  updatesitevisit,
  summaries,
  loadingSUM
}: {
  summaries:any,
  loadingSUM:boolean,
  handleAdView: (value: any) => void;
  updatesitevisit:(id:string)=>void;
}) {
  
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({}); // Track expanded slots

   const { toast } = useToast();
  const toggleExpanded = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };
   const updateVisits = async (propertyId: string) => {
   updatesitevisit(propertyId);
  
  };

  if (loadingSUM) return <p>Loading summary...</p>;

  if (summaries.length === 0) {
    return (
      <div className="text-center text-gray-600 p-0 lg:p-4">
        No upcoming site visits scheduled.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {summaries.map((summary:any, idx:number) => (
        <div key={idx} className="border p-1 lg:p-4 rounded-lg shadow-sm bg-white">
       <div className='w-full flex justify-between items-center'>
          <h3
            className="text-lg font-semibold mb-2"
           
          >
            {summary.propertyTitle}
          </h3>
 
              <DeleteVisitSite updateVisits={updateVisits} propertyId={summary.propertyId} />
              
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
  );
}
