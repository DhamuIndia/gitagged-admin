import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3003',
});

API.interceptors.request.use((config) => {

  const role = localStorage.getItem('role');
  console.log("role-order", role);
  let token = null;

  if (role === 'ADMIN') {
    token = localStorage.getItem('adminToken');
  }

  if (role === 'SELLER') {
    token = localStorage.getItem('sellerToken');
  }

  if (token) {
    console.log("token-order", token);
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getAllOrders = () => {
  const role = localStorage.getItem('role');

  if (role === 'ADMIN') {
    return API.get('/orders/admin/all');
  }

  if (role === 'SELLER') {
    return API.get('/orders/seller/all');
  }
};

export const updateItemStatus = (itemId: string, status: string) => {
  return API.patch(`/orders/item/${itemId}/status`, { status });
};
