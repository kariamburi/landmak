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
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "@/lib/actions/category.actions";
import { DeleteCategory } from "./DeleteCategory";
import AddCategoryWindow from "./AddCategoryWindow";
import { ICategory } from "@/lib/database/models/category.model";
type catProps = {
  categories: any;
};
const DisplayCategories = ({ categories }: catProps) => {
  // const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  useEffect(() => {
    //fetchCategories();
  }, []);

  //const fetchCategories = async () => {
  //  try {
  //    const response = await getAllCategories();

  //   setCategories(response);
  //} catch (error) {
  //   console.error("Error fetching categories:", error);
  //}
  //};

  const handleOpenCategory = (category: ICategory) => {
    setSelectedCategory(category);
   // alert(category.name)
    setIsOpenCategory(true);
  };

  const handleCloseCategory = () => {
    setIsOpenCategory(false);
    setSelectedCategory(null);
  };
  return (
    <div className="p-0 text-black dark:text-[#F1F3F3]">
      {status && (
        <p className="mb-4 text-sm text-gray-700 dark:text-[#F1F3F3]">
          {status}
        </p>
      )}

      {categories.length === 0 ? (
        <p>No categories available.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category: any) => (
            <div
              key={category._id}
              className="border rounded-lg p-4 shadow-sm bg-white dark:bg-[#131B1E] text-black dark:text-[#F1F3F3]"
            >
              <div className="flex justify-between items-center">
                <div className="flex gap-1 items-center">
                  <div className="rounded-full dark:bg-[#2D3236] bg-white p-2">
                    <Image
                      className="w-full h-full object-cover"
                      src={category.imageUrl[0]}
                      alt={category.name}
                      width={30}
                      height={30}
                    />
                  </div>
                  <h2 className="text-sm font-bold">{category.name}</h2>
                
                  <p
  className={`text-sm font-medium ${
    category?.status === "inactive" ? "text-red-500" : "text-green-600"
  }`}
>
  {category?.status || "active"}
</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleOpenCategory(category)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <EditOutlinedIcon />
                  </button>
                  <DeleteCategory
                    categoryId={category._id}
                    categoryImage={category.imageUrl[0]}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <AddCategoryWindow
        isOpen={isOpenCategory}
        onClose={handleCloseCategory}
        category={selectedCategory}
        type={"Update"}
      />
    </div>
  );
};

export default DisplayCategories;
