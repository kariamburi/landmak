"use client";

import React, { useState } from "react";
//import {
// deleteOrder,
//  updateDispatchedOrders,
//  updatePendingOrdersToSuccessful,
//} from "@/lib/actions/order.actions";
import { usePathname } from "next/navigation";
import { useToast } from "../ui/use-toast";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Pagination from "./Pagination";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { deleteTransaction } from "@/lib/actions/transactions.actions";
//import { DispatchConfirmation } from "./DispatchConfirmation";
type CollectionProps = {
  data: any[];
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

const CollectionTransactions = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages,
  urlParamName,
}: CollectionProps) => {
  // const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const pathname = usePathname();
  const { toast } = useToast();

  const handleDelete = async (_id: string) => {
    await deleteTransaction({ _id, path: pathname });
    toast({
      title: "Alert",
      description: "Deleted",
      duration: 5000,
      className: "bg-[#000000] text-white",
    });
  };

  return (
    <div className="dark:bg-[#2D3236]">
      <div className="flex flex-row gap-2 items-end border-t p-2">
        {/* Total for all orders */}
        <div className="flex gap-2 items-center p-1 text-xs rounded-sm">
          <div>Total</div>
          <div className="font-bold">
            KES{" "}
            {data
              .reduce((total, txs) => total + txs.amount, 0)
              .toLocaleString()}
          </div>
        </div>

        {/* Total for successful orders */}
        <div className="flex gap-2 items-center bg-green-600 p-1 text-xs rounded-sm">
          <div>Successful</div>
          <div className="font-bold">
            KES{" "}
            {data
              .filter((txs) => txs.status === "Successful")
              .reduce((total, txs) => total + txs.amount, 0)
              .toLocaleString()}
          </div>
        </div>

        {/* Total for pending orders */}
        <div className="flex gap-2 items-center bg-yellow-600 p-1 text-xs rounded-sm">
          <div>Pending</div>
          <div className="font-bold">
            KES{" "}
            {data
              .filter((txs) => txs.status === "Pending")
              .reduce((total, txs) => total + txs.amount, 0)
              .toLocaleString()}
          </div>
        </div>
      </div>

      {data.length > 0 ? (
        <div>
          <table className="w-full border-collapse border border-gray-300 text-xs">
            <thead>
              <tr className="dark:bg-gray-800 bg-gray-100">
                <th className="border p-2">Photo</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">email</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Order Tracking Id</th>
                <th className="border p-2">Plan</th>
                <th className="border p-2">Period</th>
                <th className="border p-2">Amount KES</th>
                <th className="border p-2">Created At</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((trans: any) => (
                <tr key={trans._id} className="text-xs">
                  <td className="border p-2">
                    <img
                      src={trans.buyer.photo}
                      alt={`${trans.buyer.firstName}`}
                      className="w-8 h-8 object-cover rounded-xl"
                    />
                  </td>
                  <td className="border p-2">
                    {trans.buyer.firstName} {trans.buyer.lastName}
                  </td>

                  <td className="border p-2">{trans.buyer.email}</td>
                  <td className="border p-2 text-blue-500 cursor-pointer underline">
                    <div
                      className={`flex flex-col p-1 text-white justify-center items-center w-[70px] rounded-full ${
                        trans.status === "Pending"
                          ? "bg-yellow-600"
                          : trans.status === "Failed"
                          ? "bg-red-600 "
                          : "bg-green-600"
                      }`}
                    >
                      {trans.status}
                    </div>
                  </td>
                  <td className="border p-2">{trans.orderTrackingId}</td>

                  <td className="border p-2"> {trans.plan}</td>
                  <td className="border p-2"> {trans.period}</td>
                  <td className="border p-2">
                    KES {trans.amount.toLocaleString()}
                  </td>
                  <td className="border p-2">
                    {new Date(trans.createdAt).toLocaleDateString()}
                  </td>

                  <td className="border p-2">
                    {trans.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleDelete(trans._id)}
                          disabled={trans.status === "Successful"}
                          className={`mt-1 bg-gray-100 p-1 rounded-lg cursor-pointer hover:bg-[#e4ebeb]`}
                        >
                          <DeleteOutlineOutlinedIcon />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <Pagination
              urlParamName={urlParamName}
              page={page}
              totalPages={totalPages}
            />
          )}

          {/* Modal for displaying order details */}
        </div>
      ) : (
        <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
          <div className="font-bold text-[16px] lg:text-[25px]">{emptyTitle}</div>
          <p className="text-xs lg:p-regular-14">{emptyStateSubtext}</p>
        </div>
      )}
    </div>
  );
};

export default CollectionTransactions;
