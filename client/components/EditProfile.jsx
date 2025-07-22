import React from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../layout/NavBar';
import { backend } from '../utils/api';
export default function EditProfile() {
    const {id,username,email}=useAuth();
    const navigate=useNavigate();
    const [formData,setFormData]=useState({
      email:"",
      username:"",
     
    })
    const [error, setError] = useState(""); 

    useEffect(() => {
        if (email && username) {
          setFormData({ email, username })
        }
      }, [email, username])
      if (!email || !username) {
        return <div className="text-center mt-10 text-gray-600">Loading profile...</div>; 
      }
    const handleChange=(e)=>{
        setFormData({...formData,
            [e.target.name]:e.target.value
        })
      }
      const handleSubmit=async(e)=>{
        e.preventDefault();
       
        
        const {email,username}=formData;
        
        
       const userData={email,username}
      
      try{
        const response=await backend.patch(`/user/${id}`,userData);
        const {role}=response.data;
       
      
     
       navigate('/dashboard');
      
      }
      
      catch (error) {
        if (error.response) {
          console.log("server responded with error:", error.response.data);
  
          if (error.response.data?.message?.includes("already exists")) {
            setError(error.response.data.message);
          } else {
            setError("Failed to update profile. Please try again.");
          }
        } else if (error.request) {
          setError("No response from server. Check your connection.");
        } else {
          setError( error.message);
        }
      }
    };
  return (
    <>
    <NavBar />
<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

    <div className="max-w-md w-full bg-white shadow-md rounded-xl p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center text-blue-600">Update Your Profile</h2>
      {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
              type="text"
              placeholder="Enter your name"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 border py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Update 
        </button>
      </form>
    </div>
  </div>
  </>
  )
  
}
