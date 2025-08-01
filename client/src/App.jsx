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
import ProtectedRoute from '../components/ProtectedRoute'
import PublicRoute from '../components/PublicRoute'
import NotFound from '../components/NotFound';






function App() {
  
  return (
    
<BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route 
  path="/login" 
  element={<Login />} 
/>
<Route 
  path="/signup" 
  element={<Signup />} 
/>


        {/* User protected routes */}
        <Route 
          path="/dashboard" 
          element={
          
              <Dashboard />
        
          } 
        />
        <Route 
          path="/editprofile" 
          element={
            <ProtectedRoute requiredRole="user">
              <EditProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/practiceproblems" 
          element={
            <ProtectedRoute requiredRole="user">
              <PracticeProblems />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/problems/:id" 
          element={
          
              <SpecificProblem />
           
          } 
        />
        <Route 
          path="/ratedproblems" 
          element={
            <ProtectedRoute requiredRole="user">
              <RatedProblems />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/submissions" 
          element={
            <ProtectedRoute requiredRole="user">
              <Submissions />
            </ProtectedRoute>
          } 
        />

        {/* Admin protected routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/manageproblems" 
          element={
            <ProtectedRoute requiredRole="admin">
              <ProblemTable />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/addproblem" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AddProblem />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/editproblem" 
          element={
            <ProtectedRoute requiredRole="admin">
              <EditProblem />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/editproblem/:id" 
          element={
            <ProtectedRoute requiredRole="admin">
              <EditProblem />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/allsubmissions" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AllSubmissions />
            </ProtectedRoute>
          } 
        />
   <Route path="*" element={<NotFound />} />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App