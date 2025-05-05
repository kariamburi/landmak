import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Separator } from "../ui/separator";
//import NavItems from "./NavItems";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { useState } from "react";
import NavItems from "./NavItems";
import Link from "next/link";
import StyledBrandName from "./StyledBrandName";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import StyledBrandNameG from "./StyledBrandNameG";
type MobileProps = {
  userstatus: string;
  userId: string;
  popup:string;
  user:any;
  handleOpenSell: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  handleOpenShop: (shopId:any) => void;
  onClose: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
};
const MobileNav = ({ userstatus, userId,popup,user, onClose, handleOpenSettings, handleOpenPerfomance, handleOpenShop,handleOpenChat,handleOpenPlan,handleOpenBook,handleOpenAbout,handleOpenTerms,handleOpenPrivacy,handleOpenSafety, handleOpenSell }: MobileProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleclicklink = () => {
    setIsSheetOpen(false);
  };
  return (
    <nav className="">
      <Sheet open={isSheetOpen}>
        <SheetTrigger
          className="align-middle"
          onClick={() => {
            setIsSheetOpen(true);
          }}
        >
          <div className="flex p-1 text-white lg:text-green-600 lg:text-gray-500 items-center justify-center rounded-full tooltip tooltip-bottom lg:hover:text-green-600 hover:cursor-pointer">
            <MenuIcon />
          </div>
        </SheetTrigger>
        <SheetContent
          className="[&>button]:hidden flex flex-col gap-6 dark:bg-[#131B1E] dark:text-gray-300 bg-white"
          // onClick={handleclicklink}
        >
          <SheetTitle>
            <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
          
            <img src="/logo.png" alt="Logo" className="w-6 h-6 rounded-full"/>
                <StyledBrandNameG/>
              </div>
              <button
                onClick={handleclicklink}
                className="flex justify-center items-center h-10 w-10 text-black dark:text-[#e4ebeb] dark:hover:bg-gray-700 hover:bg-[#e4ebeb] rounded-full"
              >
                <CloseOutlinedIcon />
              </button>
            </div>
          </SheetTitle>
        
            <NavItems
            userstatus={userstatus}
            userId={userId}
            user={user}
            onClose={onClose}
            handleclicklink={handleclicklink}
            handleOpenSell={handleOpenSell}
            handleOpenBook={handleOpenBook}
            handleOpenPlan={handleOpenPlan}
            handleOpenChat={handleOpenChat}
            handleOpenShop={handleOpenShop}
            handleOpenPerfomance={handleOpenPerfomance}
            handleOpenSettings={handleOpenSettings} popup={popup}          />
         {/*  <Separator className="border border-gray-300 dark:border-gray-700" />
          <div className="flex text-xs">
            <div className="flex gap-1 w-full dark:text-gray-400 text-gray-600">
              <div className="transition-colors text-[10px] hover:text-emerald-600 hover:cursor-pointer">
                <div
                  //href="/about"
                  onClick={()=> handleOpenAbout()}
                  className="no-underline hover:text-emerald-500 "
                >
                  About
                </div>
              </div>
              <div>|</div>
              <div className="transition-colors text-[10px] hover:text-emerald-600 hover:cursor-pointer">
                <div
                  onClick={()=> handleOpenTerms()}
                  className="no-underline hover:text-emerald-500 "
                >
                  <div>Terms & Conditions</div>
                </div>
              </div>
              <div>|</div>
              <div className="transition-colors text-[10px] hover:text-emerald-600 hover:cursor-pointer">
                <div
                   onClick={()=> handleOpenPrivacy()}
                  className="no-underline hover:text-emerald-500 "
                >
                  Privacy Policy
                </div>
              </div>
              <div>|</div>
              <div className="transition-colors text-[10px] hover:text-emerald-600 hover:cursor-pointer">
                <div
                  onClick={()=> handleOpenSafety()}
                  className="no-underline hover:text-emerald-500 "
                >
                  Safety Tips
                </div>
              </div>
            </div>
          </div>*/}
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
