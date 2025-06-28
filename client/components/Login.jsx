import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Login = () => {
const navigate=useNavigate();
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
 navigate('/dashboard');

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="max-w-md w-full bg-white shadow-md rounded-xl p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">Log In</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="emailOrUsername"
          value={formData.emailOrUsername}
          onChange={handleChange}
          placeholder="Username or Email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Log In
        </button>
      </form>
    </div>
  </div>
  )
}

export default Login