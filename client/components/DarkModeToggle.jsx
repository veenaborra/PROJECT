import React, { useState, useEffect } from 'react';
import { LuSun, LuSunDim } from "react-icons/lu";
import { useTheme } from '../context/Themecontext.jsx';

const DarkModeToggle = () => {
 
const {theme,toggleTheme}=useTheme();
 
const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
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
