"use client";

import React, { useEffect, useState } from "react";
import { createSubCategory } from "@/lib/actions/subcategory.actions";
import { ScrollArea } from "../ui/scroll-area";
import CategorySelect from "./CategorySelect";
import { IconUploader } from "./IconUploader";
import { getAllCategories } from "@/lib/actions/category.actions";
import { useUploadThing } from "@/lib/uploadthing";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import CategorySelectSub from "./CategorySelectSub";
import { Button } from "../ui/button";
interface Field {
  name: string;
  type: string;
  required: boolean;
  options: string[];
  // selectedValues: string[]; // Add this to handle multi-select or other specific cases
}

const CreateSubCategoryForm = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryName, setSubCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [iconUrl, setIconUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { startUpload } = useUploadThing("imageUploader");

  const [fields, setFields] = useState<Field[]>([
    {
      name: "",
      type: "text",
      required: false,
      options: [],
      //selectedValues: [],
    },
  ]);
  const [status, setStatus] = useState("");
  const [selectedCategoryCommand, setSelectedCategoryCommand] = useState<
    string[]
  >([]);
  useEffect(() => {
    const getCategory = async () => {
      try {
        const category = await getAllCategories();
        setSelectedCategoryCommand(category);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    getCategory();
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
  const handleFieldChange = (index: number, key: keyof Field, value: any) => {
    const updatedFields: any = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleAddField = () => {
    setFields([
      ...fields,
      {
        name: "",
        type: "text",
        required: false,
        options: [],
        // selectedValues: [],
      },
    ]);
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Submitting...");
    setLoading(true);
    setUploadProgress(0);
    try {
      const imageUrl = await uploadFiles();
      const response = await createSubCategory(
        categoryId,
        subcategoryName,
        imageUrl,
        fields
      );
      console.log("Category Created:", response);
      setStatus("Category created successfully!");
      // setCategoryName("");
      //  setSubCategoryName("");
      //  setIconUrl("");
      // setFields([
      //  {
      //     name: "",
      //    type: "text",
      //    required: false,
      //    options: [],
      //selectedValues: [],
      //  },
      // ]);
    } catch (error) {
      console.error("Error creating category:", error);
      setStatus("Failed to create category. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleInputCategoryChange = (
    field: string,
    value: string,
    id: string
  ) => {
    setCategoryName(value);
    setCategoryId(id);
  };
  const handleIconInput = (field: string, value: any) => {
    setIconUrl(value);
  };
  return (
    <div className="flex flex-col items-center lg:p-4 bg-white dark:bg-[#131B1E] text-gray-700 dark:text-[#F1F3F3]">
      <ScrollArea className="h-[400px] w-full p-3">
        <form onSubmit={handleSubmit} className="w-full p-1">
          <div className="mb-4">
            <CategorySelectSub
              selected={categoryName}
              data={selectedCategoryCommand}
              onChange={handleInputCategoryChange}
            />
          </div>
          <div className="mb-4">
            <label className="block">Enter Subcategory</label>
            <input
              type="text"
              value={subcategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              className="border rounded-lg p-2 w-full dark:bg-[#2D3236] bg-white"
              required
            />
          </div>
          <div className="mb-4">
            <IconUploader
              onFieldChange={(url) => handleIconInput("imageUrl", url)} // Pass the updated imageUrl back to the form
              iconUrl={iconUrl || null} // Ensure it's either a string or null
              setFile={setFiles}
            />
          </div>
          <div className="mb-4">
            <label className="block">Fields</label>
            {fields.map((field, index) => (
              <div
                key={index}
                className="flex flex-col lg:flex-row gap-2 lg:items-center mb-2"
              >
                <input
                  type="text"
                  placeholder="Field Name"
                  value={field.name}
                  onChange={(e) =>
                    handleFieldChange(index, "name", e.target.value)
                  }
                  className="border rounded-lg p-2 w-full lg:flex-1 dark:bg-[#2D3236] bg-white"
                  required
                />
                <select
                  value={field.type}
                  onChange={(e) =>
                    handleFieldChange(index, "type", e.target.value)
                  }
                  className="border rounded-lg p-2 dark:bg-[#2D3236] bg-white"
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
                  <option value="budget">Budget</option>
                  <option value="price">Sale Price</option>
                  <option value="rentprice">Price Per Duration</option>
                  <option value="priceper">Price Per Space</option>
                  <option value="serviceprice">Price Per Service</option>
                  <option value="bulkprice">Price & BulkPrice</option>
                  <option value="delivery">Delivery Option</option>
                  <option value="youtube-link">YouTube or TikTok Video link</option>
                  <option value="virtualTourLink">3D Virtual Property Tour Link</option>
                  <option value="propertyarea"> Advanced Property Mapping</option>
                  <option value="related-autocompletes">
                    Related-autocompletes
                  </option>
                </select>
                {(field.type === "select" ||
                  field.type === "multi-select" ||
                  field.type === "radio" ||
                  field.type === "autocomplete" ||
                  field.type === "checkbox") && (
                  <input
                    type="text"
                    placeholder="Comma-separated options"
                    value={field.options.join(",")}
                    onChange={(e) =>
                      handleFieldChange(
                        index,
                        "options",
                        e.target.value.split(",")
                      )
                    }
                    className="border rounded-lg p-2 flex-1 dark:bg-[#2D3236] bg-white"
                  />
                )}
                {field.type === "related-autocompletes" && (
                  <textarea
                    placeholder="Comma-separated options"
                    value={field.options}
                    onChange={(e) =>
                      handleFieldChange(index, "options", e.target.value)
                    }
                    className="border w-full rounded-lg p-2 flex-1 dark:bg-[#2D3236] bg-white"
                  />
                )}

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) =>
                      handleFieldChange(index, "required", e.target.checked)
                    }
                    className="mr-2 dark:bg-[#2D3236] bg-white"
                  />
                  Required
                </label>
                <button
                  type="button"
                  onClick={() => handleRemoveField(index)}
                  className="bg-red-500 max-w-[100px] text-[#F1F3F3] p-1 rounded-lg"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddField}
              className="bg-green-500 text-[#F1F3F3] p-2 rounded-lg mt-2"
            >
              Add Field
            </button>
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="button col-span-2 mt-3 w-full"
          >
            <div className="flex gap-1 items-center">
              {loading && <CircularProgressWithLabel value={uploadProgress} />}

              {loading ? "Submitting..." : `Create SubCategory `}
            </div>
          </Button>
        </form>

        {status && <p className="mt-4 text-sm">{status}</p>}
      </ScrollArea>
    </div>
  );
};

export default CreateSubCategoryForm;
