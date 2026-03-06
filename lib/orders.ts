import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3003',
});

// attach admin token
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem('adminToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
API.interceptors.request.use((config) => {

  const role = localStorage.getItem('role');

  let token = null;

  if (role === 'ADMIN') {
    token = localStorage.getItem('adminToken');
  }

  if (role === 'SELLER') {
    token = localStorage.getItem('sellerToken');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// export const getAllOrders = () =>
//   API.get('/orders/admin/all');
export const getAllOrders = () => {
  const role = localStorage.getItem('role');

  if (role === 'ADMIN') {
    return API.get('/orders/admin/all');
  }

  if (role === 'SELLER') {
    return API.get('/orders/seller/all');
  }
};

export const updateOrderStatus = (
  orderId: string,
  status: string
) =>
  API.patch(`/orders/${orderId}/status`, { status });
