import axios from 'axios';
import { getCookie } from './cookies';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/v1/api',
});

// Request interceptor to add token if exists
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getCookie('seba_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
