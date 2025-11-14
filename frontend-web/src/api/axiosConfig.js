// src/api/axiosConfig.js
import axios from 'axios';

// Your Django backend URL
const API_URL = 'https://chemical-api-74nj.onrender.com/api'; 


const axiosInstance = axios.create({
    baseURL: API_URL,
});

// This is an "interceptor"
// It runs BEFORE every API request
axiosInstance.interceptors.request.use(
    (config) => {
        // Get the auth data from local storage
        const authData = localStorage.getItem('auth');
        if (authData) {
            const { accessToken } = JSON.parse(authData);
            if (accessToken) {
                // Add the token to the 'Authorization' header
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;