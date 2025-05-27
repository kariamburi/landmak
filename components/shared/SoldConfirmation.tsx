'use client';

import { useTransition } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CheckCircle } from 'lucide-react'; // Better match for shadcn
import { Button } from "../ui/button";
import { handleMarkAsSold } from "@/lib/actions/dynamicAd.actions";

type SoldProps = {
  _id: string;
  status: 'Sold' | 'Rented';
  onStatusUpdate: (status:string) => void;
};

export const SoldConfirmation = ({ _id, status, onStatusUpdate }: SoldProps) => {
  const [isPending, startTransition] = useTransition();

  async function updateListing(id: string, status: string) {
    try {
      // Replace with actual logic or API call
      console.log(`Marking ${id} as ${status}`);
       await handleMarkAsSold(id, status); // Example function
      onStatusUpdate(status);
    } catch (error) {
      console.error('Failed to update status', error);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default" className="w-full mt-2">
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark as {status}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will mark the property as <strong>{status}</strong> and remove it from active listings.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => startTransition(() => updateListing(_id, status))}
          >
            {isPending ? "Updating..." : `Mark as ${status}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
