"use client";

import { createContext, useContext, useState } from "react";
import { UserTypeModal } from "@/components/ui/UserTypeModal";
import { authService } from "@/services/auth";
import { getRefreshToken, setTokens } from "@/lib/auth/token";
import { showToast } from "@/components/ui/Toast";

interface UserTypeModalContextData {
  showModal: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const UserTypeModalContext = createContext({} as UserTypeModalContextData);

export function UserTypeModalProvider({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleUserTypeSelect = async (type: 'USER' | 'HOUSE_OWNER', document: string) => {
    try {
      await authService.updateUserType(type, document);
      closeModal();
      
      const currentRefreshToken = getRefreshToken();
      if (currentRefreshToken) {
        const { accessToken, refreshToken } = await authService.refreshToken(currentRefreshToken);
        setTokens(accessToken, refreshToken);
        window.location.reload();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.response?.data?.message?.includes('CPF já existente, tente outro por favor!')) {
        showToast.error("Erro", "Este documento já está cadastrado no sistema");
      } else {
        showToast.error("Erro", "Não foi possível completar seu cadastro. Tente novamente.");
      }
    }
  };

  return (
    <UserTypeModalContext.Provider value={{ showModal, openModal, closeModal }}>
      {children}
      <UserTypeModal isOpen={showModal} onSelect={handleUserTypeSelect} />
    </UserTypeModalContext.Provider>
  );
}

export function useUserTypeModal() {
  const context = useContext(UserTypeModalContext);
  if (!context) {
    throw new Error("useUserTypeModal must be used within a UserTypeModalProvider");
  }
  return context;
} 