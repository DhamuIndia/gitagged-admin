import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3002',
});

export const getPendingProducts = () => {
  return api.get('/products/pending');
};