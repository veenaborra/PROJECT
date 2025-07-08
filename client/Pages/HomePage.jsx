import React from 'react'
import NavBar from '../layout/NavBar'
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function HomePage() {
  const [problems,setProblems]=useState([]);
const [loading,setLoading]=useState(true);
const navigate=useNavigate();

const handleRowClick=(id)=>{
  navigate(`/practiceproblems/${id}`);
  }
  useEffect(()=>{
    const fetchProblems=async ()=>{
        try{
            const res=await axios.get("http://localhost:8000/api/problems/allproblems");
            console.log(res.data);
            setProblems(res.data.problems);
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
   <NavBar></NavBar>
   <div className="p-8">
    <h2 className="text-xl font-bold mb-4">Problems</h2>
    {loading ? (<p>Loading...</p>):(
         <table className="min-w-full bg-white border border-gray-300 rounded-md">
         <thead>
           <tr className="bg-gray-100 text-left">
             <th className="p-2 border-b">Title</th>
             <th className="p-2 border-b">Difficulty</th>
             <th className="p-2 border-b">Tags</th>
             <th className="p-2 border-b">Type</th> 
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
      <td className="p-2 border-b">
        {problem.points === 0 ? (
          <span className="text-gray-600">Practice</span>
        ) : (
          <span className="text-green-600 font-semibold">Rated</span>
        )}
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
