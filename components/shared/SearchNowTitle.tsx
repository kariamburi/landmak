"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const SearchNowTitle = ({
  placeholder = "Search title...",
  handleFilter,
}: {
  placeholder?: string;
  handleFilter: (value:any) => void;
 
}) => {
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Load search history from local storage
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setSearchHistory(history);
  }, []);

  const handleSearch = () => {
    if (!query) return;

    // Save search query in history
    let updatedHistory = [
      query,
      ...searchHistory.filter((item) => item !== query),
    ];
    updatedHistory = updatedHistory.slice(0, 5); // Keep only the latest 5 searches
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    handleFilter({query:query});
    //if (searchParams.get("query") !== query) {
   //   onLoading();
    //  router.push(
      //  formUrlQuery({
      //    params: searchParams.toString(),
      //    key: "query",
       //   value: query,
      //  }),
      //  { scroll: false }
      //);
   // }
  };

  const handleClear = () => {
    setQuery("");
    handleFilter({query:''});
   // const newUrl = removeKeysFromQuery({
    //  params: searchParams.toString(),
    //  keysToRemove: ["query"],
    //});
    // onLoading();
   // router.push(newUrl, { scroll: false });
  };

  const removeHistoryItem = (item: string) => {
    const updatedHistory = searchHistory.filter((history) => history !== item);
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };
  const handleClick = (qry: string) => {
    //let newUrl = "";
   // if (qry && qry !== searchParams.get("query")) {
      //newUrl = formUrlQuery({
      //  params: searchParams.toString(),
       // key: "query",
     //   value: qry,
      //});
      
      if (qry){
        setQuery(qry);
        handleFilter({query:qry});
      }
     
     // onLoading();
     // router.push(newUrl, { scroll: false });
    //}
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      //let newUrl = "";

      if (query) {
     
        handleFilter({query:query});
      //  newUrl = formUrlQuery({
       //   params: searchParams.toString(),
       //   key: "query",
       //   value: query,
       // });
      } 
      //else {
       // newUrl = removeKeysFromQuery({
       //   params: searchParams.toString(),
        //  keysToRemove: ["query"],
       // });
     // }

      //router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);
  return (
    <div className="relative border border-gray-300 dark:border-gray-600 flex justify-between items-center dark:bg-[#2D3236] bg-white p-1 rounded-sm w-full">
      
      <div className="flex items-center w-full">
        {focus && (
          <div className="text-gray-400">
            <SearchOutlinedIcon />
          </div>
        )}
        <Input
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value === "") {
              handleFilter({query:''});
              // Add your logic here
            }
          }}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 200)} // Delay to allow click selection
          className="w-full dark:bg-[#2D3236] dark:text-gray-300 flex-grow rounded-sm p-regular-16 border-0 bg-red outline-offset-0 placeholder:text-grey-500 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        {query && (
          <button onClick={handleClear} className="p-2">
            <CloseOutlinedIcon />
          </button>
        )}
      </div>
      <div>
        <button
          onClick={handleSearch}
          className="flex justify-center items-center h-12 w-12 hover:bg-green-700 bg-green-600 text-white rounded-sm"
        >
          <SearchOutlinedIcon />
        </button>
      </div>

      

      {/* Search Suggestions Dropdown */}
      {focus && searchHistory.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-[#131B1E] border border-gray-300 dark:border-gray-700 shadow-md rounded-md mt-1 z-10">
          {searchHistory.map((item, index) => (
            <div
              key={index}
              className="flex w-full justify-between items-center p-0 cursor-pointer hover:text-green-600 dark:hover:bg-gray-800"
            >
              <span
                onClick={() => handleClick(item)}
                className="flex-grow gap-1 p-1 items-start"
              >
                <div className="flex w-full items-center">
                  <SearchOutlinedIcon sx={{ fontSize: 16 }} />
                  {item}
                </div>
              </span>
              <button
                onClick={() => removeHistoryItem(item)}
                className="text-gray-500 hover:text-red-500"
              >
                <DeleteOutlineIcon fontSize="small" />
              </button>
            </div>
          ))}
          <button
            className="w-full text-sm text-gray-500 p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
            onClick={() => {
              setSearchHistory([]);
              localStorage.removeItem("searchHistory");
            }}
          >
            Clear All History
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchNowTitle;
