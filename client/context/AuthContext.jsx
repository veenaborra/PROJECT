// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ role: null, id: null ,email:null,username:null});
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/user/me", {
        withCredentials: true
      });
      console.log("API RESPONSE:", res.data);
      setAuth({ role: res.data.role, id: res.data.userId ,email:res.data.email,username:res.data.username});
    } catch (e) {
      setAuth({ role: null, id: null ,email:null,username:null});
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);


  return (
    <AuthContext.Provider value={{ ...auth, loading,refreshUser:fetchUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


