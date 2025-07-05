import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ProblemEditor({ problem }) {
  const {id}=useAuth();
  const [code, setCode] = useState('// Write your code here');
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('');
  const [verdict, setVerdict] = useState('');
  const [activeTab, setActiveTab] = useState('input'); // input | output | verdict
  const [language] = useState('cpp');

  const handleRun = async () => {
    try {
      const res = await axios.post(
        'http://localhost:8080/run',
        {
          code,
          input: customInput,
          language,
        },
        { withCredentials: true }
      );
      setOutput(res.data.output || '');
      setActiveTab('output');
    } catch (err) {
      setOutput(err.response?.data?.error || 'Error occurred.');
      setActiveTab('output');
    }
  };

  const handleSubmit = async () => {
    try{
    const userId=id;
    const res = await axios.post('http://localhost:8000/api/submit', {
      code,
      language,
      userId,
      problemId: problem._id,
    },{withCredentials:true});
    const { result, failedTest } = res.data;
    if (result === 'Accepted') {
      setVerdict('Accepted');
    } else {
      setVerdict(
        `Wrong Answer on Test Case #${failedTest?.index + 1}`
      );
    }
    setActiveTab('verdict');
  }
  catch (err) {
    setVerdict(err.response?.data?.error || 'Submission error.');
    setActiveTab('verdict');
  }
};


  const handleReset = () => {
    setCode('// Write your code here');
    setCustomInput('');
    setOutput('');
    setVerdict('');
    setActiveTab('input');
  };

  if (!problem) return <p>Problem not loaded.</p>;

  return (
    <div className="lg:w-1/2 bg-white shadow-md rounded-xl p-6 overflow-y-auto max-h-[85vh]">
      <Editor
        height="500px"
        defaultLanguage="cpp"
        value={code}
        onChange={(value) => setCode(value || '')}
        theme="vs-dark"
      />

      
      <div className="flex gap-4 my-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={handleRun}>
          Run
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
          Submit
        </button>
        <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded" onClick={handleReset}>
          Reset
        </button>
      </div>

      
      <div className="flex gap-2 mb-2">
        {['input', 'output', 'verdict'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded capitalize ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-300'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      
      <div className="bg-gray-100 p-4 rounded h-40 overflow-y-auto">
        {activeTab === 'input' && (
          <textarea
            className="w-full h-full bg-white p-2 rounded border resize-none"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Enter custom input..."
          />
        )}
        {activeTab === 'output' && (
          <pre className="whitespace-pre-wrap">{output || 'No output yet.'}</pre>
        )}
        {activeTab === 'verdict' && (
          <span
            className={`font-semibold ${
              verdict === 'Accepted' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {verdict || 'Not evaluated yet.'}
          </span>
        )}
      </div>
    </div>
  );
}
