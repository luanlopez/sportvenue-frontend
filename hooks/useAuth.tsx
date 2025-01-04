"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { authService } from "@/services/auth";
import { getAccessToken, getRefreshToken, setTokens, removeTokens } from "@/lib/auth/token";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from 'jwt-decode';

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

const publicRoutes = ['/', '/register', '/forgot-password', ''];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      let accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (publicRoutes.includes(pathname) && (accessToken || refreshToken)) {
        router.push('/home');
        return;
      }

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
  };

  const handleUnauthenticated = () => {
    setUser(null);
    removeTokens();
    setIsLoading(false);

    if (!publicRoutes.includes(pathname)) {
      router.push('/');
    }
  };

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
      {children}
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
