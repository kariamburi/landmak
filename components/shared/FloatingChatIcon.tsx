import React from "react";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import {
  MessageCircle,
  LifeBuoy // <- support icon
} from 'lucide-react';
interface FloatingChatIconProps {
  onClick: () => void;
  isOpen: boolean;
}

const FloatingChatIcon: React.FC<FloatingChatIconProps> = ({ onClick, isOpen }) => {
  return (
    <div
      role="button"
      aria-label={isOpen ? "Close chat" : "Open chat"}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className="fixed bottom-[110px] lg:bottom-10 right-2 lg:right-5 z-50 group transform transition-transform duration-500 ease-in-out hover:scale-110 hover:shadow-2xl cursor-pointer outline-none"
    >
      {/* Pulse circle */}
      <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-green-500 animate-pulse ring-4 ring-green-300 z-10" />

      {/* Main Button */}
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 shadow-md">
        <div className="w-10 h-10 flex text-white items-center justify-center rounded-full transition-all duration-300 ease-in-out">
          {isOpen ? (
            <MessageCircle fontSize="large" />
          ) : (
            <MessageCircle fontSize="large" />
          )}
        </div>
      </div>

      {/* Hover Label (only on large screens) */}
      <div className="hidden lg:block absolute bottom-16 right-0 px-3 py-1 rounded-md bg-gray-900 text-white text-sm shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
        {isOpen ? "Close chat" : "Chat with us"}
      </div>
    </div>
  );
};

export default FloatingChatIcon;
