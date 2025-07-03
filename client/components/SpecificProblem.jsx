import React, { useState, useEffect } from 'react';
import NavBar from '../layout/NavBar';
import Editor from "@monaco-editor/react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProblemEditor from './ProblemEditor';


export default function SpecificProblem() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/problems/${id}`, {
          withCredentials: true,
        });
        setProblem(res.data);
      } catch (error) {
        console.error("Error fetching problem:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (!problem) return <p className="text-center mt-10 text-lg">Problem not found.</p>;
  console.log("Problem:", problem);

  return (
    <>
      <NavBar />
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] p-4 gap-4 bg-gray-100">

        
        <div className="lg:w-1/2 bg-white shadow-md rounded-xl p-6 overflow-y-auto max-h-[85vh]">
          <h1 className="text-2xl font-bold mb-3">{problem.title}</h1>
          <p className="text-sm text-gray-500 mb-4">Difficulty: <span
           className={`font-medium ${problem.difficulty === 'Easy' ? 'text-green-600' : problem.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>{problem.difficulty}</span></p>
<div className="mt-2  mb-4 flex flex-wrap gap-2">
            {problem.tags.map((tag, i) => (
              <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
          <div className="mb-4">
            <h2 className="font-semibold">Description:</h2>
            <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded">{problem.description}</pre>
          </div>

          <div className="mb-4">
            <h2 className="font-semibold">Input Format:</h2>
            <p className="text-sm bg-gray-50 p-2 rounded">{problem.inputFormat}</p>
          </div>

          <div className="mb-4">
            <h2 className="font-semibold">Output Format:</h2>
            <p className="text-sm bg-gray-50 p-2 rounded">{problem.outputFormat}</p>
          </div>

          {problem.constraints?.length > 0 && (
            <div className="mb-4">
              <h2 className="font-semibold">Constraints:</h2>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}

          <div className="mb-4">
            <h2 className="font-semibold">Examples:</h2>
            {problem.examples?.map((ex, i) => (
              <div key={i} className="bg-gray-100 p-2 my-2 rounded border">
                <p className="text-xs font-medium">Input:</p>
                <pre className="bg-gray-800 text-white p-2 rounded mb-1">{ex.input}</pre>
                <p className="text-xs font-medium">Output:</p>
                <pre className="bg-gray-800 text-white p-2 rounded">{ex.output}</pre>
              </div>
            ))}
          </div>

         
        </div>
        <ProblemEditor  problem={problem} />
    

      </div>
    </>
  );
}
