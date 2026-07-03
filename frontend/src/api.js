import axios from 'axios';

const PROD_URL = 'https://chilli-nursery.onrender.com/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? PROD_URL,
  timeout: 15000,
});

// Attach JWT token for admin requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
