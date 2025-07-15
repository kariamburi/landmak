"use client";
import React, { useEffect, useState } from "react";
import {
  getallcategories,
  getcategory,
} from "@/lib/actions/subcategory.actions";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { createValidationSchema } from "@/lib/createValidationSchema";
import CreateCategoryForm from "./CreateCategoryForm";
import DisplayCategories from "./DisplayCategories";
import { FileUploader } from "./FileUploader";
import { useUploadThing } from "@/lib/uploadthing";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import { Button } from "../ui/button";
import { checkAdConflicts, createData, updateAd } from "@/lib/actions/dynamicAd.actions";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CategorySelect from "./CategorySelect";
import SubCategorySelect from "./SubCategorySelect";
import { Multiselect } from "./Multiselect";
import AutoComplete from "./AutoComplete";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import { BellIcon } from "lucide-react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import CountyConstituencySelector from "./CountyConstituencySelector";
import { FreePackId, REGIONS_WITH_AREA, REGIONS_WITH_CONSTITUENCIES } from "@/constants";
import MakeModelAutocomplete from "./MakeModelAutocomplete";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { BulkPriceManager } from "./BulkPriceManager";
import DeliveryOptions from "./DeliveryOptions";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PriceInput from "./PriceInput";
import PromoSelection from "./PromoSelection";
import { DateExpressionOperatorReturningNumber } from "mongoose";
import LatitudeLongitudeInput from "./LatitudeLongitudeInput";
import MapAreaCalculator from "./MapAreaCalculator";
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import LatLngPicker from "./LatLngPicker";
import LandSubdivision from "./LandSubdivision";
import GoogleMapping from "./GoogleMapping";
import { getData } from "@/lib/actions/transactions.actions";
import { getAllPackages } from "@/lib/actions/packages.actions";
import { Icon } from "@iconify/react";
import Barsscale from "@iconify-icons/svg-spinners/bars-scale"; // Correct import
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { updateUserPhone } from "@/lib/actions/user.actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import MapDrawingTool from "./MapDrawingTool";
import { createLoan } from "@/lib/actions/loan.actions";
import { MapaPricingModal } from "./MapaPricingModal";
import PhoneVerification from "./PhoneVerification";
//import { checkAdConflicts } from "@/lib/actions/checkAdConflicts";
import { analyzeBeforeUpload } from "@/lib/actions/analyzeBeforeUpload";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[300px] h-full flex flex-col items-center justify-center">
      <Icon icon={Barsscale} className="w-10 h-10 text-gray-500" />
    </div>
  ),
});
interface Field {
  name: string;
  type:
  | "text"
  | "number"
  | "select"
  | "radio"
  | "checkbox"
  | "textarea"
  | "multi-select"
  | "autocomplete"
  | "phone"
  | "year"
  | "parcelNumber"
  | "youtube-link"
  | "price"
  | "budget"
  | "rentprice"
  | "priceper"
  | "bulkprice"
  | "serviceprice"
  | "delivery"
  | "location"
  | "propertyarea"
  | "notify"
  | "money"
  | "virtualTourLink"
  | "related-autocompletes";
  required?: boolean;
  options?: string[];
}
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEAPIKEY!;
const generateDefaultValues = (fields: Field[]) => {
  const defaults: Record<string, any> = {};
  fields.forEach((field) => {
    if (field.type === "text") {
      defaults[field.name] = "";
    } else if (field.type === "number") {
      defaults[field.name] = 0;
    } else if (field.type === "select") {
      defaults[field.name] = field.options?.[0] || "";
    } else if (field.type === "multi-select") {
      defaults[field.name] = []; // Default to an empty array
    } else if (field.type === "checkbox") {
      defaults[field.name] = false;
    } else if (field.type === "textarea") {
      defaults[field.name] = "";
    } else if (field.type === "autocomplete") {
      defaults[field.name] = "";
    } else if (field.type === "phone") {
      defaults[field.name] = "";
    } else if (field.type === "parcelNumber") {
      defaults[field.name] = "";
    }
    else if (field.type === "money") {
      defaults[field.name] = 0;
    } else if (field.type === "price") {
      defaults["price"] = 0;
    } else if (field.type === "budget") {
      defaults["price"] = 0;
    } else if (field.type === "rentprice") {
      defaults["price"] = 0;
      defaults["period"] = "";
    } else if (field.type === "bulkprice") {
      defaults["price"] = 0;
      defaults["bulkprice"] = [];
    } else if (field.type === "serviceprice") {
      defaults["price"] = 0;
      defaults["priceType"] = "specify";
      defaults["unit"] = "per service";
    } else if (field.type === "location") {
      defaults["location"] = [];
    }
    else if (field.type === "propertyarea") {
      defaults["propertyarea"] = [];
    } else if (field.type === "virtualTourLink") {
      defaults["virtualTourLink"] = "";
    }

    else if (field.type === "delivery") {
      defaults["delivery"] = [];
    } else if (field.type === "year") {
      defaults[field.name] = "";
    } else if (field.type === "youtube-link") {
      defaults[field.name] = "";
    } else if (field.type === "related-autocompletes") {
      defaults[field.name] = "";
    } else if (field.type === "radio") {
      defaults[field.name] = field.options?.[0] || "";
    }
  });
  return defaults;
};

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
type AdFormProps = {
  userId: string;
  userImage?: string;
  user: any;
  type: string;
  ad?: any;
  adId?: string;
  categories: any;
  userName: string;
  category?: string
  subcategory?: string
  packagesList: any;
  handleOpenShop: (shopId: any) => void;
  handleAdView?: (ad: any) => void;
  handlePay?: (id: string) => void;
  handleOpenTerms: () => void;
};

