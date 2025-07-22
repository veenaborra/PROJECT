
import axios from 'axios';

export const backend = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export const publicBackend = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
  });
  
export const compiler = axios.create({
  baseURL: import.meta.env.VITE_COMPILER_URL,
  withCredentials:true
});
