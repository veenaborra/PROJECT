import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../layout/NavBar';
import fetchSubmittedCode  from '../utils/fetchSubmittedCode.js';
import { backend } from '../utils/api';
import { useLocation } from "react-router-dom";

export default function AllSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await backend.get('/allsubmissions', {
          withCredentials: true,
        });
        setSubmissions(res.data);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        alert('Failed to load submissions');
      }
    };
    fetchSubmissions();
  }, []);

  const handleRowClick = async (id) => {
    try {
      const code = await fetchSubmittedCode(id);
      setSelectedCode(code);
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching submission code:', err);
      alert('Failed to load code');
    }
  };

  const closeModal = () => {
    setSelectedCode('');
    setShowModal(false);
  };

  return (
    <div>
      <NavBar />
    <div className="p-6">
     

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
        <thead>
  <tr>
    <th className="px-4 py-3 text-left">User</th>
    <th className="px-4 py-3 text-left">Problem</th>
    <th className="px-4 py-3 text-left">Language</th>
    <th className="px-4 py-3 text-left">Status</th>
    <th className="px-4 py-3 text-left">Submitted At</th>
    <th className="px-4 py-3 text-left">Actions</th>
  </tr>
</thead>
<tbody>
  {submissions.map((submission, index) => (
    <tr
      key={submission._id}
      className={`transition ${
        index % 2 === 0 ? "bg-white" : "bg-gray-100"
      }`}
    >
      <td className="px-4 py-3">{submission.userId?.username || 'Unknown'}</td>
      <td className="px-4 py-3">{submission.problemId?.title || 'Unknown'}</td>
      <td className="px-4 py-3 capitalize text-blue-600 font-medium">
        {submission.language}
      </td>
      <td
        className={`px-4 py-3 font-semibold ${
          submission.result === 'Accepted'
            ? 'text-green-600'
            : 'text-red-500'
        }`}
      >
        {submission.result}
      </td>
      <td className="px-4 py-3 text-gray-600">
        {new Date(submission.submittedAt).toLocaleString()}
      </td>
      <td className="px-4 py-3">
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={() => handleRowClick(submission._id)}
        >
          View Code
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      {/* Code Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Submitted Code</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto max-h-96">
              <code>{selectedCode}</code>
            </pre>
            <button
              className="absolute top-3 right-4 text-gray-600 hover:text-black text-xl"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
