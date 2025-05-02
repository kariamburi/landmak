"use client";

import React, { useEffect, useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import { TextareaAutosize } from "@mui/material";
import Image from "next/image";
import {
  createSubCategory,
  deleteCategory,
  getallcategories,
  updateCategory,
} from "@/lib/actions/subcategory.actions";
import { IconUploader } from "./IconUploader";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "../ui/use-toast";
import { ScrollArea } from "../ui/scroll-area";
type subcatProps = {
  subcategories: any;
};
const DisplaySubCategories = ({ subcategories }: subcatProps) => {
  
  const [status, setStatus] = useState("");
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editFields, setEditFields] = useState<any>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [iconUrl, setIconUrl] = useState("");
  const [oldurl, setOldurl] = useState("");
  const { startUpload } = useUploadThing("imageUploader");
  const { toast } = useToast();

  const uploadFiles = async () => {
    const uploadedUrls: string[] = [];
    let i = 0;
    for (const file of files) {
      try {
        i++;
        const uploadedImages = await startUpload([file]);
        if (uploadedImages && uploadedImages.length > 0) {
          uploadedUrls.push(uploadedImages[0].url);
          setUploadProgress(Math.round(((i + 1) / files.length) * 100));
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    return uploadedUrls.filter((url) => !url.includes("blob:"));
  };
  const handleDelete = async (categoryId: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;
    setStatus("Deleting...");

    try {
      await deleteCategory(categoryId, imageUrl);
      setStatus("");

      toast({
        title: "Deleted",
        description: "subcategory deleted successfully.",
        duration: 5000,
        className: "bg-[#30AF5B] text-white",
      });
      //fetchCategories();
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      // setStatus("Failed to delete subcategory. Please try again.");
      toast({
        variant: "destructive",
        title: "Failed!",
        description: "Failed to delete subcategory. Please try again.",
        duration: 5000,
      });
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setEditFields(category.fields);
  };

  const handleEditFieldChange = (index: any, key: any, value: any) => {
    const updatedFields: any = [...editFields];
    updatedFields[index][key] = value;
    setEditFields(updatedFields);
  };

  const handleSaveEdit = async () => {
    try {
      setStatus("Saving edits...");
      let imageUrl: any = [];
      if (iconUrl) {
        imageUrl = await uploadFiles();
        setOldurl(editingCategory.imageUrl[0]);
      } else {
        imageUrl = editingCategory.imageUrl[0];
      }

      const categoryName = editingCategory.name;
      const subcategoryName = editingCategory.subcategory;
      const categoryId = editingCategory._id;
      await updateCategory(
        categoryId,
        categoryName,
        subcategoryName,
        imageUrl,
        oldurl,
        editFields
      );
      setStatus("");
      toast({
        title: "Updated",
        description: "Category updated successfully.",
        duration: 5000,
        className: "bg-[#30AF5B] text-white",
      });
      setEditingCategory(null);
      // fetchCategories();
      setIconUrl("");
    } catch (error) {
      console.error("Error saving edits:", error);
      // setStatus("Failed to save edits. Please try again.");
      toast({
        variant: "destructive",
        title: "Failed!",
        description: "Failed to save edits. Please try again..",
        duration: 5000,
      });
    }
  };
  
  
  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditFields([]);
  };
  const handleIconInput = (field: string, value: any) => {
    if (value) {
      setIconUrl(value);
    } else {
    }
  };
  const handleRemoveField = (index: number) => {
    setEditFields(editFields.filter((_: any, i: any) => i !== index));
  };
  return (
    <div className="p-0 text-black dark:text-[#F1F3F3]">
      {status && (
        <p className="mb-4 text-sm text-gray-700 dark:text-[#F1F3F3]">
          {status}
        </p>
      )}

      {subcategories.length === 0 ? (
        <p>No categories available.</p>
      ) : (
        <div className="text-sm space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-1">
          {subcategories.map((category: any) => (
            <div
              key={category._id}
              className="border rounded-lg p-1 shadow-sm bg-white dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]"
            >
              {editingCategory && editingCategory._id === category._id ? (
                <div>
                  <h2 className="font-semibold">
                    Editing {category.subcategory}
                    {"("}
                    {category.category.name}
                    {")"}
                  </h2>
               
                  <div className="mb-4">
                    <IconUploader
                      onFieldChange={(url) => handleIconInput("imageUrl", url)} // Pass the updated imageUrl back to the form
                      iconUrl={iconUrl || category.imageUrl[0]} // Ensure it's either a string or null
                      setFile={setFiles}
                    />
                  </div>
                  <div className="mt-2">
                    {editFields.map((field: any, index: number) => (
                      <div key={index} className="mb-2">
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) =>
                            handleEditFieldChange(index, "name", e.target.value)
                          }
                          className="border rounded p-2 w-full mb-1 dark:bg-[#2D3236] bg-white"
                          placeholder="Field Name"
                        />

                        <select
                          value={field.type}
                          onChange={(e) =>
                            handleEditFieldChange(index, "type", e.target.value)
                          }
                          className="border rounded p-2 w-full mb-1 dark:bg-[#2D3236] bg-white"
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="select">Select</option>
                          <option value="radio">Radio</option>
                          <option value="checkbox">Checkbox</option>
                          <option value="textarea">Textarea</option>
                          <option value="multi-select">Multi-Select</option>
                          <option value="autocomplete">AutoComplete</option>
                          <option value="year">Year</option>
                          <option value="phone">Phone</option>
                          <option value="price">Sale Price</option>
                          <option value="rentprice">Price Per Duration</option>
                          <option value="priceper">Price Per Space</option>
                          <option value="bulkprice">Price & BulkPrice</option>
                          <option value="serviceprice">
                            Price Per Service
                          </option>
                          <option value="delivery">Delivery Option</option>
                          <option value="youtube-link">YouTube or TikTok Video link</option>
                          <option value="virtualTourLink">3D Virtual Property Tour Link</option>
                          <option value="propertyarea"> Advanced Property Mapping</option>
                          <option value="related-autocompletes">
                            Related-autocompletes
                          </option>
                        </select>
                        {(field.type === "select" ||
                          field.type === "radio" ||
                          field.type === "checkbox" ||
                          field.type === "autocomplete" ||
                          field.type === "multi-select") && (
                          <div>
                            <input
                              type="text"
                              value={field.options.join(", ")}
                              onChange={(e) =>
                                handleEditFieldChange(
                                  index,
                                  "options",
                                  e.target.value
                                    .split(",")
                                    .map((option) => option.trim())
                                )
                              }
                              className="border rounded p-2 w-full mb-1 dark:bg-[#2D3236] bg-white"
                              placeholder="Comma-separated options"
                            />
                          </div>
                        )}
                        {field.type === "related-autocompletes" && (
                          <TextareaAutosize
                            placeholder="Comma-separated options"
                            value={field.options}
                            minRows={3} // Minimum number of rows
                            maxRows={10} // Optional: Maximum number of rows
                            style={{
                              width: "100%",
                              padding: "8px",
                              fontSize: "16px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                            }}
                            onChange={(e) =>
                              handleEditFieldChange(
                                index,
                                "options",
                                e.target.value
                              )
                            }
                            className="border w-full rounded-lg p-2 flex-1 dark:bg-[#2D3236] bg-white"
                          />
                        )}
                        <label className="flex items-center mb-1">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) =>
                              handleEditFieldChange(
                                index,
                                "required",
                                e.target.checked
                              )
                            }
                            className="mr-2"
                          />
                          Required
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemoveField(index)}
                          className="bg-red-500 h-8 w-8 text-[#F1F3F3] p-1 rounded-lg"
                        >
                          <DeleteOutlineOutlinedIcon />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setEditFields([
                          ...editFields,
                          {
                            name: "",
                            type: "text",
                            required: false,
                            options: [],
                            multiSelect: false,
                          },
                        ])
                      }
                      className="bg-black hover:bg-gray-600 
    dark:bg-gray-700 dark:hover:bg-gray-600 text-[#F1F3F3] p-2 rounded-lg mt-2"
                    >
                      <div className="flex gap-1 items-center">
                        <AddOutlinedIcon /> Add Field
                      </div>
                    </button>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-black hover:bg-gray-600 
    dark:bg-gray-700 dark:hover:bg-gray-600 text-[#F1F3F3] p-2 rounded-lg"
                    >
                      <div className="flex gap-1 items-center">
                        <DoneOutlinedIcon /> Save Changes
                      </div>
                    </button>
                   
                    <button
                      onClick={handleCancelEdit}
                      className="bg-black hover:bg-gray-600 
    dark:bg-gray-700 dark:hover:bg-gray-600 text-[#F1F3F3] p-2 rounded-lg"
                    >
                      <CloseOutlinedIcon />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <ScrollArea className="h-[250px] w-full p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-1">
                        <div className="rounded-full dark:bg-[#2D3236] bg-white p-2">
                          <Image
                            className="w-12 h-8 object-cover"
                            src={category.imageUrl[0]}
                            alt={category.subcategory}
                            width={60}
                            height={60}
                          />
                        </div>
                        <h2 className="text-lg font-semibold">
                          {category.subcategory} {"("}
                          {category.category.name}
                          {")"}
                        </h2>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="bg-black hover:bg-gray-600 
    dark:bg-gray-700 dark:hover:bg-gray-600 text-[#F1F3F3] p-2 rounded-xl"
                        >
                          <EditOutlinedIcon />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(
                              category._id,
                              category.imageUrl[0] ?? ""
                            )
                          }
                          className="bg-black hover:bg-gray-600 
    dark:bg-gray-700 dark:hover:bg-gray-600 text-[#F1F3F3] p-2 rounded-xl"
                        >
                          <DeleteOutlineOutlinedIcon />
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Fields:</h3>
                      <ul className="list-disc pl-5 mt-2">
                        {category.fields.map((field: any, index: number) => (
                          <li key={index} className="mb-1">
                            <strong>{field.name}</strong> ({field.type})
                            {field.required && (
                              <span className="text-red-500"> *Required</span>
                            )}
                            {(field.type === "select" ||
                              field.type === "autocomplete" ||
                              field.type === "multi-select") && (
                              <div className="ml-4 text-sm text-gray-600">
                                Options: {field.options.join(", ")}{" "}
                                {field.multiSelect && (
                                  <span className="text-blue-500">
                                    (Multi-Select)
                                  </span>
                                )}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplaySubCategories;
