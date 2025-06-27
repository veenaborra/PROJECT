import React, { useState, useEffect } from 'react';
import { LuSun, LuSunDim } from "react-icons/lu";

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleDark = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleDark}
      className="px-4 py-2 bg-gray-300 dark:bg-gray-900 text-black dark:text-white rounded"
    >
      {isDark ? (
        <LuSun className="h-6 w-6 text-white transition-all duration-300 ease-in-out" />
      ) : (
        <LuSunDim className="h-6 w-6 text-white transition-all duration-300 ease-in-out" />
      )}
    </button>
  );
};

export default DarkModeToggle;
