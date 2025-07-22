import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBar from '../layout/NavBar';
import { backend } from '../utils/api';

export default function AdminDashboard() {
  const [problemCount, setProblemCount] = useState(0);
  const [submissionCount, setSubmissionCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const problemRes = await backend.get('/problems/count');
        const submissionRes = await backend.get('/submissions/count');

        setProblemCount(problemRes.data.count);
        setSubmissionCount(submissionRes.data.count);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:',err.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
    <NavBar />

    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      
        <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-gray-800">Total Problems</h3>
          <p className="text-4xl font-bold text-blue-600 mt-4">{problemCount}</p>
          <Link
            to="/admin/manageproblems"
            className="mt-4 block text-blue-500 hover:underline transition"
          >
            Manage Problems
          </Link>
        </div>

      
        <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-gray-800">Total Submissions</h3>
          <p className="text-4xl font-bold text-green-600 mt-4">{submissionCount}</p>
          <Link
            to="/admin/allsubmissions"
            className="mt-4 block text-blue-500 hover:underline transition"
          >
            View Submissions
          </Link>
        </div>

       
        <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Add New Problem</h3>
            <p className="text-sm text-gray-500 mt-2">
              Create and publish a new problem
            </p>
          </div>
          <Link
            to="/admin/addproblem"
            className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-full transition"
          >
            Add Problem
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
}
