import { UpdateUserParams } from "@/types";
import { format, isToday, isYesterday } from "date-fns";
import StarIcon from "@mui/icons-material/Star";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { DeleteReview } from "./DeleteReview";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
interface ReviewsProps {
  message: {
    starClicked: any;
    id: string;
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
  };
  uid: string;
}

const Reviews = ({
  message,
  uid,
}: ReviewsProps) => {
  // Convert Timestamp to Date object
  let formattedCreatedAt = "";
  try {
    const createdAtDate = new Date(message.createdAt.seconds * 1000); // Convert seconds to milliseconds

    // Get today's date
    const today = new Date();

    // Check if the message was sent today
    if (isToday(createdAtDate)) {
      formattedCreatedAt = "Today " + format(createdAtDate, "HH:mm"); // Set as "Today"
    } else if (isYesterday(createdAtDate)) {
      // Check if the message was sent yesterday
      formattedCreatedAt = "Yesterday " + format(createdAtDate, "HH:mm"); // Set as "Yesterday"
    } else {
      // Format the createdAt date with day, month, and year
      formattedCreatedAt = format(createdAtDate, "dd-MM-yyyy"); // Format as 'day/month/year'
    }

    // Append hours and minutes if the message is not from today or yesterday
    if (!isToday(createdAtDate) && !isYesterday(createdAtDate)) {
      formattedCreatedAt += " " + format(createdAtDate, "HH:mm"); // Append hours and minutes
    }
  } catch {
    // Handle error when formatting date
  }
  const clickedStarsCount = message.starClicked
    ? message.starClicked.filter((clicked: boolean) => clicked).length + ".0"
    : 0;

  //console.log(message);
  return (
    <div className="w-full">
      <div className="chatbox w-full">
        <div className={`flex items-start mb-2 justify-start`}>
          <Image
            src={message.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full mr-3"
            height={200}
            width={200}
          />
          <div
            className={`message-content w-full rounded-lg p-3 border-b text-left`}
          >
            <h4 className="font-semibold">{message.name}</h4>
            <div className="items-center flex gap-1">
              <p className="font-bold text-sm">{clickedStarsCount}</p>
              {message.starClicked &&
                message.starClicked.map((clicked: boolean, index: any) => (
                  <StarIcon
                    key={index}
                    sx={{ fontSize: 24, color: clicked ? "orange" : "gray" }}
                  />
                ))}
            </div>
            <p className="text-sm">{message.text}</p>
            <div className="items-center flex justify-between">
              <small className="text-gray-500">{formattedCreatedAt}</small>

              {uid === message.uid && (
                <div className="bg-red-100 shadow rounded-lg pt-1 pl-1 pr-1">
                  <DeleteReview messageId={message.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
