import React from "react"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext.jsx"
import NavBar from "../layout/NavBar.jsx"


function Signup(){
  const {refreshUser}=useAuth();
  const location = useLocation();
const from = location.state?.from || '/dashboard';
     const [formData,setFormData]=useState({
        username:"",
        email:"",
        password:"",
        confirmPassword:"",
        
     })
const navigate=useNavigate();
     const handleChange=(e)=>{
        setFormData({...formData,
            [e.target.name]:e.target.value
        })
     }
     const handleSubmit=async(e)=>{
        e.preventDefault();
        const {username,email,password,confirmPassword,role}=formData;
        if(password!==confirmPassword){
            alert('passwords do not match');
            return;
        }
       
       
        const userData={username,
            email,
        password,
    }
    try{
        const signupresponse=await axios.post("http://localhost:8000/api/auth/signup",userData);
        console.log("Signup successful");
    
       const loginresponse=await axios.post("http://localhost:8000/api/auth/login",{
        emailOrUsername:userData.username,
        password:userData.password
       },{withCredentials:true});
       
       await refreshUser();
       console.log("auto login successful");

       navigate(from, { replace: true });




    }
    catch(error){
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

     }
    return (
      <>
      <NavBar></NavBar>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md border border-gray-200">
          <h2 className="text-3xl font-extrabold text-center  text-blue-700 mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
            <input
              type="text"
              placeholder="Enter your username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 border border-gray-300 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            /></div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 border py-3 border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            /></div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 border border-gray-300  py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            /></div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
            <input
              type="password"
              placeholder="Confirm password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4  border border-gray-300  py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            /></div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Submit
            </button>
            <p className="text-sm text-gray-600 mt-6 text-center">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Log In
            </a>
          </p>
          </form>
        </div>
      </div>
      </>
    )
}
export default Signup