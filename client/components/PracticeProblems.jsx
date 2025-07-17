import React, { useState,useEffect } from 'react'
import NavBar from '../layout/NavBar'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom';

export default  function PracticeProblems() {
const [problems,setProblems]=useState([]);
const [loading,setLoading]=useState(true);
const navigate=useNavigate();

const handleRowClick=(id)=>{
navigate(`/${id}`);
}

useEffect(()=>{
    const fetchProblems=async ()=>{
        try{
            const res=await axios.get("http://localhost:8000/api/problems/practiceproblems",{withCredentials:true});
            console.log(res.data);
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
         <table className="min-w-full bg-white border border-gray-300 rounded-md">
         <thead>
           <tr className="bg-gray-100 text-left">
             <th className="p-2 border-b">Title</th>
             <th className="p-2 border-b">Difficulty</th>
             <th className="p-2 border-b">Tags</th>
           </tr>
         </thead>
         <tbody>
  {problems.map((problem) => (
    <tr key={problem._id} onClick={()=>{handleRowClick(problem._id)}}className="hover:bg-gray-50">
      <td className="p-2 border-b">{problem.title}</td>
      <td className="p-2 border-b">{problem.difficulty}</td>
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
     
    )}
</div>
    </>
  )  
  
}
