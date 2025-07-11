import React, { useEffect, useState,useRef } from 'react'
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';
import { CgProfile } from "react-icons/cg";

const ProfileDropdown=()=>{
    const {role,refreshUser,id}=useAuth();
    const [showModal, setShowModal] = useState(false);
const navigate =useNavigate();
    const [open,setOpen]=useState(false);
    const dropdownRef=useRef(null);
//handling logout
    const handleLogout=async()=>{
        try{
    await axios.post("http://localhost:8000/api/auth/logout",{},{withCredentials:true});
    await refreshUser();
    navigate('/login');
    }
    catch(error){
        console.error('Logout failed ',error);
    }};
//handling deletion of user
const handleDelete=async()=>{
    try{
    await axios.delete(`http://localhost:8000/api/user/${id}`,{withCredentials:true});
    await refreshUser();
    console.log("user deleted");
    navigate('/login');}
    catch(error){
      console.error("Account deletion failed ",error);
    }
  }

//handling closing of dropdown
    useEffect(()=>{
function handleClickOutside(e){
    if(dropdownRef.current &&  !dropdownRef.current.contains(e.target)){
        setOpen(false);
    }}
    document.addEventListener("click",handleClickOutside);

    return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    },[])


    return (
        <>
        <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:underline"
        >
         <CgProfile />
        </button>
  
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-900 border rounded shadow-md z-50">
            <button onClick={()=>{navigate('/editprofile')}}className="block w-full text-left px-4 py-2 hover:bg-gray-500" >
              Edit Profile
            </button>
                <button onClick={() => setShowModal(true)} className="block w-full text-left px-4 py-2 hover:bg-gray-500">
              Delete Account
            </button>
            <button onClick={handleLogout}className="block w-full text-left px-4 py-2 hover:bg-gray-500">
              Logout
            </button>
          </div>
        )}
      </div>
    
      {showModal && (
        <ConfirmModal
          message="Are you sure you want to delete your account? This action cannot be undone."
          onConfirm={() => {
            handleDelete();
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
      </>
    );
  };
    

export default ProfileDropdown;

