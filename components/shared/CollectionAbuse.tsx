"use client";

import React, { useState } from "react";
//import { deleteOrder } from "@/lib/actions/order.actions";
import { usePathname } from "next/navigation";
import { useToast } from "../ui/use-toast";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Pagination from "./Pagination";
import Link from "next/link";
//import { deleteProduct } from "@/lib/actions/ad.product";
import { DeleteConfirmation } from "./DeleteConfirmation";
//import ProductWindowUpdate from "./ProductWindowUpdate";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import UsersWindowUpdate from "./UsersWindowUpdate";
import ReportActionWindow from "./ReportActionWindow";
//import UsersWindowUpdate from "./UsersWindowUpdate";
type CollectionProps = {
  data: any[];
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  page: number | string;
  totalPages: number;
  urlParamName?: string;
  userId: string;
  handleOpenChatId:(valu:string)=> void;
};

const CollectionAbuse = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages,
  urlParamName,
  userId,
  handleOpenChatId,
}: CollectionProps) => {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const pathname = usePathname();
  const { toast } = useToast();

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order); // Set the selected order to display in the modal
  };

  const closeModal = () => {
    setSelectedOrder(null); // Close the modal
  };
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(true);
  };
  
  const handleClose = () => {
    setIsOpen(false);
  };

  const [isOpenUser, setIsOpenUser] = useState(false);
  const handleOpenUser = () => {
    setIsOpenUser(true);
  };

  const handleCloseUser = () => {
    setIsOpenUser(false);
  };
  const [selectedDelivery, setSelectedDelivery] = useState<any | null>(null); // State for selected delivery
  const [isOpenMethods, setIsOpenMethods] = useState(false);

  const handleOpenMethods = (delivery: any) => {
    setSelectedDelivery(delivery); // Set the selected delivery item
    setIsOpenMethods(true); // Open the modal
  };

  const handleCloseMethods = () => {
    setSelectedDelivery(null); // Clear the selected delivery
    setIsOpenMethods(false); // Close the modal
  };
  return (
    <div className="dark:bg-[#2D3236]">
      {data.length > 0 ? (
        <div>
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead className="dark:bg-gray-800 bg-[#e4ebeb] text-xs">
              <tr>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  Ad Id
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                Creater Phone
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  Reason
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  Description
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                Reporter Name
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                 Reporter Phone
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((report: any, index: number) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 dark:hover:bg-gray-600 text-xs"
                >
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {report.adId._id}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {report.adId.data.phone}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {report.reason}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {report.description}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {report.userId.firstName} {report.userId.lastName}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {report.userId.phone}
                  </td>
                 

                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <div
                      onClick={() => handleOpenMethods(report.adId)} // Pass the specific delivery
                      className="bg-gray-100 px-3 py-1 rounded cursor-pointer hover:bg-[#e4ebeb]"
                    >
                      <ModeEditOutlinedIcon />
                    </div>
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
        </div>
      ) : (
        <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
          <h3 className="font-bold text-[16px] lg:text-[25px]">{emptyTitle}</h3>
          <p className="text-xs lg:p-regular-14">{emptyStateSubtext}</p>
        </div>
      )}
      {selectedDelivery && (
        <ReportActionWindow
          isOpen={isOpenMethods}
          onClose={handleCloseMethods}
          ad={selectedDelivery} 
          handleOpenChatId={handleOpenChatId}        />
      )}
    </div>
  );
};

export default CollectionAbuse;
