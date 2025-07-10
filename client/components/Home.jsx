import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../layout/NavBar";


function Home() {
  return (
    <>
    <NavBar></NavBar>
    <div className="min-h-screen flex flex-col bg-white transition-colors duration-300 px-4">
     

      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl md:text-5xl  font-extrabold mb-4 text-gray-900">
          Welcome to <span className="text-blue-600">AlgoNest</span>!
        </h1>

        <p className="text-lg text-gray-700 mb-8 max-w-xl">
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
            className="px-6 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
          >
            Log In
          </Link>
        </div>
      </main>
    </div>
    </> );
}

export default Home;
