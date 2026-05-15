import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3003',
});

// Attach token automatically
API.interceptors.request.use((config) => {

    const token = localStorage.getItem('sellerToken');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const getSellerProfile = async () => {
    return await API.get('/sellers/me');
};

// export const updateSellerProfile = async (data: any) => {
//     return await API.patch('/sellers/update-profile', data);
// };
export const updateSellerProfile = async (data: FormData) => {

    return await API.patch(
        '/sellers/update-profile',
        data,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
};

export default API;