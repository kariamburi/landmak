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
import { deleteAd } from "@/lib/actions/dynamicAd.actions";

//import { deleteAd } from "@/lib/actions/ad.actions";
type deleteProps = {
  adId: string;
  imageUrls: string[];
  onDeleteSuccess?:()=> void;
};
export const DeleteConfirmation = ({ adId, imageUrls, onDeleteSuccess }: deleteProps) => {
  const pathname = usePathname();
  let [isPending, startTransition] = useTransition();
  let deleteImages: string[] = [];
  for (let index = 0; index < imageUrls.length; index++) {
    const image = imageUrls[index];
    const url = new URL(image);
    const filename = url.pathname.split("/").pop();
    if (filename) {
      deleteImages.push(filename);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Image
          src="/assets/icons/delete.svg"
          alt="edit"
          width={20}
          height={20}
        />
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
          <AlertDialogDescription className="p-regular-16 text-grey-600">
            This will permanently delete this Ad
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              startTransition(async () => {
                await deleteAd({ adId, deleteImages, path: pathname });
               onDeleteSuccess?.();
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
