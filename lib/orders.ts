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

export const getAllOrders = () =>
  API.get('/admin/orders');

export const updateOrderStatus = (
  orderId: string,
  status: string
) =>
  API.patch(`/admin/orders/${orderId}/status`, { status });
