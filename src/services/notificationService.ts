import api from "./api";

export interface Notification {
  id: string;
  type: string;   // "LIKE" | "COMMENT" | "FOLLOW"
  message: string;
  read: boolean;
  userId: string;
  createdAt: string;
}

export const notificationService = {
  async getAll(): Promise<Notification[]> {
    const res = await api.get("/notifications");
    return res.data;
  },

  async markAsRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  },
};
