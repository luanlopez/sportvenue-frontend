import { api } from '@/lib/axios';

interface SignInResponse {
  accessToken: string;
  refreshToken: string;
}

interface CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  userType?: 'USER' | 'HOUSE_OWNER' | 'ADMIN';
}

interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  userType?: 'USER' | 'HOUSE_OWNER';
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
}; 