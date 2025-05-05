import { useCallback, Dispatch, SetStateAction } from "react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Button } from "@/components/ui/button";
import { convertFileToUrl } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { deleteSingleImage } from "@/lib/actions/ad.actions";
import { useToast } from "@/components/ui/use-toast";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
type IconUploaderProps = {
  onFieldChange: (url: string | null) => void;
  iconUrl: string | null;
  setFile: Dispatch<SetStateAction<File[]>>; // Allow handling multiple files
};

export function IconUploader({
  iconUrl,
  onFieldChange,
  setFile,
}: IconUploaderProps) {
  const { toast } = useToast();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 1) {
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: "Only one file can be uploaded.",
          duration: 5000,
        });
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: `${file.name} exceeds the 5MB limit.`,
          duration: 5000,
        });
        return;
      }

      try {
        const url = convertFileToUrl(file);
        setFile([file]); // Ensure files are set as an array
        onFieldChange(url);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    },
    [setFile, onFieldChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image/*"]),
    maxFiles: 1,
  });

  const handleRemoveIcon = async () => {
    if (iconUrl) {
      const url = new URL(iconUrl);
      const deleteImage = url.pathname.split("/").pop();

      if (deleteImage) {
        await deleteSingleImage({
          deleteImage,
          path: "/profile",
        });
      }
    }
    onFieldChange(null);
    setFile([]);
  };

  return (
    <div className="flex-center dark:text-[#e4ebeb] flex cursor-pointer p-0 flex-col overflow-hidden bg-grey-50">
      <input {...getInputProps()} className="cursor-pointer" />
      <div className="text-left text-sm w-full mx-auto">
        <div className="font-semibold">Upload Icon</div>
        <small className="dark:text-gray-500 text-[#464b4f]">
          Upload a single icon for your profile or category.
        </small>

        {iconUrl ? (
          <div className="flex w-full m-1">
            <div className="relative max-h-[150px] justify-center items-center mb-1 rounded-sm shadow-sm p-1 bg-white mr-1 flex-shrink-0">
              <Zoom>
                <img
                  src={iconUrl}
                  alt="icon"
                  className="w-full max-h-[140px] object-cover object-center rounded-sm"
                />
              </Zoom>
              <div
                {...getRootProps()}
                className="absolute text-gray-800 top-1 right-1 rounded-full bg-[#e4ebeb] p-1 shadow-sm hover:cursor-pointer"
              >
                <EditOutlinedIcon />
              </div>
              {/*   <div
                onClick={handleRemoveIcon}
                className="absolute top-0 right-0 rounded-xl bg-white p-1 shadow-sm"
              >
                <img
                  src="/assets/icons/delete.svg"
                  alt="delete"
                  width={20}
                  height={20}
                />
              </div> */}
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
            <h3 className="mb-2 mt-2">Drag your icon here</h3>
            <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
            <Button type="button" className="rounded-full">
              Tap to upload icon
            </Button>
          </div>
        )}

        <small className="dark:text-gray-500 text-[#464b4f]">
          Supported formats are .jpg, .svg, and .png, 5MB max.
        </small>
      </div>
    </div>
  );
}
