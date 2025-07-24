import React, { useState,useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router-dom';
import fetchSubmittedCode  from '../utils/fetchSubmittedCode.js';
import { backend,compiler } from '../utils/api';



export default function ProblemEditor({ problem ,submissionId}) {

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useAuth(); 
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('');
  const [verdict, setVerdict] = useState('');
  const [activeTab, setActiveTab] = useState('Input');
  const [language] = useState('cpp');
  const [aiReview,setAiReview]=useState("")
  const [runLoading, setRunLoading] = useState(false);
  const [verdictLoading, setVerdictLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [code, setCode] = useState(() => { return submissionId ? '' : (localStorage.getItem('unsavedCode') || '// Write your code here');
   });
   const [initialCode, setInitialCode] = useState('');

  


  useEffect(() => {
    const fetchSubmittedCodeForEditor = async () => {
      if (!submissionId) return;
      try {
        const code = await fetchSubmittedCode(submissionId);
        setCode(code);
        setInitialCode(code);
      } catch (err) {
        console.error('Failed to fetch submitted code:', err.message);
      }
    };
    fetchSubmittedCodeForEditor();
  }, [submissionId]);
  

  useEffect(() => {
    localStorage.removeItem('unsavedCode'); 
  }, [id]);
  
 
  const Spinner = () => (
    <div className="flex items-center justify-center h-full">
   <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>

    </div>
  );
  


  const handleAiReview=async()=>{
    if (!id) {
      localStorage.setItem('unsavedCode', code);
      navigate('/login', { state: { from: location.pathname } });
       return;      
    }
    setActiveTab('AI Review');
    setAiLoading(true);
    try{
      const res=await backend.post("/compiler/ai-review",{code,
      title:problem?.title||"",
      description:problem?.description|| "",
      constraints:problem.constraints || ""});
      const { aiResponse } = res.data;
      setAiReview(aiResponse || 'No feedback provided.');
      setActiveTab('AI Review');
    }
    catch(err){
      
      const message =
      err.response?.data?.error || 'Failed to fetch AI review.';
    setAiReview(message);
    setActiveTab('AI Review');
    }
    finally {
      setAiLoading(false);
    }
  }

  const handleRun = async () => {
    if (!id) {
      localStorage.setItem('unsavedCode', code);
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setActiveTab('Output'); 
    setRunLoading(true);
    try {
      const res = await backend.post('/compiler/run',
        {
          code,
          input: customInput || '',
          language,
        }
      );
      setOutput(res.data.output || '');
      setActiveTab('Output');
    } catch (err) {
      let details = err.response?.data?.details;
      if (typeof details === 'object') {
        details = JSON.stringify(details, null, 2);
      }
      setOutput(details || 'Unknown error while running the code.');
      setActiveTab('Output');
    }
    finally {
      setRunLoading(false);
    }
  };
  const handleSubmit = async () => {
    if (!id) {
      localStorage.setItem('unsavedCode', code);
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setActiveTab('Verdict'); 
    setVerdictLoading(true);
  
    try {
      const res = await backend.post(
        '/submit',
        {
          code,
          language,
          problemId: problem._id,
        }
      );
  
      const { result, failedTests, details } = res.data;
  
      if (result === 'Accepted') {
        setVerdict('Accepted');
      } else if (details) {
      
        setVerdict(details);
      } else if (failedTests?.length) {
        const failedNumbers = failedTests.map((test) => test.index + 1);
        setVerdict(`Wrong Answer on testcases: ${failedNumbers.join(', ')}`);
      } else {
        setVerdict('Wrong Answer');
      }
  
      setActiveTab('Verdict');
    } catch (err) {
      setOutput(err.response?.data?.details || 'Unknown error while running the code.');
      setActiveTab('Output');
    } finally {
      setVerdictLoading(false);
    }
  };
  

  const handleReset = () => {
    setCode(submissionId ? initialCode : '// Write your code here');
    setCustomInput('');
    setOutput('');
    setVerdict('');
    setActiveTab('Input');
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
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded" onClick={handleAiReview}>
    AI Review
  </button>
        <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded" onClick={handleReset}>
          Reset
        </button>
      </div>

      <div className="flex gap-2 mb-2">
        {['Input', 'Output', 'Verdict','AI Review'].map((tab) => (
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
        {activeTab === 'Input' && (
          <textarea
            className="w-full h-full bg-white p-2 rounded border resize-none"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Enter custom input..."
          />
        )}
       {activeTab === 'Output' && (
   runLoading ? (
    <Spinner />
  )  : (
    <pre className="whitespace-pre-wrap">{output || 'No output yet.'}</pre>
  )
)}
        {activeTab === 'Verdict' && (
           verdictLoading ? (
            <Spinner />
          ) :(
          <div>
            {verdict === 'Accepted' ? (
              <p className="text-green-600 font-semibold">Accepted</p>
            ) : Array.isArray(verdict) ? (
              <div>
                <p className="text-red-600 font-semibold mb-2">Wrong Answer</p>
                <div className="flex flex-wrap gap-2">
                  {verdict.map((testNum, idx) => (
                    <div
                      key={idx}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      Test Case {testNum}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <pre className="text-red-600 whitespace-pre-wrap">{verdict}</pre>
            )}
          </div>)
        )}
       {activeTab === 'AI Review' && (
  aiLoading ? (
    <Spinner />
  ) : (
    aiReview ? (
      <div className="whitespace-pre-wrap text-gray-800">
        <ReactMarkdown>{aiReview}</ReactMarkdown>
      </div>
    ) : (
      <p>No AI feedback yet.</p>
    )
  )
)}

      </div>
    </div>
  );
}
