"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ShowDistanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleRouteFromUser: ()=> void;
}

export function ShowDistanceDialog({
  open,
  onOpenChange,
  handleRouteFromUser,
}: ShowDistanceDialogProps) {
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Distance to Property</AlertDialogTitle>
          <AlertDialogDescription>
           Show approximately distance from your current location to the property.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
           <AlertDialogCancel>Cancel</AlertDialogCancel>
           <AlertDialogAction onClick={handleRouteFromUser}>Accept</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
