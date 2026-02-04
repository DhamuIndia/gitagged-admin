import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3002',
});

// attach admin token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ADMIN APIs
export const getUsers = () => API.get('/users');

export const blockUser = (id: string) =>
  API.patch(`/users/${id}/block`);

export const unblockUser = (id: string) =>
  API.patch(`/users/${id}/unblock`);
