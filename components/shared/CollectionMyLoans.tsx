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
import { formatKsh } from "@/lib/help";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";
import { Icon } from "@iconify/react";
import threeDotsScale from "@iconify-icons/svg-spinners/3-dots-scale"; // Correct import
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import ContactUser from "./ContactUser";
import Zoom from "@mui/material/Zoom";
import { deleteLoan } from "@/lib/actions/loan.actions";
import { DeleteLoan } from "./DeleteLoan";
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

const CollectionMyLoans = ({
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
    const truncateDescription = (description: string, charLimit: number) => {
          const safeMessage = sanitizeHtml(description); 
          const truncatedMessage =
          safeMessage.length > charLimit
            ? `${safeMessage.slice(0, charLimit)}...`
            : safeMessage;
          return truncatedMessage;
        };
         const [isLoadingsmall, setIsLoadingsmall] = useState(true);
         const [selectUser, setSelectAUser] = useState<any>([]);
           const [isOpenContact, setIsOpenContact] = useState(false);
             const handleOpenContact = (user:any) => {
               setSelectAUser(user);
               setIsOpenContact(true)
             };
        const handleCloseContact = () => setIsOpenContact(false);
         const handleDelete = async (_id: string) => {
             if (confirm("Are you sure you want to delete this Request?")) {
             await deleteLoan(_id);
             toast({
               title: "Alert",
               description: "Deleted",
               duration: 5000,
               className: "bg-[#000000] text-white",
             });
            }
           };
         
  return (
    <div className="dark:bg-[#2D3236]">
      {data.length > 0 ? (
      
      <div className="w-full">
  {/* Header Row */}
  <div className="hidden md:grid grid-cols-3 gap-4 bg-[#e4ebeb] dark:bg-gray-800 text-xs font-semibold border border-gray-300 dark:border-gray-600 p-2">
    <div className="px-2 py-1 border border-gray-300 dark:border-gray-600">Property</div>
    <div className="px-2 py-1 border border-gray-300 dark:border-gray-600">Application Details</div>
    <div className="px-2 py-1 border border-gray-300 dark:border-gray-600">Actions</div>
  </div>

  {/* Data Rows */}
  {data.map((loan: any, index: number) => (
    <div
      key={index}
      className="bg-black grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-300 dark:border-gray-600 p-3 rounded mb-2 bg-gray-100 dark:bg-gray-700 text-xs w-full"
    >
      {/* Property */}
      <div className="border border-gray-300 dark:border-gray-600 p-2 w-full">
        {loan.adId ? (
          <div className="flex flex-col">
            <div className="flex gap-2 items-start">
              <div className="relative rounded">
                {isLoadingsmall && (
                  <div className="absolute inset-0 flex justify-center items-center bg-gray-100">
                    <Icon icon={threeDotsScale} className="w-6 h-6 text-gray-500" />
                  </div>
                )}
                <a
                  href={`${process.env.NEXT_PUBLIC_DOMAIN_URL}?Ad=${loan.adId._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={loan.adId.data.imageUrls[0]}
                    alt={loan.adId.data.title}
                    width={150}
                    height={100}
                    className={`w-[150px] h-[100px] rounded object-cover cursor-pointer ${
                      isLoadingsmall ? "opacity-0" : "opacity-100"
                    } transition-opacity duration-300`}
                    onLoadingComplete={() => setIsLoadingsmall(false)}
                    placeholder="empty"
                  />
                </a>
              </div>
              <div className="flex flex-col justify-between h-full">
                <p className="text-sm font-semibold mb-1">
                  {loan.adId.data.title.length > 50
                    ? `${loan.adId.data.title.substring(0, 50)}...`
                    : loan.adId.data.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 max-w-[200px]">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: truncateDescription(loan.adId.data.description ?? "", 65),
                    }}
                  />
                </p>
                <span className="font-bold text-green-600 dark:text-green-600 mt-1">
                  {formatKsh(loan.adId.data.price)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">No specific property</div>
        )}
      </div>

      {/* Application Details */}
      <div className="border border-gray-300 dark:border-gray-600 p-2 w-full">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <div className="flex flex-col">
              <p className="text-sm font-semibold">
                {loan.userId.firstName} {loan.userId.lastName}
              </p>
              <p className="text-sm font-semibold border-b">{loan.userId.email}</p>
              <p className="text-sm font-semibold border-b">{loan.userId.phone}</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Loan Request Type: <span className="font-semibold">{loan.loanType ?? "Property Financing Loan"}</span>
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Monthly Income: <span className="font-semibold">KES {loan.monthlyIncome.toLocaleString()}</span>
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Deposit Amount: <span className="font-semibold">KES {loan.deposit.toLocaleString()}</span>
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Preferred Loan Term: <span className="font-semibold">{loan.loanterm}</span>
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Employment Status: <span className="font-semibold">{loan.employmentStatus}</span>
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Message Comments: <span className="font-semibold">{loan.messageComments}</span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="border border-gray-300 dark:border-gray-600 p-2 w-full flex items-center justify-start md:justify-center">
        <DeleteLoan _id={loan._id} />
      </div>
    </div>
  ))}
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
     
    </div>
  );
};

export default CollectionMyLoans;
