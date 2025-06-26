import React from 'react'
import { useState,useEffect } from 'react';
import { LuSun,LuSunDim } from "react-icons/lu";


const DarkModeToggle = () => {
    const [isDark,setIsDark]=useState(false);
    useEffect(()=>{
        setIsDark(document.documentElement.classList.contains('dark'));
    },[]);

    const toggleDark = () => {
        document.documentElement.classList.toggle('dark');
        setIsDark(!isDark);
      };
  return (
   <button onClick={toggleDark}
   className='px-4 py-2 bg-gray-300 dark:bg-gray-900 text-black dark:text-white rounded'>
{isDark?<LuSun className='h-6 w-6 text-white'/>:<LuSunDim className='h-6 w-6 text-white transistion-colors duration-300'/>}
   </button>
  )
}

export default DarkModeToggle;