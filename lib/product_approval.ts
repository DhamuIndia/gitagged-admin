import axios from 'axios';
import { adminAPI } from '@/lib/product-approval';
export const api = axios.create({
  baseURL: 'http://localhost:3002',
});

export const getPendingProducts = () => {
  return adminAPI.get('/products/pending');
};