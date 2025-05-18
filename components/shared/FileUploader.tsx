import { useCallback, Dispatch, SetStateAction, useState } from "react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Button } from "@/components/ui/button";
import { convertFileToUrl } from "@/lib/utils";
import { RocketIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UTApi } from "uploadthing/server";
import { deleteSingleImage } from "@/lib/actions/ad.actions";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useToast } from "@/components/ui/use-toast";
import { removeImageUrl } from "@/lib/actions/dynamicAd.actions";
import { Icon } from "@iconify/react";
import imageCompression from "browser-image-compression";
import threeDotsScale from "@iconify-icons/svg-spinners/3-dots-scale"; // Correct import
import CircularProgress from "@mui/material/CircularProgress";
 // Correct import
type FileUploaderProps = {
  onFieldChange: (urls: string[]) => void;
  imageUrls: string[];
  userName: string;
  category: string;
  adId: string;
  setFiles: Dispatch<SetStateAction<File[]>>;
};
const compressImagee = async (file: File): Promise<File> => {
  const options = {
   // maxSizeMB: 2, // Target size in MB
   // maxWidthOrHeight: 1280,
   maxSizeMB: 0.8,           // Slightly higher quality, still compressed
  maxWidthOrHeight: 1280,   // Better clarity on retina screens
  useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Image compression error:", error);
    return file;
  }
};
const getNetworkType = (): "4g" | "3g" | "2g" | "slow-2g" | "unknown" => {
  if (typeof navigator !== "undefined" && "connection" in navigator) {
    // @ts-ignore
    return navigator.connection.effectiveType || "unknown";
  }
  return "unknown";
};

const isMobile = (): boolean => {
  return typeof window !== "undefined" && window.innerWidth < 768;
};

const getSmartCompressionOptions = () => {
  const network = getNetworkType();
  const mobile = isMobile();

  if (network === "2g" || network === "slow-2g") {
    return {
      maxSizeMB: 0.3,
      maxWidthOrHeight: mobile ? 800 : 1024,
    };
  }

  if (network === "3g") {
    return {
      maxSizeMB: 0.5,
      maxWidthOrHeight: mobile ? 1024 : 1280,
    };
  }

  // Good network (4g or unknown)
  return {
    maxSizeMB: 0.8,
    maxWidthOrHeight: mobile ? 1280 : 1600,
  };
};

const compressImage = async (file: File): Promise<File> => {
  const smartOptions = getSmartCompressionOptions();

  const options = {
    ...smartOptions,
    useWebWorker: true,
  };

  return await imageCompression(file, options);
};

const applyWatermark = (
  file: File,
  headerText: string,
  contentText: string
): Promise<File> => {
  if (typeof window === "undefined") {
    return Promise.resolve(file);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        img.src = result;
      } else {
        reject(new Error("Failed to read file"));
      }
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      // Calculate font sizes based on the smaller dimension of the image
      const headerFontSize = Math.min(canvas.width, canvas.height) * 0.07;
      const contentFontSize = Math.min(canvas.width, canvas.height) * 0.05;

      ctx.font = `bold ${headerFontSize}px Arial`;
      ctx.textAlign = "center";

      const gap = headerFontSize * 0.5;
      const headerCenterX = canvas.width / 2;
      const headerCenterY = canvas.height / 2 - gap / 2 + 280;

      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.strokeText(headerText, headerCenterX, headerCenterY);

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillText(headerText, headerCenterX, headerCenterY);

      ctx.font = `bold ${contentFontSize}px Arial`;
      const contentCenterX = canvas.width / 2;
      const contentCenterY = headerCenterY + gap / 4 + contentFontSize;

      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.strokeText(contentText, contentCenterX, contentCenterY);

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillText(contentText, contentCenterX, contentCenterY);

      canvas.toBlob((blob) => {
        if (blob) {
          const watermarkedFile = new File([blob], file.name, {
            type: file.type,
          });
          resolve(watermarkedFile);
        } else {
          reject(new Error("Failed to create blob"));
        }
      }, file.type);
    };

    img.onerror = (error) => reject(error);
    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
  });
};

