import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../layout/NavBar';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { backend } from '../utils/api';

export default function ProblemTable() {
  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchProblems = async () => {
    try {
      const res = await backend.get('/problems/allproblems');
      setProblems(res.data.problems);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleAdd = () => {
    navigate('/admin/addproblem');
  };

  const handleEdit = (id) => {
    navigate(`/admin/editproblem/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;
    try {
      await backend.delete(`/problems/${id}`, { withCredentials: true });
      fetchProblems();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProblems = problems.filter((problem) =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <NavBar />
      <div className="p-4">
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-4 float-right"
        >
          Add Problem
        </button>

        <div className="mb-6 w-full sm:w-1/2 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or difficulty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border-b">Title</th>
              <th className="p-2 border-b">Difficulty</th>
              <th className="p-2 border-b">Edit</th>
              <th className="p-2 border-b">Delete</th>
            </tr>
          </thead>
          <tbody>
          {filteredProblems.map((problem, index) => (
    <tr
      key={problem._id}
      className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
    >
      <td className="p-2 border-b">{problem.title}</td>
      <td
        className={`p-2 border-b font-semibold ${
          problem.difficulty === 'Easy'
            ? 'text-green-600'
            : problem.difficulty === 'Medium'
            ? 'text-yellow-600'
            : 'text-red-500'
        }`}
      >
        {problem.difficulty}
      </td>
      <td className="p-2 border-b">
        <button
          onClick={() => handleEdit(problem._id)}
          className="text-blue-600 hover:underline text-sm"
        >
          Edit
        </button>
      </td>
      <td className="p-2 border-b">
        <button
          onClick={() => handleDelete(problem._id)}
          className="text-red-600 hover:underline text-sm"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
