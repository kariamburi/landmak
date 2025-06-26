"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import CircularProgress from "@mui/material/CircularProgress";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IUser } from "@/lib/database/models/user.model";
import { UserDefaultValues } from "@/constants";
import { UserFormSchema } from "@/lib/validator";
import { updateUserFromSettings, updateUserPhone } from "@/lib/actions/user.actions";
import { useToast } from "@/components/ui/use-toast";
import { TextField } from "@mui/material";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { useUploadThing } from "@/lib/uploadthing";
import { FileuploaderBusiness } from "./FileuploaderBusiness";
import { verificationStatus } from "@/lib/actions/verificationstatus";
import PhoneVerification from "./PhoneVerification";

type setingsProp = {
  type: "Create" | "Update";
  user?: IUser;
  userId?: string;
};

type Businesshours = {
  openHour: string;
  openMinute: string;
  closeHour: string;
  closeMinute: string;
};

const SettingsEdit = ({ user, type, userId }: setingsProp) => {
  //const initialValues = user;
  const { toast } = useToast();

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("OrderTrackingId")) {
      const orderTrackingId = query.get("OrderTrackingId");
      console.log(orderTrackingId);
      // Retrieve transaction values from session storage
      const plan = sessionStorage.getItem("plan");
      const period = sessionStorage.getItem("period");
      const amount = parseInt(sessionStorage.getItem("amount") || "0");
      const planId = sessionStorage.getItem("planId");
      const buyerId = sessionStorage.getItem("buyerId");
      const phone = sessionStorage.getItem("phone");
      const firstName = sessionStorage.getItem("firstName");
      const middleName = sessionStorage.getItem("middleName");
      const lastName = sessionStorage.getItem("lastName");
      const email = sessionStorage.getItem("email");

      const transaction = {
        plan: plan,
        amount: amount,
        period: period,
        planId: planId,
        buyerId: buyerId,
        phone: phone,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        email: email,
        orderTrackingId: orderTrackingId || "", // Provide a default value if null
      };

      //  alert(JSON.stringify(transaction));
      const checkstatus = async ({ transaction }: any) => {
        console.log("TRA***********: " + transaction);

        const response = await verificationStatus(transaction);

        if (response === "success") {
          console.log("RESPONSE    " + response);
          toast({
            title: "Verification successful!",
            description: "You will receive an email confirmation",
            duration: 5000,
            className: "bg-[#30AF5B] text-white",
          });

          router.push("/settings/");
        } else if (response === "failed") {
          toast({
            variant: "destructive",
            title: "Verification canceled!",
            description:
              "Continue to shop around and checkout when you're ready",
            duration: 5000,
          });
        }
      };
      checkstatus({ transaction });
    }
  }, []);

  const [countryCode, setCountryCode] = useState(
    user?.phone ? user.phone.substring(0, 4) : "+254"
  ); // Default country code

  const [phoneNumber, setPhoneNumber] = useState(
    user?.phone ? user.phone.substring(user.phone.length - 9) : ""
  );
  const [countryCodeWhatsapp, setCountryCodeWhatsapp] = useState(
    user?.whatsapp ? user?.whatsapp.substring(0, 4) : "+254"
  ); // Default country code
  const [whatsappNumber, setWhatsappNumber] = useState(
    user?.whatsapp ? user?.whatsapp.substring(user?.whatsapp.length - 9) : ""
  );
  const router = useRouter();
  const initialValues =
    user && type === "Update"
      ? {
        ...user,
      }
      : UserDefaultValues;
  const [selectedDays, setSelectedDays] = useState<string[]>(
    user?.businessworkingdays ?? []
  );
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");
  const [startHour, setStartHour] = useState(
    user?.businesshours?.[0]?.openHour ?? "09"
  );

  const [startMinute, setStartMinute] = useState(
    user?.businesshours?.[0]?.openMinute ?? "00"
  );

  const [endHour, setEndHour] = useState(
    user?.businesshours?.[0]?.closeHour ?? "17"
  );

  const [endMinute, setEndMinute] = useState(
    user?.businesshours?.[0]?.closeMinute ?? "00"
  );
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof UserFormSchema>) {
    if (type === "Update") {
      try {
        if (!userId) {
          router.back();
          return;
        }
        let uploadedImageUrl = values.imageUrl;

        if (files.length > 0) {
          await Promise.all(
            files.map(async (file: File) => {
              try {
                const uploadedImages = await startUpload([file]);
                if (uploadedImages && uploadedImages.length > 0) {
                  // uploadedImageUrl.push(uploadedImages[0].url);
                  uploadedImageUrl = uploadedImages[0].url;
                  //   alert(uploadedImages[0].url);
                }
              } catch (error) {
                console.error("Error uploading file:", error);
              }
            })
          );

          //  alert(uploadedImages[0].url);
        }
        //   alert(countryCode + removeLeadingZero(phoneNumber));
        //form.setValue("phone", fullPhoneNumber); // Reset constituency value
        const updatedUser = await updateUserFromSettings({
          user: {
            ...values,
            imageUrl: uploadedImageUrl,
            // phone: phoneNumber
            // ? countryCode + removeLeadingZero(phoneNumber)
            //  : "",
            whatsapp: whatsappNumber
              ? countryCodeWhatsapp + removeLeadingZero(whatsappNumber)
              : "",
            businesshours: [
              {
                openHour: startHour,
                openMinute: startMinute,
                closeHour: endHour,
                closeMinute: endMinute,
              },
            ],
            _id: userId,
          },
          path: `/settings/`,
        });

        if (updatedUser) {
          // form.reset();
          // router.push(`/settings/`);
          toast({
            title: "Successful!",
            description: "You have updated your details successfully",
            duration: 5000,
            className: "bg-[#30AF5B] text-white",
          });
          // router.push(`/categories`);
        }
      } catch (error) {
        console.log(error);
      }
    }
    // console.log(values);
  }

  const handleDayToggle = (day: string) => {
    if (selectedDays.includes(day)) {
      const noofdays = selectedDays.filter((d: any) => d !== day);
      form.setValue("businessworkingdays", noofdays); // Reset constituency value
      setSelectedDays(noofdays);
    } else {
      const noofdays = [...selectedDays, day];
      form.setValue("businessworkingdays", noofdays); // Reset constituency value
      setSelectedDays(noofdays);
    }
  };

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

  const handleCountryCodeChange = (e: any) => {
    setCountryCode(e.target.value);
  };

  const handleInputChange = (e: any) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    setPhoneNumber(formatted);
  };

  const handleCountryCodeChangeWhatsapp = (e: any) => {
    setCountryCodeWhatsapp(e.target.value);
  };

  const handleInputChangeWhatsapp = (e: any) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    setWhatsappNumber(formatted);
  };
  const fullPhoneNumber = countryCode + removeLeadingZero(phoneNumber);

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
  const [changePhone, setChangePhone] = useState(false);
  const handleVerified = async (phone: string) => {

    await updateUserPhone(userId || '', phone);
    const cleanNumber = phone.startsWith('+') ? phone.slice(1) : phone;
    const countryCode = cleanNumber.slice(0, 3);
    const localNumber = cleanNumber.slice(3);
    setCountryCode('+' + countryCode)
    setPhoneNumber(localNumber)
    setChangePhone(false)
    // You can now save the verified phone to your database
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-0 flex flex-col"
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Personal Details</AccordionTrigger>
            <AccordionContent>
              <div className="rounded-[20px] p-1 dark:bg-[#131B1E] bg-white">
                <div className="m-1">
                  <div className="flex flex-col gap-5 mb-5 md:flex-row">
                    <SignedIn>
                      <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                  </div>

                  <div className="flex flex-col gap-5 mb-5 md:flex-row gap-1">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <TextField
                              {...field}
                              label="firstName"
                              variant="outlined"
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <TextField
                              {...field}
                              variant="outlined"
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
                              label="LastName"
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 mb-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <TextField
                              {...field}
                              variant="outlined"
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
                              label="Personal Email"
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Contacts details</AccordionTrigger>
            <AccordionContent>
              <div className="p-1 rounded-[20px] m-0 dark:bg-[#131B1E] bg-white">
                <div className="m-1">
                  <div className="flex flex-col gap-5 mb-5 md:flex-row">


                    {phoneNumber && !changePhone ? (<>

                      <TextField
                        disabled // ⛔ Prevent editing
                        label={`Phone (Verified)`} // ✅ Optional: Indicate it's verified
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
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-green-600 text-sm">✅ Phone verified</p>
                        <button
                          type="button"
                          onClick={() => setChangePhone(true)}
                          className="text-blue-600 text-sm underline ml-2"
                        >
                          Change
                        </button>
                      </div>

                    </>) : (<>
                      <div className="p-4">
                        <h1 className="text-xl font-bold mb-4">Verify Your Phone</h1>
                        <PhoneVerification onVerified={handleVerified} />
                      </div>
                    </>)}

                  </div>

                  <div className="flex flex-col gap-5 mb-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="flex w-full gap-1">
                              <select
                                className="dark:bg-[#2D3236] dark:text-gray-100 bg-gray-100 p-1 text-sm lg:text-base border ml-2 rounded-sm w-[120px]"
                                value={countryCodeWhatsapp}
                                onChange={handleCountryCodeChangeWhatsapp}
                              >
                                <option value="+254">Kenya (+254)</option>
                                <option value="+213">Algeria (+213)</option>
                                <option value="+244">Angola (+244)</option>
                                <option value="+229">Benin (+229)</option>
                                <option value="+267">Botswana (+267)</option>
                                <option value="+226">
                                  Burkina Faso (+226)
                                </option>
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
                                <option value="+240">
                                  Equatorial Guinea (+240)
                                </option>
                                <option value="+291">Eritrea (+291)</option>
                                <option value="+268">Eswatini (+268)</option>
                                <option value="+251">Ethiopia (+251)</option>
                                <option value="+241">Gabon (+241)</option>
                                <option value="+220">Gambia (+220)</option>
                                <option value="+233">Ghana (+233)</option>
                                <option value="+224">Guinea (+224)</option>
                                <option value="+245">
                                  Guinea-Bissau (+245)
                                </option>
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
                                <option value="+242">
                                  Republic of the Congo (+242)
                                </option>
                                <option value="+250">Rwanda (+250)</option>
                                <option value="+239">
                                  Sao Tome and Principe (+239)
                                </option>
                                <option value="+221">Senegal (+221)</option>
                                <option value="+248">Seychelles (+248)</option>
                                <option value="+232">
                                  Sierra Leone (+232)
                                </option>
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
                                {...field}
                                label="Whatsapp number"
                                type="tel"
                                value={whatsappNumber}
                                onChange={handleInputChangeWhatsapp}
                                variant="outlined"
                                InputProps={{
                                  classes: {
                                    root: "dark:bg-[#2D3236] dark:text-gray-100",
                                    notchedOutline:
                                      "border-gray-300 dark:border-gray-600",
                                    focused: "",
                                  },
                                }}
                                InputLabelProps={{
                                  classes: {
                                    root: "text-gray-500 dark:text-gray-400",
                                    focused:
                                      "text-green-500 dark:text-green-400",
                                  },
                                }}
                                className="w-full"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Business details</AccordionTrigger>
            <AccordionContent>
              <div className="rounded-[20px] p-1 dark:bg-[#131B1E] bg-white">
                <div className="m-1">
                  <div className="flex flex-col gap-5 mb-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl className="h-72">
                            <FileuploaderBusiness
                              onFieldChange={field.onChange}
                              imageUrl={field?.value ?? ""}
                              setFiles={setFiles}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 mb-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="businessname"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <TextField
                              {...field}
                              label="Business Name"
                              variant="outlined"
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 mb-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="aboutbusiness"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <TextField
                              {...field}
                              multiline
                              rows={5} // You can adjust this number based on your preference
                              label="About Business*"
                              variant="outlined"
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 mb-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="businessaddress"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <TextField
                              {...field}
                              label="Business Address"
                              variant="outlined"
                              InputProps={{
                                classes: {
                                  root: "dark:bg-[#2D3236] dark:text-gray-100",
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 mb-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <TextField
                              {...field}
                              label="Latitude"
                              variant="outlined"
                              InputProps={{
                                classes: {
                                  root: "dark:bg-[#2D3236] dark:text-gray-100",
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <TextField
                              {...field}
                              label="Longitude"
                              variant="outlined"
                              InputProps={{
                                classes: {
                                  root: "dark:bg-[#2D3236] dark:text-gray-100",
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 mb-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="businesshours"
                      render={({ field }) => (
                        <FormItem className="w-full gap-2">
                          <FormControl>
                            <div className="w-full flex flex-col">
                              <div className="w-full flex gap-1 mb-2">
                                <label>Office Open Time:</label>

                                <select
                                  className="dark:bg-[#2D3236] dark:text-gray-100 bg-gray-100 p-1 border ml-2 rounded-sm"
                                  value={startHour}
                                  onChange={(e) => setStartHour(e.target.value)}
                                >
                                  {Array.from({ length: 24 }, (_, i) => i).map(
                                    (hour) => (
                                      <option
                                        key={hour}
                                        value={hour.toString().padStart(2, "0")}
                                      >
                                        {hour.toString().padStart(2, "0")}
                                      </option>
                                    )
                                  )}
                                </select>
                                <select
                                  className="dark:bg-[#2D3236] dark:text-gray-100 bg-gray-100 p-1 border ml-2 mr-2 rounded-sm"
                                  value={startMinute}
                                  onChange={(e) =>
                                    setStartMinute(e.target.value)
                                  }
                                >
                                  {Array.from({ length: 60 }, (_, i) => i).map(
                                    (minute) => (
                                      <option
                                        key={minute}
                                        value={minute
                                          .toString()
                                          .padStart(2, "0")}
                                      >
                                        {minute.toString().padStart(2, "0")}
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>
                              <div className="w-full flex gap-1">
                                <label>Office Close Time:</label>
                                <select
                                  className="dark:bg-[#2D3236] dark:text-gray-100 bg-gray-100 p-1 border ml-2 rounded-sm"
                                  value={endHour}
                                  onChange={(e) => setEndHour(e.target.value)}
                                >
                                  {Array.from({ length: 24 }, (_, i) => i).map(
                                    (hour) => (
                                      <option
                                        key={hour}
                                        value={hour.toString().padStart(2, "0")}
                                      >
                                        {hour.toString().padStart(2, "0")}
                                      </option>
                                    )
                                  )}
                                </select>
                                <select
                                  className="dark:bg-[#2D3236] dark:text-gray-100 bg-gray-100 p-1 border ml-2 rounded-sm"
                                  value={endMinute}
                                  onChange={(e) => setEndMinute(e.target.value)}
                                >
                                  {Array.from({ length: 60 }, (_, i) => i).map(
                                    (minute) => (
                                      <option
                                        key={minute}
                                        value={minute
                                          .toString()
                                          .padStart(2, "0")}
                                      >
                                        {minute.toString().padStart(2, "0")}
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 mb-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="businessworkingdays"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div>
                              <label>Choose Working Days:</label>

                              <>
                                <div className="flex gap-1 w-full items-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedDays.includes("Sunday")}
                                    onChange={() => handleDayToggle("Sunday")}
                                  />
                                  <label>Sunday</label>
                                </div>
                                <div className="flex gap-1 w-full items-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedDays.includes("Monday")}
                                    onChange={() => handleDayToggle("Monday")}
                                  />
                                  <label>Monday</label>
                                </div>
                                <div className="flex gap-1 w-full items-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedDays.includes("Tuesday")}
                                    onChange={() => handleDayToggle("Tuesday")}
                                  />
                                  <label>Tuesday</label>
                                </div>
                                <div className="flex gap-1 w-full items-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedDays.includes("Wednesday")}
                                    onChange={() =>
                                      handleDayToggle("Wednesday")
                                    }
                                  />
                                  <label>Wednesday</label>
                                </div>
                                <div className="flex gap-1 w-full items-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedDays.includes("Thursday")}
                                    onChange={() => handleDayToggle("Thursday")}
                                  />
                                  <label>Thursday</label>
                                </div>
                                <div className="flex gap-1 w-full items-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedDays.includes("Friday")}
                                    onChange={() => handleDayToggle("Friday")}
                                  />
                                  <label>Friday</label>
                                </div>
                                <div className="flex gap-1 w-full items-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedDays.includes("Saturday")}
                                    onChange={() => handleDayToggle("Saturday")}
                                  />
                                  <label>Saturday</label>
                                </div>
                              </>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Social Media</AccordionTrigger>
            <AccordionContent>
              <div className="p-1 rounded-[20px] m-0 dark:bg-[#131B1E] bg-white">
                <div className="m-1">
                  <div className="flex flex-col gap-5 mb-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="facebook"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <TextField
                              {...field}
                              label="facebook link"
                              variant="outlined"
                              InputProps={{
                                classes: {
                                  root: "dark:bg-[#2D3236] dark:text-gray-100",
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 mb-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <TextField
                              {...field}
                              label="twitter link"
                              variant="outlined"
                              InputProps={{
                                classes: {
                                  root: "dark:bg-[#2D3236] dark:text-gray-100",
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 mb-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <TextField
                              {...field}
                              label="instagram link"
                              variant="outlined"
                              InputProps={{
                                classes: {
                                  root: "dark:bg-[#2D3236] dark:text-gray-100",
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 mb-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="tiktok"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <TextField
                              {...field}
                              label="tiktok link"
                              variant="outlined"
                              InputProps={{
                                classes: {
                                  root: "dark:bg-[#2D3236] dark:text-gray-100",
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-5 mb-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <TextField
                              {...field}
                              label="Website"
                              variant="outlined"
                              InputProps={{
                                classes: {
                                  root: "dark:bg-[#2D3236] dark:text-gray-100",
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          <div className="flex gap-1 items-center">
            {form.formState.isSubmitting && (
              <CircularProgress sx={{ color: "white" }} size={30} />
            )}
            {form.formState.isSubmitting ? "Submitting..." : `${type} User `}
          </div>
        </Button>
      </form>
    </Form>
  );
};

export default SettingsEdit;
