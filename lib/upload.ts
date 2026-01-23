import axios from 'axios';
import { api } from './api';

export const uploadImage = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('adminToken');

    return api.post('/products/upload-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    });
};

export const uploadCategoryImage = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post('/categories/upload-image', formData);
};

export const uploadGiRegionImage = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(
    'http://localhost:3002/gi-regions/upload-image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
      },
    }
  );
};






