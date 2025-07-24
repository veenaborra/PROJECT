import React, { useState,useEffect } from 'react'
import NavBar from '../layout/NavBar'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { backend } from '../utils/api';

export default  function PracticeProblems() {
const [problems,setProblems]=useState([]);
const [loading,setLoading]=useState(true);
const [searchTerm, setSearchTerm] = useState('');
const navigate=useNavigate();


const handleRowClick=(id)=>{
navigate(`/problems/${id}`);
}

const filteredProblems = problems.filter((problem) =>
  problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  problem.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) || problem.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
);

useEffect(()=>{
    const fetchProblems=async ()=>{
        try{
            const res=await backend.get("/problems/practiceproblems");
          
            setProblems(res.data.practiceProblems);
            setLoading(false);
        }  
    catch(error){
        setLoading(false);
        if(error.response){
        console.log("server responded with error:",error.response.data)
        }
        else if(error.request){
        console.log("no response from server");
        }
        else{
        console.log("axios error:",error.message);
        }
        }
    };
    fetchProblems()
},[]);
  return (
<>
   
    <NavBar />
    <div className="p-8">
    <h2 className="text-xl font-bold mb-4">Practice Problems</h2>
    {loading ? (<p>Loading...</p>):(
      <div>

        <div className="mb-4 w-full sm:w-1/2 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or tag or difficulty..."
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
             <th className="p-2 border-b">Tags</th>
           </tr>
         </thead>
         <tbody>
  {filteredProblems.map((problem) => (
    <tr key={problem._id} onClick={()=>{handleRowClick(problem._id)}}className="hover:bg-gray-50">
      <td className="p-2 border-b">{problem.title}</td>
      <td className={`p-2 border-b font-semibold ${
  problem.difficulty === 'Easy'
    ? 'text-green-600'
    : problem.difficulty === 'Medium'
    ? 'text-yellow-600'
    : 'text-red-500'
}`}>
  {problem.difficulty}
</td>

      <td className="p-2 border-b">
        {problem.tags?.map((tag, index) => (
          <span
            key={index}
            className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded mr-1"
          >
            {tag}
          </span>
        ))}
      </td>
    </tr>
  ))}
</tbody>

       </table>
       </div>
    )}
</div>

    </>
  )  
  
}
