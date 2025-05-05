import { useState } from "react";
import Image from "next/image";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
type Package = {
  imageUrl: string;
  name: string;
  _id: string;
  description: string;
  price: string[];
  features: string[];
  color: string;
  priority: number;
};
interface promoProps {
  packagesList: any;
  packname: string;
  planId: string;
  expirationDate: Date;
  listed: number;
  adstatus: string;
  priority: number;
  daysRemaining: number;
  onChange: (
    ExpirationDate_: Date,
    Priority_: number,
    Adstatus_: string,
    PlanId: string,
    Plan: string,
    periodInput: string,
    priceInput: string
  ) => void;
}
const PromoSelection = ({
  packagesList,
  packname,
  planId,
  expirationDate,
  listed,
  adstatus,
  priority,
  daysRemaining,
  onChange,
}: promoProps) => {
  const [selectedPromo, setSelectedPromo] = useState<string | null>("No promo");
  // Your existing state variables and functions here
  const [activePackage, setActivePackage] = useState<Package | null>(
    packagesList.length > 0
      ? listed > 0 && packname === "Free"
        ? packagesList[0]
        : packagesList[1]
      : null
  );
  const [activeButton, setActiveButton] = useState(0);
  const [activeButtonTitle, setActiveButtonTitle] = useState("1 week");
  const [priceInput, setPriceInput] = useState("");
  const [periodInput, setPeriodInput] = useState("");
  const [PlanId, setplanId] = useState(planId);
  const [Plan, setplan] = useState(packname);
  const [Adstatus_, setadstatus] = useState(adstatus);
  const [Priority_, setpriority] = useState(priority);

  const [ExpirationDate_, setexpirationDate] = useState(expirationDate);
  const handleButtonClick = (index: number, title: string) => {
    setActiveButton(index);
    setActiveButtonTitle(title);
    let amount = "";
    let period = "";
    activePackage?.price.forEach((price: any, indexx: number) => {
      if (indexx === index) {
        setPriceInput(price.amount);
        setPeriodInput(price.period);
        amount = price.amount;
        period = price.period;
      }
    });
    onChange(
      ExpirationDate_,
      Priority_,
      Adstatus_,
      PlanId,
      Plan,
      period,
      amount
    );
  };
  const handleClick = (pack: Package) => {
    const currDate = new Date();
    // Add one month to the current date
    let expirationDate = new Date(currDate);
    expirationDate.setMonth(currDate.getMonth() + 1);
    let status = "Active";
    let amount = "";
    let period = "";
    if (pack.name === "Free") {
      setadstatus("Active");
      status = "Active";
    } else {
      setadstatus("Pending");
      status = "Pending";
    }
    setActivePackage(pack);
    setplanId(pack._id);
    setplan(pack.name);
    setpriority(pack.priority);
    setexpirationDate(expirationDate);
    pack.price.forEach((price: any, index: number) => {
      if (index === activeButton) {
        setPriceInput(price.amount);
        setPeriodInput(price.period);
        amount = price.amount;
        period = price.period;
      }
    });

    onChange(
      expirationDate,
      pack.priority,
      status,
      pack._id,
      pack.name,
      period,
      amount
    );
  };
  return (
    <div className="w-full mt-2 p-0 dark:text-gray-100 rounded-lg">
      <div className="flex flex-col mb-5">
        <p className="text-gray-700 dark:text-gray-300 font-semibold text-xl">
          Promote your ad
        </p>
        <p className="text-gray-600 text-sm dark:text-gray-500">
          Choose a promotion type for your ad to post it
        </p>
      </div>
      {/* No Promo */}
      <div className="w-full">
        {packagesList.length > 0 &&
          packagesList.map((pack: any, index: any) => {
            // const check = packname == pack.name != "Free";
            const issamepackage = packname === pack.name;
            return (
              <div
                key={index}
                className={`mb-2 dark:bg-[#2D3236] border bg-white rounded-lg cursor-pointer ${
                  activePackage === pack
                    ? "bg-[#F2FFF2] border-[#4DCE7A] border-2"
                    : ""
                }`}
              >
                {/*  <div
                  className={`text-lg font-bold rounded-t-md text-white py-2 px-4 mb-4 flex flex-col items-center justify-center`}
                    style={{
                   backgroundColor:
                       activePackage === pack ? "#4DCE7A" : pack.color,
                    }}

                ></div>*/}
                <div
                  onClick={() =>
                    (!issamepackage && pack.name === "Free") ||
                    (issamepackage && pack.name === "Free" && listed === 0)
                      ? {}
                      : handleClick(pack)
                  }
                  className="flex justify-between items-center w-full"
                >
                  <div className="p-3">
                    <p className="text-gray-700 font-semibold dark:text-gray-300">
                      {pack.name}
                    </p>
                    <ul className="flex flex-col gap-1 p-1">
                      {pack.features
                        .slice(0, 1)
                        .map((feature: any, index: number) => (
                          <li key={index} className="flex items-center gap-1">
                            {/*  <Image
                            src={`/assets/icons/${
                              feature.checked ? "check" : "cross"
                            }.svg`}
                            alt={feature.checked ? "check" : "cross"}
                            width={24}
                            height={24}
                          />*/}
                            <DoneOutlinedIcon />
                            <p className="text-sm">{feature.title}</p>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div className="p-3">
                    <div className="text-gray-600 mb-1">
                      <div className="flex gap-2 text-sm">
                        {daysRemaining > 0 && pack.name === packname ? (
                          <>
                            <div className="p-1 flex-block rounded-full bg-emerald-500">
                              <p className="text-white text-xs">Active</p>
                            </div>
                          </>
                        ) : (
                          <>
                            {(!issamepackage && pack.name === "Free") ||
                            (issamepackage &&
                              pack.name === "Free" &&
                              listed === 0) ? (
                              <div>
                                <div className="p-0 items-center flex rounded-full bg-grey-50">
                                  <p className="bg-gray-500 border rounded-xl p-2 text-white font-bold text-xs">
                                    Disabled
                                  </p>
                                </div>
                                <div className="text-xs text-gray-400 p-1">
                                  You can&apos;t subscribe to Free Package
                                </div>
                              </div>
                            ) : (
                              issamepackage &&
                              pack.name === "Free" &&
                              listed > 0 && (
                                <>
                                  {/* <div className="p-1 w-full items-center justify-center flex rounded-full bg-emerald-500">
                                <p className="text-white text-xs">Active</p>
                              </div>*/}
                                </>
                              )
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      {pack.name === "Free" ? (
                        <></>
                      ) : (
                        <>
                          <div className="text-gray-800 font-bold mb-0">
                            <ul className="flex flex-col items-center gap-0 py-0">
                              {pack.price.map((price: any, index: number) => (
                                <li
                                  key={index}
                                  className={`flex items-center gap-0 ${
                                    index !== activeButton ? "hidden" : ""
                                  }`}
                                >
                                  <p
                                    className={`font-semibold ${
                                      activePackage === pack
                                        ? "text-[#30AF5B]"
                                        : "text-gray-800 dark:text-gray-400"
                                    }`}
                                  >
                                    Ksh {price.amount.toLocaleString()}/{" "}
                                    {activeButtonTitle}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {pack.name !== "Free" && activePackage === pack && (
                  <>
                    <div className="flex flex-wrap justify-end items-center p-2">
                      <button
                        className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${
                          activeButton === 0
                            ? "bg-gradient-to-b from-[#4DCE7A] to-[#30AF5B] text-white p-2 rounded-full"
                            : "border border-[#30AF5B] text-[#30AF5B] rounded-full p-2"
                        }`}
                        onClick={() => handleButtonClick(0, "1 week")}
                      >
                        1 week
                      </button>
                      <button
                        className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${
                          activeButton === 1
                            ? "bg-gradient-to-b from-[#4DCE7A] to-[#30AF5B] text-white p-2 rounded-full"
                            : "border border-[#30AF5B] text-[#30AF5B] rounded-full p-2"
                        }`}
                        onClick={() => handleButtonClick(1, "1 month")}
                      >
                        1 month
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
      {/* TOP Promo 
      <div className="border-2 p-3 dark:border-green-500 rounded-lg">
        <p className="text-gray-700 dark:text-gray-300">No promo</p>
        <p className="text-green-500 font-semibold">Free</p>
      </div>

     
      <div className="border p-3 dark:border-gray-600 rounded-lg mt-4">
        <p className="text-gray-700 dark:text-gray-300 font-semibold">TOP</p>
        <div className="flex gap-2 mt-2">
          <button
            className={`px-4 py-1 rounded-full ${
              selectedPromo === "7 days"
                ? "bg-green-500 text-white"
                : "bg-[#e4ebeb] text-gray-700"
            }`}
            onClick={() => setSelectedPromo("7 days")}
          >
            7 days
          </button>
          <button
            className={`px-4 py-1 rounded-full ${
              selectedPromo === "30 days"
                ? "bg-green-500 text-white"
                : "bg-[#e4ebeb] text-gray-700"
            }`}
            onClick={() => setSelectedPromo("30 days")}
          >
            30 days
          </button>
        </div>
        <p className="mt-2 text-gray-800 dark:text-gray-400 font-semibold">
          KSh 650
        </p>
      </div>

     
      <div className="border p-3 dark:border-gray-600 rounded-lg mt-4">
        <p className="text-gray-700 dark:text-gray-300 font-semibold">
          Boost Premium promo
        </p>
        <button
          className={`px-4 py-1 rounded-full mt-2 ${
            selectedPromo === "1 month"
              ? "bg-green-500 text-white"
              : "bg-[#e4ebeb] text-gray-700"
          }`}
          onClick={() => setSelectedPromo("1 month")}
        >
          1 month
        </button>
        <p className="mt-2 text-gray-800 dark:text-gray-400 font-semibold">
          KSh 7,199
        </p>
      </div>

   
      <button className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg text-lg font-semibold">
        Post ad
      </button>

  
      <p className="mt-2 text-xs text-gray-600 dark:text-gray-500 text-center">
        By clicking on Post Ad, you accept the{" "}
        <a href="#" className="text-blue-600 underline">
          Terms of Use
        </a>
      </p>
      */}
    </div>
  );
};

export default PromoSelection;
