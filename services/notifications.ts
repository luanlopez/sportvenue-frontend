import { api } from "@/lib/axios";
import {
  Notification,
  NotificationsResponse,
  GetNotificationsParams,
  NotificationStatus,
} from "@/types/notifications";

export const notificationService = {
  async getNotifications(params: GetNotificationsParams = {}) {
    const response = await api.get<NotificationsResponse>("/notifications", {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.status && { status: params.status }),
        ...(params.type && { type: params.type }),
      },
    });

    return {
      notifications: response.data.notifications,
      total: response.data.total,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: response.data.totalPages,
    };
  },

  async getNotificationById(id: string) {
    const response = await api.get<Notification>(`/notifications/${id}`);
    return response.data;
  },

  async markNotificationAsRead(id: string) {
    const response = await api.put<{
      message: string;
      notification: Notification;
    }>(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllNotificationsAsRead() {
    const response = await api.put<{
      message: string;
    }>("/notifications/mark/all");
    return response.data;
  },

  async deleteNotification(id: string) {
    const response = await api.delete<{
      message: string;
    }>(`/notifications/${id}`);
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get<{ count: number }>(
      "/notifications/unread-count"
    );
    return response.data;
  },

  async updateNotificationStatus(id: string, status: NotificationStatus) {
    const response = await api.patch<Notification>(
      `/notifications/${id}/status`,
      {
        status,
      }
    );
    return response.data;
  },
};
