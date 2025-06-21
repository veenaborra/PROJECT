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
  const {emailOrUsername,password,role}=formData;
  
  
 const userData={emailOrUsername,password}

try{
  const response=await axios.post("http://localhost:8000/api/auth/login",userData,{
    withCredentials:true,
  });
  const user=response.data;
  console.log("Login successful");
  if(user.role==="admin"){
    navigate('/admindashboard');
  }
  else{
    navigate('/userdashboard');
  }
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
   <h2>Log In</h2>
     <form onSubmit={handleSubmit}>
       <input type='text' name='emailOrUsername' onChange={handleChange} placeholder='enter username/email' value={formData.emailOrUsername} required/>
       <br />
       <input type='password' name='password' onChange={handleChange} placeholder='enter password' value={formData.password} required />
       <br />
      
        <button type="submit">Submit</button>
     </form>
       </>
  )
}

export default Login