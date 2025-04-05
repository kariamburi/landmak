import { ICategory } from "@/lib/database/models/category.model";
import React, { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter, useSearchParams } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  formUrlQuerymultiple,
  formUrlQuery,
  removeKeysFromQuery,
} from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SignalWifiStatusbarNullOutlinedIcon from "@mui/icons-material/SignalWifiStatusbarNullOutlined";
import { Label } from "@/components/ui/label";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FilterComponent from "./FilterComponent";
import { Button } from "../ui/button";
import { useMediaQuery } from "react-responsive"; // Detect mobile screens
type sidebarProps = {
  category: string;
  categoryList?: any;
 // AdsCountPerRegion?: any;
  subcategory?: string;
  AdsCountPerVerifiedTrue?: any;
  AdsCountPerVerifiedFalse?: any;
  adsCount: any;
  onLoading: () => void;
  handleFilter:(value:any) => void;
  selectedVerified: string;
  handleVerifiedChange:(value:any) => void;
  handleminPriceChange:(minPrice:string) => void;
  handlemaxPriceChange:(maxPrice:string) => void;
  maxPrice: string;
  minPrice: string;
  formData:any;
  applyFilters: () => void;
  handleInputChange:(field: string, value: any) => void;
  handleCheckboxChange:(field: string, value: any) => void;
  handleInputAutoCompleteChange:(field: string, value: any) => void;
  handleInputYearChange:(field: string, value: any) => void;
  handleClearForm: () => void;
  HandletogglePopup: () => void;
};

