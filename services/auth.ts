import { api } from "@/lib/axios";

interface SignInResponse {
  accessToken: string;
  refreshToken: string;
}

interface SignInCredentials {
  encryptedData: string;
}

interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  userType?: "USER" | "HOUSE_OWNER";
  planID?: string;
}

interface PreRegisterDTO {
  encryptedData: string;
}

interface CompleteRegistrationDTO {
  code: string;
}

export interface ResetPasswordDTO {
  code: string;
  newPassword: string;
}

export const authService = {
  async signIn(credentials: SignInCredentials): Promise<SignInResponse> {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  async register(data: RegisterDTO) {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<SignInResponse> {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  },

  async getProfile() {
    const response = await api.get("/auth/me");
    return response.data;
  },

  async preRegister(data: PreRegisterDTO) {
    const response = await api.post("/auth/pre-register", data);
    return response.data;
  },

  async completeRegistration(data: CompleteRegistrationDTO) {
    const response = await api.post("/auth/complete-registration", data);
    return response.data;
  },

  async googleCallback(code: string) {
    try {
      const response = await api.get<SignInResponse>(`/auth/google/callback`, {
        params: { code },
      });
      return response.data;
    } catch (error) {
      console.error("Erro na chamada do Google callback:", error);
      throw error;
    }
  },

  async updateUserType(type: "USER" | "HOUSE_OWNER", document: string) {
    try {
      const response = await api.patch("/auth/update-type", {
        userType: type,
        document,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar o tipo de usuário:", error);
      throw error;
    }
  },

  async forgotPassword(email: string) {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  async resetPassword(data: ResetPasswordDTO) {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },

  /**
   * Verifica se o proprietário (owner) possui boletos/invoices pendentes.
   * Usado para exibir aviso no painel após login.
   */
  async getOwnerPendingInvoices() {
    const response = await api.get("/auth/check-pending-invoices");
    return response.data.hasPendingInvoices;
  },
};
