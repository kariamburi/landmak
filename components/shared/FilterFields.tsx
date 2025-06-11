import React, { useState, useEffect } from "react";
import axios from "axios";
import { Multiselect } from "./Multiselect";
import AutoComplete from "./AutoComplete";
import MakeModelAutocomplete from "./MakeModelAutocomplete";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { Button } from "../ui/button";
import {
  formUrlQuery,
  formUrlQuerymultiple,
  removeKeysFromQuery,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import MakeModelAutocompleteFilter from "./MakeModelAutocompleteFilter";
import AutoCompleteFilter from "./AutoCompleteFilter";
interface Field {
  name: string;
  type: string;
  options: string[];
  required: boolean;
}

interface Subcategory {
  fields: Field[];
}
type CollectionProps = {
  category: string;
  subcategory: string;
  allsubcategory: any;
  adsCount: any;
  formData:any;
  handleInputChange:(field: string, value: any) => void;
  handleCheckboxChange:(field: string, value: any) => void;
  handleInputAutoCompleteChange:(field: string, value: any) => void;
  handleInputYearChange:(field: string, value: any) => void;

};
const FilterFields = ({
  category,
  subcategory,
  allsubcategory,
  adsCount,
  formData,
  handleInputChange,
  handleCheckboxChange,
  handleInputAutoCompleteChange,
  handleInputYearChange,
}: CollectionProps) => {
  const [fields, setFields] = useState<Field[]>([]);
  /// const [filters, setFilters] = useState<{ [key: string]: any }>({});
  
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const selectedData: any = allsubcategory.find(
      (catg: any) =>
        catg.category.name === category && catg.subcategory === subcategory
    );
    // Update fields if a match is found
    setFields(selectedData ? selectedData.fields : []);
  }, [category, subcategory]);
  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const currentYear = new Date().getFullYear();
  let years = [];
  for (let year = currentYear; year >= 1960; year--) {
    years.push(year.toString());
  }
  // Function to convert query parameters to an object
  const getQueryParamsObject = (url: string) => {
    const queryString = url.includes("?") ? url.split("?")[1] : url;
    return Object.fromEntries(new URLSearchParams(queryString));
  };

  

  return (
    <div>
      {fields.map((field: any) => (
        <div key={field.name} className="flex items-center">
          {field.type === "checkbox" && (
            <div className="mt-3 mb-3">
              {capitalizeFirstLetter(field.name.replace("-", " "))}
            </div>
          )}
          {field.type === "related-autocompletes" && (
            <MakeModelAutocompleteFilter
              plainTextData={field.options}
              make={formData["make"] || ""}
              formErrorsmake={""}
              model={formData["model"] || ""}
              formErrorsmodel={""}
              adsCount={adsCount}
              onChange={handleInputAutoCompleteChange}
            />
          )}

          {field.type === "select" && (
            <FormControl
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#4B5563", // Light mode border
                  },
                  "&:hover fieldset": {
                    borderColor: "#2563EB", // Border on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2563EB", // Border when focused
                  },
                },
              }}
              className="rounded-md dark:border-gray-600"
            >
              <InputLabel className="font-medium text-gray-500 dark:text-gray-400">
                {capitalizeFirstLetter(field.name.replace("-", " "))}
                {field.required && <>*</>}
              </InputLabel>
              <Select
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                required={field.required}
                label={capitalizeFirstLetter(field.name.replace("-", " "))}
                className="dark:text-gray-100 dark:bg-[#2D3236] bg-white"
              >
                {field.options?.map((option: any) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {field.type === "year" && (
            <AutoCompleteFilter
              data={years}
              name={field.name}
              adsCount={adsCount}
              onChange={handleInputYearChange}
              selected={formData[field.name] || ""}
            />
          )}
          {field.type === "autocomplete" && (
            <AutoCompleteFilter
              data={field.options}
              name={field.name}
              adsCount={adsCount}
              onChange={handleInputAutoCompleteChange}
              selected={formData[field.name] || ""}
            />
          )}

          {field.type === "radio" && (
            <AutoCompleteFilter
              data={field.options}
              name={field.name}
              adsCount={adsCount}
              onChange={handleInputAutoCompleteChange}
              selected={formData[field.name] || ""}
            />
          )}
          {field.type === "checkbox" && (
            <AutoCompleteFilter
              data={field.options}
              name={field.name}
              adsCount={adsCount}
              onChange={handleInputAutoCompleteChange}
              selected={formData[field.name] || ""}
            />
          )}
          {field.type === "multi-select" && (
            <div className="w-full flex mb-1 py-2 px-1 rounded-sm border border-gray-300 dark:border-gray-600 flex-wrap gap-2 dark:bg-[#2D3236] bg-white">
              <Multiselect
                features={field.options}
                name={field.name}
                selectedFeatures={formData[field.name] || []}
                onChange={handleCheckboxChange}
              />
            </div>
          )}
        </div>
      ))}
     
    </div>
  );
};

export default FilterFields;
