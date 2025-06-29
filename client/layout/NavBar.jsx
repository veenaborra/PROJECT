import React from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';
import ProfileDropdown from './ProfileDropdown';


export default function NavBar() {
const {role,refreshUser,id}=useAuth();
const navigate=useNavigate();



  return (

<nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
    <h1 className='text-xl font-bold'>AlgoNest</h1>
    <div className='space-x-4'>
<Link to="/problems/practice" className='hover:underline' >Practice</Link>
<Link to="/problems/rated" className='hover:underline' >Rated</Link>
{role === 'admin' && (
            <Link to="/admin/users" className="hover:underline">Manage Users</Link>
          )}
<ProfileDropdown />

</div>

</nav>
  )
}
