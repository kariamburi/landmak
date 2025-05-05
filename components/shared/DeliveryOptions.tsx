import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { ScrollArea } from "../ui/scroll-area";
import Select from "react-select"; // Import a multi-select library
import { REGIONS_WITH_CONSTITUENCIES } from "@/constants";
import { useMediaQuery } from "react-responsive"; // Detect mobile screens
import { Button } from "../ui/button";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
const formatRegions = () => {
  const formattedRegions = REGIONS_WITH_CONSTITUENCIES.map(
    ({ county, constituencies }) => ({
      label: county,
      options: [
        {
          value: county, // County-level option
          label: `${county} (All Areas)`,
        },
        ...constituencies.map((constituency) => ({
          value: constituency,
          label: `${county} - ${constituency}`,
        })),
      ],
    })
  );

  return [{ value: "All Kenya", label: "All Kenya" }, ...formattedRegions];
};

const DeliveryOptions = ({
  selected,
  name,
  subcategory,
  onChange,
  onSave,
}: {
  selected: any;
  name: string;
  subcategory: string;
  onChange: (field: string, value: any) => void;
  onSave: () => void;
}) => {
  const [chargeFee, setChargeFee] = useState("No");
  const isDarkMode = true; // Replace with theme context if available
 const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile screens

  const { register, control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      delivery: selected || [
        {
          name: subcategory,
          region: [],
          daysFrom: "",
          daysTo: "",
          chargeFee: "",
          costFrom: "",
          costTo: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "delivery",
  });

  const regionOptions = formatRegions();

  const handleRegionChange = (
    index: number,
    selectedOptions: { value: string }[]
  ) => {
    const selectedValues = selectedOptions.map((option) => option.value);

    // Ensure "All Kenya" is exclusive
    if (selectedValues.includes("All Kenya")) {
      setValue(`delivery.${index}.region`, ["All Kenya"]); // Clear other selections
    } else {
      setValue(`delivery.${index}.region`, selectedValues);
    }
  };

  const onSubmit = (data: any) => {
   // console.log(data.delivery); // Debug merged data
    onChange(name, data.delivery); // Pass it to the parent
    onSave();
  };

  return (<>
       {isMobile ? (
               
                  // Fullscreen Popover for Mobile
                  <div className="fixed inset-0 z-10 bg-[#e4ebeb] dark:bg-[#222528] dark:text-gray-100 p-4 flex flex-col">
                    <div className="flex justify-between items-center border-b pb-2">
                    <div className="flex gap-2 items-center mb-2">
        <LocalShippingOutlinedIcon />
        <h2 className="text-xl dark:text-gray-300 font-bold">
          Add Delivery Option
        </h2>
      </div>
                      <Button variant="outline" onClick={onSave}>
                      <CloseOutlinedIcon />
                      </Button>
                    </div>  
                    
                    <ScrollArea className="h-[70vh] w-full p-1">
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((item, index) => (
            <div key={item.id} className="mb-4 p-2">
              <label className="block dark:text-gray-300 text-gray-700 text-sm mb-2">
                Name this delivery
              </label>
              <input
                {...register(`delivery.${index}.name`)}
                disabled
                className="w-full px-4 py-2 border rounded-md dark:bg-[#131B1E] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., Computer Accessories"
              />

              <label className="block dark:text-gray-300 text-gray-700 text-sm mt-2">
                Region
              </label>

              <Select
                isMulti
                options={regionOptions}
                value={(watch(`delivery.${index}.region`) || []).map(
                  (value: any) => {
                    const optionLabel = regionOptions
                      .flatMap((group: any) => group.options || []) // Ensure `group.options` exists
                      .find((option: any) => option.value === value)?.label;

                    return { value, label: optionLabel || value }; // Fallback to value if label is missing
                  }
                )}
                onChange={(selectedOptions: any) =>
                  handleRegionChange(index, selectedOptions)
                }
                placeholder="Select Region and Area"
                classNamePrefix="react-select"
                className="w-full"
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary: "#009966",
                    primary25: "#93c5fd",
                    neutral0: isDarkMode ? "#131B1E" : "#ffffff",
                    neutral80: isDarkMode ? "#ffffff" : "#000000",
                    neutral20: isDarkMode ? "#374151" : "#d1d5db",
                    neutral30: isDarkMode ? "#4b5563" : "#6b7280",
                  },
                })}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: isDarkMode ? "#131B1E" : "#ffffff",
                    color: isDarkMode ? "#ffffff" : "#000000",
                    borderColor: state.isFocused
                      ? isDarkMode
                        ? "#009966"
                        : "#6b7280"
                      : isDarkMode
                      ? "#374151"
                      : "#d1d5db",
                    boxShadow: state.isFocused
                      ? "0 0 0 1px rgb(59, 69, 90)"
                      : "none",
                    "&:hover": {
                      borderColor: isDarkMode ? "#009966" : "#6b7280",
                    },
                  }),
                  option: (baseStyles, { isFocused, isSelected }) => ({
                    ...baseStyles,
                    backgroundColor: isSelected
                      ? isDarkMode
                        ? "#009966"
                        : "#93c5fd"
                      : isFocused
                      ? isDarkMode
                        ? "#1f2937"
                        : "#e5e7eb"
                      : isDarkMode
                      ? "#131B1E"
                      : "#ffffff",
                    color: isSelected
                      ? isDarkMode
                        ? "#ffffff"
                        : "#000000"
                      : isDarkMode
                      ? "#ffffff"
                      : "#000000",
                    padding: "10px",
                    "&:hover": {
                      backgroundColor: isDarkMode ? "#009966" : "#93c5fd",
                      color: "#ffffff",
                    },
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: isDarkMode ? "#131B1E" : "#ffffff",
                    borderRadius: "0.375rem",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }),
                  multiValue: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: isDarkMode ? "#374151" : "#e5e7eb",
                    color: isDarkMode ? "#ffffff" : "#000000",
                  }),
                  multiValueLabel: (baseStyles) => ({
                    ...baseStyles,
                    color: isDarkMode ? "#ffffff" : "#000000",
                  }),
                  multiValueRemove: (baseStyles) => ({
                    ...baseStyles,
                    color: isDarkMode ? "#ffffff" : "#000000",
                    "&:hover": {
                      backgroundColor: isDarkMode ? "#009966" : "#93c5fd",
                      color: "#ffffff",
                    },
                  }),
                }}
              />

              <label className="block dark:text-gray-300 text-gray-700 text-sm mt-2">
                How many days it takes to deliver?
              </label>
              <div className="flex space-x-2">
                <input
                  {...register(`delivery.${index}.daysFrom`)}
                  className="w-full px-4 py-2 border rounded-md dark:bg-[#131B1E] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="From"
                />
                <input
                  {...register(`delivery.${index}.daysTo`)}
                  className="w-full px-4 py-2 border rounded-md dark:bg-[#131B1E] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="To"
                />
              </div>

              <label className="block dark:text-gray-300 text-gray-700 text-sm mt-2">
                Do you charge a fee for delivery?
              </label>
              <select
                {...register(`delivery.${index}.chargeFee`)}
                className="w-full px-4 py-2 border rounded-md dark:bg-[#131B1E] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setChargeFee(e.target.value)}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>

              {chargeFee === "Yes" && (
                <>
                  <label className="block dark:text-gray-300 text-gray-700 text-sm mt-2">
                    How much does it cost for the customer?
                  </label>
                  <div className="flex space-x-2">
                    <input
                      {...register(`delivery.${index}.costFrom`)}
                      className="w-full px-4 py-2 border rounded-md dark:bg-[#131B1E] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="KSh From"
                    />
                    <input
                      {...register(`delivery.${index}.costTo`)}
                      className="w-full px-4 py-2 border rounded-md dark:bg-[#131B1E] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="KSh To"
                    />
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={() => remove(index)}
                className="mt-2 text-red-500 flex items-center"
              >
                <DeleteOutlineOutlinedIcon /> Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              append({
                name: subcategory,
                region: [],
                daysFrom: "",
                daysTo: "",
                chargeFee: "",
                costFrom: "",
                costTo: "",
              })
            }
            className="flex items-center justify-center w-full p-2 mt-4 bg-[#e4ebeb] text-black rounded-md hover:bg-gray-300"
          >
            <AddOutlinedIcon /> Add Delivery Option
          </button>
          {fields.length > 0 && (
            <>
              <button
                type="submit"
                className="w-full p-2 mt-4 bg-green-700 text-white rounded-md hover:bg-green-600"
              >
                Save
              </button>
            </>
          )}
        </form>
      </ScrollArea>
                    
                    </div>  
       ):(
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90 z-50">
                          <div className="dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 bg-white p-1 lg:p-6 w-full  lg:max-w-3xl rounded-md shadow-md relative">
                            <div className="flex justify-end items-center mb-1">
                              <Button
                                onClick={onSave}
                                variant="outline">
                                <CloseOutlinedIcon />
                              </Button>
                            </div>
    <div className="dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 bg-white rounded-md border p-2 dark:border-gray-700">
      <div className="flex gap-2 items-center mb-2">
        <LocalShippingOutlinedIcon />
        <h2 className="text-xl dark:text-gray-300 font-bold">
          Add Delivery Option
        </h2>
      </div>
      <ScrollArea className="h-[70vh] w-full p-1">
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((item, index) => (
            <div key={item.id} className="mb-4 p-2">
              <label className="block dark:text-gray-300 text-gray-700 text-sm mb-2">
                Name this delivery
              </label>
              <input
                {...register(`delivery.${index}.name`)}
                disabled
                className="w-full px-4 py-2 border rounded-md dark:bg-[#131B1E] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g., Computer Accessories"
              />

              <label className="block dark:text-gray-300 text-gray-700 text-sm mt-2">
                Region
              </label>

              <Select
                isMulti
                options={regionOptions}
                value={(watch(`delivery.${index}.region`) || []).map(
                  (value: any) => {
                    const optionLabel = regionOptions
                      .flatMap((group: any) => group.options || []) // Ensure `group.options` exists
                      .find((option: any) => option.value === value)?.label;

                    return { value, label: optionLabel || value }; // Fallback to value if label is missing
                  }
                )}
                onChange={(selectedOptions: any) =>
                  handleRegionChange(index, selectedOptions)
                }
                placeholder="Select Region and Area"
                classNamePrefix="react-select"
                className="w-full"
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary: "#009966",
                    primary25: "#93c5fd",
                    neutral0: isDarkMode ? "#131B1E" : "#ffffff",
                    neutral80: isDarkMode ? "#ffffff" : "#000000",
                    neutral20: isDarkMode ? "#374151" : "#d1d5db",
                    neutral30: isDarkMode ? "#4b5563" : "#6b7280",
                  },
                })}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: isDarkMode ? "#131B1E" : "#ffffff",
                    color: isDarkMode ? "#ffffff" : "#000000",
                    borderColor: state.isFocused
                      ? isDarkMode
                        ? "#009966"
                        : "#6b7280"
                      : isDarkMode
                      ? "#374151"
                      : "#d1d5db",
                    boxShadow: state.isFocused
                      ? "0 0 0 1px rgb(59, 69, 90)"
                      : "none",
                    "&:hover": {
                      borderColor: isDarkMode ? "#009966" : "#6b7280",
                    },
                  }),
                  option: (baseStyles, { isFocused, isSelected }) => ({
                    ...baseStyles,
                    backgroundColor: isSelected
                      ? isDarkMode
                        ? "#009966"
                        : "#93c5fd"
                      : isFocused
                      ? isDarkMode
                        ? "#1f2937"
                        : "#e5e7eb"
                      : isDarkMode
                      ? "#131B1E"
                      : "#ffffff",
                    color: isSelected
                      ? isDarkMode
                        ? "#ffffff"
                        : "#000000"
                      : isDarkMode
                      ? "#ffffff"
                      : "#000000",
                    padding: "10px",
                    "&:hover": {
                      backgroundColor: isDarkMode ? "#009966" : "#93c5fd",
                      color: "#ffffff",
                    },
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: isDarkMode ? "#131B1E" : "#ffffff",
                    borderRadius: "0.375rem",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }),
                  multiValue: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: isDarkMode ? "#374151" : "#e5e7eb",
                    color: isDarkMode ? "#ffffff" : "#000000",
                  }),
                  multiValueLabel: (baseStyles) => ({
                    ...baseStyles,
                    color: isDarkMode ? "#ffffff" : "#000000",
                  }),
                  multiValueRemove: (baseStyles) => ({
                    ...baseStyles,
                    color: isDarkMode ? "#ffffff" : "#000000",
                    "&:hover": {
                      backgroundColor: isDarkMode ? "#009966" : "#93c5fd",
                      color: "#ffffff",
                    },
                  }),
                }}
              />

              <label className="block dark:text-gray-300 text-gray-700 text-sm mt-2">
                How many days it takes to deliver?
              </label>
              <div className="flex space-x-2">
                <input
                  {...register(`delivery.${index}.daysFrom`)}
                  className="w-full px-4 py-2 border rounded-md dark:bg-[#131B1E] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="From"
                />
                <input
                  {...register(`delivery.${index}.daysTo`)}
                  className="w-full px-4 py-2 border rounded-md dark:bg-[#131B1E] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="To"
                />
              </div>

              <label className="block dark:text-gray-300 text-gray-700 text-sm mt-2">
                Do you charge a fee for delivery?
              </label>
              <select
                {...register(`delivery.${index}.chargeFee`)}
                className="w-full px-4 py-2 border rounded-md dark:bg-[#131B1E] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setChargeFee(e.target.value)}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>

              {chargeFee === "Yes" && (
                <>
                  <label className="block dark:text-gray-300 text-gray-700 text-sm mt-2">
                    How much does it cost for the customer?
                  </label>
                  <div className="flex space-x-2">
                    <input
                      {...register(`delivery.${index}.costFrom`)}
                      className="w-full px-4 py-2 border rounded-md dark:bg-[#131B1E] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="KSh From"
                    />
                    <input
                      {...register(`delivery.${index}.costTo`)}
                      className="w-full px-4 py-2 border rounded-md dark:bg-[#131B1E] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="KSh To"
                    />
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={() => remove(index)}
                className="mt-2 text-red-500 flex items-center"
              >
                <DeleteOutlineOutlinedIcon /> Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              append({
                name: subcategory,
                region: [],
                daysFrom: "",
                daysTo: "",
                chargeFee: "",
                costFrom: "",
                costTo: "",
              })
            }
            className="flex items-center justify-center w-full p-2 mt-4 bg-[#e4ebeb] text-black rounded-md hover:bg-gray-300"
          >
            <AddOutlinedIcon /> Add Delivery Option
          </button>
          {fields.length > 0 && (
            <>
              <button
                type="submit"
                className="w-full p-2 mt-4 bg-green-700 text-white rounded-md hover:bg-green-600"
              >
                Save
              </button>
            </>
          )}
        </form>
      </ScrollArea>
    </div>
    </div>
    </div>)}
    </>);
};

export default DeliveryOptions;
