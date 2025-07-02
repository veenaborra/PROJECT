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
<div className='flex flex-row h-[70vh]'>
   

       
        <div className="w-1/2 p-6  border border-gray-500 rounded-xl mr-2">
          <h2 className="text-2xl font-bold mb-6">Problem Title:<br /><br />{problem.title}</h2>
          
          <p className="text-sm text-gray-600 mb-6">Difficulty: {problem.difficulty}</p>
          <pre className="whitespace-pre-wrap text-sm mb-4"><strong>Description:</strong><br />{problem.description}</pre>
          <div className="flex flex-wrap gap-2">
            {problem.tags?.map((tag, i) => (
              <span key={i} className="bg-gray-200 text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4">
  <h3 className="text-lg font-semibold mb-2">Sample Test Cases:</h3>
  {problem.testCases?.slice(0, 2).map((test, i) => (
    <div key={i} className="mb-4 p-2 border border-gray-300 rounded bg-gray-50">
      <p className="text-sm font-medium">Input:</p>
      <pre className="bg-gray-700 text-white p-2 rounded border whitespace-pre-wrap">{test.input}</pre>

      <p className="text-sm font-medium mt-2">Expected Output:</p>
      <pre className="bg-gray-700 text-white p-2 rounded border whitespace-pre-wrap">{test.expectedOutput}</pre>
    </div>
  ))}
</div>

        </div>

     
        <div className="w-1/2 bg-gray-900 p-6 rounded-xl">
          <Editor
            height="100%"
            defaultLanguage="cpp"
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
          />
         <div className="flex gap-4">
    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
      Run
    </button>
    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
      Submit
    </button>
    <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
      Reset
    </button>
  </div>
        </div>
        </div>
        
    </>
  );
}
