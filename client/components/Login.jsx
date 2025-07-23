import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NavBar from '../layout/NavBar'
import { backend } from '../utils/api'
import { compiler } from '../utils/api'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { refreshUser, id, role } = useAuth();
  const [error, setError] = useState('');
  const [signingUp, setSigningUp] = useState(false);

  if (id && !signingUp) {
    return <Navigate to={role === "admin" ? "/admin/dashboard" : "/dashboard"} replace />;
  }

  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { emailOrUsername, password } = formData
    const userData = { emailOrUsername, password }

    try {
      setSigningUp(true);
      const response = await backend.post('/auth/login', userData);

      const { role } = response.data
      await refreshUser()

      const fallbackRoute = role === 'admin' ? '/admin/dashboard' : '/dashboard'
      const from = location.state?.from || fallbackRoute

      navigate(from, { replace: true })
    }catch (error) {
      if (error.response) {

        const msg = error.response.data.message;
    
        if (msg === 'Invalid password' || msg === 'invalid credentials') {
          setError(msg);
        } else {
          setError('Login failed. Please try again.');
        }
    
      } else if (error.request) {
        setError('Unable to reach the server. Please check your connection.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setSigningUp(false);
    }
    
  }

  return (
    <>
      <NavBar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
            Welcome Back
          </h2>
          {error && (
  <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
    {error}
  </div>
)}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username or Email
              </label>
              <input
                type="text"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={handleChange}
                placeholder="Username or Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Log In
            </button>
            <p className="text-sm text-gray-600 mt-6 text-center">
              Don't have an account?{' '}
              <Link
                to="/signup"
                state={location.state?.from ? { from: location.state.from } : undefined}
                className="text-blue-600 hover:underline font-medium"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
