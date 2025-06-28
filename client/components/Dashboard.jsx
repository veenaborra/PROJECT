import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import UserDashBoard from './UserDashBoard';


export default function Dashboard() {
  const { role, id, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if(!role){
   return  <Navigate to='/login' />
  }
  if(role==='admin'){
    return <AdminDashboard></AdminDashboard>
  }
  if(role==='user'){
    return <UserDashBoard></UserDashBoard>
  }
  return <div>Unauthorized role</div>;
}
