import { api } from "@/lib/axios";

export const userService = {
  async getProfile() {
    const response = await api.get("/users/me");
    return response.data;
  },

  async updateProfile(data: { name: string }) {
    const response = await api.put("/users/me", data);
    return response.data;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await api.put("/users/change-password", data);
    return response.data;
  },
};
