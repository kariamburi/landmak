"use client";

import { useEffect, useState } from "react";
import { equipmentTypes } from "@/constants";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import InitialAvatar from "./InitialAvatar";
import MakeModelMenu from "./MakeModelMenu";

type CardProps = {
  category: string;
  categoryList?: any;
  subcategory?: string;
  clearQuery:boolean;
  handleFilter:(value:any) => void;
};

interface Field {
  name: string;
  type:
    | "text"
    | "number"
    | "select"
    | "radio"
    | "checkbox"
    | "textarea"
    | "multi-select"
    | "autocomplete"
    | "phone"
    | "year"
    | "youtube-link"
    | "price"
    | "rentprice"
    | "priceper"
    | "bulkprice"
    | "delivery"
    | "related-autocompletes";
  required?: boolean;
  options?: string[];
}

export default function MenuType({
  category,
  categoryList,
  subcategory,
  handleFilter,
  clearQuery,
}: CardProps) {
  const [field, setField] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [type, setType] = useState<any[]>([]);
 const [query, setQuery] = useState("");
 
  useEffect(() => {
    setQuery(""); 
    const selectedData: any = categoryList.find(
      (catg: any) =>
        catg.category.name === category && catg.subcategory === subcategory
    );

    let filteredFields: any = [];

    // Check for the conditions in sequence: 'type', 'make', 'brand'
    filteredFields = selectedData.fields.filter((field: any) => {
      return (
        field.name === "type" ||
        /type/i.test(field.name) ||
        field.name === "make" ||
        field.name === "make-model" ||
        field.name === "brand"
      );
    });

    if (filteredFields.length > 0) {
      setField(filteredFields[0].name); // Set the first matching field
      setType(filteredFields[0].options || []);
     // console.log(filteredFields[0].name);
     // console.log(filteredFields[0].options);
    } else {
      setField(""); // If no match, set field to empty
      setType([]); // Clear options
    }
  }, [category, subcategory, categoryList, clearQuery]);

  const onSearch = (query: string) => {
    //let newUrl = "";
  
    if (query) {
      setQuery(query);
      handleFilter({category:category, subcategory:subcategory, ...{ [field]: query }});
     // console.log({category:category, subcategory:subcategory, ...{ [field]: query }})
     // newUrl = formUrlQuery({
     //   params: searchParams.toString(),
      //  key: field,
      //  value: query,
      //});
    } 
    //else {
    //  newUrl = removeKeysFromQuery({
     //   params: searchParams.toString(),
     //   keysToRemove: [field],
     // });
   // }
   // onLoading();
   // router.push(newUrl, { scroll: false });
   //subcategory === "Cars, Vans & Pickups"
  };

  return (
    <div className="mt-2">
      <div className="grid grid-cols-4 lg:grid-cols-7 m-0 gap-1">
        {field === "make-model" ? (
          <>
            <MakeModelMenu plainTextData={type} handleFilter={handleFilter} clearQuery={clearQuery}/>
          </>
        ) : (
          <>
        
            {type.map((option: any) => (
               // {type.slice(0, 7).map((option: any) => (
              <div
                onClick={(e) => onSearch(option)}
                key={option} // Always good to have a unique key prop
                className={`flex h-[80px] flex-col items-center justify-center cursor-pointer rounded-sm p-1 border hover:border-green-600 ${
                  option === query
                    ? "bg-green-600 text-white"
                    : "dark:bg-[#131B1E] bg-white hover:bg-green-100"
                }`}
              >
                <div
                  className="flex flex-col text-center items-center"
                  
                >
                  <div>
                    <InitialAvatar name={option} color={"#2D3236"} />
                  </div>

                  <h2 className="text-[10px]">{option}</h2>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
