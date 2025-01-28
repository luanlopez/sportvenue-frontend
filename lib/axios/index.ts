import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  removeTokens,
  isTokenExpired,
} from "../auth/token";
import { authService } from "@/services/auth";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let isRefreshing = false;
let failedRequestsQueue: Array<{
  onSuccess: (token: string) => void;
  onFailure: (err: Error) => void;
}> = [];

const publicRoutes = ['/login', '/register', '/forgot-password'];

const shouldRedirectToLogin = () => {
  const currentPath = window.location.pathname;
  return !publicRoutes.some(route => currentPath.startsWith(route));
};

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
    const shouldHandleError = error?.response?.status === 401 && 
      !error?.response?.data?.message?.includes('CPF já existente, tente outro por favor!');

    if (shouldHandleError) {
      const originalRequest = error.config;
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        removeTokens();
        if (shouldRedirectToLogin()) {
          window.location.href = '/login/';
        }
        return Promise.reject(error);
      }

      if (isTokenExpired(refreshToken)) {
        removeTokens();
        if (shouldRedirectToLogin()) {
          window.location.href = '/login/';
        }
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response = await authService.refreshToken(refreshToken);
          const { accessToken, refreshToken: newRefreshToken } = response;

          setTokens(accessToken, newRefreshToken);

          failedRequestsQueue.forEach(request => {
            request.onSuccess(accessToken);
          });

          return api(originalRequest);
        } catch (err) {
          failedRequestsQueue.forEach(request => {
            request.onFailure(err as Error);
          });
          
          removeTokens();
          if (shouldRedirectToLogin()) {
            window.location.href = '/login';
          }
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
          failedRequestsQueue = [];
        }
      }

      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          onSuccess: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
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
