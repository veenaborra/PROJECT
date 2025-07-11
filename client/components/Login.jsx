import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NavBar from '../layout/NavBar'
import { useLocation } from 'react-router-dom'



const Login = () => {
const navigate=useNavigate();
const {refreshUser}=useAuth();
const location = useLocation();
const from = location.state?.from || '/dashboard'; 
const [formData,setFormData]=useState({
  emailOrUsername:"",
  password:"",
 
})

const handleChange=(e)=>{
  setFormData({...formData,
      [e.target.name]:e.target.value
  })
}
const handleSubmit=async(e)=>{
  e.preventDefault();
  console.log("form submitted");
  
  const {emailOrUsername,password}=formData;
  
  
 const userData={emailOrUsername,password}

try{
  const response=await axios.post("http://localhost:8000/api/auth/login",userData,{
    withCredentials:true,
  });
  const {role}=response.data;
 console.log("login successful",response.data);
 console.log("Navigating to /dashboard");
 await refreshUser();




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
    <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 ">
    <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
            Welcome Back
          </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Username or Email</label>
        <input
          type="text"
          name="emailOrUsername"
          value={formData.emailOrUsername}
          onChange={handleChange}
          placeholder="Username or Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        /></div>
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        /></div>
        <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Log In
            </button>
            <p className="text-sm text-gray-600 mt-6 text-center">
            Don't have an account?{" "}
            <a
              href="/signup"
              state={{ from: location.state?.from || '/dashboard' }}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign Up
            </a>
          </p>
          </form>
    </div>
  </div>
  </>
  )
}

export default Login