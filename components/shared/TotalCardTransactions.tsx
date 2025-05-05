"use client"; // Ensure this file is marked as client-side in Next.js app directory
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export interface PieChartProps {
  title: string;
  count: number;
  value: number;
}

const TotalCardTransactions = ({ title, count, value }: PieChartProps) => {
  const getStatusStyles = () => {
    if (title === "Successfull") return "bg-[#00B900]";
    if (title === "Pending") return "bg-[#FF9933]";
    return "";
  };

  return (
    <div className="flex flex-1 items-center justify-between dark:bg-[#2D3236] dark:text-gray-300 bg-gray-100 p-4 rounded-lg min-h-[110px] w-fit">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2  dark:text-[#e4ebeb] text-gray-500 text-sm">
          <div className={`h-3 w-3 rounded-full ${getStatusStyles()}`}></div>
          <div className="text-xs lg:text-sm">{title}</div>
        </div>
        <div className="flex gap-2 items-center  dark:text-gray-300 text-gray-900">
          <div className="text-xs lg:text-sm ">Subscriptions No.</div>
          <div className="font-bold text-base lg:text-xl ">{count}</div>
        </div>
        <div className="flex gap-2 items-center dark:text-gray-300 text-gray-900">
          <div className="text-xs lg:text-sm ">Total Amount KES.</div>
          <div className="font-bold text-base lg:text-xl ">
            {value.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalCardTransactions;
