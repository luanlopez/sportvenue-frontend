import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  removeTokens,
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
    if (error?.response?.status === 401) {
      const originalRequest = error.config;
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        removeTokens();
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response = await authService.refreshToken(refreshToken);

          const { accessToken, refreshToken: newRefreshToken } = response;
          setTokens(accessToken, newRefreshToken);

          api.defaults.headers.Authorization = `Bearer ${accessToken}`;

          failedRequestsQueue.forEach((request) =>
            request.onSuccess(accessToken)
          );
          failedRequestsQueue = [];

          return api(originalRequest);
        } catch (err) {
          failedRequestsQueue.forEach((request) =>
            request.onFailure(err as Error)
          );

          failedRequestsQueue = [];
          removeTokens();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
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
