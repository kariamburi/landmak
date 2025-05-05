// components/ChatWindow.js
"use client";
import React, { useEffect, useState } from "react";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import Image from "next/image";
import CreateCategoryForm from "./CreateCategoryForm";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import CreateSubCategoryForm from "./CreateSubCategoryForm";
import PackageForm from "./packageForm";
import { IPackages } from "@/lib/database/models/packages.model";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  pack?: IPackages;
  packageId?: string;
}

const AddPackageWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  type,
  pack,
  packageId,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="dark:bg-[#131B1E] dark:text-gray-300 bg-white rounded-lg p-1 lg:p-6 w-full md:max-w-3xl lg:max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-end items-center mb-1">
          <button
            onClick={onClose}
            className="flex justify-center items-center h-12 w-12 text-black dark:text-[#e4ebeb] dark:hover:bg-gray-700 hover:bg-black hover:text-white rounded-full"
          >
            <CloseOutlinedIcon />
          </button>
        </div>
        {type === "Create" ? (
          <>
            <PackageForm type="Create" />
          </>
        ) : (
          <>
            <PackageForm type="Update" pack={pack} packageId={packageId} />
          </>
        )}
      </div>
    </div>
  );
};

export default AddPackageWindow;
