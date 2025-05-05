"use client"
  import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
  } from "@/components/ui/menubar";
  import { MoreVertOutlined, AttachFileOutlined, LocationOn } from "@mui/icons-material";
  
  export default function MenuComponent({ setImg, handleOpenPopupGps }: { setImg: (file: File | null) => void, handleOpenPopupGps: () => void }) {
    return (
      <Menubar className="bg-transparent shadow-none">
        <MenubarMenu>
          <MenubarTrigger className="p-2 rounded-md cursor-pointer hover:bg-[#e4ebeb]">
            <MoreVertOutlined />
          </MenubarTrigger>
          <MenubarContent align="end" className="w-40">
            <label
              htmlFor="file"
              className="cursor-pointer flex text-base items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <AttachFileOutlined /> Attach Image
            </label>
            <input
              type="file"
              id="file"
              className="hidden"
              onChange={(e) => setImg(e.target.files?.[0] || null)}
            />
            <MenubarItem onClick={handleOpenPopupGps} className="flex cursor-pointer text-base items-center gap-2">
              <LocationOn /> Share Location
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  }
  