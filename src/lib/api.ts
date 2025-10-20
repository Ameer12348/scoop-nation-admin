import { BASE_URL } from '@/consts';
import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here (e.g., 401 unauthorized)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      // You can dispatch logout action here if needed
    }
    return Promise.reject(error);
  }
);

export default api;