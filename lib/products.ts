import { api } from './api';
// import axios from 'axios';

export const getProducts = () => api.get('/products');
// export const getProducts = () => {
//   const token = localStorage.getItem('token');

//   return axios.get('http://localhost:3002/products', {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

export const createProduct = (data: any) =>
  api.post('/products', data);

export const updateProduct = (id: string, data: any) =>
  api.put(`/products/${id}`, data);

export const deleteProduct = (id: string) =>
  api.delete(`/products/${id}`);
