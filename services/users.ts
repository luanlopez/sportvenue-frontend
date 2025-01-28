import { api } from "@/lib/axios";

interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

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

  async updateUser(data: UpdateUserDTO) {
    const payload = Object.entries(data).reduce((acc, [key, value]) => {
      if (value?.trim()) {
        acc[key as keyof UpdateUserDTO] = value;
      }
      return acc;
    }, {} as UpdateUserDTO);

    if (Object.keys(payload).length > 0) {
      const response = await api.patch("/users/profile", payload);
      return response.data;
    }
  },
};