const SidebarSearchmobile = ({
  category,
  categoryList,
 // AdsCountPerRegion,
  subcategory,
  AdsCountPerVerifiedTrue,
  AdsCountPerVerifiedFalse,
  adsCount,
  maxPrice,
  minPrice,
  formData,
  onLoading,
  handleFilter,
  selectedVerified,
  handleVerifiedChange,
  handleminPriceChange,
  handlemaxPriceChange,
  applyFilters,
  handleInputChange,
  handleCheckboxChange,
  handleInputAutoCompleteChange,
  handleInputYearChange,
  handleClearForm,
  HandletogglePopup,
}: sidebarProps) => {
 
  const [totalVerifiedAll, settotalVerifiedAll] = useState(0);
  const [minP, setminP] = useState(minPrice);
  const [maxP, setmaxP] = useState(maxPrice);
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile screens
  
  const getTotalAdCount = (dataArray: any) => {
    return dataArray.reduce((total: any, item: any) => total + item.adCount, 0);
  };
  useEffect(() => {
    try {
    
      const totalAdCountVerified = AdsCountPerVerifiedTrue.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const totalAds = parseInt(current.totalAds);
          return !isNaN(totalAds) ? total + totalAds : total;
        },
        0
      );

      const totalAdCountVerifiedFalse = AdsCountPerVerifiedFalse.reduce(
        (total: any, current: any) => {
          // Parse the adCount value to a number, ignore if it's not a valid number
          const totalAds = parseInt(current.totalAds);
          return !isNaN(totalAds) ? total + totalAds : total;
        },
        0
      );

      settotalVerifiedAll(totalAdCountVerifiedFalse + totalAdCountVerified); // Output: 0
    } catch (error) {
      console.error("Error fetching data:", error);
      // setHasError(true);
    } finally {
      // setIsLoading(false);
    }
  }, [AdsCountPerVerifiedTrue, AdsCountPerVerifiedFalse]);

  // Usage
  const totalAdCount = getTotalAdCount(categoryList);
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };
 

  const handlemaxPriceChange_ = (maxP:string) => {
    if (maxP) {
      setmaxP(maxP);
      handlemaxPriceChange(maxP);
    }
  };
  const handleminPriceChange_ = (minP:string) => {
    if (minP) {
      setminP(minP);
      handleminPriceChange(minP);
    }
  };
  //const onSelectPriceClear = () => {
  //  handleFilter({price:''});
  //  handlePriceChange('','');
  //};
  const handleChange = (event: any) => {
    if (event.target.value) {
      handleVerifiedChange(event.target.value);
     // handleFilter({membership:event.target.value});
    } 
  };
  const formatToCurrency = (value: string | number) => {
    if (!value) return "0";
    const numberValue =
      typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numberValue);
  };
  const [openItem, setOpenItem] = useState("item-1"); // Set the default open item
  const [openItem2, setOpenItem2] = useState("item-2"); // Set the default open item
  const [openItem3, setOpenItem3] = useState("item-3"); // Set the default open item


  return (<>
     {isMobile ? (
               
                  // Fullscreen Popover for Mobile
                  <div className="fixed inset-0 z-50 bg-gray-200 dark:bg-[#222528] dark:text-gray-100 p-1 flex flex-col">
                    <div className="flex justify-between items-center border-b pb-2">
                    <div className="font-bold text-lg  dark:text-gray-300 text-emerald-950 text-center sm:text-left p-2">
                            Filter
                           </div>
                      <Button variant="outline" onClick={HandletogglePopup}>
                      <CloseOutlinedIcon />
                      </Button>
                    </div>  <ScrollArea className="h-[80vh] w-full dark:bg-[#222528] dark:text-gray-300 bg-gray-200 rounded-t-md p-0">
        <div className="flex flex-col items-center w-full p-2">
          <div className="dark:bg-[#2D3236] dark:text-gray-300 bg-white text-sm mt-2 border rounded-lg w-full p-1">
            <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem}>
              <AccordionItem value="item-1" className="border-0">
                <AccordionTrigger>
                  <div className="flex gap-1 items-center font-bold">
                    <CreditScoreOutlinedIcon sx={{ fontSize: 16 }} />
                    Price
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div>
                    <div className="flex grid grid-cols-2  gap-1 justify-between">
                      <div className="w-full text-sm px-0 py-2">
                        <TextField
                          value={formatToCurrency(minP ?? 0)}
                          label="Min Price*"
                          className="w-full text-sm"
                          onChange={(e) => handleminPriceChange_(e.target.value)}
                          variant="outlined"
                          InputProps={{
                            classes: {
                              root: "dark:bg-[#131B1E] dark:text-gray-100",
                              notchedOutline:
                                "border-gray-300 dark:border-gray-600",
                              focused: "",
                            },
                          }}
                          InputLabelProps={{
                            classes: {
                              root: "text-gray-500 dark:text-gray-400",
                              focused: "text-green-500 dark:text-green-400",
                            },
                          }}
                        />
                      </div>

                      <div className="w-full px-0 py-2">
                        <TextField
                          value={formatToCurrency(maxP ?? 0)}
                          label="Max Price*"
                          className="w-full text-sm"
                          onChange={(e) => handlemaxPriceChange_(e.target.value)}
                          variant="outlined"
                          InputProps={{
                            classes: {
                              root: "dark:bg-[#131B1E] dark:text-gray-100",
                              notchedOutline:
                                "border-gray-300 dark:border-gray-600",
                              focused: "",
                            },
                          }}
                          InputLabelProps={{
                            classes: {
                              root: "text-gray-500 dark:text-gray-400",
                              focused: "text-green-500 dark:text-green-400",
                            },
                          }}
                        />
                      </div>
                     {/* <div className="w-full">
                        <button
                          type="submit"
                          onClick={() => onSelectPriceClear()}
                          className="bg-gray-600 w-full p-1 text-xs rounded-sm text-white h-full"
                        >
                          <CloseIcon
                            className="text-white"
                            sx={{ fontSize: 24 }}
                          />
                          Clear Price
                        </button>
                      </div>
                      <div className="w-full">
                        <button
                          type="submit"
                          onClick={() => handlebutton()}
                          className="bg-emerald-700 w-full p-1 text-xs rounded-sm text-white h-full"
                        >
                          <SearchIcon /> Search Price
                        </button>
                      </div> */}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="dark:bg-[#2D3236] dark:text-gray-300 bg-white text-sm mt-2 border rounded-lg w-full p-2">
            <Accordion type="single" collapsible value={openItem2} onValueChange={setOpenItem2}>
              <AccordionItem value="item-2" className="border-0">
                <AccordionTrigger>
                  <div className="flex gap-1 items-center font-bold no-underline">
                    {" "}
                    <VerifiedUserOutlinedIcon sx={{ fontSize: 16 }} />
                    Verified sellers
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div>
                    <div className="w-full text-sm">
                      <div className="flex w-full gap-2 p-1">
                        <input
                          className="cursor-pointer"
                          type="radio"
                          value="all"
                          checked={selectedVerified === "all"}
                          onChange={handleChange}
                        />

                        <div className="flex justify-between w-full gap-1 items-center mt-1 mb-1">
                          Show All
                          <div className="dark:text-gray-400 text-gray-600 flex gap-1">
                            {totalVerifiedAll}
                            <div>ads</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex w-full gap-2 p-1">
                        <input
                          className="cursor-pointer"
                          type="radio"
                          value="verified"
                          checked={selectedVerified === "verified"}
                          onChange={handleChange}
                        />
                        <div className="flex justify-between w-full gap-1 items-center mt-1 mb-1">
                          Verified sellers
                          <div className="dark:text-gray-400 flex gap-1 text-gray-600">
                            {AdsCountPerVerifiedTrue.length > 0
                              ? AdsCountPerVerifiedTrue[0].totalAds
                              : 0}
                            <div>ads</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full gap-2 p-1">
                        <input
                          className="cursor-pointer"
                          type="radio"
                          value="unverified"
                          checked={selectedVerified === "unverified"}
                          onChange={handleChange}
                        />
                        <div className="flex justify-between w-full gap-1 items-center mt-1 mb-1">
                          Unverified sellers
                          <div className="dark:text-gray-400 flex gap-1 text-gray-600">
                            {AdsCountPerVerifiedFalse.length > 0
                              ? AdsCountPerVerifiedFalse[0].totalAds
                              : 0}
                            <div>ads</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          {subcategory && (
            <>
              <div className="text-sm mt-2 dark:bg-[#2D3236] bg-white border rounded-lg border dark:border-gray-700 w-full p-2">
                <Accordion type="single" collapsible value={openItem3} onValueChange={setOpenItem3}>
                  <AccordionItem value="item-3" className="border-0">
                    <AccordionTrigger>
                      <div className="flex gap-1 items-center font-bold">
                        <TuneOutlinedIcon sx={{ fontSize: 16 }} />
                        Advanced Filter
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <FilterComponent
                        category={category}
                        subcategory={subcategory || ""}
                        allsubcategory={categoryList}
                        adsCount={adsCount}
                        onLoading={onLoading}
                        handleFilter={handleFilter}
                        formData={formData}
                       // applyFilters={applyFilters}
                        handleInputChange={handleInputChange}
                        handleCheckboxChange={handleCheckboxChange}
                        handleInputAutoCompleteChange={handleInputAutoCompleteChange}
                        handleInputYearChange={handleInputYearChange}
                       // handleClearForm={handleClearForm}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </>
          )}
           <div className="flex w-full mb-10 gap-5 grid grid-cols-2">
        <Button
          onClick={() => applyFilters()}
          size="lg"
          className="button bg-green-600 hover:bg-green-700 mt-3 w-full"
        >
          <div className="flex gap-1 items-center">
            <SearchOutlinedIcon />
            Apply Filters
          </div>
        </Button>
        <Button
          onClick={() => handleClearForm()}
          size="lg"
          className="button mt-3 w-full"
        >
          <div className="flex gap-1 items-center">
            <CloseOutlinedIcon />
            Reset
          </div>
        </Button>
      </div>
        </div>
      </ScrollArea></div>
                    ):(
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90 z-50">
                      <div className="h-[90vh] dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 bg-gray-200 p-0 w-full  lg:max-w-3xl rounded-md shadow-md relative">
                        
                         <div className="flex w-full items-center justify-between">
                           <div className="font-bold text-lg  dark:text-gray-300 text-emerald-950 text-center sm:text-left p-2">
                            Filter
                           </div>
   
                           <div onClick={HandletogglePopup}>
                             <button className="dark:hover:bg-gray-700 p-1 rounded-xl mr-2">
                               <CloseIcon
                                
                                 sx={{ fontSize: 24 }}
                               />
                             </button>
                           </div>
                         </div>
      <ScrollArea className="h-[80vh] w-full  dark:bg-[#222528]  dark:text-gray-300 bg-gray-200 rounded-t-md p-3">
        <div className="flex flex-col items-center w-full">
          <div className="dark:bg-[#2D3236] dark:text-gray-300 bg-white text-sm mt-2 border rounded-lg w-full p-2">
            <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem}>
              <AccordionItem value="item-1" className="border-0">
                <AccordionTrigger>
                  <div className="flex gap-1 items-center font-bold">
                    <CreditScoreOutlinedIcon sx={{ fontSize: 16 }} />
                    Price
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div>
                    <div className="flex grid grid-cols-2  gap-1 justify-between">
                      <div className="w-full text-sm px-0 py-2">
                        <TextField
                          value={formatToCurrency(minP ?? 0)}
                          label="Min Price*"
                          className="w-full text-sm"
                          onChange={(e) => handleminPriceChange_(e.target.value)}
                          variant="outlined"
                          InputProps={{
                            classes: {
                              root: "dark:bg-[#131B1E] dark:text-gray-100",
                              notchedOutline:
                                "border-gray-300 dark:border-gray-600",
                              focused: "",
                            },
                          }}
                          InputLabelProps={{
                            classes: {
                              root: "text-gray-500 dark:text-gray-400",
                              focused: "text-green-500 dark:text-green-400",
                            },
                          }}
                        />
                      </div>

                      <div className="w-full px-0 py-2">
                        <TextField
                          value={formatToCurrency(maxP ?? 0)}
                          label="Max Price*"
                          className="w-full text-sm"
                          onChange={(e) => handlemaxPriceChange_(e.target.value)}
                          variant="outlined"
                          InputProps={{
                            classes: {
                              root: "dark:bg-[#131B1E] dark:text-gray-100",
                              notchedOutline:
                                "border-gray-300 dark:border-gray-600",
                              focused: "",
                            },
                          }}
                          InputLabelProps={{
                            classes: {
                              root: "text-gray-500 dark:text-gray-400",
                              focused: "text-green-500 dark:text-green-400",
                            },
                          }}
                        />
                      </div>
                     {/* <div className="w-full">
                        <button
                          type="submit"
                          onClick={() => onSelectPriceClear()}
                          className="bg-gray-600 w-full p-1 text-xs rounded-sm text-white h-full"
                        >
                          <CloseIcon
                            className="text-white"
                            sx={{ fontSize: 24 }}
                          />
                          Clear Price
                        </button>
                      </div>
                      <div className="w-full">
                        <button
                          type="submit"
                          onClick={() => handlebutton()}
                          className="bg-emerald-700 w-full p-1 text-xs rounded-sm text-white h-full"
                        >
                          <SearchIcon /> Search Price
                        </button>
                      </div> */}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="dark:bg-[#2D3236] dark:text-gray-300 bg-white text-sm mt-2 border rounded-lg w-full p-2">
            <Accordion type="single" collapsible value={openItem2} onValueChange={setOpenItem2}>
              <AccordionItem value="item-2" className="border-0">
                <AccordionTrigger>
                  <div className="flex gap-1 items-center font-bold no-underline">
                    {" "}
                    <VerifiedUserOutlinedIcon sx={{ fontSize: 16 }} />
                    Verified sellers
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div>
                    <div className="w-full text-sm">
                      <div className="flex w-full gap-2 p-1">
                        <input
                          className="cursor-pointer"
                          type="radio"
                          value="all"
                          checked={selectedVerified === "all"}
                          onChange={handleChange}
                        />

                        <div className="flex justify-between w-full gap-1 items-center mt-1 mb-1">
                          Show All
                          <div className="dark:text-gray-400 text-gray-600 flex gap-1">
                            {totalVerifiedAll}
                            <div>ads</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex w-full gap-2 p-1">
                        <input
                          className="cursor-pointer"
                          type="radio"
                          value="verified"
                          checked={selectedVerified === "verified"}
                          onChange={handleChange}
                        />
                        <div className="flex justify-between w-full gap-1 items-center mt-1 mb-1">
                          Verified sellers
                          <div className="dark:text-gray-400 flex gap-1 text-gray-600">
                            {AdsCountPerVerifiedTrue.length > 0
                              ? AdsCountPerVerifiedTrue[0].totalAds
                              : 0}
                            <div>ads</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full gap-2 p-1">
                        <input
                          className="cursor-pointer"
                          type="radio"
                          value="unverified"
                          checked={selectedVerified === "unverified"}
                          onChange={handleChange}
                        />
                        <div className="flex justify-between w-full gap-1 items-center mt-1 mb-1">
                          Unverified sellers
                          <div className="dark:text-gray-400 flex gap-1 text-gray-600">
                            {AdsCountPerVerifiedFalse.length > 0
                              ? AdsCountPerVerifiedFalse[0].totalAds
                              : 0}
                            <div>ads</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          {subcategory && (
            <>
              <div className="text-sm mt-2 dark:bg-[#2D3236] bg-white border rounded-lg border dark:border-gray-700 w-full p-2">
                <Accordion type="single" collapsible value={openItem3} onValueChange={setOpenItem3}>
                  <AccordionItem value="item-3" className="border-0">
                    <AccordionTrigger>
                      <div className="flex gap-1 items-center font-bold">
                        <TuneOutlinedIcon sx={{ fontSize: 16 }} />
                        Advanced Filter
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <FilterComponent
                        category={category}
                        subcategory={subcategory || ""}
                        allsubcategory={categoryList}
                        adsCount={adsCount}
                        onLoading={onLoading}
                        handleFilter={handleFilter}
                        formData={formData}
                       // applyFilters={applyFilters}
                        handleInputChange={handleInputChange}
                        handleCheckboxChange={handleCheckboxChange}
                        handleInputAutoCompleteChange={handleInputAutoCompleteChange}
                        handleInputYearChange={handleInputYearChange}
                       // handleClearForm={handleClearForm}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </>
          )}
           <div className="flex w-full gap-5 grid grid-cols-2">
        <Button
          onClick={() => applyFilters()}
          size="lg"
          className="button bg-green-600 hover:bg-green-700 mt-3 w-full"
        >
          <div className="flex gap-1 items-center">
            <SearchOutlinedIcon />
            Apply Filters
          </div>
        </Button>
        <Button
          onClick={() => handleClearForm()}
          size="lg"
          className="button mt-3 w-full"
        >
          <div className="flex gap-1 items-center">
            <CloseOutlinedIcon />
            Reset
          </div>
        </Button>
      </div>
        </div>
      </ScrollArea>
      </div>
      </div>)}
      </>);
};

export default SidebarSearchmobile;
