"use client";

import { useEffect, useState } from "react";
const PriceInput = ({
  unit_,
  priceType_,
  price_,
  negotiable_,
  onChange,
}: {
  unit_: string;
  priceType_: string;
  price_: any;
  negotiable_: string;
  onChange: (field: string, value: string) => void;
}) => {
  const [priceType, setPriceType] = useState(priceType_); // 'contact' or 'specify'
  const [price, setPrice] = useState(price_);
  const [unit, setUnit] = useState(unit_);
  const [negotiable, setNegotiable] = useState(negotiable_);
   
  useEffect(() => {
    setPriceType(priceType_);
    setPrice(price_);
    setUnit(unit_);
    setNegotiable(negotiable_);
  }, [priceType_, price_, unit_, negotiable_]);

  const formatToCurrency = (value: string | number) => {
    if (!value) return "0";
    const numberValue =
      typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numberValue);
  };
  const parseCurrencyToNumber = (value: string): number => {
    // Remove any commas from the string and convert to number
    return Number(value.replace(/,/g, ""));
  };
  return (
    <div className="bg-white w-full py-2 px-1 rounded-sm border border-gray-300 dark:border-gray-600 dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100">
      <label className="text-lg font-semibold dark:text-gray-300">Price</label>
      <div className="flex items-center gap-4 mt-2">
        {/* Contact for Price Option */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="priceOption"
            value="contact"
            checked={priceType === "contact"}
            onChange={() => {
              onChange("contact", "contact");
              setPriceType("contact");
            }}
            className="hidden"
          />
          <div
            className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
              priceType === "contact" ? "border-gray-500" : "border-gray-300"
            }`}
          >
            {priceType === "contact" && (
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            )}
          </div>
          <span className="text-gray-700 dark:text-gray-300">
            Contact for price
          </span>
        </label>

        {/* Specify Price Option */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="priceOption"
            value="specify"
            checked={priceType === "specify"}
            onChange={() => {
              onChange("contact", "specify");
              setPriceType("specify");
            }}
            className="hidden"
          />
          <div
            className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
              priceType === "specify" ? "border-green-500" : "border-gray-300"
            }`}
          >
            {priceType === "specify" && (
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            )}
          </div>
          <span className="text-green-600">Specify price</span>
        </label>
      </div>

      {/* Price Input Field (Shown only if "Specify price" is selected) */}
      {priceType === "specify" && (
        <div className="flex flex-col">
          <div className="mt-3 flex gap-2 items-center border dark:border-gray-600 rounded-lg p-2 w-full">
            <span className="flex text-gray-600 dark:text-gray-300 font-medium">
              KSh
            </span>
            <input
              type="text"
              value={formatToCurrency(price ?? "")}
              onChange={(e) => {
                onChange("price", e.target.value);
                setPrice(parseCurrencyToNumber(e.target.value));
              }}
              placeholder="Price*"
              className="flex-1 dark:bg-[#2D3236] outline-none border-none p-0"
            />
            <select
              value={unit}
              onChange={(e) => {
                onChange("unit", e.target.value);
                setUnit(e.target.value);
              }}
              className="flex outline-none dark:text-gray-300 dark:bg-[#2D3236] text-gray-600 bg-transparent cursor-pointer"
            >
              <option value="per service">per service</option>
              <option value="per hour">per hour</option>
              <option value="per day">per day</option>
              
            </select>
          </div>

          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4">
            Are you open to negotiation?
          </h3>
          <div className="flex items-center space-x-4 mt-2">
            {["Yes", "No", "Not sure"].map((option) => (
              <label
                key={option}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="negotiable"
                  value={option.toLowerCase()}
                  checked={
                    negotiable
                      ? negotiable === option.toLowerCase()
                      : option.toLowerCase() === "not sure"
                  } // Default to "not sure"
                  onChange={() => {
                    onChange("negotiable", option.toLowerCase());
                  }}
                  className="hidden peer"
                />
                <div className="w-5 h-5 border-2 border-gray-400 rounded-full peer-checked:border-green-500 peer-checked:ring-2 peer-checked:ring-green-400 flex items-center justify-center">
                  {(negotiable
                    ? negotiable === option.toLowerCase()
                    : option.toLowerCase() === "not sure") && (
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  )}
                </div>
                <span
                  className={
                    (
                      negotiable
                        ? negotiable === option.toLowerCase()
                        : option.toLowerCase() === "not sure"
                    )
                      ? "text-green-500 font-medium"
                      : "text-gray-600 dark:text-gray-400"
                  }
                >
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceInput;
