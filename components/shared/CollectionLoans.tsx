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

const CollectionLoans = ({
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
        <div>
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead className="dark:bg-gray-800 bg-[#e4ebeb] text-xs">
              <tr>
               
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
               Property
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                Applied By
                </th>
                
                 <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                 Financer
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((loan: any, index: number) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 dark:hover:bg-gray-600 text-xs"
                >
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                 <div className="flex flex-col">  
                   <div className="flex gap-1 lg:gap-4 w-full items-start"> {/* Changed items-center to items-start for top alignment */}
     <div className="relative rounded">
        {isLoadingsmall && (
                        <div 
                         className="absolute inset-0 flex justify-center items-center bg-gray-100">
                          <Icon icon={threeDotsScale} className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
              <a
              href={process.env.NEXT_PUBLIC_DOMAIN_URL+"?Ad="+loan.adId._id}
              target="_blank"
              rel="noopener noreferrer"
            > <Image
              src={loan.adId.data.imageUrls[0]}
              alt={loan.adId.data.title}
              width={150}
              height={100}
              className={`w-[150px] h-[100px] rounded object-cover cursor-pointer ${
                isLoadingsmall ? "opacity-0" : "opacity-100"
              } transition-opacity duration-300`}
              onLoadingComplete={() => setIsLoadingsmall(false)}
              placeholder="empty" // Optional: you can use "empty" if you want a placeholder before loading
            /></a>
  </div>
  <div className="flex flex-col justify-between h-full"> {/* Ensures vertical spacing if needed */}
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
                  </td>
                  
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <div className="flex flex-col">  
                      <div className="flex gap-2 items-center">
                     
                       {/*  <div className="w-10 h-10 rounded-full bg-white">  <Zoom>
                           <Image
                             className="w-full h-w-full border-1 border-green-600 rounded-full object-cover"
                             src={loan.userId.photo ?? "/avator.png"}
                             alt="Avator"
                             width={200}
                             height={200}
                           />
                         </Zoom>  </div>*/}
                     
                        <div className="flex flex-col"> 
                       <p className="text-sm font-semibold">
                         {loan.userId.firstName} {loan.userId.lastName}
                       </p>
                       <p className="text-sm flex flex-col font-semibold mb-1 border-b">
                        {loan.userId.email}
                       </p>
                        <p className="text-sm flex flex-col font-semibold mb-1 border-b">
                        {loan.userId.phone}
                       </p>
                        </div>
                        </div>
                     <p className="text-xs flex gap-2 text-gray-600 dark:text-gray-300 mb-1">
                       Monthly Income: 
                       <span className="font-semibold">KES {loan.monthlyIncome.toLocaleString()}
                      </span>
                    </p>
                     <p className="text-xs flex gap-2 text-gray-600 dark:text-gray-300 mb-1">
                       Deposit Amount:
                       <span className="font-semibold">KES {loan.deposit.toLocaleString()}
                      </span>
                    </p>

                     <p className="text-xs flex gap-2 text-gray-600 dark:text-gray-300 mb-1">
                       Preffered Loan Term: 
                       <span className="font-semibold">{loan.loanterm}
                      </span>
                    </p>
                     <p className="text-xs flex gap-2 text-gray-600 dark:text-gray-300 mb-1">
                      Employment Status: 
                       <span className="font-semibold">{loan.employmentStatus}
                      </span>
                    </p>
                   
                      <p className="text-xs flex gap-2 text-gray-600 dark:text-gray-300 mb-1">
                      Message Comments: 
                       <span className="font-semibold">{loan.messageComments}
                      </span>
                    </p>
                          
                        <p className="text-xs flex gap-2 text-gray-600 dark:text-gray-300 mb-1">
                     Status: 
                       <span
                      className={`flex flex-col p-1 justify-center items-center w-[70px] rounded-full ${
                        loan.status === "Pending"
                          ? "bg-orange-100"
                          : loan.status === "Failed"
                          ? "bg-red-100 "
                          : "bg-green-100"
                      }`}
                    >
                      {loan.status}
                  
                      </span>
                    </p>  
                            
                       <p className="text-xs items-center flex gap-2 text-gray-600 dark:text-gray-300 mb-1">
                    
                       <button
                                                          onClick={() => handleOpenContact(loan.userId)}
                                                          className="bg-gray-100 border px-3 py-1 rounded hover:bg-[#e4ebeb]"
                                                        >
                                                         <QuestionAnswerOutlinedIcon/> Contact Applier
                                                        </button>
                    </p>         
                     </div>
                    
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {loan.financerId}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <DeleteLoan _id={loan._id}/>
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
      <ContactUser isOpen={isOpenContact} user={selectUser} handleOpenChatId={handleOpenChatId} onClose={handleCloseContact}/>
     
    </div>
  );
};

export default CollectionLoans;
