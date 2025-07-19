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
import Submissions from '../components/Submissions'
import AdminDashboard from '../components/AdminDahboard'
import ProblemTable from '../components/ProblemTableAdmin'
import AddProblem from '../components/AddProblem'
import EditProblem from '../components/EditProblem'
import AllSubmissions from '../components/AllSubmissions'




function App() {
  
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home />}></Route>
 
   <Route path="/signup" element={<Signup />}></Route>
   <Route path="/login" element={<Login />}></Route>
   <Route path="/dashboard" element={<Dashboard />}></Route>
   <Route path="/admin" element={<AdminDashboard />}></Route>
   <Route path="/editprofile" element={<EditProfile />}></Route>
   <Route path="/practiceproblems" element={<PracticeProblems />}></Route>
   <Route path="/:id" element={<SpecificProblem />}></Route>
   <Route path="/ratedproblems" element={<RatedProblems />}></Route>
   <Route path='/admin/manageproblems' element={<ProblemTable />}></Route>
   <Route path="/submissions" element={<Submissions />}></Route>
   <Route path="/admin/addproblem" element={<AddProblem />}></Route>
   <Route path="/admin/editproblem" element={<EditProblem />}></Route>
   <Route path="/admin/editproblem/:id" element={<EditProblem />} />
   <Route path="/admin/allsubmissions" element={<AllSubmissions />}></Route>

    </Routes>
    </BrowserRouter>

    
  )
}

export default App
