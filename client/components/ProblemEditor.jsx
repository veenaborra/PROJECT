import React, { useState,useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router-dom';


export default function ProblemEditor({ problem }) {
  console.log(problem);
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
  const [code, setCode] = useState(() => {
    return localStorage.getItem('unsavedCode') || '// Write your code here';
  });

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
    setAiLoading(true);
    try{
      const res=await axios.post("http://localhost:8080/ai-review",{code,
      title:problem?.title||"",
      description:problem?.description|| "",
      constraints:problem.constraints || ""},
      {withCredentials:true});
      const { aiResponse } = res.data;
      setAiReview(aiResponse || 'No feedback provided.');
      setActiveTab('AI Review');
    }
    catch(err){
      console.log(err.response);
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
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setRunLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:8080/run',
        {
          code,
          input: customInput || '',
          language,
        },
        { withCredentials: true }
      );
      setOutput(res.data.output || '');
      setActiveTab('Output');
    } catch (err) {
      setOutput(err.response?.data?.details || 'Unknown error while running the code.');
      setActiveTab('Output');
    }
    finally {
      setRunLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!id) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setVerdictLoading(true);
    try {
      const userId = id;
      const res = await axios.post(
        'http://localhost:8000/api/submit',
        {
          code,
          language,
          userId,
          problemId: problem._id,
        },
        { withCredentials: true }
      );
      console.log(res);
      const { result, failedTests } = res.data;

      if (result === 'Accepted') {
        setVerdict('Accepted');
      } else {
        const failedNumbers = failedTests.map((test) => test.index + 1);
        setVerdict(failedNumbers);
      }
      setActiveTab('Verdict');
    } catch (err) {
      const details = err.response?.data?.details || 'Something went wrong. Please try again.';
      setVerdict(details);
      setActiveTab('Verdict');
    }
    finally {
      setVerdictLoading(false);
    }
  };

  const handleReset = () => {
    setCode('// Write your code here');
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
