import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens } from '@/lib/auth/token';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let isRefreshing = false;
let failedRequestsQueue: {
  onSuccess: (token: string) => void;
  onFailure: (error: Error) => void;
}[] = [];

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        window.location.href = '/';
        return Promise.reject(error);
      }

      const originalConfig = error.config;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          setTokens(accessToken, newRefreshToken);

          api.defaults.headers.Authorization = `Bearer ${accessToken}`;

          failedRequestsQueue.forEach(request => request.onSuccess(accessToken));
          failedRequestsQueue = [];

          return api(originalConfig);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          failedRequestsQueue.forEach(request => request.onFailure(err));
          failedRequestsQueue = [];

          window.location.href = '/';
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          onSuccess: (token: string) => {
            originalConfig.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalConfig));
          },
          onFailure: (err: Error) => {
            reject(err);
          },
        });
      });
    }

    return Promise.reject(error);
  }
); 