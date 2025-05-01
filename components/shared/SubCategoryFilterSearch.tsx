import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getAllCategories } from "@/lib/actions/category.actions";
import { ICategory } from "@/lib/database/models/category.model";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  formUrlQuery,
  formUrlQuerymultiple,
  removeKeysFromQuery,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import React from "react";

type sidebarProps = {
  categoryList: any;
  category: string;
  onLoading?: () => void;
  handleFilter:(value:any) => void;
};

const SubCategoryFilterSearch = ({
  category,
  categoryList,
  onLoading,
  handleFilter,
}: //AdsCountPerSubcategory,
sidebarProps) => {
  // const [categories, setCategories] = useState<ICategory[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);
   const [query, setQuery] = useState("");
  const onSelectCategory = (query: string) => {
    if (query) {
    
      handleFilter({
        category: category.toString(),
        subcategory: query.toString(),
      })
    
    } 
   
  };
  const selectedCategory = categoryList.find(
    (cat: any) => cat.subcategory === searchParams.get("subcategory")
  );

  const totalAdCount = selectedCategory ? selectedCategory.adCount : 0;
  const categoryImageUrl = selectedCategory ? selectedCategory.imageUrl[0] : "";
  return (
    <>
     
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="py-2 px-2 rounded-sm border border-gray-300 dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 items-start w-full rounded-lg cursor-pointer border">
            <div className="flex flex-col">
              <label className="text-sm font-medium dark:text-gray-400 text-gray-500">
                Category
              </label>
              <div className="dark:text-gray-100 text-black text-base">
                {searchParams.get("subcategory") ? (
                  <>
                    <div className="flex w-full gap-1 items-center">
                      <div className="flex gap-1 items-center">
                        <Image
                          className="h-4 w-6 object-cover"
                          src={categoryImageUrl || ""}
                          alt={query || ""}
                          width={60}
                          height={60}
                        />
                        <div className="w-[300px]">
                          {query}
                        </div>
                      </div>
                      <div className="flex items-center justify-end w-full">
                        <div className="flex gap-1 items-center">
                          <div>{totalAdCount}</div>
                          <div>ads</div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>{`Search subcategory`}</>
                )}
              </div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          className="dark:bg-[#222528] dark:text-gray-100"
        >
          <Command>
            <div className="dark:bg-[#222528] border-b border-gray-800">
              <CommandInput placeholder={`Search sub category`} />
            </div>
            <CommandList className="dark:bg-[#222528] dark:text-gray-100">
              <CommandEmpty>No sub category found</CommandEmpty>
              <CommandGroup>
                {categoryList
                  .filter((cat: any) => cat.category.name === category)
                  .map((sub: any, index: number) => (
                    <CommandItem
                      key={index}
                      //className="dark:hover:bg-[#131B1E]"
                      onSelect={() => {
                        setQuery(sub.subcategory)
                        onSelectCategory(sub.subcategory);
                        setOpen(false);
                      }}
                    >
                      <div className="flex w-full gap-1 items-center">
                        <div className="flex gap-1 items-center">
                          <Image
                            className="h-4 w-5 object-cover"
                            src={sub.imageUrl[0] || ""}
                            alt={sub.subcategory}
                            width={60}
                            height={60}
                          />

                          <div className="flex text-sm flex-col">
                            {sub.subcategory}
                            <div className="flex text-xs dark:text-gray-500 gap-1">
                              {sub.adCount}
                              <div>ads</div>
                            </div>
                          </div>
                        </div>
                        {/*  <div className="flex items-center justify-end w-full">
                          <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                        </div>*/}
                      </div>
                      <Check
                        className={cn(
                          "ml-auto",
                          query === sub.subcategory
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default SubCategoryFilterSearch;
