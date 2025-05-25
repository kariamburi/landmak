//import { getTrendingProducts } from "@/lib/actions/ad.product";
//import { IProduct } from "@/lib/database/models/product.model";
import { getTrendingProducts } from "@/lib/actions/dynamicAd.actions";
import { getToAdvertiser } from "@/lib/actions/user.actions";
import React, { useState, useEffect } from "react";
import ContactUser from "./ContactUser";
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import { Icon } from "@iconify/react";
import Gooeyballs from "@iconify-icons/svg-spinners/gooey-balls-1"; // Correct import
import UnreadByAdmin from "./UnreadByAdmin";
import NoOfContacts from "./NoOfContacts";

export interface Props {
  handleOpenChatId: (value: any) => void;
  topadvertiser: any;
}

const TopAdvertiser = ({ handleOpenChatId, topadvertiser }: Props) => {
  const [selectUser, setSelectAUser] = useState<any>([]);
  const [isOpenContact, setIsOpenContact] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenContact = (user: any) => {
    console.log(user);
    setSelectAUser(user);
    setIsOpenContact(true);
  };

  const handleCloseContact = () => setIsOpenContact(false);

  const filteredAdvertisers = topadvertiser.data.filter((user: any) =>
    `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 m-w-[400px] rounded-xl dark:bg-[#2D3236] dark:text-gray-300 bg-gray-100">
      <h2 className="text-lg dark:text-gray-300 text-black font-bold mb-4">
        Top Advertiser
      </h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 mb-4 rounded dark:bg-[#1E1E1E] border-gray-300 dark:border-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="space-y-4">
        {topadvertiser.data.length > 0 ? (
          <div className="dark:bg-[#2D3236]">
            <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead className="dark:bg-gray-800 bg-gray-200 text-xs">
                <tr>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">#</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Email</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Name</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Total Paid</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Ads</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Cnt .No</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdvertisers.slice(0, 10).map((user: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-600 text-xs">
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                      {user.email}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                      {user.totalPaid || "0"}
                    </td>
                    <td className="border flex gap-2 border-gray-300 dark:border-gray-600 px-4 py-2">
                      <div className="rounded-sm bg-blue-100 p-2 flex flex-col items-center justify-center text-xs">
                        <div>Total</div> {user.adsCount || "0"}
                      </div>
                      <div className="rounded-sm bg-green-100 p-2 flex flex-col items-center justify-center text-xs">
                        <div>Active</div> {user.activeCount || 0}
                      </div>
                      <div className="rounded-sm bg-red-100 p-2 flex flex-col items-center justify-center text-xs">
                        <div>Inactive</div> {user.inactiveCount || 0}
                      </div>
                      <div className="rounded-sm bg-orange-100 p-2 flex flex-col items-center justify-center text-xs">
                        <div>Pending</div> {user.pendingCount || 0}
                      </div>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                      <NoOfContacts userId={user._id} />
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                     <span  onClick={() => handleOpenContact(user)} className="relative cursor-pointer inline-block w-6 h-6">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <QuestionAnswerOutlinedIcon />
                      </div>
                      <div className="absolute top-0 right-0">
                        <UnreadByAdmin userId={user._id} />
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
            <p className="text-xs lg:p-regular-14">No advertiser yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopAdvertiser;