export function FileUploader({
  imageUrls,
  userName,
  category,
  adId,
  onFieldChange,
  setFiles,
}: FileUploaderProps) {
  const { toast } = useToast();
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [processingStatus, setProcessingStatus] = useState(false);
  const [showmessage, setmessage] = useState("");
  const onDrop = useCallback(
  async (acceptedFiles: File[]) => {
    setProcessingStatus(true);
    try {
      const processedFiles: File[] = [];

      for (const originalFile of acceptedFiles) {
        const isScreenshot =
          /screenshot/i.test(originalFile.name) || /Screen\s?Shot/i.test(originalFile.name);
        if (isScreenshot) {
          toast({
            variant: "destructive",
            title: "Failed!",
            description: `${originalFile.name} appears to be a screenshot and will not be uploaded.`,
            duration: 5000,
          });
          continue;
        }

        const previewUrl = convertFileToUrl(originalFile);
        if (imageUrls.includes(previewUrl)) {
          toast({
            variant: "destructive",
            title: "Failed!",
            description: `${originalFile.name} has already been uploaded.`,
            duration: 5000,
          });
          continue;
        }

        let file = originalFile;

        if (file.size > 0.8 * 1024 * 1024) {
          try {
            const compressed = await compressImage(file);
            if (compressed.size > 0.8 * 1024 * 1024) {
              toast({
                variant: "destructive",
                title: "Failed!",
                description: `${file.name} is still too large after compression. Skipped.`,
                duration: 5000,
              });
              continue;
            }
            file = compressed;
          } catch (err) {
            console.error("Compression failed", err);
            continue;
          }
        }

        try {
          const watermarked = await applyWatermark(file, userName.toUpperCase(), "Posted on mapa");
          processedFiles.push(watermarked);
        } catch (error) {
          console.error("Watermarking failed, proceeding with original image:", error);
          processedFiles.push(file);
        }
      }

      setFiles((prevFiles) => [...prevFiles, ...processedFiles]);
      const urls = processedFiles.map((file) => convertFileToUrl(file));
      onFieldChange([...imageUrls, ...urls]);
    } catch (err) {
      console.error("Processing failed", err);
    } finally {
      setProcessingStatus(false);
    }
  },
  [imageUrls, setFiles, onFieldChange, userName, toast]
);


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image/*"]),
  });

  const handleRemoveImage = async (index: number) => {
    const imageUrl = imageUrls[index];
    // const imageUrl = new URL(imageUrls[index]);
    // const deleteImage = url.pathname.split("/").pop();
    if (imageUrl) {
      await removeImageUrl(adId, imageUrl);
      // await deleteSingleImage({
      //  deleteImage,
      //   path: "/profile",
      // });
    }
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    onFieldChange(newImageUrls);

    // Remove from setFiles
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return (
    <div className="w-full flex-center dark:text-[#e4ebeb] flex cursor-pointer p-1 flex-col">
      <input {...getInputProps()} className="cursor-pointer" />
      <div className="text-left text-sm w-full">
        <div className="font-semibold">Add Photo</div>
        <div>
         
         {category ==='Property Services' ?(<> 
         <small className="dark:text-gray-500 text-[#464b4f]">Add Profile Image</small>
         </>):(<><small className="dark:text-gray-500 text-[#464b4f]">Add at least 3 photos for this category</small>  <br />
          <small className="dark:text-gray-500 text-[#464b4f]">
            First picture - is the title picture.
          </small>
          </>)}   
          
        
        </div>
        {processingStatus && (
        <div className="flex p-2 gap-2 text-gray-500 justify-center items-center">
          <CircularProgress sx={{ color: "gray" }} size={30}/> processing images...
        </div>
      )}
        {imageUrls.length > 0 ? (
          <div className="flex w-full m-1 ">
            <div {...getRootProps()}>
              <AddBoxIcon className="my-auto hover:cursor-pointer" />
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-5 w-full p-2 rounded-sm">
          
{imageUrls.map((url, index) => {
 
  return (
    <div
      key={index}
      className="relative justify-center items-center mb-1 rounded-sm bg-[#e4ebeb] shadow-sm p-1 mr-1 flex-shrink-0"
    >
      {/* Show spinner only when loading */}
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-100">
          <Icon icon={threeDotsScale} className="w-6 h-6 text-gray-500" />
        </div>
      )}

      <Zoom>
        <img
          src={url}
          alt={`image-${index}`}
          className={`w-full h-[100px] object-cover object-center rounded-sm transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsLoading(false)} // Hide spinner when loaded
          onError={(e) => {
            e.currentTarget.src = "/assets/icons/error.svg"; // Fallback image
            setIsLoading(false); // Hide spinner on error
          }}
        />
      </Zoom>

      <div
        onClick={() => handleRemoveImage(index)}
        className="absolute top-0 right-0 rounded-xl bg-white p-1 shadow-sm"
      >
        <img src="/assets/icons/delete.svg" alt="delete" width={20} height={20} />
      </div>
    </div>
  );
})}


            </div>
          </div>
        ) : (
          <div
            className="flex-center flex-col py-5 text-grey-500"
            {...getRootProps()}
          >
            <img
              src="/assets/icons/upload.svg"
              width={77}
              height={77}
              alt="file upload"
            />
            <h3 className="mb-2 mt-2">Drag photos here</h3>
            <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
            <Button type="button" className="rounded-full">
              Tap to upload photos
            </Button>
          </div>
        )}

        <br />
        <small className="dark:text-gray-500 text-[#464b4f]">
          Supported formats are .jpg, .gif .svg and .png, 5MB max
        </small>
      </div>
    </div>
  );
}
