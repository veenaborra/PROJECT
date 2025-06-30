import {BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from '../components/Home'
import Login from '../components/Login'
import Signup from '../components/Signup'
import Dashboard from '../components/Dashboard'
import EditProfile from '../components/EditProfile'


function App() {

  return (
    <BrowserRouter>
    <Routes>
   <Route path="/" element={<Home />}></Route>
   <Route path="/signup" element={<Signup />}></Route>
   <Route path="/login" element={<Login />}></Route>
   <Route path="/dashboard" element={<Dashboard />}></Route>
   <Route path="/editprofile" element={<EditProfile />}></Route>
    </Routes>
    </BrowserRouter>

    
  )
}

export default App
