//import { UserAuth } from "../context/AuthContext";

import { UpdateUserParams } from "@/types";

import { format, isToday, isYesterday } from "date-fns";
import Image from "next/image";
interface MessageProps {
  message: {
    uid: string;
    recipientUid: string;
    imageUrl: string;
    avatar: string;
    createdAt: {
      seconds: number;
      nanoseconds: number;
    }; // Assuming createdAt is a Timestamp object
    name: string;
    text: string;
    adUrl: string;
    adTitle: string;
    adDescription: string;
  };
  displayName: string;
  uid: string;
  photoURL: string;
  recipientUid: string | null;
  recipient: UpdateUserParams;
}

const Message = ({
  message,
  displayName,
  uid,
  recipientUid,
  photoURL,
  recipient,
}: MessageProps) => {
  // Convert Timestamp to Date object

  //console.log(message);
  const truncateDescription = (title: string, maxLength: number) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };
  return (
    <div className="text-gray-700">
      <div className="chatbox p-4 bg-gray-50">
        <div
          className={`flex items-start mb-4 ${
            message.uid === uid ? "justify-end" : "justify-start"
          }`}
        >
          <img
            src={message.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div
            className={`message-content max-w-xs rounded-lg p-3 ${
              message.uid === uid
                ? "bg-green-100 text-left"
                : "bg-blue-100 text-left"
            }`}
          >
            <h4 className="font-semibold">{message.name}</h4>
            <p className="text-sm">{message.text}</p>
            <small className="text-gray-500">
              {message.createdAt
                ? new Date(
                    message.createdAt.seconds * 1000
                  ).toLocaleTimeString()
                : "No date"}
            </small>
            {message.imageUrl && (
              <img
                src={message.imageUrl}
                alt="ad image"
                className="mt-2 rounded-lg"
              />
            )}
            <a
              href={message.adUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 text-blue-600 underline"
            >
              {message.adTitle}
            </a>
            <p className="text-sm text-gray-700">
              {truncateDescription(message.adDescription ?? "", 80)}
            </p>
          </div>
        </div>
      </div>

      {/* 
      <div
        className={`flex items-start justify-${
          message.uid === uid ? "end" : "start"
        }`}
      >
        <div className="flex-shrink-0 mr-2">
          {message.uid === uid ? (
            // If the message is sent by the current user, display the user's avatar
            <>
              {" "}
              <div className="flex items-center gap-2">
                <Image
                  className="w-8 h-8 rounded-full object-cover"
                  src={photoURL}
                  alt="avatar"
                  width={200}
                  height={200}
                />
                <div className="text-[12px] lg:text-xs text-black font-medium flex gap-5">
                  {message.name}
                  <div className="text-[12px] lg:text-xs text-gray-500">
                    {formattedCreatedAt}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div
                  className={`max-w-xs mx-2 my-1 p-3 rounded-lg  ${
                    message.uid === uid
                      ? "bg-emerald-500 text-white"
                      : "bg-[#e4ebeb] text-gray-700"
                  }`}
                >
                  {message.imageUrl && (
                    <Image
                      src={message.imageUrl}
                      alt="Image"
                      className="mb-2 object-cover"
                      width={900}
                      height={500}
                    />
                  )}
                  <div className="text-sm lg:text-base w-[200px] lg:w-full">
                    {message.text}
                  </div>
                </div>
              </div>
            </>
          ) : (
            // If the message is sent by someone else, display the recipient's avatar
            <>
              {" "}
              <div className="flex items-center gap-2">
                <Image
                  className="w-8 h-8 rounded-full object-cover"
                  src={message.avatar}
                  alt="Avatar"
                  width={200}
                  height={200}
                />
                <div className="text-[12px] lg:text-xs text-black font-medium flex gap-3">
                  {recipient.firstName} {recipient.lastName}
                  <div className="text-[12px] lg:text-xs text-gray-500">
                    {formattedCreatedAt}
                  </div>
                </div>
              </div>
              <div className="flex flex-col mr-2">
                <div
                  className={`max-w-xs mx-2 my-1 p-3 rounded-lg  ${
                    message.uid === uid
                      ? "bg-blue-500 text-white"
                      : "bg-[#e4ebeb] text-gray-700"
                  }`}
                >
                  {message.imageUrl && (
                    <Image
                      src={message.imageUrl}
                      alt="Image"
                      className="mb-2 object-cover"
                      width={900}
                      height={500}
                    />
                  )}
                  <div className="text-sm lg:text-base w-[200px] lg:w-full">
                    {message.text}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>*/}
    </div>
  );
};

export default Message;
