import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../layout/NavBar";

function Home() {
  return (
    <>
      <NavBar />

      <div className="min-h-screen flex flex-col bg-white text-gray-800 px-4">
        <main className="flex-grow flex flex-col items-center justify-center text-center py-20 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 leading-tight">
            Welcome to <span className="text-blue-600">AlgoNest</span>
          </h1>

          <p className="text-lg text-gray-700 mb-8 max-w-2xl">
            The ultimate online judge to <strong>Practice</strong>, <strong>Compete</strong>, and <strong>Grow</strong> as a coder.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 text-left w-full">
            <Feature title="Practice Problems" desc="Sharpen your skills with categorized problems from easy to expert." />
            <Feature title="Rated Problems" desc="Solve challenging problems that contribute to your global rating." />
            <Feature title="Built-in Code Editor" desc="Write and run code in our editor with support for Cpp — more languages coming soon!"/>
            <Feature title="Submissions & History" desc="Track your submissions, view results, and learn from past attempts." />
            <Feature title="Leaderboard(coming soon)" desc="Climb the ranks and compare your performance with others." />
            <Feature  title="AI Code Review"  desc="Get instant, intelligent feedback on your code for correctness, style, and optimization tips."/>

          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold transition"
            >
              Log In
            </Link>
            <Link to="/dashboard" className="px-6 py-3 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold transition"
>
  Explore
</Link>

          </div>
        </main>
      </div>
    </>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition duration-300">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

export default Home;
