"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import { authService } from "@/services/auth";
import { getAccessToken, getRefreshToken, setTokens, removeTokens } from "@/lib/auth/token";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { UserTypeModal } from "@/components/ui/UserTypeModal";

interface User {
  id: string;
  firstName: string;
  name: string;
  phone: string;
  lastName: string;
  email: string;
  userType: "USER" | "HOUSE_OWNER";
  picture?: string;
  googleId?: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const accessToken = getAccessToken();

      if (!accessToken) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const userData = await authService.getProfile();
      setUser(userData);

      if (userData && !userData.userType) {
        setShowTypeModal(true);
      }

      setIsLoading(false);
    } catch {
      removeTokens();
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signIn = async (credentials: { email: string; password: string }) => {
    const { accessToken, refreshToken } = await authService.signIn(credentials);
    setTokens(accessToken, refreshToken);

    const userData = await authService.getProfile();
    setUser(userData);

    router.push("/");
  };

  const signOut = async () => {
    removeTokens();
    setUser(null);
    router.push("/");
  };

  const handleUserTypeSelect = async (type: 'USER' | 'HOUSE_OWNER') => {
    try {
      await authService.updateUserType(type);
      const currentRefreshToken = getRefreshToken();
      if (currentRefreshToken) {
        const { accessToken, refreshToken } = await authService.refreshToken(currentRefreshToken);
        setTokens(accessToken, refreshToken);
      }
      window.location.reload();
    } catch (error) {
      console.error("Erro ao definir tipo de usuário:", error);
    }
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
      <UserTypeModal
        isOpen={showTypeModal}
        onSelect={handleUserTypeSelect}
      />
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
