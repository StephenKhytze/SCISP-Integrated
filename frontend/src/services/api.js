import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach access token if it exists in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// If the session token is missing/expired, clear it and send the user back
// to the login page instead of leaving every module stuck on a raw 401 error.
api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401 && window.location.pathname !== '/auth') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
  }
  return Promise.reject(error);
});

export default api;
