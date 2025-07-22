import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../layout/NavBar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaRegSmileBeam } from "react-icons/fa";
import { RiSparklingLine } from "react-icons/ri";
import { BsFire } from "react-icons/bs";
import { PiConfettiBold } from "react-icons/pi";
import { backend } from '../utils/api';
import { publicBackend } from '../utils/api';

export default function Dashboard() {
  const { id, role ,username} = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    const fetchGuestProblems = async () => {
      try {
        const res = await publicBackend.get('/problems/allproblems');
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
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await backend.get('/user/stats');
        setUserStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    if (id) fetchStats();
  }, [id]);
  

  const handleRowClick = (id) => navigate(`/${id}`);

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
  const renderUserStats = () => {
    if (!userStats) return <p>Loading stats...</p>;
  
    const {
      solvedCount = 0,
      attempts = 0,
      rating = 0,
      streakCount = 0,
      accuracy = 'N/A',
      tier = 'Newbie'
    } = userStats;
  
    const getTierColor = (tier) => {
      switch (tier) {
        case 'Legend': return 'text-amber-600';
        case 'Ruby': return 'text-red-600';
        case 'Diamond': return 'text-purple-600';
        case 'Platinum': return 'text-blue-600';
        case 'Gold': return 'text-yellow-500';
        case 'Silver': return 'text-gray-400';
        case 'Bronze': return 'text-orange-400';
        default: return 'text-gray-600';
      }
    };
  
    const getNextTierInfo = (rating) => {
      const tiers = [
        { name: 'Newbie', min: 0 },
        { name: 'Bronze', min: 200 },
        { name: 'Silver', min: 400 },
        { name: 'Gold', min: 700 },
        { name: 'Platinum', min: 1000 },
        { name: 'Diamond', min: 1400 },
        { name: 'Ruby', min: 1700 },
        { name: 'Legend', min: 2000 },
      ];
  
      for (let i = 0; i < tiers.length - 1; i++) {
        if (rating < tiers[i + 1].min) {
          return {
            nextTier: tiers[i + 1].name,
            pointsToNext: tiers[i + 1].min - rating,
          };
        }
      }
  
      return { nextTier: null, pointsToNext: 0 };
    };
  
    const { nextTier, pointsToNext } = getNextTierInfo(rating);
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Problems Solved</h3>
          <p className="text-3xl font-bold text-blue-600">{solvedCount}</p>
        </div>
  
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Total Attempts</h3>
          <p className="text-3xl font-bold text-yellow-600">{attempts}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Rating</h3>
          <p className="text-3xl font-bold text-green-600">{rating}</p>
  
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>0</span>
            <span>2000</span>
          </div>
  
          <div className="h-2 bg-gray-200 rounded-full mt-2">
            <div
              className="h-2 bg-green-500 rounded-full"
              style={{ width: `${Math.min((rating / 2000) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
  
        <div className="bg-white shadow rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-1"> Streak <BsFire className="text-orange-500" /></h3>
          <p className="text-3xl font-bold text-red-500">{streakCount}</p>
        </div>
  
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Accuracy</h3>
          <p className="text-3xl font-bold text-purple-600">{accuracy}%</p>
        </div>
  
       
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Tier</h3>
          <p className={`text-3xl font-bold ${getTierColor(tier)}`}>{tier}</p>
  
          {pointsToNext > 0 ? (
            <p className="mt-2 text-sm text-gray-500">
              {pointsToNext} more points to reach{' '}
              <span className={`font-semibold ${getTierColor(nextTier)}`}>{nextTier}</span>
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-500">  <PiConfettiBold className="inline text-yellow-500 mr-1" /> You've reached the highest tier!</p>
          )}
        </div>
      </div>
    );
  };
  
  

  return (
    <>
      <NavBar />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">
          {id ? 
<span>
  Welcome back, {username?username:'User'} <FaRegSmileBeam className="inline text-yellow-500" />
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
