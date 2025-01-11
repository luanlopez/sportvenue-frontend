import { api } from '@/lib/axios';

interface SignInResponse {
  accessToken: string;
  refreshToken: string;
}

interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  userType?: 'USER' | 'HOUSE_OWNER';
}

interface PreRegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  userType?: "USER" | "HOUSE_OWNER";
}

interface CompleteRegistrationDTO {
  code: string;
}

export const authService = {
  async signIn(credentials: { email: string; password: string }): Promise<SignInResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterDTO) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<SignInResponse> {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async preRegister(data: PreRegisterDTO) {
    const response = await api.post('/auth/pre-register', data);
    return response.data;
  },

  async completeRegistration(data: CompleteRegistrationDTO) {
    const response = await api.post('/auth/complete-registration', data);
    return response.data;
  },

  async googleCallback(code: string) {
    try {
      const response = await api.get<SignInResponse>(`/auth/google/callback`, {
        params: { code }
      });
      return response.data;
    } catch (error) {
      console.error("Erro na chamada do Google callback:", error);
      throw error;
    }
  },

  async updateUserType(type: 'USER' | 'HOUSE_OWNER') {
    const response = await api.patch('/auth/update-type', { userType: type });
    return response.data;
  }
}; 