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
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import ContactUser from "./ContactUser";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
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
  handleOpenChatId:(value:any)=> void;
};

const CollectionUsers = ({
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
  console.log(data);
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
 const [selectUser, setSelectAUser] = useState<any>([]);
  const [isOpenContact, setIsOpenContact] = useState(false);
    const handleOpenContact = (user:any) => {
      setSelectAUser(user);
      setIsOpenContact(true)
    };
    const handleCloseContact = () => setIsOpenContact(false);

  const handleOpenMethods = (delivery: any) => {
    setSelectedDelivery(delivery); // Set the selected delivery item
    setIsOpenMethods(true); // Open the modal
  };

  const handleCloseMethods = () => {
    setSelectedDelivery(null); // Clear the selected delivery
    setIsOpenMethods(false); // Close the modal
  };
  return (
    <div>
      {data.length > 0 ? (
        <div className="dark:bg-[#2D3236]">
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead className="dark:bg-gray-800 bg-gray-200 text-xs">
              <tr>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  Email
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  Name
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  Status
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  Business Name
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  Verified
                </th>
              
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  Ads
                </th>
               
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  Actions
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((user: any, index: number) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 dark:hover:bg-gray-600 text-xs"
                >
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {user.email}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                   {user.status}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {user.businessname || "N/A"}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {user.verified && user?.verified[0]?.accountverified === true ? (<> <p className="text-white p-1 bg-[#30AF5B] rounded-sm text-xs cursor-pointer hover:underline">
                                <VerifiedUserOutlinedIcon sx={{ fontSize: 16 }} />
                                Verified Seller
                              </p></>):(<> <p className="text-gray-600 p-1 dark:text-gray-400 dark:bg-[#131B1E] bg-white rounded-sm text-xs cursor-pointer hover:underline">
                  <ShieldOutlinedIcon sx={{ fontSize: 16 }} />
                  Unverified Seller
                </p></>)}
                  </td>
                
                  <td className="border flex gap-2 border-gray-300 dark:border-gray-600 px-4 py-2">
                  <div className="rounded-sm bg-blue-100 p-2 flex flex-col items-center justify-center text-xs"><div>Total</div> {user.adsCount || "0"}</div>
                    <div className="rounded-sm bg-green-100 p-2 flex flex-col items-center justify-center text-xs"><div>Active</div> {user.activeCount || 0}</div>
                    <div className="rounded-sm bg-red-100 p-2 flex flex-col items-center justify-center text-xs"><div>Inactive</div> <div>{user.inactiveCount || 0}</div></div>
                    <div className="rounded-sm bg-orange-100 p-2 flex flex-col items-center justify-center text-xs"><div>Pending</div> <div>{user.pendingCount || 0}</div></div>
                  </td>
                 

                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <div
                      onClick={() => handleOpenMethods(user)} // Pass the specific delivery
                      className="cursor-pointer hover:text-green-600"
                    >
                      <ModeEditOutlinedIcon />
                    </div>
                  </td>
                   <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                                    <button
                                    onClick={() => handleOpenContact(user)}
                                    className="bg-gray-100 px-3 py-1 rounded hover:bg-[#e4ebeb]"
                                  >
                                   <QuestionAnswerOutlinedIcon/>
                                  </button>
                                  </td>
                </tr>
              ))}
            </tbody>
          </table>
<ContactUser isOpen={isOpenContact} user={selectUser} handleOpenChatId={handleOpenChatId} onClose={handleCloseContact}/>
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
        <UsersWindowUpdate
          isOpen={isOpenMethods}
          onClose={handleCloseMethods}
          userId={selectedDelivery._id}
          type={"Update"}
          user={selectedDelivery}
        />
      )}
    </div>
  );
};

export default CollectionUsers;
