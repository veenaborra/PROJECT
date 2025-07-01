import React, { useState, useEffect } from 'react';
import NavBar from '../layout/NavBar';
import Editor from "@monaco-editor/react";
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function SpecificProblem() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('// Write your code here');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/problems/${id}`, {
          withCredentials: true,
        });
        console.log("API Response:", res.data);
        setProblem(res.data);
      } catch (error) {
        console.error("Error fetching problem:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!problem) return <p>Problem not found.</p>;

  return (
    <>
      <NavBar />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left: Problem Statement */}
        <div className="w-1/2 p-6 overflow-y-auto border-r">
          <h2 className="text-2xl font-bold mb-2">{problem.title}</h2>
          <p className="text-sm text-gray-600 mb-4">Difficulty: {problem.difficulty}</p>
          <pre className="whitespace-pre-wrap text-sm mb-4">{problem.description}</pre>
          <div className="flex flex-wrap gap-2">
            {problem.tags?.map((tag, i) => (
              <span key={i} className="bg-gray-200 text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Code Editor */}
        <div className="w-1/2 bg-gray-900 p-4">
          <Editor
            height="100%"
            defaultLanguage="cpp"
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
          />
        </div>
      </div>
    </>
  );
}
