import React from "react"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Dashboard from "./Dashboard.jsx"
function Signup(){
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
       

       console.log("auto login successful");

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter your username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 border py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 border py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 border py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Confirm password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4  border py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    )
}
export default Signup