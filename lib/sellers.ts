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

export const updateSellerStatus = (
  sellerId: string,
  status: string
) =>
  API.patch(`/sellers/${sellerId}/status`, { status });

// export const approveSeller = (id: string) =>
//   API.patch(`/sellers/${id}/approve`);

// export const rejectSeller = (id: string) =>
//   API.patch(`/sellers/${id}/reject`);