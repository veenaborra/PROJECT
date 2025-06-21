import {BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from '../components/Home'
import Login from '../components/Login'
import Signup from '../components/Signup'
import AdminDashBoard from '../components/AdminDashBoard'
import UserDashBoard from '../components/UserDashBoard'

function App() {

  return (
    <BrowserRouter>
    <Routes>
   <Route path="/" element={<Home />}></Route>
   <Route path="/signup" element={<Signup />}></Route>
   <Route path="/login" element={<Login />}></Route>
   <Route path="/admindashboard" element={<AdminDashBoard/>}></Route>
   <Route path="/userdashboard"   element={<UserDashBoard />}></Route>
    </Routes>
    </BrowserRouter>

    
  )
}

export default App
