import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import NavBar from '../layout/NavBar';
import { useNavigate } from 'react-router-dom';
import { backend } from '../utils/api';

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await backend.get('/submissions');
        
        setSubmissions(res.data.submissions || []);
      } catch (err) {
        console.error('Error fetching submissions:', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSubmissions();
  }, [id]);

 
  return (
    <>
      <NavBar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Your Submissions</h1>

        {loading ? (
          <p>Loading...</p>
        ) : submissions.length === 0 ? (
          <p className="text-gray-600">No submissions yet.</p>
        ) : (<div className="w-full overflow-x-auto">
          <table className="w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b border-gray-300">Problem</th>
                <th className="p-3 border-b border-gray-300">Language</th>
                <th className="p-3 border-b border-gray-300">Status</th>
                <th className="p-3 border-b border-gray-300">Time</th>
                <th className="p-3 border-b border-gray-300">Exec Time</th>
             
              </tr>
            </thead>
            <tbody>
  {submissions.map((s) => (
    <tr
      key={s._id}
      onClick={() => navigate(`/${s.problemId}?submission=${s._id}`)}
      className={`cursor-pointer transition-colors duration-200 ${
        s.status === 'Accepted' ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'
      }`}
    >
      <td className="p-3 border-t border-gray-200">{s.problemTitle || 'Untitled'}</td>
      <td className="p-3 border-t border-gray-200">{s.language.toUpperCase()}</td>
      <td className={`p-3 border-t border-gray-200 font-medium ${
        s.status === 'Accepted' ? 'text-green-600' : 'text-red-600'
      }`}>
        {s.status}
      </td>
      <td className="p-3 border-t border-gray-200">
        {new Date(s.createdAt).toLocaleString()}
      </td>
      <td className="p-3 border-t border-gray-200">{s.executionTime ?? '--'} ms</td>
    
    </tr>
  ))}
</tbody>
          </table>
        </div>
        )}
      </div>
    </>
  );
}
