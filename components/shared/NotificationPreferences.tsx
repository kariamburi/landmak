"use client";

import { updateNotiPreference } from "@/lib/actions/user.actions";
import { useState, useEffect } from "react";

interface NotificationPreferencesProps {
  userId: string;
  defaultValues?: {
    email: boolean;
    fcm: boolean;
  };
}

export default function NotificationPreferences({
  userId,
  defaultValues = { email: true, fcm: true },
}: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState(defaultValues);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: "email" | "fcm") => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    savePreferences(updated);
  };

  const savePreferences = async (prefs: { email: boolean; fcm: boolean }) => {
    setLoading(true);
    try {
        await updateNotiPreference(userId, prefs);
    } catch (err) {
      console.error("Failed to update notification preferences", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-1 lg:p-4 border rounded-sm shadow-sm bg-white w-full space-y-3">
      <h2 className="text-lg font-semibold text-green-600">Alert Preferences</h2>
      <p className="text-sm text-gray-500">Select how you want to receive notifications:</p>

      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={preferences.email}
            onChange={() => handleChange("email")}
            className="accent-green-600 cursor-pointer"
            disabled={loading}
          />
          <span>Email</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={preferences.fcm}
            onChange={() => handleChange("fcm")}
            className="accent-green-600 cursor-pointer"
            disabled={loading}
          />
          <span>Push Notification</span>
        </label>
      </div>
    </div>
  );
}
