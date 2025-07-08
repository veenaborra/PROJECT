import React from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom';

import ProfileDropdown from './ProfileDropdown';


export default function NavBar() {
const {role,refreshUser,id}=useAuth();
const navigate=useNavigate();



  return (

<nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center mb-2">
    <h1 className='text-xl font-bold'>AlgoNest</h1>
    <div className='space-x-4'>
   
   {
    !id && (
      <>
      <Link to="/login" className="hover:underline">Login</Link>
      <Link to="/signup" className="hover:underline">Register</Link>
      </>
    )
   }
    {role==="user" && (
      <>
<Link to="/practiceproblems" className='hover:underline' >Practice</Link>
<Link to="/ratedproblems" className='hover:underline' >Rated</Link>
<ProfileDropdown />
</>
)
}

{role === 'admin' && (
  <>
             <Link to='/admin/manageproblems' className='hover:underline'>Manage Problems</Link>
<ProfileDropdown />
         
       </>   )}
        

</div>


</nav>
  )
}
