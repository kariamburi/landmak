"use client";

import { useTransition } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { deleteCategory } from "@/lib/actions/category.actions";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { deleteLoan } from "@/lib/actions/loan.actions";
import { deleteBooking } from "@/lib/actions/booking.actions";
import { deleteBookingsByPropertyId } from "@/lib/actions/sitevisit.actions";
type CoProps = {
  propertyId: string;
  updateVisits:(propertyId:string)=>void;
};
export const DeleteVisitSite = ({ propertyId,updateVisits }: CoProps) => {
  let [isPending, startTransition] = useTransition();
  // console.log(messageId);
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className="rounded-lg p-2 text-xs text-red-600 bg-red-100 cursor-pointer items-center"><DeleteOutlinedIcon sx={{ fontSize: 16 }}/>Delete</div>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
          <AlertDialogDescription className="p-regular-16 text-grey-600">
            This will permanently delete your Request
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              startTransition(async () => {
                try {
                  await deleteBookingsByPropertyId(propertyId);
                  updateVisits(propertyId);
                
                } catch (error) {
                  console.error("Error deleting document: ", error);
                }
              })
            }
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
