//import { getTrendingProducts } from "@/lib/actions/ad.product";
//import { IProduct } from "@/lib/database/models/product.model";
import { getTrendingProducts } from "@/lib/actions/dynamicAd.actions";
import { getToAdvertiser } from "@/lib/actions/user.actions";
import React, { useState } from "react";
import ContactUser from "./ContactUser";
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@iconify/react";
import Gooeyballs from "@iconify-icons/svg-spinners/gooey-balls-1";
import { checkExpiredLatestSubscriptionsPerUser } from "@/lib/actions/transactions.actions";
import UnreadByAdmin from "./UnreadByAdmin";

export interface Props {
  handleOpenChatId: (value: any) => void;
  subscriptionsExpirely: any;
}

const AdvertiserSubscriptions = ({ handleOpenChatId, subscriptionsExpirely }: Props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectUser, setSelectAUser] = useState<any>([]);
  const [isOpenContact, setIsOpenContact] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenContact = (user: any) => {
    setSelectAUser(user);
    setIsOpenContact(true);
  };

  const handleCloseContact = () => setIsOpenContact(false);

  const filteredSubscriptions = subscriptionsExpirely.filter((user: any) => {
    const fullName = `${user.buyerDetails.firstName} ${user.buyerDetails.lastName}`.toLowerCase();
    const email = user.buyerDetails.email.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <ScrollArea className="max-h-[400px)] dark:bg-[#2D3236] w-full dark:text-gray-300 bg-gray-100 rounded-t-md p-2">
      <h2 className="text-lg dark:text-gray-300 text-black font-bold mb-4">
        Advertiser Subscriptions
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded border dark:bg-[#1E1E1E] border-gray-300 dark:border-gray-600 text-sm"
        />
      </div>

      <div className="space-y-4">
        {filteredSubscriptions.length > 0 ? (
          <div className="dark:bg-[#2D3236]">
            <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
              <thead className="dark:bg-gray-800 bg-gray-200 text-xs">
                <tr>
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Package</th>
                  <th className="border px-4 py-2">Expiry Date</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.map((user: any, index: number) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 dark:hover:bg-gray-600 text-xs"
                  >
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{user.buyerDetails.email}</td>
                    <td className="border px-4 py-2">
                      {user.buyerDetails.firstName} {user.buyerDetails.lastName}
                    </td>
                    <td className="border px-4 py-2">{user.planDetails.name}</td>
                    <td className="border px-4 py-2">{user.expiryDate}</td>
                    <td className="border px-4 py-2">
                      {user.isExpired ? (
                        <div className="rounded-sm bg-red-600 p-2 text-white text-xs text-center">Expired</div>
                      ) : (
                        <div className="rounded-sm bg-green-600 p-2 text-white text-xs text-center">Active</div>
                      )}
                    </td>
                    <td className="border px-4 py-2 text-center">
                       <span onClick={() => handleOpenContact(user.buyerDetails)} className="relative cursor-pointer inline-block w-6 h-6">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                              <QuestionAnswerOutlinedIcon />
                                            </div>
                                            <div className="absolute top-0 right-0">
                                              <UnreadByAdmin userId={user.buyerDetails._id} />
                                            </div>
                                          </span>
                     
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ContactUser
              isOpen={isOpenContact}
              user={selectUser}
              handleOpenChatId={handleOpenChatId}
              onClose={handleCloseContact}
            />
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
