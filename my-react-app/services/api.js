import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  verify: () => api.get('/auth/verify'),
};

// Review APIs
export const reviewAPI = {
  getAll: () => api.get('/reviews'),
  approve: (id, reply) => api.post(`/reviews/${id}/approve`, { reply }),
  generateReply: (id) => api.post(`/reviews/${id}/generate-reply`),
};

// Google Auth
export const googleAPI = {
  connect: () => api.get('/google/auth-url'),
  callback: (code) => api.post('/google/callback', { code }),
};

export default api;