import React from "react"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
        const response=await axios.post("http://localhost:8000/api/auth/signup",userData);
        console.log("Signup successful:", response.data);
    navigate('/login');

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
        <h2>Sign Up</h2>
     <form onSubmit={handleSubmit}>
        <input type='text' placeholder="enter your name"  name="username" value={formData.username}
        onChange={handleChange} required/>
        <br />
        <input type='email' placeholder="enter your email" name="email" value={formData.email}
        onChange={handleChange}  required/>
        <br />
        <input type='password' placeholder="enter your password"  name="password" value={formData.password}
        onChange={handleChange} required/>
        <br />
        <input type='password' placeholder="confirm password" name="confirmPassword" value={formData.confirmPassword}
        onChange={handleChange} required/>
        <br />
        
        <br />
        <button type="submit">Submit</button>

     </form>
        </>
    )
}
export default Signup