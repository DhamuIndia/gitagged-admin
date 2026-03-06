// import axios from 'axios';

// export const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
// });

// api.interceptors.request.use((config) => {
//   if (typeof window !== 'undefined') {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }
//   return config;
// });
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3002',
});

// api.interceptors.request.use((config) => {
//   const adminToken = localStorage.getItem('adminToken');
//   const sellerToken = localStorage.getItem('sellerToken');

//   if (adminToken) {
//     config.headers.Authorization = `Bearer ${adminToken}`;
//   } else if (sellerToken) {
//     config.headers.Authorization = `Bearer ${sellerToken}`;
//   }

//   return config;
// });

api.interceptors.request.use((config) => {
  const role = localStorage.getItem('role');

  if (role === 'ADMIN') {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  }

  if (role === 'SELLER') {
    const sellerToken = localStorage.getItem('sellerToken');
    if (sellerToken) {
      config.headers.Authorization = `Bearer ${sellerToken}`;
    }
  }

  return config;
});
