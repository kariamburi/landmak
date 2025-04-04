"use client";

import { useCallback, Dispatch, SetStateAction, useState } from "react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { Button } from "@/components/ui/button";
import { convertFileToUrl } from "@/lib/utils";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useToast } from "@/components/ui/use-toast";
type FileUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl: string;
  setFiles: Dispatch<SetStateAction<File[]>>;
};

export function FileuploaderBusiness({
  imageUrl,
  onFieldChange,
  setFiles,
}: FileUploaderProps) {
  const { toast } = useToast();
  const [showmessage, setmessage] = useState("");
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const filteredFiles = acceptedFiles.filter((file) => {
      const isScreenshot =
        /screenshot/i.test(file.name) || /Screen\s?Shot/i.test(file.name);
      if (isScreenshot) {
        setmessage(
          `${file.name} appears to be a screenshot and will not be uploaded.`
        );
        //  setShowAlert(true);
        toast({
          variant: "destructive",
          title: "Failed!",
          description: showmessage,
          duration: 5000,
        });
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        setmessage(
          `${file.name} exceeds the 5MB limit and will not be uploaded.`
        );
        toast({
          variant: "destructive",
          title: "Failed!",
          description: showmessage,
          duration: 5000,
        });
        return false;
      }
      return true;
    });

    setFiles(acceptedFiles);
    onFieldChange(convertFileToUrl(acceptedFiles[0]));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image/*"]),
  });

  return (
    <div
      {...getRootProps()}
      className="flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50"
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {imageUrl ? (
        <div className="flex h-50 w-full flex-1 justify-center ">
          <Zoom>
            <Image
              src={imageUrl}
              alt="image"
              className="object-center w-full h-full"
              width={900}
              height={500}
            />
          </Zoom>
        </div>
      ) : (
        <div className="flex-center flex-col py-5 text-grey-500">
          <Image
            src="/assets/icons/upload.svg"
            width={77}
            height={77}
            alt="file upload"
          />
          <h3 className="mb-2 mt-2">Drag Business Profile Image here</h3>
          <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
          <Button type="button" className="rounded-full">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
}
