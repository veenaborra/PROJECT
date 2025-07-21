import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../layout/NavBar';

export default function AllSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/allsubmissions', {
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
      const res = await axios.get(`http://localhost:8000/api/submissions/${id}`, {
        withCredentials: true,
      });
      setSelectedCode(res.data.code);
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
          <thead className="bg-gray-50 text-sm font-medium text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Problem</th>
              <th className="px-4 py-3 text-left">Language</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Submitted At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {submissions.length > 0 ? (
              submissions.map((submission) => (
                <tr
                  key={submission._id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => handleRowClick(submission._id)}
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No submissions found.
                </td>
              </tr>
            )}
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
