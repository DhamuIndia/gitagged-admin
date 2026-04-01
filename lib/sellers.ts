import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3003',
});

// attach admin token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllSellers = () =>
  API.get('/sellers');

export const updateSellerStatus = (id: string, status: string) => {
  return API.patch(`/sellers/${id}/status`, {
    status,

  });
};