const AdForm = ({
  userId,
  userImage,
  user,
  type,
  ad,
  adId,
  userName,
  category,
  subcategory,
  categories,
  packagesList,
  handleAdView,
  handlePay,
  handleOpenTerms,
  handleOpenShop,
}: AdFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>(
    ad ? ad.data : []
  );
  const [selectedCategory, setSelectedCategory] = useState(
    ad ? ad.data.category : ""
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    ad ? ad.data.subcategory : ""
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    ad ? ad.category : ""
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(
    ad ? ad.subcategory : ""
  );

  const [showGuide, setShowGuide] = useState(false);
  const [mapData, setMapData] = useState<any>([]);
  // const [selectedCategory, setSelectedCategory] = useState("");
  const [showload, setShowLoad] = useState(true);

  const [fields, setFields] = useState<Field[]>([]);
  //const [selectedAutoComplete, setSelectedAutoComplete] = useState("");
  const [autoCompleteValues, setAutoCompleteValues] = useState<any>({});
  const [selectedYear, setSelectedYear] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(2);
  const [createStatus, setCreateStatus] = useState('Submitting');
  const [defaults, setDefualts] = useState<any>([]);
  const [negotiable, setNegotiable] = useState<"yes" | "no" | "not sure">(
    "not sure"
  );
  const [selectedFeatures, setselectedFeatures] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const { startUpload } = useUploadThing("imageUploader");
  let uploadedImageUrl: string[] = [];
  const [showPopup, setShowPopup] = useState(false);
  const [phoneError, setphoneError] = useState('');
  const [locationError, setlocationError] = useState('');
  const modules = {
    toolbar: [
      // [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      // [{ color: [] }, { background: [] }], // Color options
      [{ align: [] }],
      // ["link", "image"],
      ["clean"],
    ],
  };
  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const [showPopupBulk, setShowPopupBulk] = useState(false);

  const handleOpenPopupBulk = () => {
    setShowPopupBulk(true);
  };

  const handleClosePopupBulk = () => {
    setShowPopupBulk(false);
  };

  const [showPopupGps, setShowPopupGps] = useState(false);

  const handleOpenPopupGps = () => {
    setShowPopupGps(true);
  };

  const handleClosePopupGps = () => {
    setShowPopupGps(false);
  };
  const handleSaveGps = () => {
    setShowPopupGps(false); // Close the popup after saving
  };

  const [showPopupArea, setShowPopupArea] = useState(false);

  const handleOpenPopupArea = () => {
    setShowPopupArea(true);
  };

  const handleClosePopupArea = () => {
    setShowPopupArea(false);
  };

  const handleSelect = (e: any) => {
    geocodeByAddress(e.value.description)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setFormData((prevData) => ({
          ...prevData, propertyarea: {
            location: { type: "Point", coordinates: [lng, lat] },
            mapaddress: e.value.description,
          }
        }));
      });
  };

  const handleSaveMap = () => {

    setFormData((prevData) => ({ ...prevData, ["propertyarea"]: mapData }));
    setShowPopupArea(false);
  };
  const handleOnClose = () => {
    setShowPopupArea(false); // Close the popup after saving
  };
  const [selectedCategoryCommand, setSelectedCategoryCommand] = useState<
    string[]
  >([]);


  const [countryCode, setCountryCode] = useState("+254"); // Default country code
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const getCategory = async () => {
      try {

        const uniqueCategories = categories.reduce((acc: any[], current: any) => {
          if (
            !acc.find((item) => item.category.name === current.category.name)
          ) {
            acc.push(current);
          }
          return acc;
        }, []);

        // ✅ Filter only "Property" and "Land" categories (example)
        const allowedCategories = [
          "New builds",
          "Houses & Apartments for Rent",
          "Houses & Apartments for Sale",
          "Land & Plots for Rent",
          "Land & Plots for Sale",
          "Commercial Property for Rent",
          "Commercial Property for Sale",
          "Event Centres, Venues & Workstations",
          "Short Let Property",
          "Special Listings",
          "Property Services"];

        const filteredCategories = uniqueCategories.filter(
          (cat: any) => allowedCategories.includes(cat.category.name)
        );

        setSelectedCategoryCommand(filteredCategories);

        if (type === "Update") {

          const selectedData: any = categories.find(
            (category: any) =>
              category.category.name === selectedCategory &&
              category.subcategory === selectedSubCategory
          );
          // Update fields if a match is found

          setSelectedCategoryId(selectedData.category._id)
          setFields(selectedData ? selectedData.fields : []);
          setFormData(ad.data);

          const cleanNumber = ad.data.phone.startsWith('+') ? ad.data.phone.slice(1) : ad.data.phone;
          const countryCode = cleanNumber.slice(0, 3);
          const localNumber = cleanNumber.slice(3);
          setCountryCode('+' + countryCode)
          setPhoneNumber(localNumber)
          setFormData({
            ...formData,
            phone: ad.data.phone,
          });


        } else {
          if (subcategory && category) {
            setSelectedCategory(category);
            setSelectedSubCategory(subcategory);
            const selectedData: any = categories.find(
              (ca: any) =>
                ca.category.name === category &&
                ca.subcategory === subcategory
            );
            // Update fields if a match is founds
            setSelectedCategoryId(selectedData.category._id)
            setSelectedSubCategoryId(selectedData._id);
            setFields(selectedData ? selectedData.fields : []);
            if (category === 'Wanted Ads') {

              setFormData({
                ...formData,
                category: category,
                subcategory: subcategory,
                imageUrls: [userImage],
              });

            } else {
              setFormData({
                ...formData,
                category: category,
                subcategory: subcategory,
              });
            }


          }
        }
        setShowLoad(false)
      } catch (error) {
        setShowLoad(false)
        console.error("Failed to fetch categories", error);
      }
    };
    getCategory();
  }, []);


  const [activePackage, setActivePackage] = useState<Package | null>(null);
  const [activeButton, setActiveButton] = useState(0);
  const [activeButtonTitle, setActiveButtonTitle] = useState("1 week");
  const [priceInput, setPriceInput] = useState("");
  const [periodInput, setPeriodInput] = useState("");
  const [subscription, setSubscription] = useState<any>(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [remainingAds, setRemainingAds] = useState(0);
  const [listed, setListed] = useState(0);
  const [Plan, setplan] = useState("Free");
  const [PlanId, setplanId] = useState(FreePackId);
  const [Priority_, setpriority] = useState(0);
  const [Adstatus_, setadstatus] = useState("Pending");
  const [color, setColor] = useState("#000000");
  const [anayze, setAnalyze] = useState("");
  const [loadingSub, setLoadingSub] = useState<boolean>(true);
  const [ExpirationDate_, setexpirationDate] = useState(new Date());

  useEffect(() => {
    if (type === "Create") {
      const fetchData = () => {
        try {


          const subscriptionData = user;
          const packages = packagesList;

          if (subscriptionData) {
            // setSubscription(subscriptionData);
            const listedAds = subscriptionData.ads || 0;
            setListed(listedAds);
            if (subscriptionData.currentpack && !Array.isArray(subscriptionData.currentpack)) {
              setRemainingAds(subscriptionData.currentpack.list - listedAds);
              setpriority(subscriptionData.currentpack.priority);
              setColor(subscriptionData.currentpack.color);
              setplan(subscriptionData.currentpack.name);
              setplanId(subscriptionData.transaction?.planId || FreePackId);
              // console.log(subscriptionData);
              const createdAtDate = new Date(subscriptionData.transaction?.createdAt || new Date());
              const periodDays = parseInt(subscriptionData.transaction?.period) || 0;
              const expiryDate = new Date(createdAtDate.getTime() + periodDays * 24 * 60 * 60 * 1000);
              setexpirationDate(expiryDate);
              const currentDate = new Date();
              const remainingDays = Math.ceil((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
              setDaysRemaining(remainingDays);
              setadstatus((remainingDays > 0 && (subscriptionData.currentpack.list - listedAds) > 0) || ((subscriptionData.currentpack.list - listedAds) > 0 && subscriptionData.currentpack.name === "Free") ? "Active" : "Pending");
              setActivePackage(
                packages.length > 0
                  ? subscriptionData.currentpack.list - listedAds > 0 && subscriptionData.currentpack.name === "Free"
                    ? packages[0]
                    : packages[1]
                  : null
              );


            } else {
              console.warn("No current package found for the user.");
            }
          }
        } catch (error) {
          console.error("Failed to fetch data", error);
        } finally {


        }
      };
      fetchData();
    }
  }, []);



  const validateForm = async () => {
    //console.log("start: ");
   // alert("Validation started");

    const validationSchema = createValidationSchema(fields, selectedCategory);
    console.log(formData);
   // alert("FormData: " + JSON.stringify(formData));

    const result = validationSchema.safeParse(formData);
    console.log(result);
   // alert("Validation result: " + JSON.stringify(result));

    if (!result.success) {
      const errors = result.error.errors.reduce((acc: any, err: any) => {
        acc[err.path[0]] = err.message;
        console.log(acc);
      //  alert(`Field: ${err.path[0]} - Error: ${err.message}`);
        return acc;
      }, {});
      console.log(errors);
      //alert("Final errors: " + JSON.stringify(errors));
      setFormErrors(errors);
      return false;
    }

    console.log("success:");
   // alert("Validation success");
    setFormErrors({});
    return true;
  };

  const uploadFiles = async () => {
    const uploadedUrls: string[] = [];
    let i = 0;
    for (const file of files) {
      try {
        const analysis = await analyzeBeforeUpload(file);

        // Proceed to upload

        const uploadedImages = await startUpload([file]);

        if (uploadedImages && uploadedImages.length > 0) {
          uploadedUrls.push(uploadedImages[0].url);
          i++;
          setUploadProgress(Math.round((i / files.length) * 100));
        }
      } catch (error: any) {
        console.error("Image analysis failed:", error);

        if (error.hasWatermark) {
          setAnalyze("Remove watermark or overlaid text from images.");

        } else if (error.likelyDownloaded) {
          setAnalyze("Please upload original, not downloaded images.");

        } else if (!error.isRealProperty) {
          setAnalyze("Only real land/property photos are allowed.");

        } else {
          setAnalyze("Image analysis failed.");
        }
      }
    }

    const successfulUploads = uploadedUrls.filter((url) => !url.includes("blob:"));

    if (successfulUploads.length === 0) {
      throw new Error("All images failed analysis");
    }

    return successfulUploads;

  };

  const uploadFilesUpload = async () => {
    const uploadedUrls: string[] = [];
    let i = 0;
    for (const file of files) {
      try {
        i++;
        const uploadedImages = await startUpload([file]);
        if (uploadedImages && uploadedImages.length > 0) {
          uploadedUrls.push(uploadedImages[0].url);
          setUploadProgress(Math.round((i / files.length) * 100));
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    return uploadedUrls.filter((url) => !url.includes("blob:"));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });

  };

  const handleInputCategoryChange = (field: string, value: any, _id: string) => {
    setSelectedCategory(value);
    setSelectedCategoryId(_id);
    setSelectedSubCategory("");
    setSelectedSubCategoryId("");
    setFields([]);

    if (value === 'Wanted Ads') {

      setFormData({
        ...formData,
        [field]: value,
        imageUrls: [userImage],
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };
  const handleInputSubCategoryChange = (
    field: string,
    value: any,
    _id: string
  ) => {

    setSelectedSubCategory(value);
    setSelectedSubCategoryId(_id);
    const selectedData: any = categories.find(
      (category: any) =>
        category.category.name === selectedCategory &&
        category.subcategory === value
    );
    // Update fields if a match is found
    setFields(selectedData ? selectedData.fields : []);
    // Set default values based on fields
    // const defaults = generateDefaultValues(selectedData.fields);
    setDefualts(generateDefaultValues(selectedData ? selectedData.fields : []));
    setFormData(defaults);
    setFormErrors({});
    setFiles([]);

    if (user.user.phone && type === "Create") {

      const cleanNumber = user.user.phone.startsWith('+') ? user.user.phone.slice(1) : user.user.phone;
      const countryCode = cleanNumber.slice(0, 3);
      const localNumber = cleanNumber.slice(3);
      setCountryCode('+' + countryCode)
      setPhoneNumber(localNumber)
      setFormData({
        ...formData, [field]: value,
        phone: user.user.phone,
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }

  };

  const handleInputAutoCompleteChange = (field: string, value: any) => {
    if (field === "make") {
      setFormData({
        ...formData,
        [field]: value,
        ...(formData.hasOwnProperty("model") && { model: "" }), // Check if 'model' exists before setting it to ""
      });
    } else if (field === "contact" && value === "contact") {
      setFormData({
        ...formData,
        [field]: value,
        price: "0",
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleInputYearChange = (field: string, value: any) => {
    setSelectedYear(value);

    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    setShowPopup(false); // Close the popup after saving
  };

  const handleInputOnChange = (field: string, value: any) => {
    // console.log(value);
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };
  const handlePackageOnChange = (
    ExpirationDate_: Date,
    Priority_: number,
    Adstatus_: string,
    PlanId: string,
    Plan: string,
    periodInput: string,
    priceInput: string
  ) => {
    setexpirationDate(ExpirationDate_);
    setpriority(Priority_);
    setadstatus(Adstatus_);
    setplanId(PlanId);
    setplan(Plan);
    setPriceInput(priceInput);
    setPeriodInput(periodInput);

  };
  function isValidKenyanPhoneNumber(phone: string): boolean {
    const kenyanPhoneRegex = /^(?:\+254|254|0)?(7\d{8})$/;
    return kenyanPhoneRegex.test(phone.trim());
  }
  const handleSubmit = async () => {
    setLoading(true);
    setUploadProgress(0);

    try {
      const isValid = await validateForm();
      if (!isValid) {
        toast({
          variant: "destructive",
          title: "Missing fields",
          description: "Please fill in all required fields",
          duration: 5000,
        });
        return;
      }

      const phone = countryCode + removeLeadingZero(phoneNumber);

      if (!isValidKenyanPhoneNumber(phone)) {
        toast({
          variant: "destructive",
          title: "Invalid Phone",
          description: "Invalid Phone Number.",
          duration: 5000,
        });
        setphoneError("Invalid Phone Number!");
        return;
      }

      if (!formData["propertyarea"]) {
        toast({
          variant: "destructive",
          title: "No location",
          description: "Please set location!",
          duration: 5000,
        });
        setlocationError("Set Location!");
        return;
      }

      let finalData: any;
      if (type === "Create") {


        if (selectedCategory === 'Wanted Ads' && selectedSubCategory.trim().toLowerCase() === "Property Financing Requests".toLowerCase()) {

          const newAd = await createLoan({
            loan: {
              userId: userId,
              adId: null,
              loanType: formData["Loan Type"]?.toString() || "",
              LoanAmount: parseCurrencyToNumber(formData["Loan Amount"]?.toString() || 0),
              monthlyIncome: parseCurrencyToNumber(formData["Monthly Income"]?.toString() || 0),
              deposit: parseCurrencyToNumber(formData["Deposit Amount"]?.toString() || 0),
              loanterm: formData["Preferred Loan Term"]?.toString() || "",
              employmentStatus: formData["Employment Status"]?.toString() || "",
              messageComments: formData["Comment"]?.toString() || "",
              status: "Pending",
            },
            path: "/create",
          });
          setFormData(defaults);
          setFiles([]);
          if (handleOpenShop) {
            handleOpenShop(user.user);
          }
          toast({
            title: "Submitted",
            description: "Loan request submitted successfully.",
            duration: 5000,
            className: "bg-[#30AF5B] text-white",
          });
          return;
        }


        if (selectedCategory === 'Wanted Ads') {
          finalData = {
            ...formData,
            budget: parseCurrencyToNumber(formData["budget"].toString()),
            phone,
          };

        } else {

          const precheck: any = await checkAdConflicts(formData);
          if (precheck.error) {
            toast({
              variant: "destructive",
              title: "Duplicate Detected",
              description: precheck.error,
              duration: 6000,
            });
            setLoading(false);
            return;
          }
          try {
            // const uploadedUrls = await uploadFiles();
            const uploadedUrls = await uploadFilesUpload();

            finalData = {
              ...formData,
              imageUrls: uploadedUrls,
              price: parseCurrencyToNumber(formData["price"].toString()),
              phone,
            };

            // proceed to save the finalData...
          } catch (error) {
            console.error("Upload halted:", error);
            toast({
              title: "Upload Blocked",
              description: "All selected images were rejected. Please upload valid property photos.",
              variant: "destructive",
            });
            return;
          }
        }

        const pricePack = Number(priceInput);

        const newAd = await createData({
          userId,
          subcategory: selectedSubCategoryId,
          category: selectedCategoryId,
          formData: finalData,
          expirely: ExpirationDate_,
          priority: selectedCategory === 'Wanted Ads' ? 1 : Priority_,
          adstatus: selectedCategory === 'Wanted Ads' ? 'Active' : Adstatus_,
          planId: selectedCategory === 'Wanted Ads' ? FreePackId : PlanId,
          plan: selectedCategory === 'Wanted Ads' ? 'Free' : Plan,
          pricePack,
          periodPack: periodInput,
          path: "/create",
        });


        setFormData(defaults);
        setFiles([]);
        setSelectedYear("");
        setPhoneNumber("");
        setselectedFeatures([]);

        toast({
          title: "Submitted",
          description: "Ad submitted successfully.",
          duration: 5000,
          className: "bg-black text-white",
        });

        if (newAd) {
          if (newAd.adstatus === "Pending" && handlePay) {
            handlePay(newAd._id);
          } else {
            handleAdView?.(newAd);
          }
        }


      }

      if (type === "Update") {

        const uploadedUrls = await uploadFilesUpload();
        // Preserve existing imageUrls if no new files are uploaded
        const finalImageUrls =
          uploadedUrls.length > 0 ? uploadedUrls : formData.imageUrls;

        const finalData = {
          ...formData,
          imageUrls: finalImageUrls,
          price: parseCurrencyToNumber(formData["price"].toString()),
          phone,
        };

        const updatedAd = await updateAd(userId, ad._id, selectedCategoryId, selectedSubCategoryId, finalData);

        setFormData(defaults);
        setFiles([]);
        setSelectedYear("");
        setPhoneNumber("");
        setselectedFeatures([]);

        toast({
          title: "Updated",
          description: "Ad updated successfully.",
          duration: 5000,
          className: "bg-black text-white",
        });

        handleAdView?.(updatedAd);
      }
    } catch (error) {
      console.error("Validation or submission failed", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter the subcategories for the selected category and include both subcategory and _id
  const filteredSubcategories = categories
    .filter((category: any) => category.category.name === selectedCategory && category.subcategory !== "Property Financing Requests")
    .map((category: any) => ({
      subcategory: category.subcategory,
      imageUrl: category.imageUrl[0],
      _id: category._id,
    }))
    .filter(
      (value: any, index: any, self: any) =>
        index ===
        self.findIndex(
          (c: any) => c.subcategory === value.subcategory && c._id === value._id
        )
    ); // Get unique subcategory and _id pairs
  const handleInputChangeMoney = (field: string, value: string) => {
    const numericValue = value.replace(/,/g, "");
    setFormData((prev) => ({ ...prev, [field]: numericValue }));
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
  const parseCurrencyToNumber = (value: string): number => {
    // Remove any commas from the string and convert to number
    return Number(value.replace(/,/g, ""));
  };
  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleCheckboxChange = (field: string, value: any) => {
    const currentSelection = formData[field] || []; // Get current selections for the field
    const isSelected = currentSelection.includes(value);

    const updatedSelection = isSelected
      ? currentSelection.filter((selected: any) => selected !== value) // Remove if already selected
      : [...currentSelection, value]; // Add new selection

    setFormData({ ...formData, [field]: updatedSelection }); // Update formData for the specific field
  };

  const currentYear = new Date().getFullYear();
  let years = [];
  for (let year = currentYear; year >= 1960; year--) {
    years.push(year.toString());
  }

  const formatPhoneNumber = (input: any) => {
    // Remove all non-digit characters
    const cleaned = input.replace(/\D/g, "");

    // Apply formatting based on length
    if (cleaned.length < 4) {
      return cleaned;
    } else if (cleaned.length < 7) {
      return `${cleaned.slice(0, 3)}${cleaned.slice(3)}`;
    } else if (cleaned.length < 11) {
      return `${cleaned.slice(0, 3)}${cleaned.slice(3, 6)}${cleaned.slice(6)}`;
    } else {
      return `${cleaned.slice(0, 3)}${cleaned.slice(3, 6)}${cleaned.slice(
        6,
        10
      )}`;
    }
  };
  function removeLeadingZero(numberString: string) {
    // Check if the first character is '0'
    if (numberString.charAt(0) === "0") {
      // If yes, return the string without the first character
      return numberString.substring(1);
    } else {
      // If no, return the original string
      return numberString;
    }
  }
  const handleCountryCodeChange = (e: any) => {
    setCountryCode(e.target.value);
  };

  const handleInputChangePhone = (e: any) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    setPhoneNumber(formatted);
    setFormData({
      ...formData,
      phone: countryCode + removeLeadingZero(phoneNumber),
    });
  };
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [selectedConstituency, setSelectedConstituency] = useState<
    string | null
  >(null);
  const constituencies =
    REGIONS_WITH_AREA.find(
      (county) => county.region === selectedCounty
    )?.area || [];

  const handleCounty = (field: string, value: any) => {

    setSelectedCounty(value);
    setFormData({ ...formData, [field]: value, area: "" });
    setSelectedConstituency(null);
  };
  const handleConstituency = (field: string, value: any) => {
    setSelectedConstituency(value);
    setFormData({ ...formData, [field]: value });
  };

  // Your existing state variables and functions here

  const handleButtonClick = (index: number, title: string) => {
    setActiveButton(index);
    setActiveButtonTitle(title);

    activePackage?.price.forEach((price: any, indexx: number) => {
      if (indexx === index) {
        setPriceInput(price.amount);
        setPeriodInput(price.period);
      }
    });
  };
  const handleClick = (pack: Package) => {
    const currDate = new Date();
    // Add one month to the current date
    let expirationDate = new Date(currDate);
    expirationDate.setMonth(currDate.getMonth() + 1);
    if (pack.name === "Free") {
      setadstatus("Active");
    } else {
      setadstatus("Pending");
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
      }
    });
  };
  const handleVerified = async (phone: string) => {

    await updateUserPhone(userId, phone);
    const cleanNumber = phone.startsWith('+') ? phone.slice(1) : phone;
    const countryCode = cleanNumber.slice(0, 3);
    const localNumber = cleanNumber.slice(3);
    setCountryCode('+' + countryCode)
    setPhoneNumber(localNumber)
    setFormData({
      ...formData,
      phone: phone,
    });
    // You can now save the verified phone to your database
  };
  if (!selectedCategoryCommand) {
    return (
      <div className="w-full mt-10 h-full flex flex-col items-center justify-center">
        <Image
          src="/assets/icons/loading2.gif"
          alt="loading"
          width={40}
          height={40}
          unoptimized
        />
      </div>
    );
  }
  return (
    <>
      {showload ? (<><div className="w-full p-5 h-full flex flex-col items-center justify-center">
        <Image
          src="/assets/icons/loading2.gif"
          alt="loading"
          width={40}
          height={40}
          unoptimized
        />
      </div></>) : (<>
        <div className="p-0 lg:p-2">
          <section className="bg-grey-50 bg-dotted-pattern bg-cover bg-center mb-2 mt-2 rounded-sm">
            <div className="wrapper flex items-center justify-center sm:justify-between">
              <div className="lg:flex-1 p-1 ml-2 mr-5 mb-0 lg:mb-0">
                <div className="text-lg font-bold breadcrumbs">
                  <h3 className="font-bold text-[25px] text-center sm:text-left">
                    {type} Ad
                  </h3>
                </div>
              </div>
            </div>

          </section>
          <div className="flex flex-col w-full mt-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 flex gap-3 flex-col">
              <div className="flex flex-col">
                <CategorySelect
                  selected={selectedCategory}
                  data={selectedCategoryCommand}
                  onChange={handleInputCategoryChange}
                />
                {formErrors["category"] && (
                  <p className="text-red-500 text-sm">{formErrors["category"]}</p>
                )}


              </div>
              <div className="flex flex-col">
                <SubCategorySelect
                  selected={selectedSubCategory}
                  data={selectedCategory ? filteredSubcategories : []}
                  onChange={handleInputSubCategoryChange}
                />
                {formErrors["subcategory"] && (
                  <p className="text-red-500 text-sm">
                    {formErrors["subcategory"]}
                  </p>
                )}
              </div>
            </div>
            {/*     {selectedSubCategory && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 flex gap-3 mt-3 flex-col">
                <div>
                  <AutoComplete
                    data={REGIONS_WITH_AREA.map(
                      (county) => county.region
                    )}
                    name={"region"}
                    onChange={handleCounty}
                    selected={formData["region"] || ""}
                  />
                  {formErrors["region"] && (
                    <p className="text-red-500 text-sm">
                      {formErrors["region"]}
                    </p>
                  )}
                </div>

                <div>
                  <AutoComplete
                    data={constituencies ?? []}
                    name={"area"}
                    onChange={handleConstituency}
                    selected={formData["area"] || ""}
                  />
                  {formErrors["area"] && (
                    <p className="text-red-500 text-sm">{formErrors["area"]}</p>
                  )}
                </div>
              </div>
            </>
          )} */}
            {selectedSubCategory && selectedCategory !== 'Wanted Ads' && (
              <>
                <div className="flex flex-col bg-white w-full mt-3 gap-0 border dark:bg-[#2D3236] py-2 px-1 rounded-sm border border-gray-300 dark:border-gray-600 items-center">
                  <FileUploader
                    onFieldChange={(urls) => handleInputChange("imageUrls", urls)}
                    imageUrls={formData["imageUrls"] || []} // Ensure this is an array
                    setFiles={setFiles}
                    adId={adId || ""}
                    userName={userName}
                    category={selectedCategory}
                    anayze={anayze}
                  />
                  {formErrors["imageUrls"] && (
                    <p className="text-red-500 text-sm">
                      {formErrors["imageUrls"]}
                    </p>
                  )}
                </div>
              </>
            )}


            {fields.map((field: any) => (
              <div key={field.name} className="flex gap-3 items-center mt-3">
                {field.type === "checkbox" && (
                  <div className="mt-3 mb-3">
                    {capitalizeFirstLetter(field.name.replace("-", " "))}
                  </div>
                )}
                {field.type === "related-autocompletes" && (
                  <MakeModelAutocomplete
                    plainTextData={field.options}
                    make={formData["make"] || ""}
                    formErrorsmake={formErrors["make"]}
                    model={formData["model"] || ""}
                    formErrorsmodel={formErrors["model"]}
                    onChange={handleInputAutoCompleteChange}
                  />
                )}
                {field.type === "text" && (
                  <TextField
                    required={field.required}
                    id={field.name}
                    label={capitalizeFirstLetter(field.name.replace("-", " "))}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    variant="outlined"
                    placeholder={`Enter ${field.name.replace("-", " ")}`}
                    InputProps={{
                      classes: {
                        root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
                        notchedOutline: "border-gray-300 dark:border-gray-600",
                        focused: "",
                      },
                    }}
                    InputLabelProps={{
                      classes: {
                        root: "text-gray-500 dark:text-gray-400",
                        focused: "text-green-500 dark:text-green-400",
                      },
                    }}
                    className="w-full"
                  />
                )}
                {field.type === "youtube-link" && (
                  <TextField
                    required={field.required}
                    id={field.type}
                    label={"YouTube or TikTok Video link"}
                    value={formData[field.type] || ""}
                    onChange={(e) =>
                      handleInputChange(field.type, e.target.value)
                    }
                    variant="outlined"
                    placeholder={`Enter YouTube or TikTok Video link`}
                    InputProps={{
                      classes: {
                        root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
                        notchedOutline: "border-gray-300 dark:border-gray-600",
                        focused: "",
                      },
                    }}
                    InputLabelProps={{
                      classes: {
                        root: "text-gray-500 dark:text-gray-400",
                        focused: "text-green-500 dark:text-green-400",
                      },
                    }}
                    className="w-full"
                  />
                )}
                {field.type === "virtualTourLink" && (
                  <TextField
                    required={field.required}
                    id={field.type}
                    label={"3D Virtual Property Tour Link"}
                    value={formData[field.type] || ""}
                    onChange={(e) =>
                      handleInputChange(field.type, e.target.value)
                    }
                    variant="outlined"
                    placeholder={`Enter 3D Virtual Property Tour Link`}
                    InputProps={{
                      classes: {
                        root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
                        notchedOutline: "border-gray-300 dark:border-gray-600",
                        focused: "",
                      },
                    }}
                    InputLabelProps={{
                      classes: {
                        root: "text-gray-500 dark:text-gray-400",
                        focused: "text-green-500 dark:text-green-400",
                      },
                    }}
                    className="w-full"
                  />
                )}
                {field.type === "budget" && (
                  <div className="flex flex-col w-full">
                    <TextField
                      required={field.required}
                      id={"price"}
                      label={capitalizeFirstLetter(field.name)}
                      value={formatToCurrency(formData[field.name] ?? 0)}
                      onChange={(e) =>
                        handleInputChangeMoney(field.name, e.target.value)
                      }
                      variant="outlined"
                      placeholder={`Enter ${field.name.replace("-", " ")}`}
                      InputProps={{
                        classes: {
                          root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
                          notchedOutline: "border-gray-300 dark:border-gray-600",
                          focused: "",
                        },
                      }}
                      InputLabelProps={{
                        classes: {
                          root: "text-gray-500 dark:text-gray-400",
                          focused: "text-green-500 dark:text-green-400",
                        },
                      }}
                      className="w-full"
                    />
                  </div>
                )}

                {field.type === "price" && (
                  <div className="flex flex-col w-full">
                    <TextField
                      required={field.required}
                      id={field.name}
                      label={capitalizeFirstLetter(field.name)}
                      value={formatToCurrency(formData[field.name] ?? 0)}
                      onChange={(e) =>
                        handleInputChangeMoney(field.name, e.target.value)
                      }
                      variant="outlined"
                      placeholder={`Enter ${field.name.replace("-", " ")}`}
                      InputProps={{
                        classes: {
                          root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
                          notchedOutline: "border-gray-300 dark:border-gray-600",
                          focused: "",
                        },
                      }}
                      InputLabelProps={{
                        classes: {
                          root: "text-gray-500 dark:text-gray-400",
                          focused: "text-green-500 dark:text-green-400",
                        },
                      }}
                      className="w-full"
                    />
                    <div className="mt-3 bg-white border-gray-300 cursor-pointer dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 text-sm py-2 px-1 rounded-sm border border-gray-300 dark:border-gray-600 w-full">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4">
                        Are you open to negotiation?
                      </h3>
                      <div className="flex items-center space-x-4 mt-2">
                        {["Yes", "No", "Not sure"].map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="negotiable"
                              value={option.toLowerCase()}
                              checked={
                                formData["negotiable"]
                                  ? formData["negotiable"] === option.toLowerCase()
                                  : option.toLowerCase() === "not sure"
                              } // Default to "not sure"
                              onChange={() => {
                                handleInputChange(
                                  "negotiable",
                                  option.toLowerCase()
                                );
                              }}
                              className="hidden peer"
                            />
                            <div className="w-5 h-5 border-2 border-gray-400 rounded-full peer-checked:border-green-500 peer-checked:ring-2 peer-checked:ring-green-400 flex items-center justify-center">
                              {(formData["negotiable"]
                                ? formData["negotiable"] === option.toLowerCase()
                                : option.toLowerCase() === "not sure") && (
                                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                                )}
                            </div>
                            <span
                              className={
                                (
                                  formData["negotiable"]
                                    ? formData["negotiable"] ===
                                    option.toLowerCase()
                                    : option.toLowerCase() === "not sure"
                                )
                                  ? "text-green-500 font-medium"
                                  : "text-gray-600 dark:text-gray-400"
                              }
                            >
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {field.type === "rentprice" && (
                  <div className="flex flex-col w-full">
                    <div className="flex w-full gap-1">
                      <TextField
                        required={field.required}
                        id={"price"}
                        label={capitalizeFirstLetter("price")}
                        value={formatToCurrency(formData["price"] ?? 0)}
                        onChange={(e) =>
                          handleInputChangeMoney("price", e.target.value)
                        }
                        variant="outlined"
                        placeholder={`Enter Price`}
                        InputProps={{
                          classes: {
                            root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
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
                        className="w-full"
                      />
                      <select
                        className="bg-white border-gray-300 cursor-pointer dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 text-sm py-2 px-1 rounded-sm border border-gray-300 dark:border-gray-600 w-[140px] lg:w-[200px]"
                        value={formData["period"] || ""}
                        onChange={(e) =>
                          handleInputChange("period", e.target.value)
                        }
                      >
                        <option value="per month" className="dark:text-gray-400">
                          per month
                        </option>
                        <option value="per day">per day</option>
                        <option value="per month">per month</option>
                        <option value="per quarter-year">per quarter-year</option>
                        <option value="per half-year">per half-year</option>
                        <option value="per year">per year</option>
                      </select>
                    </div>
                    <div className="mt-3 bg-white border-gray-300 cursor-pointer dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 text-sm py-2 px-1 rounded-sm border border-gray-300 dark:border-gray-600 w-full">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4">
                        Are you open to negotiation?
                      </h3>
                      <div className="flex items-center space-x-4 mt-2">
                        {["Yes", "No", "Not sure"].map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="negotiable"
                              value={option.toLowerCase()}
                              checked={
                                formData["negotiable"]
                                  ? formData["negotiable"] === option.toLowerCase()
                                  : option.toLowerCase() === "not sure"
                              } // Default to "not sure"
                              onChange={() => {
                                handleInputChange(
                                  "negotiable",
                                  option.toLowerCase()
                                );
                              }}
                              className="hidden peer"
                            />
                            <div className="w-5 h-5 border-2 border-gray-400 rounded-full peer-checked:border-green-500 peer-checked:ring-2 peer-checked:ring-green-400 flex items-center justify-center">
                              {(formData["negotiable"]
                                ? formData["negotiable"] === option.toLowerCase()
                                : option.toLowerCase() === "not sure") && (
                                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                                )}
                            </div>
                            <span
                              className={
                                (
                                  formData["negotiable"]
                                    ? formData["negotiable"] ===
                                    option.toLowerCase()
                                    : option.toLowerCase() === "not sure"
                                )
                                  ? "text-green-500 font-medium"
                                  : "text-gray-600 dark:text-gray-400"
                              }
                            >
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {field.type === "priceper" && (
                  <div className="flex flex-col w-full">
                    <div className="flex w-full gap-1">
                      <TextField
                        required={field.required}
                        id={"price"}
                        label={capitalizeFirstLetter("price")}
                        value={formatToCurrency(formData["price"] ?? 0)}
                        onChange={(e) =>
                          handleInputChangeMoney("price", e.target.value)
                        }
                        variant="outlined"
                        placeholder={`Enter Price`}
                        InputProps={{
                          classes: {
                            root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
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
                        className="w-full"
                      />
                      <select
                        className="bg-white border-gray-300 cursor-pointer dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 text-sm py-2 px-1 rounded-sm border border-gray-300 dark:border-gray-600 w-[140px] lg:w-[200px]"
                        value={formData["per"] || "Outright Price"}
                        onChange={(e) => handleInputChange("per", e.target.value)}
                      >
                        <option
                          value="Outright Price"
                          className="dark:text-gray-400"
                        >
                          Outright Price...
                        </option>
                        <option value="per acre">per acre</option>
                        <option value="per plot">per plot</option>
                        <option value="per SqF">per SqF</option>
                      </select>
                    </div>
                    <div className="mt-3 bg-white border-gray-300 cursor-pointer dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 text-sm py-2 px-1 rounded-sm border border-gray-300 dark:border-gray-600 w-full">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4">
                        Are you open to negotiation?
                      </h3>
                      <div className="flex items-center space-x-4 mt-2">
                        {["Yes", "No", "Not sure"].map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="negotiable"
                              value={option.toLowerCase()}
                              checked={
                                formData["negotiable"]
                                  ? formData["negotiable"] === option.toLowerCase()
                                  : option.toLowerCase() === "not sure"
                              } // Default to "not sure"
                              onChange={() => {
                                handleInputChange(
                                  "negotiable",
                                  option.toLowerCase()
                                );
                              }}
                              className="hidden peer"
                            />
                            <div className="w-5 h-5 border-2 border-gray-400 rounded-full peer-checked:border-green-500 peer-checked:ring-2 peer-checked:ring-green-400 flex items-center justify-center">
                              {(formData["negotiable"]
                                ? formData["negotiable"] === option.toLowerCase()
                                : option.toLowerCase() === "not sure") && (
                                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                                )}
                            </div>
                            <span
                              className={
                                (
                                  formData["negotiable"]
                                    ? formData["negotiable"] ===
                                    option.toLowerCase()
                                    : option.toLowerCase() === "not sure"
                                )
                                  ? "text-green-500 font-medium"
                                  : "text-gray-600 dark:text-gray-400"
                              }
                            >
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {field.type === "bulkprice" && (
                  <div className="flex flex-col w-full">
                    <div className="flex w-full gap-1">
                      <TextField
                        required={field.required}
                        id={"price"}
                        label={capitalizeFirstLetter("price")}
                        value={formatToCurrency(formData["price"] ?? 0)}
                        onChange={(e) =>
                          handleInputChangeMoney("price", e.target.value)
                        }
                        variant="outlined"
                        placeholder={`Enter Price`}
                        InputProps={{
                          classes: {
                            root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
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
                        className="w-full"
                      />
                      <button
                        onClick={handleOpenPopupBulk}
                        className="text-sm lg:text-base py-3 w-[200px] px-1 rounded-sm text-green-600 bg-green-100 border border-green-600 hover:bg-green-200">
                        <AddOutlinedIcon /> Add Bulk Price
                      </button>


                      {showPopupBulk && (

                        <BulkPriceManager
                          selected={formData["bulkprice"] || []}
                          name={"bulkprice"}
                          onChange={handleInputAutoCompleteChange}
                          handleClosePopupBulk={handleClosePopupBulk}
                        />

                      )}
                    </div>

                    <div className="mt-3 bg-white border-gray-300 cursor-pointer dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 text-sm py-2 px-1 rounded-sm border border-gray-300 dark:border-gray-600 w-full">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4">
                        Are you open to negotiation?
                      </h3>
                      <div className="flex items-center space-x-4 mt-2">
                        {["Yes", "No", "Not sure"].map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="negotiable"
                              value={option.toLowerCase()}
                              checked={
                                formData["negotiable"]
                                  ? formData["negotiable"] === option.toLowerCase()
                                  : option.toLowerCase() === "not sure"
                              } // Default to "not sure"
                              onChange={() => {
                                handleInputChange(
                                  "negotiable",
                                  option.toLowerCase()
                                );
                              }}
                              className="hidden peer"
                            />
                            <div className="w-5 h-5 border-2 border-gray-400 rounded-full peer-checked:border-green-500 peer-checked:ring-2 peer-checked:ring-green-400 flex items-center justify-center">
                              {(formData["negotiable"]
                                ? formData["negotiable"] === option.toLowerCase()
                                : option.toLowerCase() === "not sure") && (
                                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                                )}
                            </div>
                            <span
                              className={
                                (
                                  formData["negotiable"]
                                    ? formData["negotiable"] ===
                                    option.toLowerCase()
                                    : option.toLowerCase() === "not sure"
                                )
                                  ? "text-green-500 font-medium"
                                  : "text-gray-600 dark:text-gray-400"
                              }
                            >
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {field.type === "serviceprice" && (
                  <div className="flex w-full gap-1">
                    <PriceInput
                      priceType_={formData["contact"] || "specify"}
                      unit_={formData["unit"] || "per service"}
                      negotiable_={formData["negotiable"] || "not sure"}
                      onChange={handleInputAutoCompleteChange}
                      price_={formData["price"] || ""}
                    />
                  </div>
                )}
                {field.type === "parcelNumber" && (
                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                      >
                        Parcel / LR Number
                        <span className="ml-1 text-sm text-gray-500">
                          (Optional, but recommended for verification)
                        </span>
                      </label>

                      <div className="flex flex-col items-end">
                        {/* Tooltip */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-green-600 cursor-help text-sm">🔒 Mapa Verified?</span>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="end">
                              <p>✅ We use this to check for land disputes and increase trust with buyers.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* Popup Trigger */}
                        <MapaPricingModal /> {/* ← Inserted here */}
                      </div>
                    </div>

                    {/* Privacy Note */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                      🔐 Your parcel number will be used only for verification and <strong>will not be displayed publicly</strong>.
                    </p>

                    <TextField
                      required={false}
                      id={field.name}
                      label=""
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      variant="outlined"
                      placeholder="Enter parcel/LR number (if available)"
                      InputProps={{
                        classes: {
                          root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
                          notchedOutline: "border-gray-300 dark:border-gray-600",
                          focused: "",
                        },
                      }}
                      InputLabelProps={{
                        classes: {
                          root: "text-gray-500 dark:text-gray-400",
                          focused: "text-green-500 dark:text-green-400",
                        },
                      }}
                      className="w-full"
                    />

                    {/* Badge if parcel number is entered */}
                    {formData[field.name] && (
                      <div className="inline-flex items-center gap-1 text-sm text-green-700 bg-green-100 px-2 py-1 rounded-full mt-1 border border-green-400">
                        🔒 Mapa Verified: Parcel number submitted
                      </div>
                    )}

                    {/* Warning for fake info */}
                    <p className="text-xs text-red-500 mt-1">
                      🚫 Submitting fake parcel numbers may result in suspension or blacklisting.
                    </p>
                  </div>
                )}


                {field.type === "number" && (
                  <>
                    <TextField
                      required={field.required}
                      id={field.name}
                      label={capitalizeFirstLetter(field.name.replace("-", " "))}
                      value={formData[field.name] || 0}
                      onChange={(e) =>
                        handleInputChange(field.name, e.target.value)
                      }
                      variant="outlined"
                      placeholder={`Enter ${field.name.replace("-", " ")}`}
                      InputProps={{
                        classes: {
                          root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
                          notchedOutline: "border-gray-300 dark:border-gray-600",
                          focused: "",
                        },
                      }}
                      InputLabelProps={{
                        classes: {
                          root: "text-gray-500 dark:text-gray-400",
                          focused: "text-green-500 dark:text-green-400",
                        },
                      }}
                      className="w-full"
                    />
                  </>
                )}
                {field.type === "money" && (
                  <>
                    <TextField
                      required={field.required}
                      id={field.name}
                      label={capitalizeFirstLetter(field.name.replace("-", " "))}
                      value={formatToCurrency(formData[field.name] ?? 0)}
                      onChange={(e) =>
                        handleInputChangeMoney(field.name, e.target.value)
                      }
                      variant="outlined"
                      placeholder={`Enter ${field.name.replace("-", " ")}`}
                      InputProps={{
                        classes: {
                          root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
                          notchedOutline: "border-gray-300 dark:border-gray-600",
                          focused: "",
                        },
                      }}
                      InputLabelProps={{
                        classes: {
                          root: "text-gray-500 dark:text-gray-400",
                          focused: "text-emerald-500 dark:text-emerald-400",
                        },
                      }}
                      className="w-full"
                    />
                  </>
                )}
                {field.type === "select" && (
                  <FormControl
                    fullWidth
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#4B5563", // Light mode border
                        },
                        "&:hover fieldset": {
                          borderColor: "#2563EB", // Border on hover
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#2563EB", // Border when focused
                        },
                      },
                    }}
                    className="rounded-md dark:border-gray-600"
                  >
                    <InputLabel className="font-medium text-gray-500 dark:text-gray-400">
                      {capitalizeFirstLetter(field.name.replace("-", " "))}
                      {field.required && <>*</>}
                    </InputLabel>
                    <Select
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        handleInputChange(field.name, e.target.value)
                      }
                      required={field.required}
                      label={capitalizeFirstLetter(field.name.replace("-", " "))}
                      className="dark:text-gray-100 dark:bg-[#2D3236] bg-white"
                    >
                      {field.options?.map((option: any) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {field.type === "year" && (
                  <AutoComplete
                    data={years}
                    name={field.name}
                    onChange={handleInputYearChange}
                    selected={formData[field.name] || ""}
                  />
                )}
                {field.type === "autocomplete" && (
                  <AutoComplete
                    data={field.options}
                    name={field.name}
                    onChange={handleInputAutoCompleteChange}
                    selected={formData[field.name] || ""}
                  />
                )}
                {field.type === "multi-select" && (
                  <div className="w-full flex py-2 px-1 rounded-sm border border-gray-300 dark:border-gray-600 flex-wrap gap-2 dark:bg-[#2D3236] bg-white">
                    <Multiselect
                      features={field.options}
                      name={field.name}
                      selectedFeatures={formData[field.name] || []}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                )}

                {field.type === "radio" && (
                  <div className="w-full flex py-2 px-3 rounded-sm border border-gray-300 dark:border-gray-600 flex-wrap gap-2 dark:bg-[#2D3236] bg-white">
                    <FormControl>
                      <FormLabel className="text-gray-800 dark:text-[#e4ebeb]">
                        {capitalizeFirstLetter(field.name.replace("-", " "))}
                      </FormLabel>
                      <RadioGroup
                        name={field.name}
                        value={formData[field.name]} // Default to the first option
                        //value={formData[field.name] || field.options[0]} // Default to the first option
                        onChange={(e) =>
                          handleInputChange(field.name, e.target.value)
                        }
                        className="space-y-0"
                      >
                        {field.options?.map((option: any, index: number) => (
                          <FormControlLabel
                            key={index}
                            value={option}
                            control={
                              <Radio
                                sx={{
                                  color: "gray", // Unchecked color
                                  "&.Mui-checked": {
                                    color: "green", // Checked color
                                  },
                                }}
                              />
                            }
                            label={option}
                            className="text-gray-800 dark:text-[#e4ebeb]"
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </div>
                )}
                {field.type === "checkbox" &&
                  field.options?.map((option: any, index: number) => (
                    <label key={index}>
                      <input
                        type="checkbox"
                        name={field.name}
                        value={option}
                        onChange={(e) =>
                          handleInputChange(field.name, e.target.value)
                        }
                      />
                      {option}
                    </label>
                  ))}
                {field.type === "textarea" && (
                  <div style={{ width: "100%", height: "300px", borderRadius: "8px", border: "1px", overflow: "hidden" }}>
                    <ReactQuill
                      value={formData[field.name] || ""}
                      onChange={(value) => handleInputChange(field.name, value)}
                      className="bg-white w-full w-[200px] text-black mb-0"
                      modules={modules} // Pass the custom toolbar modules
                      placeholder={`Enter ${capitalizeFirstLetter(field.name.replace("-", " "))}*`}
                      style={{ height: "100%", width: "100%", border: "1px", borderRadius: "8px" }}
                    />
                  </div>
                )}

                {field.type === "phone" && (
                  <div className="flex w-full flex-col">
                    <div className="flex w-full gap-1">

                      {phoneNumber ? (<>

                        <TextField
                          required={field.required}
                          id={field.name}
                          disabled // ⛔ Prevent editing
                          label={`${capitalizeFirstLetter(field.name)} (Verified)`} // ✅ Optional: Indicate it's verified
                          type="tel"
                          value={`${countryCode}${phoneNumber}`}
                          variant="outlined"
                          InputProps={{
                            readOnly: true,
                            classes: {
                              root: "bg-gray-100 dark:bg-[#2D3236] dark:text-gray-100",
                              notchedOutline: "border-green-500",
                              focused: "",
                            },
                          }}
                          InputLabelProps={{
                            classes: {
                              root: "text-green-600 dark:text-green-400",
                              focused: "text-green-600 dark:text-green-400",
                            },
                          }}
                          className="w-full"
                        />
                        <p className="w-[150px] text-green-600 text-sm mt-1">✅ Phone verified</p>
                        {/*     <select
                    className="border-gray-300 dark:border-gray-600 dark:bg-[#2D3236] dark:text-gray-100 text-sm py-2 px-1 rounded-sm border border-gray-300 dark:border-gray-600 w-[140px] lg:w-[200px]"
                    value={countryCode}
                    onChange={handleCountryCodeChange}
                  >
                    <option value="+254">Kenya (+254)</option>
                    <option value="+213">Algeria (+213)</option>
                    <option value="+244">Angola (+244)</option>
                    <option value="+229">Benin (+229)</option>
                    <option value="+267">Botswana (+267)</option>
                    <option value="+226">Burkina Faso (+226)</option>
                    <option value="+257">Burundi (+257)</option>
                    <option value="+237">Cameroon (+237)</option>
                    <option value="+238">Cape Verde (+238)</option>
                    <option value="+236">
                      Central African Republic (+236)
                    </option>
                    <option value="+235">Chad (+235)</option>
                    <option value="+269">Comoros (+269)</option>
                    <option value="+243">
                      Democratic Republic of the Congo (+243)
                    </option>
                    <option value="+253">Djibouti (+253)</option>
                    <option value="+20">Egypt (+20)</option>
                    <option value="+240">Equatorial Guinea (+240)</option>
                    <option value="+291">Eritrea (+291)</option>
                    <option value="+268">Eswatini (+268)</option>
                    <option value="+251">Ethiopia (+251)</option>
                    <option value="+241">Gabon (+241)</option>
                    <option value="+220">Gambia (+220)</option>
                    <option value="+233">Ghana (+233)</option>
                    <option value="+224">Guinea (+224)</option>
                    <option value="+245">Guinea-Bissau (+245)</option>
                    <option value="+225">Ivory Coast (+225)</option>
                    <option value="+266">Lesotho (+266)</option>
                    <option value="+231">Liberia (+231)</option>
                    <option value="+218">Libya (+218)</option>
                    <option value="+261">Madagascar (+261)</option>
                    <option value="+265">Malawi (+265)</option>
                    <option value="+223">Mali (+223)</option>
                    <option value="+222">Mauritania (+222)</option>
                    <option value="+230">Mauritius (+230)</option>
                    <option value="+212">Morocco (+212)</option>
                    <option value="+258">Mozambique (+258)</option>
                    <option value="+264">Namibia (+264)</option>
                    <option value="+227">Niger (+227)</option>
                    <option value="+234">Nigeria (+234)</option>
                    <option value="+242">Republic of the Congo (+242)</option>
                    <option value="+250">Rwanda (+250)</option>
                    <option value="+239">Sao Tome and Principe (+239)</option>
                    <option value="+221">Senegal (+221)</option>
                    <option value="+248">Seychelles (+248)</option>
                    <option value="+232">Sierra Leone (+232)</option>
                    <option value="+252">Somalia (+252)</option>
                    <option value="+27">South Africa (+27)</option>
                    <option value="+211">South Sudan (+211)</option>
                    <option value="+249">Sudan (+249)</option>
                    <option value="+255">Tanzania (+255)</option>
                    <option value="+228">Togo (+228)</option>
                    <option value="+216">Tunisia (+216)</option>
                    <option value="+256">Uganda (+256)</option>
                    <option value="+260">Zambia (+260)</option>
                    <option value="+263">Zimbabwe (+263)</option>
                  </select>

                  <TextField
                    required={field.required}
                    id={field.name}
                    label={capitalizeFirstLetter(field.name)}
                    type="tel"
                    value={phoneNumber}
                    onChange={handleInputChangePhone}
                    variant="outlined"
                    placeholder={`Enter ${field.name}`}
                    InputProps={{
                      classes: {
                        root: "bg-white dark:bg-[#2D3236] dark:text-gray-100",
                        notchedOutline: "border-gray-300 dark:border-gray-600",
                        focused: "",
                      },
                    }}
                    InputLabelProps={{
                      classes: {
                        root: "text-gray-500 dark:text-gray-400",
                        focused: "text-green-500 dark:text-green-400",
                      },
                    }}
                    className="w-full"
                  />
                </div>
                 {phoneError && (
                  <p className="text-red-500 text-sm">{phoneError}</p>
                )}*/}
                      </>) : (<>
                        <div className="p-4">
                          <h1 className="text-xl font-bold mb-4">Verify Your Phone</h1>
                          <PhoneVerification onVerified={handleVerified} />
                        </div>
                      </>)}
                    </div>
                  </div>)}

                {field.type === "delivery" && (
                  <div className="flex flex-col w-full gap-1">
                    <button
                      onClick={handleOpenPopup}
                      className="py-3 w-full px-1 rounded-sm text-green-600 bg-green-100 border border-green-600 hover:bg-green-200">
                      <AddOutlinedIcon /> Add Delivery Option
                    </button>


                    {showPopup && (

                      <DeliveryOptions
                        name={"delivery"}
                        subcategory={selectedSubCategory || ""}
                        onChange={handleInputOnChange}
                        selected={formData["delivery"] || []}
                        onSave={handleSave} // Pass the save handler to the child
                      />

                    )}
                  </div>
                )}
                {field.type === "location" && (
                  <div className="flex flex-col w-full gap-1">
                    <GooglePlacesAutocomplete
                      apiKey={GOOGLE_MAPS_API_KEY}
                      selectProps={{
                        placeholder: "Search location",
                        onChange: handleSelect,
                        styles: {
                          control: (provided) => ({
                            ...provided,
                            padding: '6px',
                            borderRadius: '4px',
                            borderColor: '#ccc',
                            boxShadow: 'none',
                            minHeight: '55px',
                          }),
                          placeholder: (provided) => ({
                            ...provided,
                            color: '#888',
                          }),
                          menu: (provided) => ({
                            ...provided,
                            zIndex: 9999, // ensure it appears on top
                          }),
                        },
                      }}
                      autocompletionRequest={{
                        componentRestrictions: {
                          country: ["KE"], // Limits results to Kenya
                        },
                      }}
                    />
                    {locationError && (
                      <p className="text-red-500 text-sm">{locationError}</p>
                    )}
                  </div>)}

                {field.type === "propertyarea" && (
                  <div className="flex flex-col w-full gap-1">
                    <button
                      onClick={handleOpenPopupArea}
                      className="py-3 w-full px-1 cursor-pointer rounded-sm text-green-600 bg-green-100 border border-green-600 hover:bg-green-200">
                      <AddLocationAltOutlinedIcon />
                      {formData["propertyarea"]?.mapaddress ? (<>
                        {formData["propertyarea"]?.mapaddress}
                      </>) : (<> {(selectedCategory === "Property Services" || selectedCategory === "Wanted Ads") ? (<> Add Location</>) : (<>Add Property Location</>)}</>)}

                    </button>
                    {locationError && (
                      <p className="text-red-500 text-sm">{locationError}</p>
                    )}

                    {showPopupArea && (
                      <div className="fixed inset-0 flex items-center justify-center bg-[#e4ebeb] z-50">



                        <MapDrawingTool
                          name="propertyarea"
                          selectedCategory={selectedCategory}
                          data={formData["propertyarea"] || []}
                          onSave={handleSaveMap}
                          onClose={handleOnClose}
                          onChange={(name, data) => {
                            console.log(data);
                            setMapData(data);
                          }}
                        />
                      </div>
                    )}
                  </div>

                )}
                {field.type === "notify" && (
                  <label className="flex items-center mt-2 mb-2 gap-2 dark:text-gray-400 text-green-600 text-sm">
                    <BellIcon className="w-4 h-4" />
                    {field.options}
                  </label>
                )}
                {formErrors[field.name] && (
                  <p className="text-red-500 text-sm">{formErrors[field.name]}</p>
                )}
              </div>
            ))}

            {type === "Create" && selectedCategory !== 'Wanted Ads' && selectedSubCategory && (
              <>
                <div className="rounded-lg mt-4 p-0">

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
                          const issamepackage = Plan === pack.name;
                          return (
                            <div
                              key={index}
                              className={`mb-2 dark:bg-[#2D3236] border bg-white rounded-lg cursor-pointer ${activePackage === pack
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
                                    (issamepackage && pack.name === "Free" && remainingAds === 0)
                                    ? handleClick(pack)
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
                                      {daysRemaining > 0 && pack.name === Plan ? (
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
                                              remainingAds === 0) ? (
                                            <div>
                                              {/*   <div className="p-0 items-center flex rounded-full bg-grey-50">
                                                <p className="bg-gray-500 border rounded-xl p-2 text-white font-bold text-xs">
                                                  Disabled
                                                </p>
                                              </div>
                                              <div className="text-xs text-gray-400 p-1">
                                                You can&apos;t subscribe to Free Package
                                              </div>
                                              */}
                                            </div>
                                          ) : (
                                            issamepackage &&
                                            pack.name === "Free" &&
                                            remainingAds > 0 && (
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
                                                className={`flex items-center gap-0 ${index !== activeButton ? "hidden" : ""
                                                  }`}
                                              >
                                                <p
                                                  className={`font-semibold ${activePackage === pack
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
                                      className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${activeButton === 0
                                        ? "bg-gradient-to-b from-[#4DCE7A] to-[#30AF5B] text-white p-2 rounded-full"
                                        : "border border-[#30AF5B] text-[#30AF5B] rounded-full p-2"
                                        }`}
                                      onClick={() => handleButtonClick(0, "1 week")}
                                    >
                                      1 week
                                    </button>
                                    <button
                                      className={`mr-2 mb-2 text-xs w-[80px] lg:w-[90px] lg:text-sm ${activeButton === 1
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

                  </div>

                </div>

              </>
            )}

            <button
              disabled={loading}
              onClick={handleSubmit}
              className="py-3 w-full px-1 mt-2 items-center justify-center rounded-sm bg-green-600 text-white hover:bg-green-700">
              <div className="flex w-full justify-center gap-1 items-center">
                {loading && <CircularProgressWithLabel value={uploadProgress} />}

                {loading ? "Submitting..." : `${type} Ad `}
              </div>
            </button>
            <p className="mt-2 mb-2 text-xs text-gray-600 dark:text-gray-500 text-center">
              By clicking on Create Ad, you accept the{" "}
              <span onClick={() => handleOpenTerms()} className="text-green-600 cursor-pointer underline">
                Terms of Use
              </span>
            </p>
          </div>
        </div>


        {loading && (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="justify-center items-center dark:text-gray-300 rounded-lg p-1 lg:p-6 w-full md:max-w-3xl lg:max-w-4xl h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex font-bold gap-1 text-[#D1D5DB] items-center">

              {type === "Update" ? <><CircularProgress sx={{ color: '#D1D5DB' }} />Updating Ad...</> : <><CircularProgress sx={{ color: '#D1D5DB' }} />{createStatus}...</>}
            </div>
          </div>
        </div>)}
      </>)}
    </>
  );
};

export default AdForm;
