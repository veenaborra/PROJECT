import React from "react"
import { Link } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";


function Home(){
    return (
        <>
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
    
       <main className="flex-grow flex flex-col items-center justify-center px-4 text-center ">
       <h1 className="text-5xl font-extrabold mb-4 text-gray-900 dark:text-white">
          Welcome to <span className="text-blue-600 dark:text-blue-400">AlgoNest</span>!
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-xl">
          Your platform to <strong>Practice</strong>, <strong>Compete</strong>, and <strong>Evolve</strong> as a coder.
        </p>
        <div className="flex gap-4">
          <Link
            to="/signup"
            className="px-6 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-2 rounded border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
          >
            Log In
          </Link>
        </div>
      </main>

       
      
      </div>
        </>
    )
}

export default Home;