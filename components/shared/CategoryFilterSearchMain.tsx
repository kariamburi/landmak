"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from "@/lib/actions/category.actions";
import { ICategory } from "@/lib/database/models/category.model";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";
const CategoryFilterSearchMain = ({ onSelectCategory,categoryList }: { categoryList:any, onSelectCategory: (value :any) => void }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [category, setCategory] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {

    setCategories(categoryList as ICategory[]);
  
  }, []);

  return (
    <>
      <Select onValueChange={(value: string) => onSelectCategory(value)}>
        <SelectTrigger className="select-field flex gap-1 dark:bg-[#2D3236] dark:text-gray-300">
          <div className="flex gap-1">
            {!category && (
              <>
                <SearchOutlinedIcon />
              </>
            )}
            <SelectValue placeholder="Search Category" />
          </div>
        </SelectTrigger>
        <SelectContent className="dark:bg-[#2D3236] dark:text-gray-300">
          {categories.map((category) => (
            <SelectItem
              value={category.name}
              key={category._id}
              className="flex w-full cursor-pointer p-regular-14 dark:hover:bg-[#131B1E]"
            >
              <div className="flex w-[280px] items-center">
                <div className="flex gap-1 items-center">
                  <Image
                    className="h-4 w-4 object-cover"
                    src={category.imageUrl[0] || ""}
                    alt={category.name || ""}
                    width={60}
                    height={60}
                  />

                  <div className="flex text-sm flex-col">
                    {category.name}
                    <div className="flex text-xs dark:text-gray-500 gap-1">
                      {category.adCount}
                      <div>ads</div>
                    </div>
                  </div>
                </div>
              
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default CategoryFilterSearchMain;
