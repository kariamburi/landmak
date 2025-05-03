"use client";

import React, { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { FileUploaderCategory } from "./FileuploaderCategory";
import { Button } from "../ui/button";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import { useUploadThing } from "@/lib/uploadthing";
import { createCategory, updateCategory } from "@/lib/actions/category.actions";
import { IconUploader } from "./IconUploader";
import { ICategory } from "@/lib/database/models/category.model";
import { usePathname } from "next/navigation";
import { useToast } from "../ui/use-toast";

interface CategoryProps {
  category?: ICategory | null;
  type: string;
}
const CreateCategoryForm = ({ category, type }: CategoryProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [oldurl, setOldurl] = useState("");
  const [formData, setFormData] = useState<Record<string, any>>([]);
  const pathname = usePathname();
  const { toast } = useToast();
  const { startUpload } = useUploadThing("imageUploader");
  useEffect(() => {
  
    const getCategory = async () => {
      try {
        if (type === "Update" && category) {
          // Update fields if a match is found
          
          setOldurl(category.imageUrl[0]);
          setFormData({
            ...formData,
            name: category.name,
            imageUrl: category.imageUrl[0],
            status: category.status || "active",
          });
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    getCategory();
    //setFormData({ ...formData, ['status']: 'active' });
  }, []);
  const uploadFiles = async () => {
    const uploadedUrls: string[] = [];
    let i = 0;
    for (const file of files) {
      try {
        i++;
        const uploadedImages = await startUpload([file]);
        if (uploadedImages && uploadedImages.length > 0) {
          uploadedUrls.push(uploadedImages[0].url);
          setUploadProgress(Math.round((i / files.length) * 100));
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    return uploadedUrls.filter((url) => !url.includes("blob:"));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };
  const handleSubmit = async () => {
    setLoading(true);

    try {
      //const isValid = await validateForm();

      // if (!isValid) return;
      if (type === "Create") {
        // Update fields if a match is found
        const uploadedUrls = await uploadFiles();
        const finalData = {
          ...formData,
          imageUrl: uploadedUrls,
        };
        await createCategory({
          formData: finalData,
          path: pathname,
        });
        toast({
          title: "Created",
          description: "Category created successfully.",
          duration: 5000,
          className: "bg-[#30AF5B] text-white",
        });
      }
      if (type === "Update" && category) {
        // Update fields if a match is found
        const uploadedUrls = await uploadFiles();
        const finalData = {
          ...formData,
          imageUrl: uploadedUrls,
        };
        const deleteUrl = oldurl === uploadedUrls[0];
        await updateCategory({
          _id: category._id,
          formData: finalData,
          deleteUrl: deleteUrl,
          oldurl: oldurl,
          path: pathname,
        });
        toast({
          title: "Updated",
          description: "Category updated successfully.",
          duration: 5000,
          className: "bg-[#30AF5B] text-white",
        });
      }

      setFormData([]);
      setFiles([]);
      setUploadProgress(0);
      // console.log("Data submitted successfully");
    } catch (error) {
      console.error("Validation or submission failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border flex flex-col items-center lg:p-4 bg-white dark:bg-[#131B1E] text-gray-700 dark:text-[#F1F3F3]">
      <ScrollArea className="h-[400px] w-full p-3">
        <div className="w-full p-1">
          <div className="mb-4">
            <label className="block">Category Name</label>
            <input
              type="text"
              value={formData["name"] || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="border rounded-lg p-2 w-full dark:bg-[#2D3236] bg-white"
              required
            />
          </div>
          <div className="mb-4">
  <label className="block">Status</label>
  <select
    value={formData["status"]}
    onChange={(e) => handleInputChange("status", e.target.value)}
    className="border rounded-lg p-2 w-full dark:bg-[#2D3236] bg-white"
  >
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </select>
</div>
          <div className="mb-4">
            <IconUploader
              onFieldChange={(url) => handleInputChange("imageUrl", url)} // Pass the updated imageUrl back to the form
              iconUrl={formData["imageUrl"] || null} // Ensure it's either a string or null
              setFile={setFiles}
            />
          </div>
          <Button
            onClick={handleSubmit}
            size="lg"
            disabled={loading}
            className="button col-span-2 mt-3 w-full"
          >
            <div className="flex gap-1 items-center">
              {loading && <CircularProgressWithLabel value={uploadProgress} />}

              {loading ? "Submitting..." : `${type} Category `}
            </div>
          </Button>
        </div>

        {status && <p className="mt-4 text-sm">{status}</p>}
      </ScrollArea>
    </div>
  );
};

export default CreateCategoryForm;
