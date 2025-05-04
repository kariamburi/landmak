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
  const [priceType, setPriceType] = useState(priceType_);
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

  const parseCurrencyToNumber = (value: string): number =>
    Number(value.replace(/,/g, ""));

  return (
    <div className="bg-white w-full max-w-full py-3 px-4 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100">
      <label className="text-base font-semibold dark:text-gray-300">
        Price
      </label>

      <div className="flex flex-wrap gap-4 mt-3">
        {[
          { label: "Contact for price", value: "contact", color: "gray" },
          { label: "Specify price", value: "specify", color: "green" },
        ].map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name="priceOption"
              value={option.value}
              checked={priceType === option.value}
              onChange={() => {
                onChange("contact", option.value);
                setPriceType(option.value);
              }}
              className="hidden"
            />
            <div
              className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                priceType === option.value
                  ? `border-${option.color}-500`
                  : "border-gray-300"
              }`}
            >
              {priceType === option.value && (
                <div
                  className={`w-3 h-3 bg-${option.color}-500 rounded-full`}
                ></div>
              )}
            </div>
            <span
              className={`${
                option.color === "gray"
                  ? "text-gray-700 dark:text-gray-300"
                  : "text-green-600"
              }`}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>

      {priceType === "specify" && (
        <div className="flex flex-col w-full mt-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 border dark:border-gray-600 rounded-lg py-2 px-3 w-full">
            <span className="text-gray-600 dark:text-gray-300 font-medium">
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
              className="flex-1 min-w-0 w-full dark:bg-[#2D3236] outline-none border-none p-0"
            />
            <select
              value={unit}
              onChange={(e) => {
                onChange("unit", e.target.value);
                setUnit(e.target.value);
              }}
              className="w-full sm:w-auto outline-none dark:text-gray-300 dark:bg-[#2D3236] text-gray-600 bg-transparent cursor-pointer"
            >
              <option value="per service">per service</option>
              <option value="per hour">per hour</option>
              <option value="per day">per day</option>
            </select>
          </div>

          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4">
            Are you open to negotiation?
          </h3>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            {["Yes", "No", "Not sure"].map((option) => {
              const value = option.toLowerCase();
              const isChecked =
                negotiable !== undefined
                  ? negotiable === value
                  : value === "not sure";
              return (
                <label
                  key={option}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="negotiable"
                    value={value}
                    checked={isChecked}
                    onChange={() => onChange("negotiable", value)}
                    className="hidden peer"
                  />
                  <div className="w-5 h-5 border-2 border-gray-400 rounded-full peer-checked:border-green-500 peer-checked:ring-2 peer-checked:ring-green-400 flex items-center justify-center">
                    {isChecked && (
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                  <span
                    className={`${
                      isChecked
                        ? "text-green-500 font-medium"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceInput;
