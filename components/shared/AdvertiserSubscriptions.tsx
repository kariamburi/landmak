//import { getTrendingProducts } from "@/lib/actions/ad.product";
//import { IProduct } from "@/lib/database/models/product.model";
import { getTrendingProducts } from "@/lib/actions/dynamicAd.actions";
import { getToAdvertiser } from "@/lib/actions/user.actions";
import React, { useState, useEffect } from "react";
import ContactUser from "./ContactUser";
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import { Icon } from "@iconify/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Gooeyballs from "@iconify-icons/svg-spinners/gooey-balls-1"; // Correct import
import { checkExpiredLatestSubscriptionsPerUser } from "@/lib/actions/transactions.actions";
export interface Props {
  handleOpenChatId:(value:any)=> void;
  subscriptionsExpirely:any;
}

const AdvertiserSubscriptions = ({handleOpenChatId, subscriptionsExpirely}:Props) => {
 
  const [loading, setLoading] = useState<boolean>(true);
  const [selectUser, setSelectAUser] = useState<any>([]);
    const [isOpenContact, setIsOpenContact] = useState(false);
      const handleOpenContact = (user:any) => {
        setSelectAUser(user);
        setIsOpenContact(true)
      };
      const handleCloseContact = () => setIsOpenContact(false);
  
  

  return (
      <ScrollArea className="max-h-[400px)] dark:bg-[#2D3236] w-full dark:text-gray-300 bg-gray-100 rounded-t-md p-2">

      <h2 className="text-lg  dark:text-gray-300 text-black font-bold mb-4">
        Advertiser Subscriptions
      </h2>

     
        <div className="space-y-4">
      {subscriptionsExpirely.length > 0 ? (
        
        <div className="dark:bg-[#2D3236]">
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead className="dark:bg-gray-800 bg-gray-200 text-xs">
              <tr>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  #
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  Email
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  Name
                </th>
              
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  Package
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                   ExpiryDate
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
          Status
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody>
              {subscriptionsExpirely.map((user: any, index: number) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 dark:hover:bg-gray-600 text-xs"
                >
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {(index + 1)}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {user.buyerDetails.email}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {user.buyerDetails.firstName} {user.buyerDetails.lastName}
                  </td>
                 
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {user.planDetails.name}
                  </td>
                   <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {user.expiryDate}
                  </td>
                   <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {user.isExpired ? (<>
                    <div className="rounded-sm bg-red-100 p-2 flex flex-col items-center justify-center text-xs">Expired</div></>):(<>
                     <div className="rounded-sm bg-green-100 p-2 flex flex-col items-center justify-center text-xs">Active</div></>)}
                  </td>
                 
                   <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                                    <button
                                    onClick={() => handleOpenContact(user)}
                                    className="bg-gray-200 text-gray-600 px-3 py-1 rounded hover:bg-gray-300"
                                  >
                                   <QuestionAnswerOutlinedIcon/>
                                  </button>
                                  </td>
                </tr>
              ))}
            </tbody>
          </table>
<ContactUser isOpen={isOpenContact} user={selectUser} handleOpenChatId={handleOpenChatId} onClose={handleCloseContact}/>
         
        </div>
      ) : (
        <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
          <h3 className="font-bold text-[16px] lg:text-[25px]">No data</h3>
          <p className="text-xs lg:p-regular-14">No subscription yet</p>
        </div>
      )}
   
      </div>
   
    
  </ScrollArea>
  );
};

export default AdvertiserSubscriptions;
