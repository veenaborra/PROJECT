import {BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from '../components/Home'
import Login from '../components/Login'
import Signup from '../components/Signup'
import Dashboard from '../components/Dashboard'
import EditProfile from '../components/EditProfile'
import PracticeProblems from '../components/PracticeProblems'
import SpecificProblem from '../components/SpecificProblem'
import RatedProblems from '../components/RatedProblems'

import ManageProblems from '../components/ManageProblems'


function App() {

  return (
    <BrowserRouter>
    <Routes>
   <Route path="/" element={<Home />}></Route>
   <Route path="/signup" element={<Signup />}></Route>
   <Route path="/login" element={<Login />}></Route>
   <Route path="/dashboard" element={<Dashboard />}></Route>
   <Route path="/editprofile" element={<EditProfile />}></Route>
   <Route path="/practiceproblems" element={<PracticeProblems />}></Route>
   <Route path="/practiceproblems/:id" element={<SpecificProblem />}></Route>
   <Route path="/ratedproblems" element={<RatedProblems />}></Route>
   <Route path='/admin/manageproblems' element={<ManageProblems />}></Route>
    </Routes>
    </BrowserRouter>

    
  )
}

export default App
