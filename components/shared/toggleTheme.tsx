"use client";

import React, { useEffect, useState } from "react";

const ToggleTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark"; // Default to "dark"
    const isDark = savedTheme === "dark";
    
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    if (isDarkMode === null) return; // Prevent running on initial mount

    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  if (isDarkMode === null) return null; // Avoid flickering before state is set

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium text-gray-300">
        {isDarkMode ? "Dark Mode" : "Light Mode"}
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isDarkMode}
          onChange={() => setIsDarkMode(!isDarkMode)}
        />
        <div className="w-11 h-6 bg-[#e4ebeb] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer dark:bg-gray-700 peer-checked:bg-primary"></div>
        <div className="absolute left-1 top-1 w-4 h-4 bg-[#131B1E] rounded-full transition-transform peer-checked:translate-x-5"></div>
      </label>
    </div>
  );
};

export default ToggleTheme;
