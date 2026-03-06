import axios from 'axios';

export const adminAPI = axios.create({
  baseURL: 'http://localhost:3003',
});

adminAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});