"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {
  createLoan
} from "@/lib/actions/loan.actions";
import { useToast } from "../ui/use-toast";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { formatKsh } from "@/lib/help";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";
import CircularProgress from "@mui/material/CircularProgress";

interface loanProps {
  userId: string;
  userName: string;
  userImage: string;
  ad: any;
  isOpen: boolean;
  onClose: () => void;
}

export const RequestFinancing: React.FC<loanProps> = ({
  ad,
  isOpen,
  userId,
  userImage,
  userName,
  onClose,
}) => {
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [loanterm, setLoanterm] = useState("");
  const [loanType] = useState("Property Financing");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [messageComments, setMessageComments] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const pathname = usePathname();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const truncateDescription = (description: string, charLimit: number) => {
    const safeMessage = sanitizeHtml(description);
    const truncatedMessage =
      safeMessage.length > charLimit
        ? `${safeMessage.slice(0, charLimit)}...`
        : safeMessage;
    return truncatedMessage;
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
    return Number(value.replace(/,/g, ""));
  };

  const handleSubmit = async () => {
    if (!monthlyIncome || !deposit || !loanterm || !employmentStatus) {
      toast({
        variant: "destructive",
        title: "Failed!",
        description:
          !monthlyIncome
            ? "Please enter Monthly Income."
            : !deposit
            ? "Please enter Deposit Amount."
            : !loanterm
            ? "Please select Preferred Loan Term."
            : "Please enter your Employment Status.",
        duration: 5000,
      });
      return;
    }

    try {
      setIsSending(true);

      const newResponse = await createLoan({
        loan: {
          userId,
          adId: ad._id,
          loanType,
          monthlyIncome,
          deposit,
          loanterm,
          employmentStatus,
          messageComments,
          status: "Pending",
        },
        path: pathname,
      });

      if (newResponse === "Property Financing Requested submitted") {
        toast({
          title: "Alert",
          description: newResponse,
          duration: 5000,
          className: "bg-[#30AF5B] text-white",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed!",
          description: newResponse,
          duration: 5000,
        });
      }

      // Reset and close
      setDeposit(0);
      setMonthlyIncome(0);
      setEmploymentStatus("");
      setMessageComments("");
      setLoanterm("");
      onClose();
    } catch (error) {
      console.error("Error submitting loan:", error);
    } finally {
      setIsSending(false);
    }
  };

  const FormContent = (
    <>
      <div className="flex gap-4 w-full items-start">
        <Image
          src={ad.data.imageUrls[0]}
          alt={ad.data.title}
          className="w-[150px] h-[100px] object-cover rounded"
          width={150}
          height={100}
        />
        <div className="flex flex-col justify-between h-full">
          <p className="font-semibold mb-1">
            {ad.data.title.length > 50
              ? `${ad.data.title.substring(0, 50)}...`
              : ad.data.title}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            <span
              dangerouslySetInnerHTML={{
                __html: truncateDescription(ad.data.description ?? "", 65),
              }}
            />
          </p>
          <span className="font-bold text-green-600 dark:text-green-600 mt-1">
            {formatKsh(ad.data.price)}
          </span>
        </div>
      </div>

      {/* Form Fields */}
      {[
        {
          label: "Monthly Income: KES",
          value: monthlyIncome,
          setter: setMonthlyIncome,
        },
        {
          label: "Deposit Amount: KES",
          value: deposit,
          setter: setDeposit,
        },
      ].map(({ label, value, setter }) => (
        <div key={label} className="flex gap-2 items-center w-full mt-2">
          <label className="text-sm w-[200px]">{label}</label>
          <input
            type="text"
            value={formatToCurrency(value)}
            onChange={(e) => setter(parseCurrencyToNumber(e.target.value))}
            className="px-4 py-2 w-full border border-gray-800 rounded-md dark:bg-[#131B1E] dark:text-gray-100"
          />
        </div>
      ))}

      {/* Select Fields */}
      <div className="flex gap-2 items-center w-full mt-2">
        <label className="text-sm w-[200px]">Employment Status:</label>
        <Select onValueChange={setEmploymentStatus}>
          <SelectTrigger className="w-full text-base border p-2 rounded-md dark:text-gray-300 text-gray-700">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent className="text-base">
            <SelectItem value="Employed">Employed</SelectItem>
            <SelectItem value="Self-employed">Self-employed</SelectItem>
            <SelectItem value="Business Owner">Business Owner</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 items-center w-full mt-2">
        <label className="text-sm w-[200px]">Preferred Loan Term:</label>
        <Select onValueChange={setLoanterm}>
          <SelectTrigger className="w-full text-base border p-2 rounded-md dark:text-gray-300 text-gray-700">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent className="text-base">
            {["12", "24", "36", "48", "60"].map((m) => (
              <SelectItem key={m} value={`${m} months`}>
                {m} months
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Textarea
        value={messageComments}
        onChange={(e) => setMessageComments(e.target.value)}
        placeholder="Any comment (optional)"
        maxLength={300}
        className="w-full text-base dark:bg-[#131B1E] dark:text-gray-100 p-2 border rounded-md mt-4"
      />

      <Button
        onClick={handleSubmit}
        disabled={isSending}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md mt-4"
      >
        {isSending ? (
          <div className="flex items-center justify-center gap-2">
            <CircularProgress size={20} color="inherit" />
            Sending...
          </div>
        ) : (
          "Submit Request"
        )}
      </Button>
    </>
  );

  return (
    <>
      {isMobile && isOpen ? (
        <div className="fixed inset-0 z-20 bg-[#e4ebeb] dark:bg-[#222528] dark:text-gray-100 p-4 flex flex-col">
          <div className="flex w-full gap-2 items-center dark:bg-[#131B1E] border-b pb-2">
            <button
              onClick={onClose}
              className="flex justify-center p-2 items-center text-gray-600 dark:text-[#e4ebeb] dark:hover:bg-gray-700 hover:text-green-600 rounded-full"
            >
              <ArrowBackOutlinedIcon />
            </button>
            <p className="font-bold">Financing Request Form</p>
          </div>
          <div className="overflow-y-auto mt-4 flex flex-col gap-3">
            {FormContent}
          </div>
        </div>
      ) : (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Financing Request Form</DialogTitle>
            </DialogHeader>
            <div className="mt-2 flex flex-col gap-3">{FormContent}</div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
