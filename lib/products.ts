import { api } from './api';

export const getProducts = () => api.get('/products');

export const createProduct = (data: any) =>
  api.post('/products', data);

export const updateProduct = (id: string, data: any) =>
  api.put(`/products/${id}`, data);

export const deleteProduct = (id: string) =>
  api.delete(`/products/${id}`);

export const getSellerProducts = () =>
  api.get('/products/seller/my-products');

export const addProductStock = (
  productId: string,
  data: any
) => {
  return api.post(
    `/products/${productId}/add-stock`,
    data
  );
};