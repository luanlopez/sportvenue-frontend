"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { authService } from "@/services/auth";
import { getAccessToken, getRefreshToken, setTokens, removeTokens } from "@/lib/auth/token";
import { useRouter } from "next/navigation";
import { jwtDecode } from 'jwt-decode';
import { LoadingScreen } from "@/components/ui/LoadingScreen";

interface User {
  id: string;
  firstName: string;
  name: string;
  phone: string;
  lastName: string;
  email: string;
  userType: "USER" | "HOUSE_OWNER";
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

const publicRoutes = ['/', '/register', '/forgot-password', '/register/verification'];

const isPublicRoute = (path: string) => publicRoutes.includes(path);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    const handleUnauthenticated = () => {
      setUser(null);
      removeTokens();
      setIsLoading(false);

      if (!isPublicRoute(window.location.pathname)) {
        router.push('/');
      }
    };

    try {
      let accessToken = getAccessToken();

      const refreshToken = getRefreshToken();

      if (!accessToken && !refreshToken) {
        handleUnauthenticated();
        return;
      }

      if (accessToken) {
        const decodedToken = jwtDecode(accessToken) as { exp: number };
        const isTokenExpired = Date.now() >= decodedToken.exp * 1000;

        if (isTokenExpired && refreshToken) {
          const response = await authService.refreshToken(refreshToken);
          setTokens(response.accessToken, response.refreshToken);
          accessToken = response.accessToken;
        }
      }

      if (!accessToken && refreshToken) {
        const response = await authService.refreshToken(refreshToken);
        setTokens(response.accessToken, response.refreshToken);
        accessToken = response.accessToken;
      }

      if (accessToken) {
        const userData = await authService.getProfile();
        setUser(userData);
        setIsLoading(false);
        return;
      }

      handleUnauthenticated();
    } catch {
      handleUnauthenticated();
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signIn = async (credentials: { email: string; password: string }) => {
    const response = await authService.signIn(credentials);
    setTokens(response.accessToken, response.refreshToken);
    
    const userData = await authService.getProfile();
    setUser(userData);

    router.push('/home');
  };

  const signOut = async () => {
    removeTokens();
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {isLoading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
