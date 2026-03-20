import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3002',
});

api.interceptors.request.use((config) => {
  const role = localStorage.getItem('role');

  if (role === 'ADMIN') {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  }

  if (role === 'SELLER') {
    const sellerToken = localStorage.getItem('sellerToken');
    if (sellerToken) {
      config.headers.Authorization = `Bearer ${sellerToken}`;
    }
  }

  return config;
});
