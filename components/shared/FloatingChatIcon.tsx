import React from "react";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";

interface FloatingChatIconProps {
  onClick: () => void;
  isOpen: boolean;
}

const FloatingChatIcon: React.FC<FloatingChatIconProps> = ({
  onClick,
  isOpen,
}) => {
  return (
    <div
      className="fixed bottom-20 lg:bottom-10 right-1 lg:right-5 z-50 group transform transition-transform duration-500 ease-in-out hover:scale-110 hover:shadow-2xl cursor-pointer"
      onClick={onClick}
    >
      {/* Animated pulse circle for attraction */}
      <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-green-500 animate-pulse ring-4 ring-green-300 z-10" />

      {/* Button itself */}
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 shadow-md">
        <div className="w-10 h-10 flex text-gray-50 items-center justify-center rounded-full">
          {isOpen ? (
            <KeyboardArrowDownOutlinedIcon fontSize="large" />
          ) : (
            <QuestionAnswerOutlinedIcon fontSize="large" />
          )}

        </div>
      </div>

      {/* Optional label on hover */}
      <div className="absolute bottom-16 right-0 px-3 py-1 rounded-md bg-gray-900 text-gray-50 text-sm shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
        {isOpen ? "Close chat" : "Chat with us"}
      </div>
    </div>
  );
};

export default FloatingChatIcon;

