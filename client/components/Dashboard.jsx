import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../layout/NavBar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaRegSmileBeam } from "react-icons/fa";
import { RiSparklingLine } from "react-icons/ri";

export default function Dashboard() {
  const { id, role, user } = useAuth(); // assuming user object has stats
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGuestProblems = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/problems/allproblems');
        setProblems(res.data.problems);
      } catch (err) {
        console.log('Error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!id) fetchGuestProblems();
    else setLoading(false); // no need to fetch if logged in
  }, [id]);

  const handleRowClick = (id) => navigate(`/practiceproblems/${id}`);

  const renderGuestTable = () => (
    <>
      <h2 className="text-xl font-bold mb-4">Explore Problems</h2>
      <table className="min-w-full bg-white border border-gray-300 rounded-md">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border-b">Title</th>
            <th className="p-2 border-b">Difficulty</th>
            <th className="p-2 border-b">Tags</th>
            <th className="p-2 border-b">Type</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem._id} onClick={() => handleRowClick(problem._id)} className="hover:bg-gray-50 cursor-pointer">
              <td className="p-2 border-b">{problem.title}</td>
              <td className="p-2 border-b">{problem.difficulty}</td>
              <td className="p-2 border-b">
                {problem.tags?.map((tag, i) => (
                  <span key={i} className="inline-block bg-gray-200 text-xs px-2 py-1 rounded mr-1">
                    {tag}
                  </span>
                ))}
              </td>
              <td className="p-2 border-b">
                {problem.points === 0 ? (
                  <span className="text-gray-600">Practice</span>
                ) : (
                  <span className="text-green-600 font-semibold">Rated</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const renderUserStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Problems Solved</h3>
        <p className="text-3xl font-bold text-blue-600">{user?.solvedCount ?? 0}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Total Attempts</h3>
        <p className="text-3xl font-bold text-yellow-600">{user?.attempts ?? 0}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Current Rating</h3>
        <p className="text-3xl font-bold text-green-600">{user?.rating ?? 'Unrated'}</p>
      </div>
    </div>
  );

  return (
    <>
      <NavBar />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">
          {id ? 
<span>
  Welcome back, {user?.username ?? 'User'} <FaRegSmileBeam className="inline text-yellow-500" />
</span>:<span>
  Explore AlgoNest <RiSparklingLine className="inline text-yellow-500"  />
</span>}
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : id ? (
          renderUserStats()
        ) : (
          <>
            {renderGuestTable()}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Want to track your progress?{' '}
                <a href="/signup" className="text-blue-600 font-medium hover:underline">
                  Sign up now!
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
