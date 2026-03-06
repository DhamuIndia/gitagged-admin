import axios from 'axios';

export const sellerAPI = axios.create({
  baseURL: 'http://localhost:3003',
});

sellerAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('sellerToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});