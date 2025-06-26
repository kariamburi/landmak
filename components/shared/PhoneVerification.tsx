"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase"; // Make sure this is the modular `getAuth()` instance
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";

// Extend `window` to include recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

export default function PhoneVerification({
  onVerified,
}: {
  onVerified: (phone: string) => void;
}) {
  const [countryCode, setCountryCode] = useState("+254");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize reCAPTCHA once
  useEffect(() => {
    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            // reCAPTCHA solved
          },
          "expired-callback": () => {
            console.warn("reCAPTCHA expired");
          },
        }
      );

      verifier.render().then(() => {
        window.recaptchaVerifier = verifier;
      });
    }
  }, []);

  const sendOtp = async () => {
    setError("");
    const fullPhone = `${countryCode}${phone.trim()}`;

    if (!phone.match(/^\d{7,12}$/)) {
      setError("Enter a valid phone number.");
      return;
    }

    if (!window.recaptchaVerifier) {
      setError("reCAPTCHA is not ready. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithPhoneNumber(
        auth,
        fullPhone,
        window.recaptchaVerifier
      );
      setConfirmResult(result);
    } catch (err: any) {
      console.log(err);
      setError("Failed to send OTP. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!confirmResult) return;
    setError("");
    setLoading(true);
    try {
      const res = await confirmResult.confirm(otp);
      onVerified(res.user.phoneNumber || "");
    } catch (err: any) {
      console.error(err);
      setError("Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-1 w-full space-y-4">
      {!confirmResult ? (
        <>
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="border px-2 py-2 rounded"
            >
              <option value="+254">Kenya (+254)</option>
              <option value="+255">Tanzania (+255)</option>
              <option value="+256">Uganda (+256)</option>
              <option value="+250">Rwanda (+250)</option>
              {/* Add more country codes as needed */}
            </select>
            <input
              className="flex-1 border px-2 py-2 rounded"
              placeholder="712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div
              onClick={() => {
                if (!loading) sendOtp();
              }}
              className="flex cursor-pointer justify-center items-center w-[150px] bg-black text-white py-2 rounded"
            >
              {loading ? "Sending..." : "Send OTP"}
            </div>
          </div>
        </>
      ) : (
        <>
          <input
            className="w-full border px-2 py-2 rounded"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <div
            onClick={() => {
              if (!loading) verifyOtp();
            }}
            className="flex cursor-pointer justify-center items-center w-[150px] bg-green-600 text-white py-2 rounded"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </div>
        </>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div id="recaptcha-container" />
    </div>
  );
}
