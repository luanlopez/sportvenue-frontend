import axios, { AxiosError } from 'axios';
import { getAccessToken } from '../auth/token';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('API Request Error:', {
        url: error.config?.url,
        method: error.config?.method,
        message: 'No response received'
      });
    } else {
      console.error('API Config Error:', error.message);
    }
    return Promise.reject(error);
  }
);
